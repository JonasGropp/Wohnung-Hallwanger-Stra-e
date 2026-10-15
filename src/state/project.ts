import type {Project,Furniture} from '../types';
import {initialFurniture,rooms} from '../data';
import {normalizeRotation} from '../geometry/collision';
const finite=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export function parseProject(input:unknown):Project{
 if(!input||typeof input!=='object')throw Error('Projektdatei muss ein JSON-Objekt sein.');
 const o=input as Project;
 if(o.version!==1||!Array.isArray(o.furniture)||o.furniture.length>300||!finite(o.calibration,.5,2)||!finite(o.wallHeight,2.2,4))throw Error('Ungültige Projektversion, Kalibrierung oder Objektanzahl.');
 const ids=new Set<string>();const kinds=new Set(initialFurniture.map(f=>f.kind));
 const furniture=o.furniture.map((f):Furniture=>{
  if(!f||typeof f.id!=='string'||!f.id||ids.has(f.id)||typeof f.name!=='string'||f.name.length>150||!kinds.has(f.kind)||!rooms.some(r=>r.id===f.room)||!finite(f.width,.05,10)||!finite(f.depth,.05,10)||!finite(f.height,.05,4)||!Array.isArray(f.position)||f.position.length!==3||!f.position.every(v=>finite(v,-30,30))||!finite(f.position[1],0,5)||!finite(f.rotation,-36000,36000)||typeof f.visible!=='boolean'||typeof f.fixed!=='boolean')throw Error('Ungültige Möbeldaten oder doppelte Objekt-ID.');
  ids.add(f.id);
  const source=initialFurniture.find(x=>x.id===f.id)||initialFurniture.find(x=>x.kind===f.kind)!;
  if(f.fixed&&!initialFurniture.some(x=>x.fixed&&x.id===f.id))throw Error('Unbekannter fester Einbau.');
  // Imported text/URLs cannot override trusted reference metadata.
  return {...source,id:f.id,name:f.name,room:f.room,width:f.width,depth:f.depth,height:f.height,position:[...f.position],rotation:normalizeRotation(f.rotation),visible:f.visible,fixed:source.fixed};
 });
 for(const fixed of initialFurniture.filter(f=>f.fixed)){
  const found=furniture.find(f=>f.id===fixed.id);if(!found)throw Error('Feste Einbauten fehlen im Projekt.');
  const expected=[fixed.position[0]*o.calibration,fixed.position[1],fixed.position[2]*o.calibration];
  if(found.width!==fixed.width||found.depth!==fixed.depth||found.height!==fixed.height||found.room!==fixed.room||found.rotation!==normalizeRotation(fixed.rotation)||found.position.some((v,i)=>Math.abs(v-expected[i])>1e-6))throw Error('Feste Einbauten wurden verändert.');
 }
 return {version:1,furniture,calibration:o.calibration,wallHeight:o.wallHeight};
}
export function serializeProject(p:Project){return JSON.stringify(parseProject(p),null,2)}
