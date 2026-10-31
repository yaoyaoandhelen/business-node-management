import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {copyFileSync} from 'node:fs';
const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({base:'./',root,plugins:[{name:'copy-classic-assets',closeBundle(){for(const name of ['app.js','template-0.txt','template-1.txt','template-2.txt'])copyFileSync(root+name,root+'dist/'+name)}}],server:{host:'127.0.0.1',strictPort:true},build:{outDir:'dist'}});
