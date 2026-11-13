// Punto de entrada: entrada de usuario, bucle principal y ciclo de vida de la pestaña
import {W,$} from './config.js';
import {snd} from './audio.js';
import {buildScene} from './scene.js';
import * as ui from './ui.js';
import {G,player,startGame,setPause,tick} from './game.js';
const cv=$('cv'),stage=$('stage');let rect;
const fit=()=>{rect=stage.getBoundingClientRect()};
const pm=e=>{if(rect)player.move((e.clientX-rect.left)/rect.width*W)};
window.addEventListener('pointermove',pm);
cv.addEventListener('pointerdown',e=>{pm(e);if(e.pointerType==='mouse'&&e.button!==0)return;if(G.state!=='over'&&!G.paused&&player.swat())snd.swat()});
cv.addEventListener('contextmenu',e=>e.preventDefault());
$('play').onclick=startGame;$('again').onclick=startGame;$('resume').onclick=()=>setPause(false);
$('pause').onclick=()=>setPause(!G.paused);
window.addEventListener('keydown',e=>{if(e.key==='p'||e.key==='P'||e.key==='Escape')setPause(!G.paused)});
ui.initAudioControls();
let last=performance.now(),raf=0;
function frame(now){raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;tick(dt)}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelAnimationFrame(raf);raf=0;setPause(true);if(snd.ctx)snd.ctx.suspend()}
  else if(!raf){last=performance.now();raf=requestAnimationFrame(frame);if(snd.ctx&&!G.paused)snd.ctx.resume()}
});
new ResizeObserver(fit).observe(stage);
buildScene();fit();raf=requestAnimationFrame(frame);
