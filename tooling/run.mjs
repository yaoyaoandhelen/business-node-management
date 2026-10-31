/** The launcher uses the project's verified archive, never a parent/global fallback. */
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname,join} from 'node:path';
import {verifyToolchain} from './restore.mjs';
const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
try{const runtime=await verifyToolchain(project);await import(pathToFileURL(join(runtime.directory,'bin/pwf.mjs')).href)}catch(error){process.stderr.write((error.code==='ERR_MODULE_NOT_FOUND'?'工具依赖尚未安装：运行 npm ci --prefix .local/workflow-kit --omit=dev':error.message)+'\n');process.exitCode=1}
