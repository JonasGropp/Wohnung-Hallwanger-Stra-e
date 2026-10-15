import {create} from 'zustand';
import type {Project,Furniture,Mode} from '../types';
import {initialProject,initialFurniture,rooms} from '../data';
import {parseProject} from './project';
import {normalizeRotation} from '../geometry/collision';
const STORAGE_KEY='hallwanger-project-v1';
function restore(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?{project:parseProject(JSON.parse(saved)),notice:''}:{project:initialProject(),notice:''}}catch{return {project:initialProject(),notice:'Gespeicherte Planung konnte nicht geladen werden. Originalanordnung geöffnet.'}}}
interface State {project:Project;past:Project[];future:Project[];selected:string|null;room:string|null;mode:Mode;walls:'solid'|'ghost'|'hidden';ceiling:boolean;snap:boolean;drag:boolean;light:number;notice:string;planRevision:number;gesture:Project|null;select:(id:string|null)=>void;setView:(patch:Partial<Pick<State,'room'|'mode'|'walls'|'ceiling'|'snap'|'drag'|'light'|'notice'>>)=>void;change:(id:string,patch:Partial<Furniture>,live?:boolean)=>void;begin:()=>void;end:()=>void;undo:()=>void;redo:()=>void;add:(id:string)=>void;remove:(id:string)=>void;reset:()=>void;load:(p:Project)=>void;calibrate:(s:number,h:number)=>void;}
const restored=restore();
function persist(p:Project){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(p));return ''}catch{return 'Lokaler Speicher ist voll oder gesperrt. Bitte Projekt als JSON sichern.'}}
export const useStore=create<State>((set,get)=>{
 const commit=(p:Project)=>{const s=get();set({project:p,past:[...s.past,s.project].slice(-60),future:[],notice:persist(p),planRevision:s.planRevision+1})};
 return {...restored,past:[],future:[],selected:null,room:null,mode:'orbit',walls:'ghost',ceiling:false,snap:true,drag:false,light:1,planRevision:0,gesture:null,
 select:id=>set({selected:id}),setView:patch=>set(patch),
 change:(id,patch,live=false)=>{const state=get(),old=state.project.furniture.find(x=>x.id===id);if(!old)return;if(old.fixed)patch={visible:patch.visible??old.visible};
  if(patch.rotation!==undefined)patch.rotation=normalizeRotation(patch.rotation);
  const next={...state.project,furniture:state.project.furniture.map(f=>f.id===id?{...f,...patch}:f)};
  if(live)set({project:next});else commit(next);
 },
 begin:()=>set({gesture:structuredClone(get().project)}),
 end:()=>{const s=get();if(s.gesture&&JSON.stringify(s.project)!==JSON.stringify(s.gesture))set({past:[...s.past,s.gesture].slice(-60),future:[],gesture:null,notice:persist(s.project),planRevision:s.planRevision+1});else set({gesture:null})},
 undo:()=>{const s=get(),p=s.past.at(-1);if(!p)return;set({project:p,past:s.past.slice(0,-1),future:[s.project,...s.future],notice:persist(p),planRevision:s.planRevision+1})},
 redo:()=>{const s=get(),p=s.future[0];if(!p)return;set({project:p,past:[...s.past,s.project],future:s.future.slice(1),notice:persist(p),planRevision:s.planRevision+1})},
 add:id=>{const s=get(),f=initialFurniture.find(x=>x.id===id);if(!f||f.fixed)return;const room=s.room||f.room,r=rooms.find(x=>x.id===room)!;const x=r.polygon.reduce((a,p)=>a+p[0],0)/r.polygon.length*s.project.calibration,z=r.polygon.reduce((a,p)=>a+p[1],0)/r.polygon.length*s.project.calibration;const copy={...structuredClone(f),id:crypto.randomUUID(),name:f.name+' · Kopie',room,position:[x,0,z] as [number,number,number]};commit({...s.project,furniture:[...s.project.furniture,copy]});set({selected:copy.id})},
 remove:id=>{const s=get();if(s.project.furniture.find(f=>f.id===id)?.fixed)return;commit({...s.project,furniture:s.project.furniture.filter(f=>f.id!==id)});set({selected:null})},
 reset:()=>{commit(initialProject());set({selected:null})},
 load:p=>{commit(parseProject(p));set({selected:null})},
 calibrate:(scale,height)=>{const s=get();if(scale<.5||scale>2||height<2.2||height>4)return;const ratio=scale/s.project.calibration;commit({...s.project,calibration:scale,wallHeight:height,furniture:s.project.furniture.map(f=>({...f,position:[f.position[0]*ratio,f.position[1],f.position[2]*ratio]}))})}
 };
});
