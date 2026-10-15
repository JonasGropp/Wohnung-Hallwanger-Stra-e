import type {Furniture,Part,Vec3} from '../types';
/** Geometry and collision share these metre-based components. Accessories belong to their parent. */
export function furnitureParts(f:Furniture):Part[]{
 const {width:w,depth:d,height:h,kind:k}=f;const p:Part[]=[];
 const box=(size:Vec3,position:Vec3,material='white',collision=true)=>p.push({shape:'box',size,position,material,collision});
 const cyl=(size:Vec3,position:Vec3,material='metal',rotation:Vec3=[0,0,0],collision=true)=>p.push({shape:'cylinder',size,position,material,rotation,collision});
 const ball=(size:Vec3,position:Vec3,material='white')=>p.push({shape:'sphere',size,position,material});
 const legs=(height:number,mat='white',thickness=.045)=>{for(const x of [-1,1])for(const z of [-1,1])box([thickness,height,thickness],[x*(w/2-thickness),height/2,z*(d/2-thickness)],mat)};
 const handle=(x:number,y:number,z=d/2+.008)=>cyl([.025,.025,.025],[x,y,z],'dark',[Math.PI/2,0,0],false);
 const carcass=(bottom=.08,top=h,mat='white')=>{box([w,.035,d],[0,top-.0175,0],mat);box([w,.035,d],[0,bottom,0],mat);for(const x of [-1,1])box([.025,top-bottom,d],[x*(w/2-.0125),(top+bottom)/2,0],mat);box([w,top-bottom,.02],[0,(top+bottom)/2,-d/2+.01],mat)};
 const fronts=(cols:number,rows:number,bottom=.1,top=h-.05)=>{for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const ch=(top-bottom)/rows,cw=w/cols;const x=-w/2+cw*(i+.5),y=bottom+ch*(j+.5);box([cw-.012,ch-.012,.025],[x,y,d/2-.008]);handle(x,y+.025)}};
 const lamp=(x=0,z=0,y=h)=>{cyl([.15,.02,.15],[x,y+.01,z]);cyl([.018,.23,.018],[x,y+.135,z]);cyl([.2,.19,.2],[x,y+.32,z],'linen');};
 const monitor=(x:number,y:number,z:number,mw=.55)=>{box([mw,mw*.57,.035],[x,y,z],'dark');box([mw-.025,mw*.57-.025,.008],[x,y,z+.021],'screen');box([.025,.22,.025],[x,y-.24,z-.03],'dark');box([.2,.015,.12],[x,y-.35,z],'dark')};
 switch(k){
 case 'bed':
  legs(.15);box([w,.23,d],[0,.265,0]);box([w,.9,.055],[0,.45,-d/2+.0275]);box([w-.1,.18,d-.12],[0,h+.09,.01],'linen');
  // A fitted white cover, no decorative pillows or loose blanket.
  break;
 case 'daybed':
  carcass(.08,.43);fronts(3,1,.12,.41);box([w-.08,.16,d-.07],[0,.51,.01],'linen');box([w,.4,.045],[0,.63,-d/2+.0225]);
  for(const x of [-1,1])box([.045,.66,d],[x*(w/2-.0225),.5,0]);
  for(let i=1;i<20;i++)box([.008,.28,.012],[-w/2+i*w/20,.66,-d/2+.05],'trim',false);break;
 case 'dresser':
  legs(.13);carcass(.13);fronts(2,3,.16,h-.05);for(const x of [-.6,-.2,.2,.6])handle(x,h-.17);
  box([.82,.04,.62],[0,h+.02,0]);for(const x of [-1,1])box([.025,.12,.62],[x*.41,h+.06,0]);box([.82,.12,.025],[0,h+.06,-.3]);box([.76,.025,.54],[0,h+.055,0],'linen');break;
 case 'bedside':legs(h-.06);box([w,.04,d],[0,h-.02,0]);box([w-.05,.02,d-.04],[0,.12,0]);box([w-.06,.12,d-.03],[0,h-.12,0]);handle(0,h-.12);lamp();break;
 case 'billy':case 'glasscabinet':case 'sideboard':case 'wardrobe':case 'hauga':case 'kallax':
  carcass();
  if(k==='kallax') {box([.025,h,d],[0,h/2,0]);for(let i=1;i<4;i++)box([w,.025,d],[0,h*i/4,0]);}
  else if(k==='hauga'){fronts(1,3,.08,.75);box([w,.025,d],[0,.78,0]);box([w,.025,d],[0,h-.35,0]);cyl([.025,w-.08,.025],[0,h-.42,0],'metal',[0,0,Math.PI/2]);}
  else if(k==='wardrobe'){fronts(4,1,.08,h-.06);for(let i=1;i<4;i++)box([w,.008,.01],[0,h*i/4,d/2+.01],'trim',false);}
  else if(k==='billy'||k==='glasscabinet'){
   for(let i=1;i<(k==='billy'?6:3);i++)box([w-.05,.025,d-.04],[0,h*i/(k==='billy'?6:3),0]);
   for(const x of [-1,1]){box([w/2-.04,h-.14,.012],[x*w/4,h/2,d/2],'glass');for(const xx of [-1,1])box([.025,h-.1,.025],[x*w/4+xx*(w/4-.025),h/2,d/2]);for(const y of [.09,h/2,h-.06])box([w/2-.02,.035,.025],[x*w/4,y,d/2]);handle(x*.05,h*.48)}
  }else {fronts(3,1,.12,h-.06);box([w,.035,d],[0,h-.0175,0],'wood');}
  if(k==='glasscabinet')box([w,.035,d],[0,h-.0175,0],'wood');break;
 case 'besta':
  carcass(.04);fronts(3,1,.045,h-.04);monitor(0,h+.44,-.07,1.2);box([.85,.055,.09],[0,h+.035,.11],'dark');break;
 case 'vanity':
  legs(h-.06);box([w,.045,d],[0,h-.0225,0]);box([w-.1,.13,d-.04],[0,h-.11,0]);handle(-w*.32,h-.11);handle(w*.32,h-.11);
  box([.48,.045,.3],[0,.44,.29]);for(const x of [-.2,.2])for(const z of [.18,.4])box([.03,.42,.03],[x,.21,z]);break;
 case 'console':
  legs(h-.03);for(const y of [.09,.4])box([w-.04,.025,d-.04],[0,y,0]);box([w,.018,d],[0,h-.01,0],'glass');for(const z of [-1,1])box([w,.06,.03],[0,h-.03,z*(d/2-.015)]);break;
 case 'crib':
  for(const x of [-1,1])for(const z of [-1,1]){box([.035,h,.035],[x*(w/2-.025),h/2,z*(d/2-.02)]);cyl([.04,.035,.04],[x*(w/2-.025),.02,z*(d/2-.02)],'dark')}
  box([w-.03,.04,d-.025],[0,.48,0]);box([w-.06,.04,d-.05],[0,.52,0],'linen');
  for(const y of [.24,h-.02]){box([w,.025,.025],[0,y,-d/2]);for(const x of [-1,1])box([.025,.025,d],[x*(w/2-.015),y,0])}
  for(let i=0;i<12;i++)box([.015,h-.25,.018],[-w/2+.04+i*(w-.08)/11,(h+.23)/2,-d/2]);for(const x of [-1,1])for(let j=1;j<5;j++)box([.018,h-.25,.015],[x*(w/2-.015),(h+.23)/2,-d/2+j*d/5]);break;
 case 'table':case 'desk':
  box([w,.045,d],[0,h-.0225,0],'wood');
  if(k==='table')legs(h-.045,'wood',.07);
  else {for(const x of [-w*.35,w*.35]){box([.06,h-.05,.065],[x,(h-.05)/2,0],'dark');box([.12,.045,d*.88],[x,.025,0],'dark')}box([w*.7,.055,.05],[0,h-.1,0],'dark');monitor(-.31,h+.4,-.24);monitor(.31,h+.4,-.24);box([.44,.02,.15],[-.15,h+.01,.16],'dark');ball([.065,.035,.1],[.22,h+.02,.16],'dark');box([.28,.018,.2],[.6,h+.01,.03],'dark');}
  break;
 case 'chair':
  legs(.46);box([w,.045,d],[0,.46,0],'linen');for(const x of [-1,1])box([.035,h-.45,.035],[x*(w/2-.02),(.45+h)/2,-d/2+.02]);for(let i=0;i<3;i++)box([w,.055,.025],[0,.62+i*(h-.66)/2,-d/2+.02]);break;
 case 'sofa':
  legs(.07,'dark');box([w,.22,d],[0,.18,0],'fabric');box([w-.04,.13,d-.19],[0,.355,.065],'fabricLight');box([w,.4,.16],[0,h-.2,-d/2+.08],'fabric');
  box([.11,h-.12,d],[f.id==='sofa-1'?w/2-.055:-w/2+.055,(h+.12)/2,0],'fabric');
  for(const x of [-w*.22,w*.22]){box([w*.4,.28,.12],[x,.55,-d/2+.24],'fabricLight');}
  box([.36,.03,.55],[0,.44,d*.18],'linen',false);break;
 case 'roundtable':cyl([w,.035,d],[0,h-.0175,0],f.room==='balcony'?'wood':'white');for(let i=0;i<3;i++){const a=i*Math.PI*2/3;box([.035,h-.035,.035],[Math.cos(a)*w*.28,(h-.035)/2,Math.sin(a)*d*.28],'wood')}break;
 case 'washer':case 'dryer':case 'dishwasher':case 'fridge':
  box([w,h,d],[0,h/2,0]);
  if(k==='washer'||k==='dryer'){cyl([w*.68,.035,w*.68],[0,h*.43,d/2+.01],'metal',[Math.PI/2,0,0]);cyl([w*.53,.04,w*.53],[0,h*.43,d/2+.025],k==='dryer'?'white':'screen',[Math.PI/2,0,0]);box([w*.32,.07,.008],[w*.18,h-.11,d/2+.01],'screen');handle(-w*.25,h-.11)}
  else if(k==='fridge'){box([w,.012,.012],[0,h*.3,d/2+.01],'trim');box([.025,.35,.035],[w*.35,h*.6,d/2+.015],'metal')}
  else box([w*.65,.025,.025],[0,h-.1,d/2+.02],'metal');break;
 case 'counter':case 'peninsula':case 'kitchenSink':case 'kitchenHob':
  carcass(.1,h-.045,k==='peninsula'?'sage':'white');fronts(Math.max(1,Math.round(w/.6)),1,.12,h-.09);box([w,.045,d],[0,h-.0225,0],'wood');
  if(k==='kitchenSink'){box([.62,.01,.4],[0,h+.004,0],'metal');box([.28,.012,.28],[-.12,h+.012,0],'sink');cyl([.025,.25,.025],[0,h+.125,-d*.35]);box([.18,.025,.025],[-.08,h+.25,-d*.35],'metal')}
  if(k==='kitchenHob'){box([w*.85,.015,d*.8],[0,h+.007,0],'dark');for(const x of [-1,1])for(const z of [-1,1])cyl([.16,.008,.16],[x*.15,h+.02,z*.13],'metal');box([w*.8,.4,.02],[0,.43,d/2+.015],'screen');box([w*.7,.025,.03],[0,.64,d/2+.03],'metal')}
  break;
 case 'upper':carcass(0);fronts(2,1,0,h);break;
 case 'hood':box([w,.08,d],[0,.04,0],'sage');box([w*.75,h-.08,d*.7],[0,h/2+.04,-d*.1]);break;
 case 'radiator':
  for(let i=0;i<Math.round(w/.055);i++)box([.038,h,d],[(-w/2+.025)+i*(w-.05)/(Math.round(w/.055)-1),h/2,0],'radiator');for(const y of [.07,h-.07])box([w,.025,.035],[0,y,0],'metal');box([w+.06,.025,d+.05],[0,h+.04,0],'stone');break;
 case 'basin':
  box([w,.1,d],[0,h-.05,0],'ceramic');box([w*.78,.012,d*.65],[0,h+.005,.01],'sink');cyl([.025,.17,.025],[0,h+.085,-d*.34]);box([.14,.025,.025],[0,h+.17,-d*.24],'metal');cyl([.055,.32,.055],[0,h-.26,0]);box([w,.58,.12],[0,h+.66,-d/2+.06],'metal');for(const x of [-1,0,1])box([w/3-.005,.55,.008],[x*w/3,h+.66,-d/2+.125],'mirror');break;
 case 'toilet':
  ball([w,.28,d],[0,.26,.03],'ceramic');cyl([w,.035,d],[0,.4,.04],'ceramic');cyl([w*.66,.01,d*.65],[0,.421,.04],'sink');box([w+.15,1.1,.15],[0,.55,-d/2],'grayTile');box([.18,.12,.015],[0,.88,-d/2+.085],'metal');break;
 case 'shower':
  box([w,.025,d],[0,.0125,0],'stone');box([.065,h,d],[ -w/2+.0325,h/2,0],'grayTile');box([.015,1.9,d*.55],[w/2, .95,-d*.225],'glass');cyl([.025,1.35,.025],[-w/2+.1,1.25,-.3]);box([.28,.025,.025],[-w/2+.24,1.93,-.3],'metal');cyl([.24,.02,.24],[-w/2+.32,1.93,-.3]);break;
 default:carcass();fronts(2,1);
 }
 return p;
}
