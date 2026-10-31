import {existsSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidates=[process.env.PWF_KIT_ROOT&&resolve(process.env.PWF_KIT_ROOT,'bin/pwf.mjs'),resolve(root,'node_modules/@personal/product-workflow-kit/bin/pwf.mjs'),resolve(root,'tooling/workflow-kit/bin/pwf.mjs'),resolve(root,'../../workflow-kit/bin/pwf.mjs')].filter(Boolean);
const entry=candidates.find(p=>existsSync(p));if(!entry)throw Error('请安装 tooling/toolchain.json 中登记的工作流工具版本，或设置 PWF_KIT_ROOT');
await import(pathToFileURL(entry).href);
