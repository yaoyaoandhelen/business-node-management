/** Project-local bootstrap. Only the checked-in, hash-locked archive is accepted. */
import {readFile,mkdir,realpath,readdir,lstat,rename,rm} from 'node:fs/promises';
import {resolve,dirname,relative,sep,join,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
const inside=(root,path)=>{const rel=relative(root,path);return !isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep)};
export async function restoreToolchain(projectDirectory=resolve(dirname(fileURLToPath(import.meta.url)),'..')){
 const project=await realpath(projectDirectory);const lock=JSON.parse(await readFile(join(project,'tooling/toolchain.json'),'utf8'));
 if(lock.schemaVersion!==1||typeof lock.packageArchive!=='string'||!/^[a-f0-9]{64}$/.test(lock.sha256||''))throw Error('tooling/toolchain.json 必须包含schemaVersion=1、packageArchive和sha256');
 const intended=resolve(project,lock.packageArchive);if(!inside(project,intended))throw Error('工具归档路径超出业务仓库');const archive=await realpath(intended);if(!inside(project,archive))throw Error('工具归档符号链接超出业务仓库');
 const actual=createHash('sha256').update(await readFile(archive)).digest('hex');if(actual!==lock.sha256)throw Error('工具归档sha256不匹配；拒绝恢复或下载替代版本');
 const listed=(await exec('tar',['-tzf',archive],{maxBuffer:16*1024*1024})).stdout.split('\n').filter(Boolean).map(path=>path.replace(/^\.\//,''));
 let top;for(const name of listed){const parts=name.replace(/\/$/,'').split('/');if(name.startsWith('/')||name.includes('\\')||parts.some(p=>!p||p==='..'||p==='.'))throw Error('工具归档包含不安全路径');top??=parts[0];if(parts[0]!==top)throw Error('工具归档必须只有一个顶层目录')}
 const verbose=(await exec('tar',['-tvzf',archive],{maxBuffer:16*1024*1024})).stdout.split('\n').filter(Boolean);if(verbose.some(line=>!['-','d'].includes(line[0])))throw Error('工具归档包含符号链接、硬链接或特殊文件');
 const local=join(project,'.local');await mkdir(local,{recursive:true});if(!inside(project,await realpath(local)))throw Error('.local 目录越出业务仓库');
 const temporary=join(local,'restore-'+randomUUID());await mkdir(temporary);const output=join(local,'workflow-kit');
 try{
  await exec('tar',['-xzf',archive,'-C',temporary],{maxBuffer:16*1024*1024});
  async function check(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if((await lstat(path)).isSymbolicLink())throw Error('恢复后的工具包含符号链接');if(entry.isDirectory())await check(path);else if(!entry.isFile())throw Error('恢复后的工具包含特殊文件')}}await check(temporary);
  const candidate=join(temporary,top||'');await readFile(join(candidate,'package.json'));await readFile(join(candidate,'package-lock.json'));await readFile(join(candidate,'bin/pwf.mjs'));
  const backup=output+'.'+randomUUID()+'.previous';let previous=false;try{await rename(output,backup);previous=true}catch(e){if(e.code!=='ENOENT')throw e}
  try{await rename(candidate,output)}catch(e){if(previous)await rename(backup,output);throw e}if(previous)await rm(backup,{recursive:true,force:true});
  return {directory:output,sha256:actual,source:'checked-in-project-archive'};
 }finally{await rm(temporary,{recursive:true,force:true})}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))restoreToolchain().then(result=>process.stdout.write(JSON.stringify(result,null,2)+'\n')).catch(error=>{process.stderr.write(error.message+'\n');process.exitCode=1});
