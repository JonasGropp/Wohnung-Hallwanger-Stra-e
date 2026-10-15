"""Reproducible extraction. Requires Python: pymupdf pillow. Originals are read-only."""
from pathlib import Path
import fitz, zipfile, xml.etree.ElementTree as ET, json
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1]; out=ROOT/'public/references'; out.mkdir(parents=True,exist_ok=True)
manifest={'pdf':[], 'docx':[]}
doc=fitz.open(ROOT/'source-files/Expose.pdf')
for i,page in enumerate(doc):
    p=out/f'expose-page-{i+1:02}.png';page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(p)
    images=[]
    for j,im in enumerate(page.get_images(full=True)):
        data=doc.extract_image(im[0]); name=f'expose-{i+1:02}-image-{j+1}.{data["ext"]}';(out/name).write_bytes(data['image']);images.append(name)
    manifest['pdf'].append({'page':i+1,'render':p.name,'text':page.get_text(),'images':images})
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
with zipfile.ZipFile(ROOT/'source-files/Möbel.docx') as z:
    rel={r.attrib['Id']:r.attrib['Target'] for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
    for file in z.namelist():
        if file.startswith('word/media/'): (out/('moebel-'+Path(file).name)).write_bytes(z.read(file))
    root=ET.fromstring(z.read('word/document.xml'))
    for p in root.findall('.//w:p',ns):
        txt=''.join(t.text or '' for t in p.findall('.//w:t',ns))
        ims=[ 'moebel-'+Path(rel[b.attrib['{'+ns['r']+'}embed']]).name for b in p.findall('.//a:blip',ns) if '{'+ns['r']+'}embed' in b.attrib]
        if txt or ims:manifest['docx'].append({'text':txt,'images':ims})
(out/'extraction.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# Contact sheets of every embedded Word image and all PDF pages, labelled by file name.
for group,files in [('word',sorted(out.glob('moebel-*'))),('pdf',sorted(out.glob('expose-page-*')))]:
 for offset in range(0,len(files),12):
    batch=files[offset:offset+12]; sheet=Image.new('RGB',(1200,((len(batch)+3)//4)*340),'#ddd');draw=ImageDraw.Draw(sheet)
    for j,f in enumerate(batch):
        im=Image.open(f).convert('RGB');im.thumbnail((290,310));x=(j%4)*300;y=(j//4)*340;sheet.paste(im,(x+(290-im.width)//2,y));draw.text((x+5,y+315),f.name,fill='black')
    sheet.save(out/f'contact-{group}-{offset//12+1}.jpg')
print('PDF pages:',len(doc),'Word blocks:',len(manifest['docx']))
for x in manifest['docx']:print(x['text'],','.join(x['images']))
for x in manifest['pdf']:print('PAGE',x['page'],x['text'])
