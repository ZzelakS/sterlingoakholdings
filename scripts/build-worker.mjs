import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {build} from 'esbuild';
const assets={};const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
async function walk(dir,prefix=''){for(const f of await readdir(dir,{withFileTypes:true})){const path=prefix+'/'+f.name;if(f.isDirectory())await walk(dir+'/'+f.name,path);else assets[path]={body:(await readFile(dir+'/'+f.name)).toString('base64'),type:types[f.name.slice(f.name.lastIndexOf('.'))]||'application/octet-stream'};}}
await walk('dist');await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
const result=await build({entryPoints:['server/inquiry.ts'],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const handler=result.outputFiles[0].text.replace(/export\s*\{\s*inquiry\s*\};?\s*$/,'');
await writeFile('dist/server/index.js',handler+'\nconst assets='+JSON.stringify(assets)+';\nexport default {async fetch(request,env){const path=new URL(request.url).pathname;if(path==="/api/inquiry")return inquiry(request,env);if(request.method!=="GET"&&request.method!=="HEAD")return new Response("Method not allowed",{status:405});const asset=assets[path==="/"?"/index.html":path];if(!asset)return new Response("Not found",{status:404});const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));return new Response(request.method==="HEAD"?null:bytes,{headers:{"Content-Type":asset.type,"Cache-Control":path.startsWith("/assets/")?"public,max-age=31536000,immutable":"public,max-age=300"}});}};');
await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
