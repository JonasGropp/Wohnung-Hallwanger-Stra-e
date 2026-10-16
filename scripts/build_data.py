"""Curated tracing of Exposé p13, in displayed 1888x1334 coordinates.
Source evidence and uncertain interpretations are retained. No furniture is scaled to fit.
"""
from pathlib import Path
import json,math
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'src/data';OUT.mkdir(exist_ok=True)
def save(n,x): (OUT/f'{n}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
# Interior polygons traced independently; doorway thresholds belong to adjoining walls.
raw=[('kitchen','Küche',17.9,[(334,211),(766,211),(766,450),(802,450),(802,683),(334,683)],'tile'),('bath','Badezimmer',6.5,[(779,211),(1140,211),(1140,433),(852,433),(852,403),(779,403)],'grayTile'),('hall','Flur',8.1,[(818,451),(1558,451),(1558,579),(818,579)],'lightWood'),('living','Wohnzimmer',19.9,[(334,711),(802,711),(802,1217),(334,1217)],'parquet'),('bedroom','Schlafzimmer',16.3,[(818,606),(1218,606),(1218,1078),(818,1078)],'lightWood'),('office','Büro / Kinderzimmer',13,[(1234,606),(1558,606),(1558,1078),(1234,1078)],'lightWood'),('stairs','Treppenhaus',2.9,[(1156,211),(1290,211),(1290,433),(1156,433)],'stone'),('balcony','Balkon',8.8,[(826,1107),(1558,1107),(1558,1217),(826,1217)],'terracotta')]
def area(poly):return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly))))/2
# Least-squares fit of areas of six interior rooms (exclude stair landing and balcony).
fit=raw[:6]; s=math.sqrt(sum(area(p)*a for _,_,a,p,_ in fit)/sum(area(p)**2 for _,_,a,p,_ in fit))
def point(p):return [round((p[0]-334)*s,4),round((p[1]-211)*s,4)]
rooms=[]
for id,name,a,p,mat in raw:
 poly=[point(v) for v in p];actual=area(poly)
 rooms.append(dict(id=id,name=name,sourceArea=a,polygon=poly,material=mat,modelArea=round(actual,3),deviationPercent=round((actual/a-1)*100,1),source='Expose.pdf, Seite 13',status='abgeleitet'))
save('rooms',rooms)
# Wall centerlines with real holes. Openings are intervals in source pixels, height in metres.
walls=[]
def wall(id,a,b,t=16,opens=[],height=2.5):
 A=point(a);B=point(b)
 walls.append(dict(id=id,a=A,b=B,thickness=round(t*s,4),height=height,openings=[dict(id=f'{id}-{i}',start=round((p-min(a[0],b[0]) if a[1]==b[1] else p-min(a[1],b[1]))*s,4),width=round(w*s,4),sill=sill,height=h,kind=k,swing=sw,status='abgeleitet; Höhen und Anschlag geschätzt') for i,(p,w,sill,h,k,sw) in enumerate(opens)]))
wall('Nord',(320,197),(1571,197),28,[(557,122,.95,1.2,'window',1),(857,107,1.1,1.1,'window',1),(1042,94,1.1,1.1,'window',1),(1164,108,1.1,1.1,'window',1)])
wall('West',(320,197),(320,1230),28,[(309,120,.9,1.3,'window',1),(469,120,.9,1.3,'window',1)])
wall('Ost',(1571,197),(1571,1230),28,[(453,121,.9,1.3,'window',1)])
wall('Süd-Wohnen',(320,1230),(810,1230),28,[(413,314,.75,1.45,'window',1)])
wall('Küche-Bad',(772,197),(772,442),14)
wall('Küche-Flur',(810,442),(810,696),16,[(453,97,0,2.08,'door',-1)])
wall('Küche-Wohnen',(320,696),(810,696),25,[(697,95,0,2.08,'door',1)])
wall('Bad-Flur',(772,442),(1148,442),16,[(855,90,0,2.08,'door',-1)])
wall('Bad-Treppe',(1148,197),(1148,442),18)
wall('Eingang',(1148,442),(1571,442),22,[(1163,95,0,2.1,'door',1)])
wall('Flur-Schlafen',(810,592),(1226,592),25,[(1105,93,0,2.08,'door',1)])
wall('Flur-Büro',(1226,592),(1571,592),25,[(1245,93,0,2.08,'door',-1)])
wall('Wohnen-Schlafen',(810,696),(810,1094),16)
wall('Schlafen-Büro',(1226,592),(1226,1094),16)
# Photo p8 places the balcony door right next to existing cupboard; position approximate within source opening.
wall('Schlafen-Balkon',(810,1094),(1226,1094),24,[(903,168,0,2.15,'balconyDoor',1)])
wall('Büro-Balkon',(1226,1094),(1571,1094),24,[(1302,117,0,2.15,'balconyDoor',1)])
wall('Wohnen-Balkon',(810,1094),(810,1230),20,[(1110,100,0,2.15,'balconyDoor',1)])
# The step-edge in the plan is not a wall; the landing polygon limits walking.
save('apartment',dict(unit='m',axes='X Osten, Y Höhe, Z Süden; Ursprung innere Nordwestecke Küche',wallHeight=2.5,pixelsToMetres=s,traceImage='expose-13-image-1.jpeg',traceCoordinateFrame=[1888,1334],walls=walls,assumptions=['Kein Aufmaß. Ein einheitlicher Maßstab wurde per Flächen-Ausgleich der sechs Innenräume bestimmt.','Wandhöhe 2,50 m; Öffnungshöhen, Fensterbrüstungen und Türanschläge geschätzt.','Fotografische Bestandsküche ist gespiegelt zur Kamerablickrichtung im Plan interpretiert. Nicht sichtbare Gerätefronten und Hochschrankposition geschätzt.','Schlafzimmerschrank an Westwand: im Foto rechts beim Blick zur Südbalkontür, im Word-Plan ebenfalls westlich. Exposé-Illustration zeigt ihn östlich und wird hier nicht als Bestand übernommen. Maße geschätzt.','Treppenlandung ist Teil des Modells; der restliche Treppenlauf ist schematisch und nicht begehbar.','Balkonfläche im Plan widerspricht dem einheitlichen Maßstab; keine Anpassung zulasten der Raumproportionen.','Bett mit Kopfteil nach Osten gemäß Word-Markierung, Schrank westlich gemäß Foto. Exposé-Möblierung ist illustrativ.','Balkonzugänge laut Fotos/Ausstattung in allen drei Zimmern. Breiten aus Plan, genaue Flügelteilung nicht bestimmbar.']))
items=[]
def add(id,name,kind,room,dims,pos,rot=0,ref=None,mark=None,orig='',ass=[],fixed=False,y=0):
 items.append(dict(id=id,name=name,kind=kind,room=room,width=dims[0],depth=dims[1],height=dims[2],position=[pos[0],y,pos[1]],rotation=rot,visible=True,fixed=fixed,originalDimensions=orig or 'Keine Bemaßung in Quelle',reference=f'/references/{ref}' if ref else None,placementReference=f'/references/moebel-image{mark}.png' if mark else None,method='Parametrische Einzelgeometrien mit gruppiertem Zubehör',provenance='Bestand' if fixed else ('Planungsannahme' if room=='balcony' else 'Möbel.docx'),assumptions=ass))
def img(n,ext='jpeg'):return f'moebel-image{n}.{ext}'
add('daybed','HEMNES Tagesbett','daybed','office',(2.09,.86,.83),(10.65,4.68),-90,img(2,'png'),3,'209 × 86 × 83 cm')
add('dresser','HEMNES Kommode','dresser','bedroom',(1.6,.5,.96),(5.57,3.96),0,img(4),5,'160 × 96 × 50 cm',['Wickelaufsatz zusätzlich 12 cm hoch, geschätzt.'])
add('bed','MALM Bett','bed','bedroom',(1.96,2.09,.38),(6.45,6.05),-90,img(6),7,'209 × 196 × 38 cm',['38 cm ist Rahmenhöhe. Kopfteil 90 cm und Matratze 18 cm geschätzt.','Exposé zeigt eine abweichende illustrative Bettausrichtung; Word-Markierung hat Vorrang.'])
for i,z in enumerate([4.77,7.33]):add(f'bedside-{i+1}',f'HEMNES Nachttisch {i+1}','bedside','bedroom',(.46,.35,.7),(7.26,z),-90,img(6),7,'46 × 35 × 70 cm',['Lampenmaß aus Foto geschätzt.'])
for i,x in enumerate([1.05,1.87]):add(f'billy-{i+1}',f'BILLY / OXBERG {i+1}','billy','living',(.8,.41,2.02),(x,4.82),0,img(8),9,'80 × 41 × 202 cm')
add('besta','BESTÅ TV-Bank','besta','living',(1.8,.4,.38),(4.07,7.36),-90,img(10),11,'180 × 40 × 38 cm',['Fernseher 120 × 70 cm und Soundbar 85 cm geschätzt; Zubehör gruppiert.'])
add('vanity','Schminktisch','vanity','bedroom',(1.1,.45,.75),(7.25,7.72),180,img(12),13,'110 × 75 × 45 cm')
add('skruvby-side','SKRUVBY Sideboard','sideboard','kitchen',(1.2,.38,.9),(1.64,.24),0,img(14),15,'120 × 38 × 90 cm')
add('skruvby-cab','SKRUVBY Schrank','glasscabinet','kitchen',(.7,.38,.9),(2.61,.24),0,img(14),15,'90 × 70 × 38 cm',['Maßreihenfolge H × B × T anhand Bild normalisiert.'])
add('console','HEMNES Ablagetisch','console','hall',(1.57,.4,.74),(5.33,3.18),180,img(16),17,'157 × 74 × 40 cm')
add('kallax','KALLAX Regal','kallax','hall',(.75,.39,1.47),(9.94,3.16),180,img(18),19,'147 × 39 × 75 cm',['Auftraggeberkorrektur: senkrecht, 75 × 39 × 147 cm.'])
add('hauga','HAUGA Kleiderschrank','hauga','hall',(.7,.46,1.99),(10.93,2.82),-90,img(20,'png'),21,'199 × 70 × 46 cm',['H × B × T aus Foto normalisiert.'])
add('babybay','Babybay Beistellbett','crib','bedroom',(.88,.46,.79),(6.31,7.34),0,img(22,'png'),23,'88 × 79 × 46 cm',['B × H × T anhand Produktform; Liegefläche 50 cm geschätzt.'])
add('dining','Esstisch','table','kitchen',(1.8,1,.72),(1.59,1.4),0,img(24),25,'180 × 100 × 125 cm',['Auftraggeberkorrektur: Höhe 72 cm statt 125 cm.'])
for i,(x,z,r) in enumerate([(1.10,.6,0),(2.05,.6,0),(1.10,2.2,180),(2.05,2.2,180),(.41,1.4,90),(2.77,1.4,-90)]):add(f'chair-{i+1}',f'Esszimmerstuhl {i+1}','chair','kitchen',(.46,.5,.94),(x,z),r,img(24),25,'94 × 46 × 50 cm',['H × B × T aus Foto; Sitzhöhe 46 cm geschätzt.'])
add('sofa-1','Couchteil 1 · Ottomane','sofa','living',(1.1,1.8,.7),(.98,7.44),90,img(26),27,'110 × 180 × 70 cm')
add('sofa-2','Couchteil 2','sofa','living',(1,1.2,.7),(.68,8.49),90,img(26),27,'100 × 120 × 70 cm')
add('coffee','Runder Couchtisch','roundtable','living',(.7,.7,.42),(2.25,8.1),0,img(26),27,'Nicht angegeben',['Durchmesser 70 cm, Höhe 42 cm geschätzt; editierbar.'])
add('desk','YASA Desk Pro','desk','office',(1.6,.8,.74),(8.73,6.16),90,img(28),29,'160 × 80 cm',['Höhe 74 cm geschätzt und editierbar. Monitor-/Zubehörmaße geschätzt.'])
add('dryer','Bosch Trockner','dryer','kitchen',(.6,.65,.86),(3.6,.43),0,img(30),31,'60 × 86 × 65 cm')
add('washer','Siemens Waschmaschine','washer','bath',(.6,.6,.86),(6.02,.35),0,img(30),32,'60 × 86 × 60 cm')
# Permanent built-ins, separate from movable source inventory. Source photos override illustrative furnishings.
for i,(kind,name,x,z,w,d,h,r) in enumerate([
 ('kitchenSink','Spülenzeile',1.03,4.07,1.45,.6,.9,180),('kitchenHob','Kochfeld / Backofen',2.12,4.07,.72,.6,.9,180),('dishwasher','Geschirrspüler',.3,3.33,.6,.6,.86,90),('counter','Arbeitsplatte am Fenster',.3,2.78,.6,.5,.9,90),('peninsula','Küchenhalbinsel',1.05,2.48,1.5,.58,.9,0),('fridge','Kühlschrank (Position geschätzt)',3.77,1.45,.6,.65,1.85,-90),('upper','Oberschrank',1.0,4.24,1.2,.34,.62,180),('hood','Dunstabzug',2.12,4.24,.72,.42,.7,180)]):
 add('kitchen-'+str(i),name,kind,'kitchen',(w,d,h),(x,z),r,'expose-01-image-1.jpeg',ass=['Maße aus Foto/Plan geschätzt; Geräteaufteilung teilweise verdeckt.'],fixed=True,y=1.5 if kind=='upper' else 1.55 if kind=='hood' else 0)
add('wardrobe','Vorhandener Kleiderschrank','wardrobe','bedroom',(2.6,.6,2.4),(4.77,6.36),90,'expose-08-image-1.jpeg',ass=['2,60 × 0,60 × 2,40 m geschätzt. Westwand aus Foto S. 8 und Word-Plan; Exposé-Möblierung zeigt widersprüchlich Ostwand.'],fixed=True)
add('basin','Waschbecken + Spiegelschrank','basin','bath',(.95,.5,.88),(4.31,.65),90,'expose-10-image-1.jpeg',ass=['Abmessungen geschätzt.'],fixed=True)
add('wc','Wand-WC','toilet','bath',(.38,.55,.44),(6.2,1.03),-90,'expose-10-image-2.jpeg',ass=['Position an Trennwand zur Dusche aus Fotos abgeleitet.'],fixed=True,y=.1)
add('shower','Begehbare Dusche','shower','bath',(.92,1.85,2.1),(6.93,1.0),0,'expose-11-image-1.jpeg',ass=['Duschlänge und Trennwandposition geschätzt.'],fixed=True)
for i,(r,x,z,w,h,rot,ref) in enumerate([('kitchen',.13,.72,.85,.65,90,'expose-01-image-1.jpeg'),('kitchen',.13,2.82,.85,.65,90,'expose-01-image-1.jpeg'),('living',2.18,9.14,2.2,.55,180,'expose-07-image-1.jpeg'),('bedroom',4.75,7.86,.55,1.05,180,'expose-08-image-1.jpeg'),('office',10.7,7.83,.48,1.05,180,'expose-07-image-2.jpeg'),('hall',10.17,2.29,.85,.6,0,'expose-11-image-2.jpeg')]):
 add(f'radiator-{i}',f'Heizkörper {i+1}','radiator',r,(w,.16,h),(x,z),rot,ref,ass=['Position aus Foto, Maße und Montagehöhe geschätzt.'],fixed=True,y=.16)
add('balcony-table','Balkontisch · Vorschlag','roundtable','balcony',(.5,.5,.65),(8.15,8.75),ass=['Frei erfundener, entfernbarer Planungsvorschlag.'])
for i,x in enumerate([7.4,8.9]):add(f'balcony-chair-{i}',f'Balkonstuhl {i+1} · Vorschlag','chair','balcony',(.45,.5,.85),(x,8.75),90 if i==0 else -90,ass=['Frei erfundener, entfernbarer Planungsvorschlag.'])
# The user's latest floor plan supersedes the original Word placement markings.
layout=json.loads((OUT/'original-layout.json').read_text())
for item in items:
 if item['id'] in layout['placements']:
  item.update(layout['placements'][item['id']])
  item['assumptions']=[a for a in item['assumptions'] if 'Word-Markierung hat Vorrang' not in a]
  item['assumptions'].append('Ausgangsposition nach angehängtem Nutzergrundriss; aus Bild abgeleitet, ca. ±3 cm. Frühere Word-Markierung dient nur als historische Referenz.')
save('furniture',items)
save('placements',[dict(id=o['id'],room=o['room'],position=o['position'],rotation=o['rotation'],source=layout['source'] if o['id'] in layout['placements'] else o['placementReference'],status='abgeleitet' if o['placementReference'] else 'geschätzt') for o in items])
save('references',dict(originals=['source-files/Expose.pdf','source-files/Möbel.docx'],extraction='/references/extraction.json',floorplan='/references/expose-13-image-1.jpeg',furniture=[dict(id=o['id'],photo=o['reference'],marking=o['placementReference'],originalDimensions=o['originalDimensions'],assumptions=o['assumptions']) for o in items]))
print('Scale:',s,'m/px; furniture:',len(items),'movable Word items:',sum(not o['fixed'] and o['room']!='balcony' for o in items))
for r in rooms: print(r['name'],r['modelArea'],r['sourceArea'],r['deviationPercent'])
