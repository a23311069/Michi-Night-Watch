// Sprites en pixel art (definidos como mapas de caracteres)
import {W,H} from './config.js';
/* ---------- Pixel art: sprites ---------- */
export const mkc=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return[c,c.getContext('2d')]};
function sprite(rows,pal){const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const x=c.getContext('2d');
  rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const k=pal[r[i]];if(k){x.fillStyle=k;x.fillRect(i,j,1,1)}}});return c}
const shade=(h,f)=>{const n=parseInt(h.slice(1),16);return'#'+[16,8,0].map(s=>Math.round(((n>>s)&255)*f).toString(16).padStart(2,'0')).join('')};
export function limb(c,x0,y0,x1,y1,o,f,w,ow){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
  for(let pass=0;pass<2;pass++){c.fillStyle=pass?f:o;const s=pass?w:ow,h=s>>1;
    for(let i=0;i<=n;i++)c.fillRect(Math.round(x0+(x1-x0)*i/n)-h,Math.round(y0+(y1-y0)*i/n)-h,s,s)}}
const ZH=["..kkkkkk..",".khhhhhhk.","khhhhhhhhk","khssssssSk","ksssssssSk","kseessseSk","kseessseSk","ksssssssSk","ksmttmmmSk",".kmmmmmmk.","..kkkkkk.."];
const ZT=[".kkkkkkkkkk.","kcccccccccCk","kcccccccccCk","kccCCcccccCk","kcccccccccCk","kccccCCcccCk","kcccccccccCk","kc.ckc.ckcck"];
export const ZV=[['#7fae6e','#b8404f','#2b1d1a'],['#9bb87c','#3f5f9a','#6b3f2a'],['#7fa39a','#c28a3a',null],['#b2a98a','#5a3f7a','#b8b2a0'],['#8fbf5a','#e0702a','#2b1d1a'],['#a5b88a','#3a8a6a',null]];
export const ZS=ZV.map(([sk,sh,ha])=>sprite([...ZH.map(r=>'.'+r+'.'),...ZT],{k:'#17121f',s:sk,S:shade(sk,.72),h:ha||sk,e:'#ffe45c',m:'#2a0f18',t:'#e9e2c9',c:sh,C:shade(sh,.68)}));
export const CP={k:'#2a1a1c',w:'#f6f0e4',d:'#5c3a2a',b:'#cf8f55'};
export const CHEAD=sprite(["..kk............kk..",".kddk..........kbbk.","kddddkkkkkkkkkkbbbbk","kddddddddwwbbbbbbbbk","kddddddddwwbbbbbbbbk","kddddddddwwbbbbbbbbk","kddddddddwwbbbbbbbbk","kddddddddwwbbbbbbbbk","kddddddddwwbbbbbbbbk","kwdddddddwwbbbbbbbwk","kwdddddddwwbbbbbbbwk","kwdddddddwwbbbbbbbwk",".kdddddddwwbbbbbbbk.","..kkdddddwwbbbbbkk..","....kkkkkkkkkkkk...."],CP);
export const CBODY=sprite(["..kkkkkkkkkkkkkkkkkk..",".kdddddddwwwwbbbbbbbk.","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk","kdddddddwwwwwwbbbbbbbk",".kdddddwwwwwwwwbbbbbk.","..kkkkkkkkkkkkkkkkkk.."],CP);
export const PAW=sprite([".kkkkkkk.","kwwwwwwwk","kwwkwkwwk","kwwwwwwwk","kwbbwwwwk","kwbbwwwwk",".kwwwwwk.","..kkkkk.."],CP);

