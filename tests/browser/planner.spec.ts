import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const selectBed=async(page:any)=>{await page.getByRole('button',{name:'MALM Bett',exact:true}).click();await expect(page.getByRole('heading',{name:'MALM Bett'})).toBeVisible()};
const edit=async(page:any,label:string,value:string)=>{const field=page.getByRole('spinbutton',{name:label,exact:true});await field.fill(value);await field.press('Tab')};
test('3D startet offline ohne Fehler; vier Ansichten und Quellen funktionieren',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://localhost:5173')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url())});
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.waitForTimeout(2000);await page.screenshot({path:'.local/validated-3d.png'});
 await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();await expect(page.locator('#floor-plan')).toBeVisible();await expect(page.locator('[data-object]')).toHaveCount(49);await page.screenshot({path:'.local/validated-2d.png'});
 await page.getByRole('button',{name:'Einzelraum',exact:true}).click();await expect(page.locator('.viewport h1')).toHaveText('Wohnzimmer');await expect(page.locator('canvas')).toBeVisible();
 await page.getByRole('button',{name:'Rundgang',exact:true}).click();await expect(page.getByRole('button',{name:'Rundgang verlassen'})).toBeVisible();await page.keyboard.press('w');await page.getByRole('button',{name:'Rundgang verlassen'}).click();await expect(page.getByRole('button',{name:'3D-Ansicht',exact:true})).toHaveClass(/active/);
 await page.getByRole('button',{name:'Quellen & Maße'}).click();await expect(page.getByRole('dialog')).toContainText('32 eingebetteten Word-Bilder');await expect(page.locator('tbody tr')).toHaveCount(8);await page.getByRole('button',{name:'Dialog schließen'}).click();expect(errors).toEqual([]);expect(external).toEqual([]);
});
test('numerische Bearbeitung, Drehen, Undo/Redo, Speicherung, Sichtbarkeit und Reset',async({page})=>{
 await page.goto('/');await selectBed(page);await edit(page,'X · Ost','6.1');await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.1');await page.getByRole('button',{name:'Möbel um 90 Grad drehen'}).click();await expect(page.getByRole('spinbutton',{name:'Drehung'})).toHaveValue('0');
 await page.getByRole('button',{name:'Rückgängig',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'Drehung'})).toHaveValue('-90');await page.getByRole('button',{name:'Wiederholen',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'Drehung'})).toHaveValue('0');
 await page.reload();await selectBed(page);await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.1');await expect(page.getByRole('spinbutton',{name:'Drehung'})).toHaveValue('0');
 await page.getByRole('button',{name:'MALM Bett ausblenden',exact:true}).click();await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();await expect(page.locator('[data-object="bed"]')).toHaveCount(0);await page.getByRole('button',{name:'MALM Bett einblenden',exact:true}).click();await expect(page.locator('[data-object="bed"]')).toHaveCount(1);
 await page.getByRole('button',{name:'Originalanordnung wiederherstellen',exact:true}).click();await page.getByRole('button',{name:'Abbrechen',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.1');await page.getByRole('button',{name:'Originalanordnung wiederherstellen',exact:true}).click();await page.getByRole('button',{name:'Wiederherstellen',exact:true}).click();await selectBed(page);await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('7.09');
 const original=await page.evaluate(()=>JSON.parse(localStorage.getItem('hallwanger-project-v1')!).furniture);
 expect(original.find((f:any)=>f.id==='vanity')).toMatchObject({room:'office',position:[11.03,0,7],rotation:-90});
 expect(original.find((f:any)=>f.id==='skruvby-side')).toMatchObject({room:'living',position:[.2,0,5.75],rotation:90});
 expect(original.find((f:any)=>f.id==='skruvby-cab')).toMatchObject({room:'living',position:[2.8,0,4.8]});
 expect(original.find((f:any)=>f.id==='babybay').position).toEqual([6.9,0,7.25]);
 await page.getByRole('button',{name:'Rückgängig',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.1');
 await page.reload();await selectBed(page);await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.1');
});
test('Möbel in 2D ziehen, Kollision anzeigen, hinzufügen und entfernen',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();await page.getByRole('button',{name:'Möbel verschieben',exact:true}).click();
 const bed=page.locator('[data-object="bed"]'),rect=await bed.boundingBox();expect(rect).not.toBeNull();await page.mouse.move(rect!.x+rect!.width/2,rect!.y+rect!.height/2);await page.mouse.down();await page.mouse.move(rect!.x+rect!.width/2-90,rect!.y+rect!.height/2,{steps:8});await page.mouse.up();await expect(page.getByRole('heading',{name:'MALM Bett'})).toBeVisible();expect(await page.getByRole('spinbutton',{name:'X · Ost'}).inputValue()).not.toBe('7.09');
 await edit(page,'X · Ost','-0.1');await expect(page.locator('.warning-box')).toContainText(['Wand West']);await page.getByRole('button',{name:'Rückgängig',exact:true}).click();
 await page.getByRole('button',{name:'Möbel hinzufügen',exact:true}).first().click();await page.locator('.library-card').filter({hasText:'KALLAX Regal'}).click();await expect(page.getByRole('heading',{name:'KALLAX Regal · Kopie'})).toBeVisible();await expect(page.locator('[data-object]')).toHaveCount(50);await page.getByRole('button',{name:'Aus Planung entfernen'}).click();await expect(page.locator('[data-object]')).toHaveCount(49);
});
test('Kalibrierung skaliert Räume und Positionen, nicht Möbel; feste Einbauten sind geschützt',async({page})=>{
 await page.goto('/');await selectBed(page);const width=await page.getByRole('spinbutton',{name:'Breite',exact:true}).inputValue();await page.getByRole('button',{name:'Darstellung und Kalibrierung'}).click();await edit(page,'Gemessene Länge A–B','5');await page.getByRole('button',{name:'Kalibrierung anwenden'}).click();await expect(page.getByRole('spinbutton',{name:'Breite',exact:true})).toHaveValue(width);await expect(page.getByRole('spinbutton',{name:'X · Ost'})).not.toHaveValue('7.09');
 await page.getByRole('textbox',{name:'Möbel suchen'}).fill('Vorhandener');await page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'Breite',exact:true})).toBeDisabled();await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toBeDisabled();await expect(page.getByRole('button',{name:'Aus Planung entfernen'})).toHaveCount(0);
});
test('PNG, PDF, GLB und JSON exportieren gültige Dateien; JSON lässt sich importieren',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.waitForTimeout(2000);
 for(const [label,ext] of [['Ansicht als PNG','png'],['Grundriss als PDF','pdf'],['3D-Modell als GLB','glb'],['Projekt als JSON','json']]){
  await page.getByRole('button',{name:'Exportieren',exact:true}).click();const wait=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).click();const download=await wait;expect(await download.failure()).toBeNull();const path=`.local/export.${ext}`;await download.saveAs(path);const data=await fs.readFile(path);expect(data.length).toBeGreaterThan(1000);
  if(ext==='png')expect(data.subarray(1,4).toString()).toBe('PNG');
  if(ext==='pdf'){expect(data.subarray(0,5).toString()).toBe('%PDF-');expect(data.toString('latin1')).toContain('Flächenabgleich')}
  if(ext==='glb'){expect(data.subarray(0,4).toString()).toBe('glTF');expect(data.readUInt32LE(4)).toBe(2);expect(data.readUInt32LE(8)).toBe(data.length);const len=data.readUInt32LE(12);const gltf=JSON.parse(data.subarray(20,20+len).toString());expect(gltf.nodes.some((n:any)=>n.name==='MALM Bett')).toBe(true);expect(gltf.nodes.filter((n:any)=>n.mesh!==undefined).length).toBeGreaterThan(500);expect(gltf.materials.length).toBeGreaterThan(8);
   const restored=await page.evaluate(async(base64)=>{const {GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js' as string);const THREE=await import('/node_modules/three/build/three.module.js' as string);const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const loaded=await new GLTFLoader().parseAsync(bytes.buffer,'');let objects=0,meshes=0,bed:any=null;loaded.scene.traverse((o:any)=>{if(o.isMesh)meshes++;if(o.userData.id){objects++;if(o.userData.id==='bed')bed=o.getWorldPosition(new THREE.Vector3()).toArray()}});return {objects,meshes,bed}},data.toString('base64'));
   expect(restored.objects).toBe(49);expect(restored.meshes).toBeGreaterThan(500);expect(restored.bed).toEqual([7.09,0,6]);
  }
  if(ext==='json'){const project=JSON.parse(data.toString());expect(project.furniture.length).toBe(49);project.furniture.find((f:any)=>f.id==='bed').position[0]=6.8;await page.locator('input[type=file]').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});await selectBed(page);await expect(page.getByRole('spinbutton',{name:'X · Ost'})).toHaveValue('6.8')}
 }
 await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();await page.getByRole('button',{name:'Exportieren',exact:true}).click();const wait=page.waitForEvent('download');await page.getByRole('button',{name:'Ansicht als PNG',exact:true}).click();const d=await wait;await d.saveAs('.local/export-plan.png');expect((await fs.stat('.local/export-plan.png')).size).toBeGreaterThan(1000);expect(errors).toEqual([]);
});
test('direktes Ziehen in 3D sowie sichtbare Kamerabewegung im Rundgang',async({page})=>{
 await page.goto('/');await page.waitForTimeout(2000);await page.getByRole('button',{name:'Möbel verschieben',exact:true}).click();
 const target=await page.evaluate(async()=>{
  // Project a known visible sofa point using the documented initial perspective.
  const THREE=await import('/node_modules/three/build/three.module.js' as string);
  const rect=document.querySelector('canvas')!.getBoundingClientRect(),aspect=rect.width/rect.height,dist=Math.max(16,18/Math.max(aspect,.65));
  const camera=new THREE.PerspectiveCamera(45,aspect,.05,150);camera.position.set(5.5+dist*.42,dist*.78,4.5+dist*.72);camera.lookAt(5.5,0,4.5);camera.updateMatrixWorld();const v=new THREE.Vector3(.98,.43,7.44).project(camera);return {x:rect.left+(v.x+1)*rect.width/2,y:rect.top+(1-v.y)*rect.height/2};
 });
 await page.mouse.move(target.x,target.y);await page.mouse.down();await page.mouse.move(target.x+60,target.y-15,{steps:10});await page.mouse.up();await expect(page.getByRole('heading',{name:'Couchteil 1 · Ottomane'})).toBeVisible();expect(await page.getByRole('spinbutton',{name:'X · Ost'}).inputValue()).not.toBe('0.98');await expect(page.getByRole('spinbutton',{name:'Y · Höhe'})).toHaveValue('0');
 await page.getByRole('button',{name:'Rundgang',exact:true}).click();await page.waitForTimeout(500);const before=await page.locator('canvas').screenshot();await page.keyboard.down('d');await page.waitForTimeout(600);await page.keyboard.up('d');const after=await page.locator('canvas').screenshot();expect(Buffer.compare(before,after)).not.toBe(0);
});
