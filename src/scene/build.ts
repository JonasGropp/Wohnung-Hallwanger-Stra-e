import * as THREE from 'three';
import {assetUrl} from '../utils/assets';
import type {Furniture,Project,Room,Vec3} from '../types';
import {rooms,apartment} from '../data';
import {furnitureParts} from '../geometry/models';
import {wallSolids,radians} from '../geometry/collision';
const geometries={box:new THREE.BoxGeometry(1,1,1),cylinder:new THREE.CylinderGeometry(.5,.5,1,24),sphere:new THREE.SphereGeometry(.5,20,12)};
const colors:Record<string,string>={white:'#efeee8',trim:'#d4d1c8',wood:'#c5a47d',linen:'#f7f4e9',metal:'#aeb5b4',dark:'#333937',screen:'#141d21',glass:'#b4d4ce',mirror:'#b4ccd0',fabric:'#9f9685',fabricLight:'#bcb19e',sage:'#67897d',radiator:'#e9e3d1',stone:'#b9b5a7',sink:'#b4c0c1',ceramic:'#f5f5ef',grayTile:'#b3afa5'};
const mats:Record<string,THREE.MeshStandardMaterial>={};
export function material(name:string):THREE.MeshStandardMaterial{
 if(mats[name])return mats[name];const mat=new THREE.MeshStandardMaterial({color:colors[name]||'#eee9de',roughness:name==='metal'?.3:.78,metalness:name==='metal'?.6:name==='mirror'?.75:0});
 if(name==='glass'){mat.transparent=true;mat.opacity=.22;mat.depthWrite=false;mat.roughness=.1;mat.side=THREE.DoubleSide}
 if(['wood','fabric','grayTile'].includes(name)){const tex=new THREE.TextureLoader().load(assetUrl(`textures/${name}.png`));tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;mat.map=tex;mat.color.set('#ffffff')}
 mats[name]=mat;return mat;
}
function mesh(size:Vec3,pos:Vec3,mat:THREE.Material,shape:'box'|'cylinder'|'sphere'='box'){
 const m=new THREE.Mesh(geometries[shape],mat);m.scale.set(...size);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;return m;
}
export function furnitureGroup(f:Furniture){const group=new THREE.Group();group.name=f.name;group.userData={id:f.id,room:f.room,dimensions:[f.width,f.depth,f.height],source:f.originalDimensions,assumptions:f.assumptions};
 for(const p of furnitureParts(f)){const m=mesh(p.size,p.position,material(p.material),p.shape);if(p.rotation)m.rotation.set(...p.rotation);group.add(m)}return group;
}
const floorMats=new Map<string,THREE.MeshStandardMaterial>();
function floorMaterial(r:Room){if(floorMats.has(r.material))return floorMats.get(r.material)!;const tex=new THREE.TextureLoader().load(assetUrl(`textures/${r.material==='stone'?'tile':r.material}.png`));tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.repeat.set(.7,.7);tex.anisotropy=4;const m=new THREE.MeshStandardMaterial({map:tex,roughness:.82});floorMats.set(r.material,m);return m;}
export interface SceneSettings{walls:'solid'|'ghost'|'hidden';ceiling:boolean;room:string|null}
export function architecture(p:Project,settings:SceneSettings){const g=new THREE.Group();g.name='Wohnung · baulicher Bestand';const s=p.calibration;
 for(const room of rooms){if(settings.room&&settings.room!==room.id)continue;const shape=new THREE.Shape();room.polygon.forEach(([x,z],i)=>i===0?shape.moveTo(x*s,-z*s):shape.lineTo(x*s,-z*s));shape.closePath();const geometry=new THREE.ShapeGeometry(shape);geometry.rotateX(-Math.PI/2);const floor=new THREE.Mesh(geometry,floorMaterial(room));floor.name=room.name+' Boden';floor.receiveShadow=true;floor.position.y=-.005;g.add(floor);
 if(settings.ceiling&&room.id!=='balcony'){const ceiling=new THREE.Mesh(geometry,material('white'));ceiling.position.y=p.wallHeight;ceiling.material=new THREE.MeshStandardMaterial({color:'#f5f3e9',side:THREE.DoubleSide});ceiling.name='Decke '+room.name;g.add(ceiling)}
 }
 // Exterior plinth gives the cutaway a readable edge without enclosing balcony access.
 if(!settings.room){const slab=mesh([11.65*s,.16,9.75*s],[5.55*s,-.1,4.52*s],material('stone'));slab.name='Bodenplatte';g.add(slab)}
 const wm=new THREE.MeshStandardMaterial({color:'#f5f2e9',transparent:settings.walls==='ghost',opacity:settings.walls==='ghost'?.22:1,depthWrite:settings.walls!=='ghost'});
 for(const w of apartment.walls){
  // Isolated rooms retain only boundary segments near their polygon.
  const r=rooms.find(r=>r.id===settings.room);
  if(r){const xs=r.polygon.map(v=>v[0]),zs=r.polygon.map(v=>v[1]);if(Math.max(w.a[0],w.b[0])<Math.min(...xs)-.2||Math.min(w.a[0],w.b[0])>Math.max(...xs)+.2||Math.max(w.a[1],w.b[1])<Math.min(...zs)-.2||Math.min(w.a[1],w.b[1])>Math.max(...zs)+.2)continue}
  if(settings.walls!=='hidden')for(const solid of wallSolids(w,s,p.wallHeight)){
   if(r){const horizontal=Math.abs(w.a[1]-w.b[1])<.001,axis=horizontal?0:2;const values=r.polygon.map(v=>v[horizontal?0:1]*s),low=Math.max(solid.center[axis]-solid.size[0]/2,Math.min(...values)-w.thickness*s),high=Math.min(solid.center[axis]+solid.size[0]/2,Math.max(...values)+w.thickness*s);if(high<=low)continue;solid.center[axis]=(low+high)/2;solid.size[0]=high-low}
   const m=mesh(solid.size,solid.center,wm);m.rotation.y=solid.angle;m.name=solid.name;m.castShadow=settings.walls==='solid';g.add(m)
  }
  const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],length=Math.hypot(dx,dz),theta=-Math.atan2(dz,dx);
  for(const o of w.openings){if(r){const cx=w.a[0]+dx*(o.start+o.width/2)/length,cz=w.a[1]+dz*(o.start+o.width/2)/length,xs=r.polygon.map(v=>v[0]),zs=r.polygon.map(v=>v[1]);if(cx<Math.min(...xs)-.2||cx>Math.max(...xs)+.2||cz<Math.min(...zs)-.2||cz>Math.max(...zs)+.2)continue}const frame=new THREE.Group();frame.position.set((w.a[0]+dx*(o.start+o.width/2)/length)*s,0,(w.a[1]+dz*(o.start+o.width/2)/length)*s);frame.rotation.y=theta;frame.name=o.kind+' '+w.id;const width=o.width*s;
   for(const x of [-1,1])frame.add(mesh([.045,o.height,.075],[x*(width/2-.0225),o.sill+o.height/2,0],material('white')));
   frame.add(mesh([width,.045,.075],[0,o.sill+o.height-.0225,0],material('white')));
   if(o.kind==='window'){frame.add(mesh([width,o.height,.01],[0,o.sill+o.height/2,0],material('glass')));frame.add(mesh([.035,o.height,.055],[0,o.sill+o.height/2,0],material('white')));frame.add(mesh([width+.08,.03,.28],[0,o.sill,0],material('stone')))}
   else {const hinge=new THREE.Group();hinge.position.x=-width/2+.04;hinge.rotation.y=-Math.PI/2*o.swing;const leaf=mesh([width-.08,o.height-.07,.035],[(width-.08)/2,o.height/2,0],material(o.kind==='balconyDoor'?'glass':'white'));hinge.add(leaf);hinge.add(mesh([.09,.02,.04],[width-.17,1.0,.035],material('metal')));frame.add(hinge)}
   g.add(frame);
  }
 }
 // Wooden balcony railing from p9. Keep the three existing access openings clear.
 if(!settings.room||settings.room==='balcony'){
  for(let i=0;i<10;i++)g.add(mesh([.055,1.03,.055],[(4.48+i*.76)*s,.515,9.34*s],material('wood')));
  for(let j=0;j<4;j++)g.add(mesh([6.9*s,.12,.045],[7.88*s,.2+j*.23,9.34*s],material('wood')));
 }
 if(!settings.room||settings.room==='stairs')for(let i=0;i<10;i++){const step=mesh([2.2*s,.14,.19*s],[10*s,-i*.14,1.85*s-i*.17*s],material('stone'));step.name='Treppenlauf schematisch';g.add(step)}
 return g;
}
export function wholeModel(p:Project,settings:SceneSettings){const g=new THREE.Group();g.name='Hallwanger Wohnung (Meter)';g.add(architecture(p,settings));for(const f of p.furniture){if(!f.visible||(settings.room&&settings.room!==f.room))continue;const model=furnitureGroup(f);model.position.set(...f.position);model.rotation.y=radians(f.rotation);g.add(model)}return g;}
export async function texturesReady(){await Promise.all(Object.values(mats).map(m=>m.map?.image).filter((i):i is HTMLImageElement=>i instanceof HTMLImageElement).map(i=>i.decode().catch(()=>{})));}
/** Release only allocations owned by an architecture instance; shared primitives/materials stay cached. */
export function releaseArchitecture(group:THREE.Group){
 const sharedGeometry=new Set<THREE.BufferGeometry>(Object.values(geometries));const sharedMaterials=new Set<THREE.Material>([...Object.values(mats),...floorMats.values()]);const released=new Set<object>();
 group.traverse(o=>{if(!(o instanceof THREE.Mesh))return;if(!sharedGeometry.has(o.geometry)&&!released.has(o.geometry)){o.geometry.dispose();released.add(o.geometry)}for(const m of Array.isArray(o.material)?o.material:[o.material])if(!sharedMaterials.has(m)&&!released.has(m)){m.dispose();released.add(m)}});
}
