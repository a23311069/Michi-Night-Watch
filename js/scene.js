// Escenario fijo: se dibuja una sola vez en capas cacheadas
import {W,H,GL,GR,GT,GB,LANES} from './config.js';
import {mkc} from './sprites.js';
/* ---------- Escenario (capas cacheadas a 240×150) ---------- */
export const layers={};
let seed=7;const srnd=()=>(seed=seed*16807%2147483647)/2147483647;
const SKY=['#080a22','#0d1030','#171447','#241c5a','#352772','#4b3585','#664a92','#835f9a'];
function disc(x,cx,cy,r,col){x.fillStyle=col;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r)x.fillRect(cx+i,cy+j,1,1)}
function buildBG(){
  const[k,x]=mkc();seed=7;
  for(let y=GT;y<GB;y++){const t=(y-GT)/(GB-GT)*SKY.length,i=Math.min(7,t|0),f=t-i;x.fillStyle=SKY[i];x.fillRect(GL,y,GR-GL,1);
    if(f>.7&&i<7){x.fillStyle=SKY[i+1];for(let px=GL+(y&1);px<GR;px+=2)x.fillRect(px,y,1,1)}}
  x.fillStyle='rgba(235,235,255,.1)';for(let j=-14;j<=14;j++)for(let i=-14;i<=14;i++){const d=i*i+j*j;if(d>81&&d<196&&((i+j)&1)===0)x.fillRect(152+i,27+j,1,1)}
  disc(x,152,27,9,'#f3efdc');x.fillStyle='#cfc9b8';[[149,24],[150,24],[155,29],[154,30],[148,31]].forEach(a=>x.fillRect(a[0],a[1],1,1));
  const city=(col,minH,vr,step,win)=>{for(let bx=GL-2;bx<GR;){const w=step+(srnd()*8|0),h=minH+(srnd()*vr|0),top=98-h;x.fillStyle=col;x.fillRect(bx,top,w,h);
    for(let wy=top+3;wy<94;wy+=4)for(let wx=bx+2;wx<bx+w-2;wx+=3)if(srnd()<win){x.fillStyle='#ffd98a';x.fillRect(wx,wy,1,2)}bx+=w+1}};
  city('#1e1a46',16,22,9,.16);city('#120f2c',10,18,10,.08);
  x.fillStyle='#1a1430';x.fillRect(GL,98,GR-GL,GB-98);x.fillStyle='#2b2248';x.fillRect(GL,98,GR-GL,1);
  for(const lx of[60,182]){x.fillStyle='#2b2440';x.fillRect(lx,84,1,14);x.fillStyle='#ffd98a';x.fillRect(lx-1,83,3,1);
    x.fillStyle='rgba(255,200,120,.22)';for(let j=-9;j<=9;j++)for(let i=-9;i<=9;i++)if(i*i+j*j<81&&((i+j)&1)===0)x.fillRect(lx+i,84+j,1,1)}
  for(const lx of LANES){x.fillStyle='#5b4032';x.fillRect(lx-5,42,1,GB-42);x.fillRect(lx+5,42,1,GB-42);
    x.fillStyle='#7a5640';for(let y=GB-3;y>44;y-=6)x.fillRect(lx-5,y,11,1)}
  layers.bg=k;
}
function buildFG(){
  const[k,x]=mkc();
  x.fillStyle='#2a1a33';x.fillRect(0,0,W,H);x.fillStyle='#31203d';for(let i=0;i<W;i+=8)x.fillRect(i,0,3,H);
  x.fillStyle='#160d17';x.fillRect(0,135,W,15);
  x.fillStyle='#24140e';x.fillRect(GL-5,GT-5,GR-GL+10,GB-GT+10);x.fillStyle='#5a3a28';x.fillRect(GL-4,GT-4,GR-GL+8,GB-GT+8);
  x.fillStyle='#8a6244';x.fillRect(GL-4,GT-4,GR-GL+8,1);x.fillRect(GL-4,GT-4,1,GB-GT+8);
  x.clearRect(GL,GT,GR-GL,GB-GT);
  x.fillStyle='#24140e';x.fillRect(GL-1,GT-1,GR-GL+2,1);x.fillRect(GL-1,GT-1,1,GB-GT+2);x.fillRect(GR,GT-1,1,GB-GT+2);
  x.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<34;i++)x.fillRect(GL+8+i,GT+36-i,4,1);
  const sc=['#7a5238','#6e4a32','#62402c','#563826','#4a2f20'];sc.forEach((c,i)=>{x.fillStyle=c;x.fillRect(36,GB+2+i*4,168,4)});
  x.fillStyle='#8a5e3f';x.fillRect(36,GB+2,168,1);x.fillStyle='#3a2418';x.fillRect(34,129,172,6);x.fillStyle='#8a5e3f';x.fillRect(34,129,172,1);
  x.fillStyle='#ffd98a';x.fillRect(54,107,5,1);x.fillStyle='#e9a85a';x.fillRect(53,108,7,1);x.fillRect(52,109,9,3);x.fillStyle='#b8793a';x.fillRect(52,111,9,1);
  x.fillStyle='#3a2418';x.fillRect(56,112,2,8);x.fillRect(52,120,10,2);
  x.fillStyle='#a0583a';x.fillRect(180,121,11,7);x.fillStyle='#7a3f28';x.fillRect(180,126,11,2);
  x.fillStyle='#4c7a4c';[[184,118,2,4],[186,114,2,8],[189,116,2,6],[182,119,2,3]].forEach(a=>x.fillRect(a[0],a[1],a[2],a[3]));x.fillStyle='#6fa060';x.fillRect(186,114,1,3);
  for(let y=6;y<128;y++){const ex=44+Math.round(4*Math.cos(y/22));
    for(let px=12;px<ex;px++){const col=((px+(y>>3))%6<3)?'#4a2d66':'#3a2252';x.fillStyle=px%6===0?'#5a3a78':col;x.fillRect(px,y,1,1);x.fillRect(W-1-px,y,1,1)}}
  x.fillStyle='#8a6a3a';x.fillRect(8,4,224,2);x.fillStyle='#c9a35a';x.fillRect(8,4,3,3);x.fillRect(229,4,3,3);
  layers.fg=k;
  const[g,gx]=mkc();gx.fillStyle='rgba(255,170,80,.16)';
  for(let j=-26;j<=26;j++)for(let i=-26;i<=26;i++){const d=i*i+j*j;if(d<676&&(d<144||((i+j)&1)===0))gx.fillRect(56+i,110+j,1,1)}
  layers.glow=g;
}
export function buildScene(){buildBG();buildFG()}
