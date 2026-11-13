// Audio dinámico y música con Web Audio API (se inicia tras la primera interacción)
import {R,clamp,store} from './config.js';
const CHORDS=[[110,164.81,220],[87.31,130.81,174.61],[130.81,196,261.63],[98,146.83,196]],PENTA=[329.63,392,440,523.25,587.33,659.25];
/* ---------- Audio (Web Audio API, se inicia tras el primer clic) ---------- */
class Sound{
  constructor(){const a=store.get('mnw_audio',{vol:.7,muted:false});this.vol=a.vol;this.muted=a.muted;this.ctx=null}
  init(){
    if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    const c=this.ctx=new AC();this.master=c.createGain();this.master.connect(c.destination);this.apply();
    const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;this.nb=buf;
    const w=this.noise(true),lp=c.createBiquadFilter(),wg=c.createGain();lp.type='lowpass';lp.frequency.value=260;wg.gain.value=.05;
    w.connect(lp);lp.connect(wg);wg.connect(this.master);w.start();
    this.dg=c.createGain();this.dg.gain.value=.004;const l2=c.createBiquadFilter();l2.type='lowpass';l2.frequency.value=170;
    l2.connect(this.dg);this.dg.connect(this.master);
    [50,53.5].forEach(f=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(l2);o.start()});
    this.startMusic();
  }
  noise(loop){const s=this.ctx.createBufferSource();s.buffer=this.nb;s.loop=!!loop;return s}
  apply(){if(this.master)this.master.gain.setTargetAtTime(this.muted?0:this.vol*.8,this.ctx.currentTime,.05)}
  save(){store.set('mnw_audio',{vol:this.vol,muted:this.muted})}
  threat(t){if(this.dg)this.dg.gain.setTargetAtTime(.004+.07*t,this.ctx.currentTime,.3)}
  moan(close,pan){ // gemido ambiental: más fuerte y más claro cuanto más cerca
    const c=this.ctx;if(!c||this.muted)return;const t=c.currentTime,dur=1.1+R()*.6,f=75+R()*45;
    const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f*1.25,t);o.frequency.exponentialRampToValueAtTime(f*.8,t+dur);
    const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5+R()*2;lg.gain.value=4;lfo.connect(lg);lg.connect(o.frequency);
    const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=380+R()*200;bp.Q.value=2.2;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=350+1500*close;
    const g=c.createGain(),v=.03+.16*close;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.25);g.gain.linearRampToValueAtTime(0,t+dur);
    o.connect(bp);bp.connect(lp);lp.connect(g);
    if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(this.master)}else g.connect(this.master);
    o.start(t);lfo.start(t);o.stop(t+dur+.05);lfo.stop(t+dur+.05);
  }
  tone(type,f0,f1,dur,vol,lpf){const c=this.ctx;if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain(),l=c.createBiquadFilter();
    o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);l.type='lowpass';l.frequency.value=lpf||4000;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(l);l.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.05)}
  burst(type,f0,f1,dur,vol){const c=this.ctx;if(!c)return;const t=c.currentTime,s=this.noise(),b=c.createBiquadFilter(),g=c.createGain();
    b.type=type;b.Q.value=.8;b.frequency.setValueAtTime(f0,t);b.frequency.exponentialRampToValueAtTime(f1,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+dur*.3);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(b);b.connect(g);g.connect(this.master);s.start(t,R()*1.5,dur+.05)}
  startMusic(){ // nana suave generada con Web Audio, muy baja
    const c=this.ctx;this.mg=c.createGain();this.mg.gain.value=.5;this.mg.connect(this.master);
    const dl=c.createDelay();dl.delayTime.value=.36;const fb=c.createGain();fb.gain.value=.4;dl.connect(fb);fb.connect(dl);dl.connect(this.mg);this.dl=dl;
    this.mi=2;this.step=0;this.next=c.currentTime+.2;this.timer=setInterval(()=>this.sched(),200);
  }
  sched(){const c=this.ctx;while(this.next<c.currentTime+.8){this.beat(this.step++,this.next);this.next+=.7}}
  beat(s,t){
    const c=this.ctx;
    if(s%8===0){const ch=CHORDS[(s/8|0)%4];for(const f of ch){const o=c.createOscillator(),g=c.createGain(),l=c.createBiquadFilter();o.type='sine';o.frequency.value=f;l.type='lowpass';l.frequency.value=800;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+1.4);g.gain.linearRampToValueAtTime(0,t+6.2);o.connect(l);l.connect(g);g.connect(this.mg);o.start(t);o.stop(t+6.3)}}
    if(R()<.6){this.mi=clamp(this.mi+(R()*3|0)-1,0,5);const o=c.createOscillator(),g=c.createGain(),s2=c.createGain();o.type='sine';o.frequency.value=PENTA[this.mi];
      g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);s2.gain.value=.6;o.connect(g);g.connect(this.mg);g.connect(s2);s2.connect(this.dl);o.start(t);o.stop(t+1.7)}
  }
  swat(){this.burst('bandpass',1800,600,.2,.12)}
  hit(){this.tone('sine',150,45,.25,.3);this.burst('lowpass',600,200,.14,.2)}
  hurt(){this.tone('sawtooth',220,70,.45,.12,600)}
}
export const snd=new Sound();
