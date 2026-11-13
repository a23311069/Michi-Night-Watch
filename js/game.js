// Estado del juego, reglas, dificultad y renderizado
import {W,H,GL,GR,GT,GB,MAXZ,R,$,clamp,store} from './config.js';
import {snd} from './audio.js';
import {Zombie} from './zombie.js';
import {Canela,drawCanela} from './player.js';
import {layers} from './scene.js';
import * as ui from './ui.js';
const cv=$('cv'),ctx=cv.getContext('2d');cv.width=W;cv.height=H;
/* ---------- Juego ---------- */
const player=new Canela(),zs=Array.from({length:MAXZ},()=>new Zombie()),parts=Array.from({length:40},()=>({l:0,x:0,y:0,vx:0,vy:0}));
const stars=Array.from({length:42},()=>{let x,y;do{x=GL+2+(R()*(GR-GL-4)|0);y=GT+2+(R()*44|0)}while(Math.hypot(x-152,y-27)<14);return{x,y,sp:.8+R()*2,ph:R()*6,big:R()<.18}});
const G={state:'menu',paused:false,score:0,lives:3,time:0,level:0,spawnT:1.5,moanT:2,thrT:0,hurt:0,best:store.get('mnw_best',0)};
let gt=0;
function sparks(x,y){let n=0;for(const p of parts){if(p.l<=0){const a=R()*6.28,v=25+R()*40;p.l=.4;p.x=x;p.y=y;p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v-15;if(++n>=9)break}}}
function spawn(){
  let lane=0;
  for(let t=0;t<5;t++){lane=R()*5|0;if(!zs.some(z=>z.alive&&z.state===0&&z.lane===lane&&z.p<.25))break}
  const z=zs.find(z=>!z.alive);if(!z)return;
  const fast=G.level>=1&&R()<.25;
  z.spawn(lane,Math.min(.26,.085+.011*G.level)*(.85+R()*.3)*(fast?1.5:1),fast);
}
function setPause(v){
  if(G.state!=='play'||G.paused===v)return;G.paused=v;ui.setPauseUI(v);
  if(snd.ctx)v?snd.ctx.suspend():snd.ctx.resume();
}
function startGame(){
  snd.init();Object.assign(G,{state:'play',paused:false,score:0,lives:3,time:0,level:0,spawnT:1.2,moanT:2,hurt:0});
  zs.forEach(z=>z.alive=false);parts.forEach(p=>p.l=0);ui.resetHud();ui.showPlaying();ui.hud(G);
}
function gameOver(){
  G.state='over';snd.threat(0);
  const nb=G.score>G.best;if(nb){G.best=G.score;store.set('mnw_best',G.best)}
  ui.showGameOver(G,nb);
}
function update(dt){
  player.update(dt);
  for(const p of parts)if(p.l>0){p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=125*dt}
  if(G.hurt>0)G.hurt-=dt*2;
  if(G.state!=='play')return;
  G.time+=dt;G.level=G.time/15|0;G.spawnT-=dt;
  if(G.spawnT<=0){const act=zs.reduce((n,z)=>n+(z.alive&&z.state===0),0);if(act<Math.min(MAXZ,4+G.level))spawn();G.spawnT=Math.max(.7,2.6-.18*G.level)*(.7+R()*.6)}
  let maxP=0,cnt=0,pick=null;
  for(const z of zs){
    if(!z.alive)continue;z.update(dt);
    if(z.state===0){
      if(z.p>=1){z.alive=false;G.lives--;G.hurt=1;snd.hurt();if(G.lives<=0){gameOver();return}continue}
      if(z.p>maxP)maxP=z.p;if(z.p>.4)cnt++;if(!pick||R()<.4)pick=z;
    }
  }
  if(player.extending&&player.r>.3){
    const tp=player.tip();let n=0;
    for(const z of zs){
      if(!z.alive||z.state!==0||z.p<.12||z.hitId===player.id)continue;
      if(Math.abs(tp.x-z.x)<10&&tp.y>z.y-8&&tp.y<z.y+16){z.hitId=player.id;z.knock();G.score+=10+G.level*2+(n++)*5;sparks(z.x,z.y);snd.hit()}
    }
  }
  const thr=pick?clamp(.12+.75*Math.pow(maxP,1.6)+.06*cnt,0,1):0;
  if((G.thrT-=dt)<=0){G.thrT=.2;snd.threat(thr)}
  if(pick&&(G.moanT-=dt)<=0){G.moanT=(3.4-2.4*thr)*(.6+R()*.8);snd.moan(pick.p,clamp((pick.x-120)/70,-1,1))}
  ui.hud(G);
}
function render(){
  const c=ctx;c.imageSmoothingEnabled=false;c.clearRect(0,0,W,H);
  c.save();c.beginPath();c.rect(GL,GT,GR-GL,GB-GT);c.clip();
  c.drawImage(layers.bg,0,0);
  for(const s of stars)if(Math.sin(gt*s.sp+s.ph)>-.2){c.fillStyle=s.big?'#fff':'#c9c6ff';c.fillRect(s.x,s.y,1,1);if(s.big){c.fillRect(s.x-1,s.y,3,1);c.fillRect(s.x,s.y-1,1,3)}}
  c.fillStyle='rgba(180,160,220,.1)';for(let i=0;i<2;i++){const cx=GL-30+((gt*2+i*80)%190)|0,cy=24+i*14;c.fillRect(cx,cy,26,2);c.fillRect(cx+6,cy-2,14,2);c.fillRect(cx+3,cy+2,20,1)}
  for(const z of zs)if(z.alive)z.draw(c,gt);
  c.fillStyle='#ffe9a8';for(const p of parts)if(p.l>0)c.fillRect(Math.round(p.x),Math.round(p.y),p.l>.2?2:1,p.l>.2?2:1);
  c.restore();
  c.drawImage(layers.fg,0,0);
  c.globalAlpha=.8+.2*Math.sin(gt*9);c.drawImage(layers.glow,0,0);c.globalAlpha=1;
  drawCanela(c,player,gt);
  if(G.hurt>0){c.fillStyle='rgba(210,30,50,'+(G.hurt*.35).toFixed(3)+')';c.fillRect(0,0,W,H)}
}


function tick(dt){if(!G.paused){gt+=dt;update(dt)}render()}
export {G,player,startGame,setPause,tick};
