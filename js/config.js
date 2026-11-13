// Constantes y utilidades compartidas
export const W=240,H=150,GL=50,GR=190,GT=10,GB=107,LANES=[68,94,120,146,172],MAXZ=12;
export const REST=108,PEAK=86,PX=13,OUT=.16,HOLD=.05,BACK=.3;
export const $=id=>document.getElementById(id),R=Math.random;
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
export function bez(a,b,c,d,t){const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d}
