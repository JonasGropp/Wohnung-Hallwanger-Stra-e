/** Serve the bundled production build with Node only, including offline installations. */
import http from 'node:http';
import {createReadStream} from 'node:fs';
import {realpath,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=await realpath(fileURLToPath(new URL('../dist',import.meta.url))).catch(()=>{console.error('Der Ordner dist fehlt. Bitte zuerst npm run build ausführen oder das vollständige ZIP entpacken.');process.exit(1)});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return}
 try{
  const url=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);const file=await realpath(path.join(root,pathname==='/'?'index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}const info=await stat(file);if(!info.isFile()){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':info.size,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});if(req.method==='HEAD')res.end();else createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch{res.writeHead(404);res.end('Datei nicht gefunden.')}
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port 5173 ist belegt. Den anderen Wohnungsplaner-Server zuerst schließen.':e.message);process.exitCode=1});
server.listen(5173,'127.0.0.1',()=>{
 console.log('Wohnungsplaner: http://localhost:5173 — Beenden mit Strg+C.');
 if(process.argv.includes('--open')&&process.platform==='win32')spawn('cmd.exe',['/c','start','', 'http://localhost:5173'],{stdio:'ignore'}).on('error',()=>{});
});
