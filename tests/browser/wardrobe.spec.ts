import {test,expect} from '@playwright/test';
import furniture from '../../src/data/furniture.json' with {type:'json'};

test('alter gespeicherter Schrank wird beweglich: Ziehen, Drehen, Reload, Entfernen und Reset',async({page})=>{
 const old=structuredClone(furniture);
 old.find(f=>f.id==='wardrobe')!.fixed=true;
 old.find(f=>f.id==='bed')!.position=[6.8,0,6];
 await page.addInitScript(project=>{
  if(!localStorage.getItem('hallwanger-project-v1'))localStorage.setItem('hallwanger-project-v1',JSON.stringify(project));
 },{version:1,furniture:old,calibration:1,wallHeight:2.5});
 await page.goto('/');
 await page.getByRole('button',{name:'MALM Bett',exact:true}).click();
 await expect(page.getByRole('spinbutton',{name:'X · Ost',exact:true})).toHaveValue('6.8');
 await page.getByRole('button',{name:'2D-Grundriss',exact:true}).click();
 await page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true}).click();
 const x=page.getByRole('spinbutton',{name:'X · Ost',exact:true});
 await expect(x).toBeEnabled();await expect(page.getByRole('spinbutton',{name:'Breite',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Möbel verschieben',exact:true}).click();
 const bounds=await page.locator('[data-object="wardrobe"]').boundingBox();expect(bounds).not.toBeNull();
 await page.mouse.move(bounds!.x+bounds!.width/2,bounds!.y+bounds!.height/2);
 await page.mouse.down();await page.mouse.move(bounds!.x+bounds!.width/2+40,bounds!.y+bounds!.height/2,{steps:8});await page.mouse.up();
 await expect(x).not.toHaveValue('4.77');const moved=await x.inputValue();
 await page.getByRole('button',{name:'Möbel um 90 Grad drehen'}).click();
 await expect(page.getByRole('spinbutton',{name:'Drehung',exact:true})).toHaveValue('180');
 await page.reload();await page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true}).click();
 await expect(x).toHaveValue(moved);await expect(x).toBeEnabled();
 await expect(page.getByRole('spinbutton',{name:'Drehung',exact:true})).toHaveValue('180');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hallwanger-project-v1')!).furniture.find((f:{id:string})=>f.id==='wardrobe'));
 expect(stored.fixed).toBe(false);
 await page.getByRole('button',{name:'Aus Planung entfernen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Rückgängig',exact:true}).click();
 await expect(page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Originalanordnung wiederherstellen',exact:true}).click();
 await page.getByRole('button',{name:'Wiederherstellen',exact:true}).click();
 await page.getByRole('button',{name:'Vorhandener Kleiderschrank',exact:true}).click();
 await expect(x).toHaveValue('4.77');await expect(x).toBeEnabled();
});
