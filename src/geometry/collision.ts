import type {Furniture,Solid,Vec2,Wall} from '../types';
import {furnitureParts} from './models';
import {apartment,rooms} from '../data';
export const normalizeRotation=(v:number)=>((v%360)+360)%360;
export const radians=(v:number)=>v*Math.PI/180;
export function polygonArea(p:Vec2[]):number{return Math.abs(p.reduce((s,v,i)=>s+v[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*v[1],0))/2}
export function contains(p:Vec2,poly:Vec2[]):boolean{let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside}return inside}
export function corners(s:Solid):Vec2[]{const c=Math.cos(s.angle),n=Math.sin(s.angle);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>[s.center[0]+c*x*s.size[0]/2+n*z*s.size[2]/2,s.center[2]-n*x*s.size[0]/2+c*z*s.size[2]/2])}
/** Separating axis theorem in XZ plus exact vertical intervals; touching is not penetration. */
export function overlaps(a:Solid,b:Solid,epsilon=.003):boolean{
 if(Math.abs(a.center[1]-b.center[1]) >= (a.size[1]+b.size[1])/2-epsilon)return false;
 const ca=corners(a),cb=corners(b);
 for(const t of [a.angle,b.angle])for(const axis of [[Math.cos(t),-Math.sin(t)],[Math.sin(t),Math.cos(t)]]){
  const pa=ca.map(p=>p[0]*axis[0]+p[1]*axis[1]),pb=cb.map(p=>p[0]*axis[0]+p[1]*axis[1]);
  if(Math.max(...pa)<=Math.min(...pb)+epsilon||Math.max(...pb)<=Math.min(...pa)+epsilon)return false;
 }return true;
}
export function furnitureSolids(f:Furniture):Solid[]{const t=radians(f.rotation),c=Math.cos(t),s=Math.sin(t);
 return furnitureParts(f).filter(p=>p.collision!==false).map(p=>{
  const size=[...p.size] as [number,number,number];
  if(p.rotation?.[0]) [size[1],size[2]]=[size[2],size[1]];
  if(p.rotation?.[2]) [size[0],size[1]]=[size[1],size[0]];
  return {id:f.id,name:f.name,center:[f.position[0]+c*p.position[0]+s*p.position[2],f.position[1]+p.position[1],f.position[2]-s*p.position[0]+c*p.position[2]],size,angle:t+(p.rotation?.[1]||0)};
 });
}
export function wallSolids(w:Wall,scale=1,height=2.5):Solid[]{
 const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],len=Math.hypot(dx,dz),solids:Solid[]=[];const angle=-Math.atan2(dz,dx);
 const add=(start:number,end:number,y:number,h:number)=>{if(end-start<.001||h<=0)return;solids.push({id:'wall-'+w.id,name:'Wand '+w.id,center:[(w.a[0]+dx*(start+end)/len/2)*scale,y+h/2,(w.a[1]+dz*(start+end)/len/2)*scale],size:[(end-start)*scale,h,w.thickness*scale],angle})};
 let at=0;for(const o of [...w.openings].sort((a,b)=>a.start-b.start)){add(at,o.start,0,height);if(o.sill>0)add(o.start,o.start+o.width,0,o.sill);add(o.start,o.start+o.width,o.sill+o.height,height-o.sill-o.height);at=o.start+o.width}add(at,len,0,height);return solids;
}
export interface Conflict {a:string;b:string;message:string}
export function collisionReport(furniture:Furniture[],scale=1,height=2.5):Conflict[]{
 // Hidden objects remain physical obstacles; visibility only controls rendering.
 const bounds=(ss:Solid[])=>{const cs=ss.flatMap(corners);return [Math.min(...cs.map(p=>p[0])),Math.max(...cs.map(p=>p[0])),Math.min(...cs.map(p=>p[1])),Math.max(...cs.map(p=>p[1]))]};
 const solids=furniture.map(f=>{const s=furnitureSolids(f);return {f,s,b:bounds(s)}});const walls=apartment.walls.flatMap(w=>wallSolids(w,scale,height));const result:Conflict[]=[];
 for(let i=0;i<solids.length;i++){
  const a=solids[i];for(let j=i+1;j<solids.length;j++){const b=solids[j];if(a.f.fixed&&b.f.fixed)continue;if(a.b[1]<b.b[0]||b.b[1]<a.b[0]||a.b[3]<b.b[2]||b.b[3]<a.b[2])continue;
   if(a.s.some(x=>b.s.some(y=>overlaps(x,y))))result.push({a:a.f.id,b:b.f.id,message:`${a.f.name} überschneidet sich mit ${b.f.name}.`});}
  if(!a.f.fixed){const ids=new Set<string>();for(const wall of walls)if(!ids.has(wall.id)&&a.s.some(x=>overlaps(x,wall))){ids.add(wall.id);result.push({a:a.f.id,b:wall.id,message:`${a.f.name} durchdringt ${wall.name}.`})}}
 }return result;
}
export function locationWarning(f:Furniture,scale=1):string|null{const room=rooms.find(r=>r.id===f.room);if(!room)return 'Unbekannter Raum';const base:Solid={id:f.id,name:f.name,center:f.position,size:[f.width,f.height,f.depth],angle:radians(f.rotation)};return corners(base).every(p=>contains([p[0]/scale,p[1]/scale],room.polygon))?null:'Grundfläche liegt teilweise außerhalb des zugeordneten Raums.'}
export function walkAllowed(x:number,z:number,scale:number,height:number):boolean{
 const onFloor=rooms.some(r=>contains([x/scale,z/scale],r.polygon));
 const inDoor=apartment.walls.some(w=>w.openings.some(o=>{if(o.sill>0)return false;const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],len=Math.hypot(dx,dz);const px=x/scale-w.a[0],pz=z/scale-w.a[1],along=(px*dx+pz*dz)/len,across=Math.abs(px*dz-pz*dx)/len;return along>o.start+.12&&along<o.start+o.width-.12&&across<w.thickness/2+.14}));
 if(!onFloor&&!inDoor)return false;
 const person:Solid={id:'person',name:'person',center:[x,.9,z],size:[.28,1.8,.28],angle:0};return !apartment.walls.some(w=>wallSolids(w,scale,height).some(s=>overlaps(person,s)));
}
