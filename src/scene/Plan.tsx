import {useRef} from 'react';
import {useStore} from '../state/store';
import {rooms,apartment,roomLabels} from '../data';
import {corners,radians,wallSolids} from '../geometry/collision';
import type {Furniture,Vec2} from '../types';
const color:Record<string,string>={kitchen:'#e6e0ce',bath:'#d5dcd7',living:'#d9b994',bedroom:'#e3ceb0',office:'#e3ceb0',hall:'#e3d7bf',stairs:'#d8d8d0',balcony:'#c6a68f'};
const pts=(p:Vec2[])=>p.map(v=>v.join(',')).join(' ');
export function Plan({conflicts}:{conflicts:Set<string>}){
 const p=useStore(s=>s.project),selected=useStore(s=>s.selected),drag=useStore(s=>s.drag);const svg=useRef<SVGSVGElement>(null),moving=useRef<{id:string;dx:number;dz:number;y:number}|null>(null);
 const s=p.calibration;const coord=(e:React.PointerEvent)=>{const point=svg.current!.createSVGPoint();point.x=e.clientX;point.y=e.clientY;return point.matrixTransform(svg.current!.getScreenCTM()!.inverse())};
 const down=(e:React.PointerEvent,f:Furniture)=>{e.stopPropagation();useStore.getState().select(f.id);if(!drag||f.fixed||e.button!==0)return;const q=coord(e);moving.current={id:f.id,dx:f.position[0]-q.x,dz:f.position[2]-q.y,y:f.position[1]};e.currentTarget.setPointerCapture(e.pointerId);useStore.getState().begin()};
 const move=(e:React.PointerEvent)=>{if(!moving.current)return;const q=coord(e),m=moving.current;const round=(n:number)=>useStore.getState().snap?Math.round(n/.05)*.05:n;useStore.getState().change(m.id,{position:[round(q.x+m.dx),m.y,round(q.y+m.dz)]},true)};
 const up=()=>{if(moving.current){moving.current=null;useStore.getState().end()}};
 return <svg ref={svg} id="floor-plan" className="plan" viewBox={`-1 -1 ${13.8*s} ${11.7*s}`} aria-label="Bearbeitbarer 2D-Grundriss" onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerDown={()=>useStore.getState().select(null)}>
 <defs><pattern id="grid" width=".5" height=".5" patternUnits="userSpaceOnUse"><path d="M .5 0 L 0 0 0 .5" fill="none" stroke="#d8ded4" strokeWidth=".008"/></pattern></defs><rect x="-1" y="-1" width={13.8*s} height={11.7*s} fill="#edf0e9"/><rect x="-1" y="-1" width={13.8*s} height={11.7*s} fill="url(#grid)"/>
 {rooms.map(r=><g key={r.id}><polygon points={pts(r.polygon.map(([x,z])=>[x*s,z*s]))} fill={color[r.id]} stroke="#b2b5aa" strokeWidth=".015"/></g>)}
 {apartment.walls.flatMap(w=>wallSolids(w,s,p.wallHeight)).filter(w=>w.center[1]-w.size[1]/2<.2).map((w,i)=><polygon key={i} points={pts(corners(w))} fill="#506159"/>)}
 {apartment.walls.flatMap(w=>{const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],len=Math.hypot(dx,dz),angle=Math.atan2(dz,dx)*180/Math.PI;return w.openings.map(o=><g key={o.id} transform={`translate(${(w.a[0]+dx*o.start/len)*s},${(w.a[1]+dz*o.start/len)*s}) rotate(${angle})`}>
 {o.kind==='window'?<><rect x="0" y={-w.thickness*s/2} width={o.width*s} height={w.thickness*s} fill="#c1e2df"/><line x2={o.width*s} stroke="#4f8a8d" strokeWidth=".025"/></>:<><line x1="0" y1="0" x2="0" y2={o.width*s*o.swing} stroke="#728a79" strokeWidth=".025"/><path d={`M ${o.width*s} 0 A ${o.width*s} ${o.width*s} 0 0 ${o.swing===1?1:0} 0 ${o.width*s*o.swing}`} fill="none" stroke="#728a79" strokeWidth=".015" strokeDasharray=".05 .04"/></>}
 </g>)})}
 {p.furniture.filter(f=>f.visible).map(f=><g key={f.id} data-object={f.id} transform={`translate(${f.position[0]},${f.position[2]}) rotate(${-f.rotation})`} onPointerDown={e=>down(e,f)} style={{cursor:drag&&!f.fixed?'grab':'pointer'}}>
 <title>{f.name} · {Math.round(f.width*100)} × {Math.round(f.depth*100)} cm</title>
 {f.kind==='roundtable'?<ellipse rx={f.width/2} ry={f.depth/2} fill="#fbf8ee" stroke={conflicts.has(f.id)?'#c9593b':selected===f.id?'#267562':'#8b9589'} strokeWidth={selected===f.id?.045:.02}/>:<rect x={-f.width/2} y={-f.depth/2} width={f.width} height={f.depth} rx=".025" fill={conflicts.has(f.id)?'#f2d6ca':f.fixed?'#bdc6b8':'#faf8ed'} stroke={conflicts.has(f.id)?'#c9593b':selected===f.id?'#267562':'#8b9589'} strokeWidth={selected===f.id?.045:.02}/>}
 <line x1={-f.width*.36} y1={f.depth*.38} x2={f.width*.36} y2={f.depth*.38} stroke="#6f8375" strokeWidth=".025"/>
 {selected===f.id&&<text y={-f.depth/2-.08} textAnchor="middle" fontSize=".14" fill="#224f40">{Math.round(f.width*100)} × {Math.round(f.depth*100)} cm</text>}
 </g>)}
 {rooms.map(r=><g key={'label-'+r.id} transform={`translate(${roomLabels[r.id][0]*s},${roomLabels[r.id][1]*s})`} pointerEvents="none"><rect x={-.87*s} y={-.15*s} width={1.74*s} height={.46*s} rx={.06*s} fill="#f8f9ee" opacity=".85"/><text textAnchor="middle" fill="#425e4c" fontSize={.14*s} fontWeight="600">{r.name}</text><text y={.2*s} textAnchor="middle" fill="#687c61" fontSize={.12*s}>{(r.modelArea*s*s).toFixed(1)} m² · geschätzt</text></g>)}
 <g transform={`translate(${12*s},.2)`}><path d="M 0 .7 L 0 0 L -.12 .24 M 0 0 L .12 .24" fill="none" stroke="#35594b" strokeWidth=".035"/><text y="-.13" textAnchor="middle" fontSize=".2" fill="#35594b">N</text></g>
 <g transform={`translate(.1,${10*s})`}><path d="M 0 -.07 V 0 H 2 V -.07 M 1 0 V -.07" fill="none" stroke="#35594b" strokeWidth=".025"/><text y=".22" fontSize=".13" fill="#35594b">0　　　　　　　　　1　　　　　　　　　2 m</text></g>
 </svg>;
}
