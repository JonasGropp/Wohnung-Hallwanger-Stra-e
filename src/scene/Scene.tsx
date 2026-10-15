import {Canvas,useThree,useFrame,ThreeEvent} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {useStore} from '../state/store';
import type {Furniture} from '../types';
import {architecture,furnitureGroup,releaseArchitecture} from './build';
import {rooms} from '../data';
import {radians,walkAllowed} from '../geometry/collision';
export const sceneBridge:{capture?:()=>Promise<string>;walkStart?:()=>void;walkExit?:()=>void}={};
const ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function FurnitureMesh({f,conflict}:{f:Furniture;conflict:boolean}){
 const group=useMemo(()=>furnitureGroup(f),[f.kind,f.width,f.depth,f.height]);const selected=useStore(s=>s.selected===f.id),drag=useStore(s=>s.drag),mode=useStore(s=>s.mode);const moving=useRef(false),offset=useRef(new THREE.Vector3());
 const {gl}=useThree();
 const down=(e:ThreeEvent<PointerEvent>)=>{if(mode==='walk')return;e.stopPropagation();useStore.getState().select(f.id);if(!drag||f.fixed||e.button!==0)return;const point=new THREE.Vector3();if(!e.ray.intersectPlane(ground,point))return;offset.current.set(f.position[0]-point.x,0,f.position[2]-point.z);moving.current=true;useStore.getState().begin();(e.target as unknown as Element).setPointerCapture(e.pointerId);gl.domElement.style.cursor='grabbing'};
 const move=(e:ThreeEvent<PointerEvent>)=>{if(!moving.current)return;e.stopPropagation();const point=new THREE.Vector3();if(e.ray.intersectPlane(ground,point)){const snap=useStore.getState().snap,round=(v:number)=>snap?Math.round(v/.05)*.05:v;useStore.getState().change(f.id,{position:[round(point.x+offset.current.x),f.position[1],round(point.z+offset.current.z)]},true)}};
 const up=(e:ThreeEvent<PointerEvent>)=>{if(!moving.current)return;e.stopPropagation();moving.current=false;(e.target as unknown as Element).releasePointerCapture(e.pointerId);useStore.getState().end();gl.domElement.style.cursor='auto'};
 const edgeGeometry=useMemo(()=>new THREE.EdgesGeometry(new THREE.BoxGeometry(f.width+.025,Math.max(f.height,.15)+.025,f.depth+.025)),[f.width,f.height,f.depth]);useEffect(()=>()=>edgeGeometry.dispose(),[edgeGeometry]);
 return <group position={f.position} rotation={[0,radians(f.rotation),0]} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} dispose={null}>
  <primitive object={group}/>
  {(selected||conflict)&&<lineSegments geometry={edgeGeometry} position={[0,f.height/2,0]}><lineBasicMaterial color={conflict?'#cd593b':'#2b7966'} depthTest={false} transparent opacity={selected?1:.7}/></lineSegments>}
 </group>;
}
function Controller(){
 const {camera,gl,scene,size}=useThree();const mode=useStore(s=>s.mode),room=useStore(s=>s.room),scale=useStore(s=>s.project.calibration),rev=useStore(s=>s.planRevision);const controls=useRef<any>(null);const keys=useRef(new Set<string>()),yaw=useRef(0),pitch=useRef(0),locked=useRef(false);
 useEffect(()=>{
  const r=rooms.find(r=>r.id===room);const center=r?[r.polygon.reduce((a,p)=>a+p[0],0)/r.polygon.length*scale,r.polygon.reduce((a,p)=>a+p[1],0)/r.polygon.length*scale]:[5.5*scale,4.5*scale];
  camera.up.set(0,1,0);
  if(mode==='walk'){camera.position.set(8.2*scale,1.65,2.9*scale);yaw.current=0;pitch.current=0;camera.rotation.set(0,0,0,'YXZ')}
  else {const dist=mode==='room'?7:Math.max(16,18/Math.max(size.width/size.height,.65));camera.position.set(center[0]+dist*.42,dist*.78,center[1]+dist*.72);camera.lookAt(center[0],0,center[1]);controls.current?.target.set(center[0],0,center[1]);controls.current?.update()}
 },[mode,room,scale,camera,size.width,size.height]);
 useEffect(()=>{
  sceneBridge.capture=async()=>{gl.render(scene,camera);return gl.domElement.toDataURL('image/png')};
  sceneBridge.walkStart=()=>{gl.domElement.requestPointerLock()?.catch(()=>useStore.getState().setView({notice:'Mausfang nicht verfügbar. Im Rundgang mit gedrückter Maustaste umsehen.'}))};
  sceneBridge.walkExit=()=>{if(document.pointerLockElement)document.exitPointerLock();useStore.getState().setView({mode:'orbit'})};
  const keydown=(e:KeyboardEvent)=>{if((e.target as HTMLElement).matches('input,select,textarea'))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys.current.add(e.code);if(mode==='walk')e.preventDefault()}if(e.code==='Escape'&&mode==='walk')sceneBridge.walkExit?.()};
  const keyup=(e:KeyboardEvent)=>keys.current.delete(e.code);
  const mouse=(e:MouseEvent)=>{if(mode!=='walk'||(!locked.current&&!(e.buttons===1&&e.target===gl.domElement)))return;yaw.current-=e.movementX*.0025;pitch.current=THREE.MathUtils.clamp(pitch.current-e.movementY*.0025,-1.4,1.4);camera.rotation.set(pitch.current,yaw.current,0,'YXZ')};
  const lock=()=>{locked.current=document.pointerLockElement===gl.domElement};const blur=()=>keys.current.clear();
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);document.addEventListener('mousemove',mouse);document.addEventListener('pointerlockchange',lock);window.addEventListener('blur',blur);
  return ()=>{delete sceneBridge.capture;document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);document.removeEventListener('mousemove',mouse);document.removeEventListener('pointerlockchange',lock);window.removeEventListener('blur',blur);if(document.pointerLockElement===gl.domElement)document.exitPointerLock()};
 },[mode,gl,camera,scene]);
 useFrame((_,dt)=>{if(mode!=='walk')return;const k=keys.current,forward=Number(k.has('KeyW')||k.has('ArrowUp'))-Number(k.has('KeyS')||k.has('ArrowDown')),side=Number(k.has('KeyD')||k.has('ArrowRight'))-Number(k.has('KeyA')||k.has('ArrowLeft'));if(!forward&&!side)return;const step=1.6*Math.min(dt,.04)/Math.max(1,Math.hypot(side,forward));const dx=(Math.cos(yaw.current)*side-Math.sin(yaw.current)*forward)*step,dz=(-Math.sin(yaw.current)*side-Math.cos(yaw.current)*forward)*step;const p=useStore.getState().project;
 if(walkAllowed(camera.position.x+dx,camera.position.z,p.calibration,p.wallHeight))camera.position.x+=dx;
 if(walkAllowed(camera.position.x,camera.position.z+dz,p.calibration,p.wallHeight))camera.position.z+=dz;
 });
 const dragging=useStore(s=>s.drag);void rev;
 return mode==='walk'?null:<OrbitControls ref={controls} makeDefault enabled={!dragging} maxPolarAngle={Math.PI*.49} minDistance={2} maxDistance={55} enableDamping dampingFactor={.12}/>;
}
function World({conflicts}:{conflicts:Set<string>}){
 const p=useStore(s=>s.project),walls=useStore(s=>s.walls),ceiling=useStore(s=>s.ceiling),room=useStore(s=>s.room),light=useStore(s=>s.light),mode=useStore(s=>s.mode);
 const isolated=mode==='room'?room:null;
 const building=useMemo(()=>architecture(p,{walls,ceiling,room:isolated}),[p.calibration,p.wallHeight,walls,ceiling,isolated]);
 useEffect(()=>()=>releaseArchitecture(building),[building]);
 return <><color attach="background" args={['#e9ece6']}/><ambientLight intensity={.7*light}/><hemisphereLight args={['#fff7e8','#a8b0a0',1.25*light]}/><directionalLight position={[-3,15,12]} intensity={2.1*light} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-.0003}/>
 <group name="apartment-model"><primitive object={building} dispose={null}/>{p.furniture.filter(f=>f.visible&&(!isolated||f.room===isolated)).map(f=><FurnitureMesh key={f.id} f={f} conflict={conflicts.has(f.id)}/>)}</group><Controller/></>;
}
export function Scene({conflicts}:{conflicts:Set<string>}){
 return <Canvas shadows camera={{position:[14,18,20],fov:45,near:.05,far:150}} dpr={[1,1.75]} gl={{antialias:true,preserveDrawingBuffer:true}} onPointerMissed={()=>useStore.getState().select(null)} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.domElement.setAttribute('aria-label','Interaktive 3D-Wohnung')}}><World conflicts={conflicts}/></Canvas>;
}
