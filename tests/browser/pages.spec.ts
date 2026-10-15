import {test,expect} from '@playwright/test';
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import type {AddressInfo} from 'node:net';
const prefix='/Wohnung-Hallwanger-Stra-e/';
const root=path.resolve('dist');
let server:http.Server;
let base:string;
test.beforeAll(async()=>{
 server=http.createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url!,'http://localhost').pathname);
  if(!pathname.startsWith(prefix)){res.writeHead(404);res.end();return}
  const relative=pathname.slice(prefix.length)||'index.html',file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  try{
   if(!(await stat(file)).isFile())throw Error('not a file');
   const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.json':'application/json','.svg':'image/svg+xml'};
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end()}
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
test.afterAll(async()=>{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()))});
test('GitHub-Pages-Unterpfad: 3D, Referenzbilder, Quellenprotokoll und GLB-Export',async({page})=>{
 const errors:string[]=[],missing:string[]=[],textures:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)missing.push(`${r.status()} ${r.url()}`);if(r.url().includes('/textures/'))textures.push(r.url())});
 await page.goto(base+prefix);
 await expect(page.locator('canvas')).toBeVisible();
 await expect(page.locator('.source-card img')).toHaveJSProperty('naturalWidth',1920);
 await page.getByRole('button',{name:'MALM Bett',exact:true}).click();
 await expect(page.locator('.reference-thumb img')).toHaveJSProperty('complete',true);
 await expect.poll(()=>page.locator('.reference-thumb img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
 await expect(page.locator('.reference-thumb img')).toHaveAttribute('src','./references/moebel-image6.jpeg');
 await page.getByRole('button',{name:'Quellen & Maße'}).click();
 const href=await page.getByRole('link',{name:'Extraktionsprotokoll öffnen ↗'}).getAttribute('href');
 expect(href).toBe('./references/extraction.json');
 const response=await page.request.get(new URL(href!,base+prefix).href);expect(response.ok()).toBe(true);expect((await response.json()).pdf).toHaveLength(14);
 await page.getByRole('button',{name:'Dialog schließen'}).click();
 await page.getByRole('button',{name:'Exportieren',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'3D-Modell als GLB'}).click();const glb=await download;
 expect(await glb.failure()).toBeNull();const bytes=await readFile((await glb.path())!);
 expect(bytes.subarray(0,4).toString()).toBe('glTF');
 const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());expect(json.images.length).toBeGreaterThan(3);expect(json.nodes.filter((n:any)=>n.extras?.id).length).toBe(49);
 await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();await expect(page.locator('[data-object]')).toHaveCount(49);
 expect(textures.length).toBeGreaterThan(3);expect(textures.every(url=>url.startsWith(base+prefix+'textures/'))).toBe(true);
 expect(missing).toEqual([]);expect(errors).toEqual([]);
});
