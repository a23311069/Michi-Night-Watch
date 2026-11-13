// Interfaz DOM: HUD, pantallas y controles de sonido
import {$} from './config.js';
import {snd} from './audio.js';
const cv=$('cv'),hudEl={score:$('score'),time:$('time'),hearts:$('hearts'),bar:$('bar'),lvl:$('lvl')},hc={};
const fmt=s=>(s/60|0)+':'+String(s%60).padStart(2,'0');
export function resetHud(){hc.sc=hc.tm=hc.hr=hc.lv=-1}
export function hud(G){ // solo toca el DOM cuando algo cambia
  const sc=G.score,tm=G.time|0,hr=G.lives,lv=G.level;
  if(hc.sc!==sc){hc.sc=sc;hudEl.score.textContent=sc}
  if(hc.tm!==tm){hc.tm=tm;hudEl.time.textContent=fmt(tm)}
  if(hc.hr!==hr){hc.hr=hr;hudEl.hearts.innerHTML='♥'.repeat(Math.max(0,hr))+'<span class="lost">'+'♥'.repeat(3-Math.max(0,hr))+'</span>'}
  if(hc.lv!==lv){hc.lv=lv;hudEl.lvl.textContent='Nivel '+(lv+1)}
  hudEl.bar.style.width=(G.time%15)/15*100+'%';
}
export function showPlaying(){
  for(const id of['start','over','pausecard'])$(id).classList.add('hide');
  $('pause').classList.remove('hide');$('pause').textContent='⏸';$('hud').classList.remove('m');cv.style.cursor='none';
}
export function setPauseUI(v){$('pausecard').classList.toggle('hide',!v);$('pause').textContent=v?'▶':'⏸';cv.style.cursor=v?'default':'none'}
export function showGameOver(G,newBest){
  cv.style.cursor='default';$('pause').classList.add('hide');
  $('fs').textContent=G.score;$('fb').textContent=G.best;
  $('fn').textContent='Sobreviviste '+fmt(G.time|0)+(newBest?' · ¡Nuevo récord!':'');
  $('over').classList.remove('hide');
}
export function initAudioControls(){
  const vol=$('vol'),mute=$('mute');vol.value=snd.vol;
  const sync=()=>{mute.textContent=snd.muted||snd.vol===0?'🔇':'🔊'};sync();
  mute.onclick=()=>{snd.muted=!snd.muted;snd.init();snd.apply();snd.save();sync()};
  vol.oninput=()=>{snd.vol=+vol.value;snd.muted=false;snd.apply();snd.save();sync()};
}
