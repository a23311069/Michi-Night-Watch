import {LANES,R} from './config.js';
import {limb,ZS,ZV} from './sprites.js';
/* ---------- Zombis ---------- */
export class Zombie{
  constructor(){this.alive=false}
  spawn(lane,speed,fast){const v=fast?4:[0,1,2,3,5][R()*5|0];Object.assign(this,{alive:true,state:0,lane,x:LANES[lane],p:0,speed,fast,ph:R()*6,spr:ZS[v],skin:ZV[v][0],vy:0,fy:0,hitId:-1})}
  get y(){return 114-42*this.p}
  knock(){this.state=1;this.vy=-40}
  update(dt){
    this.ph+=dt*(this.fast?9:6);
    if(this.state===0){this.p+=this.speed*dt;this.x=LANES[this.lane]+Math.round(Math.sin(this.ph*.5))}
    else{this.fy+=this.vy*dt;this.vy+=280*dt;if(this.fy>60)this.alive=false}
  }
  draw(c,gt){
    if(this.state&&this.fy>8&&((gt*18|0)&1))return;
    const x=Math.round(this.x),y=Math.round(this.y+this.fy)+(this.state?0:Math.round(Math.sin(this.ph)*.8)),sw=this.state?0:Math.sin(this.ph);
    c.save();c.translate(x,y);if(this.state&&this.vy>0)c.scale(1,-1);
    const hs=[-1,1].map(k=>[k*9,Math.round(-2-k*sw*3)]);
    [-1,1].forEach((k,i)=>limb(c,k*5,8,hs[i][0],hs[i][1],'#17121f',this.skin,2,4));
    c.drawImage(this.spr,-6,-5);
    for(const h of hs){c.fillStyle='#17121f';c.fillRect(h[0]-3,h[1]-3,6,6);c.fillStyle=this.skin;c.fillRect(h[0]-2,h[1]-2,4,4)}
    c.restore();
  }
}

