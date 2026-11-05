import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {copyFileSync,writeFileSync} from 'node:fs';
const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({base:'./',root,plugins:[{name:'copy-classic-assets',closeBundle(){for(const name of ['app.js','identity-review.js','intelligent.js','intelligent-expanded.js','template-0.txt','template-1.txt','template-2.txt'])copyFileSync(root+name,root+'dist/'+name);writeFileSync(root+'dist/inspector-config.js','window.AIPrototypeInspectorConfig={allowedParentOrigins:[window.location.origin]};\n')}}],server:{host:'127.0.0.1',strictPort:true},build:{outDir:'dist',rollupOptions:{input:{main:root+'index.html',portal:root+'portal.html'}}}});
