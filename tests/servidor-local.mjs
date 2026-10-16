import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.csv':'text/csv; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.yaml':'text/yaml; charset=utf-8','.yml':'text/yaml; charset=utf-8','.zip':'application/zip'};
http.createServer((request,response)=>{
  const requested=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const relative=requested==='/'?'index.html':requested.replace(/^\//,'');
  const target=path.resolve(root,relative);
  if(!target.startsWith(root)){response.writeHead(403).end('Prohibido');return;}
  fs.readFile(target,(error,data)=>{
    if(error){response.writeHead(404).end('No encontrado');return;}
    response.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Servidor listo en http://127.0.0.1:4173/'));
