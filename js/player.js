import {GL,GR,REST,PEAK,PX,OUT,HOLD,BACK,clamp,bez} from './config.js';
import {limb,CP,CHEAD,CBODY,PAW} from './sprites.js';
/* ---------- Canela ---------- */
export class Canela{
  constructor(){this.x=120;this.tx=120;this.vx=0;this.wp=0;this.sw=null;this.id=0}
  move(x){this.tx=clamp(x-PX,GL+8,GR-8-PX)}
  swat(){if(this.sw!==null)return false;this.sw=0;this.id++;return true}
  update(dt){
    const v=clamp((this.tx-this.x)*9,-115,115);this.vx+=(v-this.vx)*(1-Math.exp(-12*dt));this.x+=this.vx*dt;
    if(this.walking)this.wp+=dt*13;
    if(this.sw!==null){this.sw+=dt;if(this.sw>OUT+HOLD+BACK)this.sw=null}
  }
  get walking(){return Math.abs(this.vx)>4}
  get extending(){return this.sw!==null&&this.sw<OUT+HOLD}
  get r(){const s=this.sw;if(s===null)return 0;
    if(s<OUT){const u=s/OUT-1;return clamp(1+2.2*u*u*u+1.2*u*u,0,1.06)}
    if(s<OUT+HOLD)return 1;const u=(s-OUT-HOLD)/BACK;return 1-u*u*(3-2*u)}
  tip(){return{x:this.x+PX,y:REST-this.r*(REST-PEAK)}}
}
export function drawCanela(c,p,gt){
  const walk=p.walking,x=Math.round(p.x),hop=walk&&Math.sin(p.wp)>.3?1:0,base=128-hop,y0=base-27,bo=!walk&&Math.sin(gt*1.3)>.6?1:0;
  c.fillStyle='rgba(0,0,0,.3)';c.fillRect(x-11,126,22,3);
  const sw=Math.sin(gt*(walk?5:1.7))*(walk?6:4);
  for(let pass=0;pass<2;pass++)for(let i=0;i<=10;i++){const u=i/10,tx=Math.round(bez(x+8,x+16,x+24+sw,x+20+sw*1.5,u)),ty=Math.round(bez(base-6,base-3,base-18,base-25,u));
    if(!pass){c.fillStyle=CP.k;c.fillRect(tx-2,ty-2,5,5)}else{c.fillStyle=i<4?CP.b:i<7?CP.w:CP.d;c.fillRect(tx-1,ty-1,3,3)}}
  const tp=p.tip();
  limb(c,x+6,y0+12,Math.round(tp.x),Math.round(tp.y)+3,CP.k,CP.w,4,6); // brazo grosor fijo, sale por delante de la cabeza
  c.drawImage(PAW,Math.round(tp.x)-4,Math.round(tp.y)-4);
  for(const i of[-1,1]){const lift=walk&&Math.sin(p.wp+(i>0?0:Math.PI))>0?2:0;c.fillStyle=CP.k;c.fillRect(x+i*7-4,base-4-lift,8,4);c.fillStyle=CP.w;c.fillRect(x+i*7-3,base-4-lift,6,3)}
  c.drawImage(CBODY,x-11,y0+12);c.drawImage(CHEAD,x-10,y0+bo);
}

