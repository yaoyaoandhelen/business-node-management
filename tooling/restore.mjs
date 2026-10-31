/** Standalone bootstrap. The project's archive is the trust source, never a cache stamp. */
import {readFile,writeFile,mkdir,realpath,readdir,lstat,rename,rm} from 'node:fs/promises';
import {resolve,dirname,relative,sep,join,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const inside=(root,path)=>{const rel=relative(root,path);return !isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep)};
const digest=value=>createHash('sha256').update(value).digest('hex');
const defaultProject=()=>resolve(dirname(fileURLToPath(import.meta.url)),'..');
const invalid=message=>new Error(message);
function number(bytes){const value=bytes.toString('ascii').replace(/\0.*$/s,'').trim();if(!/^[0-7]*$/.test(value))throw invalid('工具归档包含不支持的数字格式');return value?parseInt(value,8):0}
function string(bytes){return bytes.toString('utf8').replace(/\0.*$/s,'')}
function pax(bytes){const fields={};let at=0;while(at<bytes.length){const space=bytes.indexOf(32,at);if(space<0)throw invalid('工具归档PAX记录损坏');const size=Number(bytes.subarray(at,space).toString());if(!Number.isSafeInteger(size)||size<=space-at+1||at+size>bytes.length)throw invalid('工具归档PAX长度无效');const record=bytes.subarray(space+1,at+size-1).toString('utf8'),equal=record.indexOf('=');if(equal<1)throw invalid('工具归档PAX记录无效');fields[record.slice(0,equal)]=record.slice(equal+1);at+=size}return fields}
/** Parse regular files only; links/special entries and escaping paths never reach disk. */
export function readArchiveFiles(compressed){
 let tar;try{tar=gunzipSync(compressed,{maxOutputLength:256*1024*1024})}catch{throw invalid('工具归档不是有效或受支持大小的gzip文件')}
 const files=new Map(),directories=new Set();let top,at=0,pending={},longName;
 while(at+512<=tar.length){const header=tar.subarray(at,at+512);if(header.every(byte=>byte===0))break;
  const expected=number(header.subarray(148,156));let sum=0;for(let i=0;i<512;i++)sum+=(i>=148&&i<156)?32:header[i];if(sum!==expected)throw invalid('工具归档头校验失败');
  const size=number(header.subarray(124,136)),type=String.fromCharCode(header[156]||48),mode=number(header.subarray(100,108));
  if(!Number.isSafeInteger(size)||size<0||at+512+size>tar.length)throw invalid('工具归档内容不完整');const content=tar.subarray(at+512,at+512+size);at+=512+Math.ceil(size/512)*512;
  if(type==='x'){pending=pax(content);continue}if(type==='g'){const global=pax(content);if(global.path||global.linkpath)throw invalid('工具归档不支持全局路径覆盖');continue}if(type==='L'){longName=string(content).replace(/\n$/,'');continue}
  if(!['0','5'].includes(type))throw invalid('工具归档包含符号链接、硬链接或特殊文件');
  if(pending.linkpath)throw invalid('工具归档包含链接路径');if(pending.size!==undefined&&Number(pending.size)!==size)throw invalid('工具归档PAX大小与文件不一致');
  const prefix=string(header.subarray(345,500));let name=pending.path||longName||[prefix,string(header.subarray(0,100))].filter(Boolean).join('/');pending={};longName=undefined;
  name=name.replace(/^\.\//,'').replace(/\/$/,'');const parts=name.split('/');if(!name||isAbsolute(name)||name.includes('\\')||/[\u0000-\u001f\u007f]/u.test(name)||parts.some(p=>!p||p==='.'||p==='..'))throw invalid('工具归档包含不安全路径');
  // Older macOS tar archives carry AppleDouble metadata beside their real entries.
  if(type==='0'&&parts.some(part=>part.startsWith('._'))&&content.length>=4&&content.readUInt32BE(0)===0x00051607)continue;
  top??=parts[0];if(top!==parts[0])throw invalid('工具归档必须只有一个顶层目录');const path=parts.slice(1).join('/');if(!path){if(type!=='5')throw invalid('工具归档顶层必须为目录');continue}
  if(type==='5'){if(files.has(path))throw invalid('工具归档路径冲突');directories.add(path);continue}
  if(files.has(path)||directories.has(path))throw invalid('工具归档包含重复或冲突路径');files.set(path,{content,sha256:digest(content),mode:(mode&0o111)?0o755:0o644});
 }
 if(pending.path||longName)throw invalid('工具归档存在未完成路径记录');
 for(const path of files.keys()){const parts=path.split('/');for(let i=1;i<parts.length;i++)if(files.has(parts.slice(0,i).join('/')))throw invalid('工具归档文件与目录冲突')}
 if(!top||!files.has('package.json')||!files.has('package-lock.json')||!files.has('bin/pwf.mjs'))throw invalid('工具归档缺少包、依赖锁或CLI入口');
 return {top,files,directories};
}
async function projectPath(project,value,{exists=true}={}){const intended=resolve(project,value);if(!inside(project,intended))throw invalid('工具路径超出业务仓库');let current=intended,tail=[];while(true){try{current=await realpath(current);break}catch(error){if(error.code!=='ENOENT'||exists)throw error;tail.unshift(current.slice(dirname(current).length+1));current=dirname(current)}}const actual=resolve(current,...tail);if(!inside(project,actual))throw invalid('工具路径符号链接超出业务仓库');return actual}
export async function inspectLockedArchive(projectDirectory=defaultProject()){
 const project=await realpath(projectDirectory),lockPath=await projectPath(project,'tooling/toolchain.json');const lock=JSON.parse(await readFile(lockPath,'utf8'));
 if(lock.schemaVersion!==1||typeof lock.packageArchive!=='string'||!/^[a-f0-9]{64}$/.test(lock.sha256||''))throw invalid('tooling/toolchain.json 必须包含schemaVersion=1、packageArchive和sha256；请显式打包或升级工具');
 const archive=await projectPath(project,lock.packageArchive),compressed=await readFile(archive);if(digest(compressed)!==lock.sha256)throw invalid('工具归档sha256不匹配；拒绝恢复或下载替代版本');
 const parsed=readArchiveFiles(compressed);let pkg;try{pkg=JSON.parse(parsed.files.get('package.json').content.toString('utf8'))}catch{throw invalid('工具归档包信息损坏')}
 if(typeof pkg.name!=='string'||typeof pkg.version!=='string'||(lock.package&&lock.package!==pkg.name)||(lock.version&&lock.version!==pkg.version))throw invalid('工具归档包身份或版本与锁不匹配');
 return {project,lock,archive,package:pkg.name,version:pkg.version,...parsed};
}
async function runtimeFiles(directory){const files=new Map();async function walk(root){for(const entry of await readdir(root,{withFileTypes:true})){if(entry.name==='.DS_Store'||(root===directory&&entry.name==='node_modules'))continue;const path=join(root,entry.name),info=await lstat(path);if(info.isSymbolicLink()||(!info.isFile()&&!info.isDirectory()))throw invalid('材料化工具含链接或特殊文件');if(info.isDirectory())await walk(path);else files.set(relative(directory,path).split(sep).join('/'),digest(await readFile(path)))}}await walk(directory);return files}
export async function verifyToolchain(projectDirectory=defaultProject()){
 const source=await inspectLockedArchive(projectDirectory);let directory;
 try{directory=await projectPath(source.project,'.local/workflow-kit');const info=await lstat(directory);if(!info.isDirectory()||info.isSymbolicLink())throw invalid('材料化工具目录无效')}catch(error){if(error.code==='ENOENT')throw invalid('锁定工具尚未恢复；运行 node tooling/restore.mjs，再运行 npm ci --prefix .local/workflow-kit --omit=dev');throw error}
 const actual=await runtimeFiles(directory);if(actual.size!==source.files.size)throw invalid('材料化工具内容与锁定归档不一致；请显式重新恢复');for(const [path,record]of source.files)if(actual.get(path)!==record.sha256)throw invalid('材料化工具文件摘要不匹配：'+path+'；请显式重新恢复');
 return {directory,sha256:source.lock.sha256,source:'checked-in-project-archive',package:source.package,version:source.version,filesVerified:actual.size};
}
export async function restoreToolchain(projectDirectory=defaultProject()){
 const source=await inspectLockedArchive(projectDirectory),local=await projectPath(source.project,'.local',{exists:false});await mkdir(local,{recursive:true});
 const temporary=join(local,'restore-'+randomUUID()),candidate=join(temporary,'workflow-kit'),output=join(local,'workflow-kit');await mkdir(candidate,{recursive:true});
 try{for(const [path,record]of source.files){const target=join(candidate,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,record.content,{mode:record.mode})}
  const backup=output+'.'+randomUUID()+'.previous';let previous=false;try{const info=await lstat(output);if(info.isSymbolicLink()||!info.isDirectory())throw invalid('材料化工具目录不能是链接或特殊文件');await rename(output,backup);previous=true}catch(error){if(error.code!=='ENOENT')throw error}
  try{await rename(candidate,output)}catch(error){if(previous)await rename(backup,output);throw error}if(previous)await rm(backup,{recursive:true,force:true});return await verifyToolchain(source.project);
 }finally{await rm(temporary,{recursive:true,force:true})}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))restoreToolchain().then(result=>process.stdout.write(JSON.stringify(result,null,2)+'\n')).catch(error=>{process.stderr.write(error.message+'\n');process.exitCode=1});
