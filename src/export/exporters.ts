import {jsPDF} from 'jspdf';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import type {Project} from '../types';
import {rooms,apartment,roomLabels} from '../data';
import {wallSolids,corners,radians} from '../geometry/collision';
import {wholeModel,releaseArchitecture, type SceneSettings} from '../scene/build';
import {serializeProject} from '../state/project';
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
export function exportJSON(p:Project){download(new Blob([serializeProject(p)],{type:'application/json'}),'Hallwanger-Planung.json')}
export async function exportGLB(p:Project,settings:SceneSettings){
 // Wait for all locally loaded texture images before serializing binary GLTF.
 const model=wholeModel(p,settings);const images=new Set<HTMLImageElement>();model.traverse(o=>{const m=o as import('three').Mesh;if(m.isMesh){for(const mat of Array.isArray(m.material)?m.material:[m.material]){const map=(mat as import('three').MeshStandardMaterial).map;if(map?.image instanceof HTMLImageElement)images.add(map.image)}}});
 try {await Promise.all([...images].map(i=>i.decode()));const data=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});if(!(data instanceof ArrayBuffer))throw Error('GLB konnte nicht erzeugt werden.');download(new Blob([data],{type:'model/gltf-binary'}),'Hallwanger-Wohnung.glb');return data.byteLength;} finally {releaseArchitecture(model)}
}
export function exportPDF(p:Project){
 const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:'a3'});const s=p.calibration;
 const points=rooms.flatMap(r=>r.polygon.map(([x,z])=>[x*s,z*s])).concat(p.furniture.filter(f=>f.visible).flatMap(f=>corners({id:f.id,name:f.name,center:f.position,size:[f.width,f.height,f.depth],angle:radians(f.rotation)})));
 const minX=Math.min(-.4*s,...points.map(v=>v[0])),maxX=Math.max(11.65*s,...points.map(v=>v[0])),minZ=Math.min(-.4*s,...points.map(v=>v[1])),maxZ=Math.max(9.75*s,...points.map(v=>v[1]));
 const denominator=Math.max(50,Math.ceil(Math.max((maxX-minX)/242,(maxZ-minZ)/215)*1000/25)*25),scale=1000/denominator,ox=20-minX*scale,oy=45-minZ*scale;
 pdf.setFont('helvetica','bold');pdf.setFontSize(20);pdf.text('Hallwanger | Wohnungsplanung',20,18);pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.text(`1. Obergeschoss · ${new Date().toLocaleDateString('de-DE')} · Maßstab 1:${denominator} bei 100 % Druck`,20,26);pdf.text('Abgeleitet aus Exposé S. 13. Nicht vermessene Maße sind Schätzwerte. Möbelmaße gemäß Inventar.',20,32);
 const polygon=(points:number[][],fill:[number,number,number],stroke:[number,number,number])=>{pdf.setFillColor(...fill);pdf.setDrawColor(...stroke);pdf.setLineWidth(.2);const [first,...rest]=points;const deltas=rest.map((v,i)=>[v[0]-points[i][0],v[1]-points[i][1]]).concat([[first[0]-points.at(-1)![0],first[1]-points.at(-1)![1]]]);pdf.lines(deltas.map(v=>v.map(x=>x*scale)),ox+first[0]*scale,oy+first[1]*scale,[1,1],'FD',true)};
 for(const r of rooms){polygon(r.polygon.map(v=>v.map(x=>x*s)),[239,237,226],[170,178,166]);}

 for(const w of apartment.walls.flatMap(w=>wallSolids(w,s,p.wallHeight)).filter(w=>w.center[1]-w.size[1]/2<.2))polygon(corners(w),[88,104,92],[88,104,92]);
 for(const w of apartment.walls){const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],len=Math.hypot(dx,dz);for(const o of w.openings){const x=(w.a[0]+dx*o.start/len)*s,z=(w.a[1]+dz*o.start/len)*s;pdf.setDrawColor(80,150,145);pdf.setLineWidth(.4);if(o.kind==='window')pdf.line(ox+x*scale,oy+z*scale,ox+(x+dx/len*o.width*s)*scale,oy+(z+dz/len*o.width*s)*scale);else pdf.line(ox+x*scale,oy+z*scale,ox+(x-dz/len*o.width*s*o.swing)*scale,oy+(z+dx/len*o.width*s*o.swing)*scale)}}
 p.furniture.filter(f=>f.visible).forEach((f,i)=>{polygon(corners({id:f.id,name:f.name,center:f.position,size:[f.width,f.height,f.depth],angle:radians(f.rotation)}),f.fixed?[197,208,193]:[253,250,239],[115,134,116]);pdf.setFontSize(5);pdf.text(String(i+1),ox+f.position[0]*scale,oy+f.position[2]*scale,{align:'center'})});
 for(const r of rooms){const [x,z]=roomLabels[r.id].map(v=>v*s);pdf.setFillColor(249,250,240);pdf.rect(ox+(x-.85*s)*scale,oy+(z-.15*s)*scale,1.7*s*scale,.45*s*scale,'F');pdf.setTextColor(50,65,53);pdf.setFontSize(7);pdf.text(r.name,ox+x*scale,oy+z*scale,{align:'center'});pdf.setFontSize(6);pdf.text(`${(r.modelArea*s*s).toFixed(1)} m² (geschätzt)`,ox+x*scale,oy+(z+.18*s)*scale,{align:'center'})}
 pdf.setTextColor(45,66,52);pdf.setFontSize(10);pdf.text('Flächenabgleich (Modell / Quelle)',280,46);pdf.setFontSize(8);rooms.forEach((r,i)=>pdf.text(`${r.name}: ${(r.modelArea*s*s).toFixed(2)} / ${r.sourceArea.toFixed(1)} m²`,280,53+i*6));
 pdf.setFontSize(8);pdf.text(['Maße aus Flächenfit, kein Aufmaß.','Balkon anteilig laut Plan ca. 4,3 m².','Flächen nicht zur Wohnfläche addieren.','Norden oben. Einheit: Meter.','Dunkel: Wand; Blau: Öffnung.','Grün: Bestand; Hell: bewegliche Möbel.'],280,110);
 pdf.setFontSize(9);pdf.text('Raumausdehnung X × Z (geschätzt)',280,150);pdf.setFontSize(8);rooms.forEach((r,i)=>{const xs=r.polygon.map(v=>v[0]),zs=r.polygon.map(v=>v[1]);pdf.text(`${r.name}: ${((Math.max(...xs)-Math.min(...xs))*s).toFixed(2)} × ${((Math.max(...zs)-Math.min(...zs))*s).toFixed(2)} m`,280,158+i*6)});
 const bottom=272;pdf.setDrawColor(40,70,50);pdf.line(22,bottom,22+2*scale,bottom);pdf.setFontSize(7);pdf.text('0',22,bottom+5);pdf.text('1',22+scale,bottom+5);pdf.text('2 m',22+2*scale,bottom+5);
 pdf.addPage();pdf.setFontSize(17);pdf.text('Möbellegende & Annahmen',20,20);let y=32;pdf.setFontSize(8);
 p.furniture.filter(f=>f.visible).forEach((f,i)=>{if(y>272){pdf.addPage();y=20}const line=`${i+1}. ${f.name} | ${Math.round(f.width*100)} × ${Math.round(f.depth*100)} × ${Math.round(f.height*100)} cm (B/T/H) | ${f.provenance}`;pdf.text(line,20,y);y+=4;const note=f.assumptions.join(' ');if(note){const lines=pdf.splitTextToSize('Annahme: '+note,370);pdf.setTextColor(110,95,70);pdf.text(lines,24,y);y+=lines.length*3.5;pdf.setTextColor(45,66,52)}y+=2});pdf.save('Hallwanger-Grundriss.pdf');
}
export async function svgPNG(svg:SVGSVGElement){const clone=svg.cloneNode(true) as SVGSVGElement;clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','2000');clone.setAttribute('height','1700');const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}));try{const im=new Image();im.src=url;await im.decode();const canvas=document.createElement('canvas');canvas.width=2000;canvas.height=1700;canvas.getContext('2d')!.drawImage(im,0,0);return canvas.toDataURL('image/png')}finally{URL.revokeObjectURL(url)}}
export function savePNG(data:string){const a=document.createElement('a');a.href=data;a.download='Hallwanger-Ansicht.png';a.click()}
