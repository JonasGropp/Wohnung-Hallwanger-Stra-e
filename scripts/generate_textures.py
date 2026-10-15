from pathlib import Path
from PIL import Image,ImageDraw
import random
out=Path(__file__).resolve().parents[1]/'public/textures';out.mkdir(exist_ok=True)
random.seed(17)
for name,base,style in [('wood',(164,119,73),'plank'),('lightWood',(203,178,138),'parquet'),('parquet',(164,124,78),'parquet'),('tile',(216,207,189),'tile'),('grayTile',(164,162,155),'tile'),('terracotta',(155,99,65),'tile'),('fabric',(151,143,128),'fabric')]:
 im=Image.new('RGB',(512,512),base);d=ImageDraw.Draw(im)
 if style=='parquet':
  for x in range(0,512,128):
   for y in range(0,512,128):
    for k in range(4):
     delta=random.randint(-9,9);c=tuple(max(0,min(255,v+delta)) for v in base)
     r=(x+k*32,y,x+k*32+31,y+127) if (x+y)//128%2 else (x,y+k*32,x+127,y+k*32+31)
     d.rectangle(r,fill=c,outline=tuple(v-16 for v in c))
     for j in range(12):
      if (x+y)//128%2:d.line((r[0]+random.randrange(1,30),y+2,r[0]+random.randrange(1,30),y+125),fill=tuple(v-5 for v in c))
      else:d.line((x+2,r[1]+random.randrange(1,30),x+125,r[1]+random.randrange(1,30)),fill=tuple(v-5 for v in c))
 elif style=='tile':
  for x in range(0,512,128):
   for y in range(0,512,256):
    c=tuple(v+random.randint(-5,5) for v in base);d.rectangle((x,y,x+126,y+254),fill=c)
 elif style=='plank':
  for y in range(0,512,64):
   c=tuple(v+random.randint(-9,9) for v in base);d.rectangle((0,y,511,y+62),fill=c)
   for j in range(35):
    yy=y+random.randrange(1,62);d.line((0,yy,512,yy+random.randint(-2,2)),fill=tuple(v-7 for v in c))
 else:
  for x in range(512):
   for y in range(512):
    n=random.randint(-9,9);im.putpixel((x,y),tuple(v+n for v in base))
 im.save(out/f'{name}.png')
