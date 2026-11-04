/* ============================================================
   ZBEUL · Le Plateau
   Couche « plateau de jeu télé » posée par-dessus le script
   principal : décor du studio, enseigne lumineuse, tuiles,
   photos des joueurs, roues (rôles, qui commence), musique et
   bruitages. Chargé après le script d'index.html, il habille
   les fonctions existantes sans les réécrire.
   ============================================================ */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
const ICONS=window.ZB_ICONS||{};
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- sprite d'illustrations + filtre « trait qui tremble » ---------- */
const NS="http://www.w3.org/2000/svg";
(function sprite(){
  let s=`<svg xmlns="${NS}" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>`;
  s+=`<filter id="zbBoil"><feTurbulence id="zbTurb" type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter>`;
  for(const k in ICONS)s+=`<symbol id="zi-${k}" viewBox="0 0 512 512">${ICONS[k]}</symbol>`;
  s+=`</defs></svg>`;
  document.body.insertAdjacentHTML("afterbegin",s);
  if(!REDUCE&&matchMedia("(min-width:700px)").matches){let sd=1;const t=$("zbTurb");setInterval(()=>{if(document.hidden)return;sd=sd%4+1;t.setAttribute("seed",sd)},140)}
})();
const ico=(k,cls="")=>ICONS[k]?`<svg class="${cls}" viewBox="0 0 512 512" aria-hidden="true"><use href="#zi-${k}"/></svg>`:"";

/* ---------- le studio (projecteurs, sol, gribouillis) ---------- */
(function studio(){
  const st=document.createElement("div");st.className="studio";st.setAttribute("aria-hidden","true");
  const L=["uc","lg","dt","av","jn","bt","crown","podium","joker","swords"];let h="";
  for(let k=0;k<30;k++){const x=(k*37)%100,y=(k*53+k*k*7)%100,r=(k*47)%60-30,sc=.6+((k*13)%10)/10;
    h+=`<svg viewBox="0 0 512 512" style="left:${x}%;top:${y}%;transform:rotate(${r}deg) scale(${sc})"><use href="#zi-${L[k%L.length]}"/></svg>`}
  st.innerHTML=`<div class="beam l"></div><div class="beam r"></div><div class="floor"></div><div class="doodles">${h}</div>`;
  document.body.prepend(st);
})();

/* ============================================================
   SON : petit synthé maison (aucun fichier à télécharger)
   ============================================================ */
let AC=null,soundOn=lsGet("zb_sound",true),mus=null,musWanted=true;
function ac(){if(!soundOn)return null;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();return AC}catch(e){return null}}
/* tout passe par un bus doux : filtre passe-bas + compresseur, pour ne rien avoir de strident */
let BUS=null;
function bus(a){if(BUS&&BUS.context===a)return BUS;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3200;lp.Q.value=.5;
  const cp=a.createDynamicsCompressor();cp.threshold.value=-20;cp.ratio.value=4;cp.attack.value=.005;cp.release.value=.2;
  const g=a.createGain();g.gain.value=.8;lp.connect(cp).connect(g).connect(a.destination);BUS=lp;return lp}
function tone(f,t=0,d=.12,type="sine",v=.06,f2){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t0=a.currentTime+t;o.type=type;o.frequency.setValueAtTime(f,t0);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d*.8);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(bus(a));o.start(t0);o.stop(t0+d+.05)}
function noiseBuf(a,sec){const b=a.createBuffer(1,Math.floor(a.sampleRate*sec),a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
let lastTick=0;
const fx={
  /* la roue : un petit « toc » de bois, grave et court, jamais plus de 16 par seconde */
  tick:()=>{const n=performance.now();if(n-lastTick<60)return;lastTick=n;tone(420,0,.05,"triangle",.07,260)},
  click:()=>tone(520,0,.04,"sine",.035,380),
  press:()=>{tone(196,0,.12,"triangle",.07,150)},
  whoosh:()=>{const a=ac();if(!a)return;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;s.buffer=noiseBuf(a,.3);f.type="bandpass";f.Q.value=1.2;
    f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(1400,t+.22);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+.26);s.connect(f).connect(g).connect(bus(a));s.start(t)},
  reveal:()=>{tone(523,0,.22,"sine",.06);tone(659,.09,.22,"sine",.06);tone(784,.18,.4,"sine",.06)},
  /* fin de roue : un carillon doux au lieu d'une cymbale */
  ding:()=>{[523,659,784].forEach((f,i)=>{tone(f,i*.04,1.1,"sine",.05);tone(f*2,i*.04,.5,"sine",.012)})},
  fanfare:()=>{[392,523,659,784].forEach((f,i)=>tone(f,i*.12,.3,"triangle",.06));tone(523,.5,.8,"triangle",.05);tone(659,.5,.8,"triangle",.04);tone(784,.5,.8,"sine",.04)},
  crash:()=>{const a=ac();if(!a)return;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;s.buffer=noiseBuf(a,.8);f.type="lowpass";f.frequency.value=900;
    g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+.6);s.connect(f).connect(g).connect(bus(a));s.start(t)},
  applause:()=>{const a=ac();if(!a)return;const len=Math.floor(a.sampleRate*1.6),b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(Math.random()<.3?1:.15)*Math.pow(1-i/len,1.4);
    const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type="bandpass";f.frequency.value=1100;f.Q.value=.7;g.gain.value=.1;s.buffer=b;s.connect(f).connect(g).connect(bus(a));s.start()},
  /* roulement : caisse claire feutrée, qui monte doucement */
  drumroll:ms=>{const a=ac();if(!a)return;const nb=noiseBuf(a,.1),t0=a.currentTime,end=t0+ms/1000;
    for(let t=t0;t<end;t+=.06){const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=nb;f.type="lowpass";f.frequency.value=700;
      const p=(t-t0)/(ms/1000);g.gain.setValueAtTime(.02+.06*p,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);s.connect(f).connect(g).connect(bus(a));s.start(t);s.stop(t+.06)}}
};
/* générique de jeu télé : boucle I-vi-IV-V en do, 124 bpm */
function startMusic(){const a=ac();if(!a||mus||!musWanted||document.hidden)return;const out=a.createGain();out.gain.value=.0001;out.connect(bus(a));out.gain.linearRampToValueAtTime(.09,a.currentTime+1.5);
  const nb=noiseBuf(a,.3),step=60/124/2,prog=[[48,60,64,67],[45,57,60,64],[41,57,60,65],[43,55,59,62]];
  const mel=[72,76,79,76,74,72,74,76,72,69,72,76,74,72,69,67,69,72,77,76,74,72,74,72,71,74,79,77,76,74,71,67];
  const hz=m=>440*Math.pow(2,(m-69)/12);let n=0,next=a.currentTime+.1;
  function note(type,f,t,d,v,cut){const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    if(cut){const fl=a.createBiquadFilter();fl.type="lowpass";fl.frequency.value=cut;o.connect(fl).connect(g)}else o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.02)}
  function hat(t,v){const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=nb;f.type="bandpass";f.frequency.value=5000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);s.connect(f).connect(g).connect(out);s.start(t);s.stop(t+.06)}
  function kick(t){const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.connect(g).connect(out);o.start(t);o.stop(t+.2)}
  const tick=()=>{if(!mus)return;while(next<a.currentTime+.25){const ch=prog[Math.floor(n/8)%4],s=n%8,t=next;
      if(s%2===0)kick(t);hat(t,s%2?.08:.04);
      note("triangle",hz(ch[0]-12+(s%4===2?12:0)),t,step*.9,.22,700);
      if(s%2===1)ch.slice(1).forEach(m=>note("triangle",hz(m),t,step*.7,.04,1600));
      note("sine",hz(mel[n%32]),t,step*.85,.09);n++;next+=step}};
  mus={id:setInterval(tick,60),out};tick()}
function stopMusic(){if(!mus)return;clearInterval(mus.id);try{mus.out.gain.setTargetAtTime(.0001,AC.currentTime,.2)}catch(e){}mus=null}
function duck(on){if(!mus||!AC)return;mus.out.gain.setTargetAtTime(on?.025:.09,AC.currentTime,.15)}
document.addEventListener("pointerdown",()=>{if(soundOn&&!mus)startMusic()});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopMusic();else if(soundOn)startMusic()});
document.addEventListener("click",e=>{if(e.target.closest("button,.tile,label"))fx.click()},true);

/* ---------- barre du haut : « en direct » + bouton son ---------- */
(function topbar(){
  const hd=document.querySelector(".wrap>header");if(!hd)return;
  const bar=document.createElement("div");bar.className="zbtop";
  bar.innerHTML=`<span class="zblive"><i></i>En direct de ton salon</span>
    <button class="zbsound" type="button" aria-pressed="${soundOn}" aria-label="Son et musique"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path class="wv" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg><span>Son</span></button>`;
  hd.before(bar);
  const b=bar.querySelector(".zbsound");
  b.onclick=()=>{soundOn=!soundOn;lsSet("zb_sound",soundOn);b.setAttribute("aria-pressed",soundOn);
    try{sfx.on=soundOn}catch(e){}
    if(soundOn){startMusic();fx.reveal()}else stopMusic()};
  if(!soundOn){try{sfx.on=false}catch(e){}}
})();

/* ---------- l'enseigne lumineuse ---------- */
const header=document.querySelector(".wrap>header");
const bulbs=document.createElement("div");bulbs.className="zbbulbs";bulbs.setAttribute("aria-hidden","true");
if(header){const w=document.createElement("div");w.className="zbwob";w.setAttribute("aria-hidden","true");header.prepend(w,bulbs)}
function placeBulbs(){if(!header)return;const W=header.offsetWidth,H=header.offsetHeight;if(!W||!H)return;const inset=14,step=26;bulbs.innerHTML="";
  const w=W-inset*2,h=H-inset*2,per=2*(w+h),n=Math.round(per/step);let html="";
  for(let k=0;k<n;k++){let s=k/n*per,x,y;if(s<w){x=inset+s;y=inset}else if((s-=w)<h){x=W-inset;y=inset+s}else if((s-=h)<w){x=W-inset-s;y=H-inset}else{s-=w;x=inset;y=H-inset-s}
    html+=`<span style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"></span>`}
  bulbs.innerHTML=html}
function letters(){const l1=$("l1");if(!l1||l1.querySelector(".zl"))return;const t=l1.textContent;l1.textContent="";
  [...t].forEach((c,i)=>{const s=document.createElement("span");s.className="zl";s.textContent=c;s.style.animationDelay=(i*.12)+"s";if(c===" ")s.style.width=".3em";l1.appendChild(s)})}
let bulbT=0;const reBulbs=()=>{cancelAnimationFrame(bulbT);bulbT=requestAnimationFrame(placeBulbs)};
addEventListener("resize",reBulbs);
if(window.ResizeObserver&&header)new ResizeObserver(reBulbs).observe(header);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(reBulbs);

const STAGE={home:"#16083F",uc:"#16083F",lg:"#0B0630",dt:"#16083F",av:"#16083F",jn:"#16083F",bt:"#16083F"};
if(typeof setTheme==="function"){const _setTheme=setTheme;
  window.setTheme=setTheme=function(g){_setTheme.apply(this,arguments);letters();
    try{document.querySelector('meta[name=theme-color]').content=STAGE[g]||"#16083F"}catch(e){}reBulbs()}}
letters();reBulbs();

/* ---------- tuiles de l'accueil ---------- */
const TILE_ICON={uc:"uc",lg:"lg",dt:"dt",av:"av",jn:"jn",bt:"bt",qd:"qd",mc:"mc",mt:"mt",ec:"ec",bm:"bm"};
function decorateTile(t){if(t.querySelector(".zt"))return;const zt=document.createElement("span");zt.className="zt";
  const g=t.dataset.g;zt.innerHTML=`<span class="zic">${ico(TILE_ICON[g]||(ICONS[g]?g:"star"))}</span>`;
  [...t.childNodes].forEach(n=>zt.appendChild(n));t.appendChild(zt)}
function decorateTiles(root=document){root.querySelectorAll(".tile").forEach(decorateTile)}
decorateTiles();
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.classList.contains("tile"))decorateTile(n);else if(n.querySelector&&n.querySelector(".tile"))decorateTiles(n)})})
  .observe(document.body,{childList:true,subtree:true});
setInterval(()=>{if(document.hidden)return;const ts=[...document.querySelectorAll("#tiles .tile")].filter(t=>t.offsetParent);if(!ts.length)return;
  const t=ts[Math.floor(Math.random()*ts.length)];t.classList.remove("zshine");void t.offsetWidth;t.classList.add("zshine")},2600);

/* ============================================================
   LES JOUEURS : choisis au lancement de chaque jeu, avec photo
   ============================================================ */
const team=$("players")&&$("players").closest(".card");
let teamHome=null;
if(team){team.classList.add("zbteam");teamHome=document.createComment("team");team.before(teamHome);
  const h=team.querySelector("h2");if(h)h.textContent="Qui joue ?";
  const lb=team.querySelector(".label");if(lb)lb.textContent="Les candidats";
  const hint=document.createElement("p");hint.className="hint";hint.style.margin="0";hint.textContent="Touche la pastille pour prendre ta photo, ou choisir un emoji.";
  $("players").before(hint)}
/* tout écran « *-setup » reçoit la carte des joueurs, y compris les jeux ajoutés plus tard */
const RENDER={"uc-setup":"renderUcSetup","lg-setup":"renderLgSetup","dt-setup":"renderDtSetup","bt-setup":"renderBtSetup","tour-setup":"renderTourSetup"};
const isSetup=id=>/-setup$/.test(id)&&!!$(id);
let curScr="home";
function refreshSetup(){const fn=RENDER[curScr];if(fn&&typeof window[fn]==="function"){try{window[fn]()}catch(e){}}}
function placeTeam(id){if(!team)return;
  if(isSetup(id)){const sec=$(id);if(!sec)return;const anchor=sec.querySelector(":scope>.back");if(anchor)anchor.after(team);else sec.prepend(team)}
  else if(team.parentNode!==teamHome.parentNode||team.previousSibling!==teamHome)teamHome.after(team)}
/* l'accueil ne bloque plus : les noms se vérifient au moment de lancer */
if(typeof validPlayers==="function"){const _vp=validPlayers;
  window.validPlayers=validPlayers=function(){if(team&&team.closest("#home"))return true;return _vp.apply(this,arguments)}}
document.addEventListener("click",e=>{const b=e.target.closest("button[id$=Start]");if(!b||!team)return;
  const sec=b.closest("section.scr");if(sec&&team.closest("section.scr")===sec&&typeof validPlayers==="function"&&!validPlayers()){e.stopImmediatePropagation();e.preventDefault()}},true);
if(team){let rt=0;$("players").addEventListener("input",()=>{clearTimeout(rt);rt=setTimeout(refreshSetup,250)})}

if(typeof show==="function"){const _show=show;
  window.show=show=function(id){placeTeam(id);curScr=id;_show.apply(this,arguments);
    if(isSetup(id)){try{renderPlayers()}catch(e){}}
    if(/^lg/.test(id))loadVoice();
    if(id==="lg-mj"||id==="bt-play"){musWanted=false;stopMusic()}else{musWanted=true;if(soundOn&&AC)startMusic()}
    fx.whoosh()}}

/* photo : prise avec la caméra frontale, recadrée en carré, gardée sur le tel */
function readPhoto(file){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const img=new Image();img.onerror=rej;img.onload=()=>{
  const S=180,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d"),m=Math.min(img.width,img.height);
  x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,S,S);res(c.toDataURL("image/jpeg",.78))};img.src=r.result};r.readAsDataURL(file)})}
const photoOf=n=>{try{return profiles[n]&&profiles[n].ph||""}catch(e){return""}};
if(typeof openPicker==="function"){const _op=openPicker;
  window.openPicker=openPicker=function(i,row){_op.apply(this,arguments);const box=row.nextElementSibling;if(!box||!box.classList.contains("picker"))return;
    const n=names[i],p=prof(n),bar=document.createElement("div");bar.className="zbph";
    bar.innerHTML=`<label>${ico("camera")}<span>${p.ph?"Reprendre la photo":"Prendre ma photo"}</span><input type="file" accept="image/*" capture="user"></label>`+(p.ph?`<button type="button" class="zbphx">Enlever la photo</button>`:"");
    bar.querySelector("input").onchange=async ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;
      try{p.ph=await readPhoto(f);store.set("profiles",profiles)}catch(e){}pickerFor=-1;renderPlayers();fx.reveal()};
    const x=bar.querySelector(".zbphx");if(x)x.onclick=()=>{delete p.ph;store.set("profiles",profiles);pickerFor=-1;renderPlayers()};
    box.prepend(bar)}}
if(typeof renderPlayers==="function"){const _rp=renderPlayers;
  window.renderPlayers=renderPlayers=function(){_rp.apply(this,arguments);
    document.querySelectorAll("#players .prow").forEach((r,i)=>{const ph=photoOf(names[i]),b=r.querySelector(".avb");if(!b)return;
      if(ph){b.classList.add("ph");b.style.backgroundImage=`url("${ph}")`}else{b.classList.remove("ph");b.style.backgroundImage=""}});
    refreshSetup()}}

/* ---------- passe le tel : la vedette du moment ---------- */
function avatarHTML(n){const ph=photoOf(n),p=prof(n);return ph?`<div class="pstar" style="background-image:url('${ph}')" aria-hidden="true"></div>`:`<div class="pstar" style="--pc:${p.c}" aria-hidden="true">${esc(p.e)}</div>`}
if(typeof passStep==="function"){const _ps=passStep;
  window.passStep=passStep=function(){_ps.apply(this,arguments);try{const it=passQ.items[passQ.i],rn=$("rName");
    const old=rn.parentNode.querySelector(".pstar");if(old)old.remove();rn.insertAdjacentHTML("beforebegin",avatarHTML(it.name));rn.textContent=it.name;fx.whoosh()}catch(e){}}}

/* ============================================================
   LA GRANDE ROUE
   ============================================================ */
const SEGC=["#2B4BFF","#7A3CFF","#FF8A00","#FF2E7E","#10B97A","#00A8E8","#FF3346","#FFC22E"];
const POINTER=`<svg class="zw-pointer" viewBox="0 0 44 56" aria-hidden="true"><path d="M22 54 L4 14 A18 18 0 1 1 40 14 Z" fill="#FFC22E" stroke="#1A0F3D" stroke-width="3"/><circle cx="22" cy="17" r="7" fill="#FFF6D0" stroke="#1A0F3D" stroke-width="2"/></svg>`;
let wid=0;
function wheelSVG(segs){const n=segs.length,c=210,r=188,A=360/n;wid++;
  let s=`<svg viewBox="0 0 420 420" aria-hidden="true"><defs>`;
  const pr=Math.min(40,150*Math.sin(Math.PI/n)*.9);
  segs.forEach((g,i)=>{if(g.img)s+=`<clipPath id="zwc${wid}_${i}"><circle cx="${c}" cy="${c-128}" r="${pr}"/></clipPath>`});
  s+=`</defs><g filter="url(#zbBoil)"><circle cx="210" cy="210" r="208" fill="#1A0F3D"/><circle cx="210" cy="210" r="201" fill="#FFC22E"/></g>`;
  segs.forEach((g,i)=>{const a0=(i*A-90)*Math.PI/180,a1=((i+1)*A-90)*Math.PI/180,col=g.color||SEGC[i%SEGC.length];
    s+=n===1?`<circle cx="${c}" cy="${c}" r="${r}" fill="${col}" stroke="#1A0F3D" stroke-width="3"/>`
      :`<path d="M${c} ${c} L${(c+r*Math.cos(a0)).toFixed(2)} ${(c+r*Math.sin(a0)).toFixed(2)} A${r} ${r} 0 ${A>180?1:0} 1 ${(c+r*Math.cos(a1)).toFixed(2)} ${(c+r*Math.sin(a1)).toFixed(2)} Z" fill="${col}" stroke="#1A0F3D" stroke-width="3"/>`;
    const mid=i*A+A/2,sz=Math.min(80,2*150*Math.sin(Math.PI/Math.max(n,2))*.85),rad=sz/2;
    s+=`<g transform="rotate(${mid} ${c} ${c})">`;
    if(g.img)s+=`<image href="${g.img}" x="${c-pr}" y="${c-128-pr}" width="${pr*2}" height="${pr*2}" clip-path="url(#zwc${wid}_${i})" preserveAspectRatio="xMidYMid slice"/><circle cx="${c}" cy="${c-128}" r="${pr}" fill="none" stroke="#fff" stroke-width="4"/>`;
    else if(g.icon&&ICONS[g.icon])s+=`<svg x="${c-rad}" y="${c-128-rad}" width="${sz}" height="${sz}" viewBox="0 0 512 512" style="color:#fff"><use href="#zi-${g.icon}"/></svg>`;
    else s+=`<text x="${c}" y="${c-128}" dy=".35em" text-anchor="middle" font-size="${Math.min(50,sz*.75).toFixed(1)}" fill="#fff">${esc(g.text||"?")}</text>`;
    s+=`</g>`});
  for(let k=0;k<24;k++){const a=k*15*Math.PI/180;s+=`<circle cx="${(c+196*Math.cos(a)).toFixed(1)}" cy="${(c+196*Math.sin(a)).toFixed(1)}" r="4.5" fill="#FFF6D0"/>`}
  return s+`</svg>`}
function flash(){const f=document.querySelector(".zbflash")||document.body.appendChild(Object.assign(document.createElement("div"),{className:"zbflash"}));f.classList.remove("go");void f.offsetWidth;f.classList.add("go")}
function celebrate(){fx.fanfare();setTimeout(fx.applause,350);vib([40,60,40]);flash();try{confetti(["#FFC22E","#FF3346","#19C6FF","#FF3D9A","#22DD8E","#FFFFFF","#8C5CFF"])}catch(e){}}
/* ouvre la roue en plein écran, la lance sur segs[idx], puis attend le bouton */
function wheelShow({title,sub,segs,idx,cta,hub="ZB",onDone,celebrateEnd=true}){
  const ov=document.createElement("div");ov.className="zw-ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label",title);
  ov.innerHTML=`<h2>${esc(title)}</h2>${sub?`<p>${esc(sub)}</p>`:""}<div class="zw-wrap">${POINTER}<div class="zw-wheel">${wheelSVG(segs)}</div><div class="zw-hub" aria-hidden="true">${esc(hub)}</div></div>
    <p class="zw-label" aria-live="polite"></p><button class="btn" type="button" hidden>${esc(cta)}</button>`;
  document.body.appendChild(ov);
  const w=ov.querySelector(".zw-wheel"),p=ov.querySelector(".zw-pointer"),label=ov.querySelector(".zw-label"),btn=ov.querySelector(".btn");
  const n=segs.length,A=360/n,jitter=(Math.random()-.5)*A*.6,rot=360*(REDUCE?1:6)+((360-(idx*A+A/2)+jitter)%360+360)%360,dur=REDUCE?700:4700;
  if(REDUCE)w.style.transitionDuration=".6s";
  let done=false,last=null,finished=false;
  const finish=()=>{if(finished)return;finished=true;done=true;label.textContent=segs[idx].label;fx.crash();fx.ding();if(celebrateEnd)celebrate();setTimeout(()=>duck(false),1800);btn.hidden=false;btn.focus()};
  const close=()=>{ov.remove();duck(false);onDone&&onDone()};
  btn.onclick=close;
  fx.press();vib(30);duck(true);fx.drumroll(REDUCE?600:4500);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{w.style.transform=`rotate(${rot}deg)`}));
  (function watch(){if(done)return;const m=getComputedStyle(w).transform;if(m&&m!=="none"){const v=m.slice(m.indexOf("(")+1,-1).split(",").map(Number);
      const deg=((Math.atan2(v[1],v[0])*180/Math.PI)+360)%360,gi=Math.floor(((360-deg)%360)/A)%n;label.textContent=segs[gi].label;
      if(last!==null&&gi!==last){fx.tick();p.classList.remove("tick");void p.offsetWidth;p.classList.add("tick")}last=gi}
    requestAnimationFrame(watch)})();
  setTimeout(finish,dur);
  return ov}
window.zbWheel=wheelShow;

/* ---------- Loup-garou : la roue distribue ton rôle ---------- */
const ROLE_ICON={loup:"loup",infect:"infect",loupblanc:"loupblanc",villageois:"villageois",voyante:"voyante",sorciere:"sorciere",chasseur:"chasseur",cupidon:"cupidon",
  salvateur:"salvateur",petitefille:"petitefille",ancien:"ancien",idiot:"idiot",corbeau:"corbeau",renard:"renard",enfant:"enfant",ange:"ange",flute:"flute",bouc:"bouc"};
const roleName=k=>{try{return LG_ROLES[k][0]}catch(e){return k}};
function roleSegs(target,pool){let keys=[...new Set(pool.filter(k=>k&&LG_CARD[k]))];
  ["loup","villageois","voyante","sorciere","chasseur","cupidon"].forEach(k=>{if(keys.length<6&&!keys.includes(k)&&LG_CARD[k])keys.push(k)});
  if(!keys.includes(target))keys.push(target);
  if(keys.length>8){keys=keys.filter(k=>k!==target).sort(()=>Math.random()-.5).slice(0,7);keys.push(target)}
  keys.sort(()=>Math.random()-.5);
  /* deux cases côte à côte de même couleur : on alterne */
  const segs=keys.map((k,i)=>({icon:ROLE_ICON[k],label:roleName(k),color:SEGC[i%SEGC.length],key:k}));
  return {segs,idx:keys.indexOf(target)}}
function roleWheel(target,pool,onDone){const {segs,idx}=roleSegs(target,pool);
  wheelShow({title:"La roue des rôles",sub:"Cache bien l'écran, c'est pour toi seul",segs,idx,cta:"Voir ma carte",hub:"?",celebrateEnd:false,onDone})}
const secret=$("secret");
if(secret&&secret.onclick){const _reveal=secret.onclick;
  secret.onclick=function(ev){let it=null;try{it=passQ.items[passQ.i]}catch(e){}
    if(it&&it.card&&typeof LG_CARD!=="undefined"&&LG_CARD[it.card]&&!secret.disabled){secret.disabled=true;
      roleWheel(it.card,passQ.items.map(x=>x.card),()=>{secret.disabled=false;_reveal.call(secret,ev);fx.reveal();vib(60)});return}
    _reveal.call(this,ev);fx.reveal();vib(60)}}
const mine=$("mySecret");
if(mine&&mine.onclick){const _mine=mine.onclick;
  mine.onclick=function(ev){let ms=null;try{ms=mySecret}catch(e){}
    if(ms&&ms.card&&typeof LG_CARD!=="undefined"&&LG_CARD[ms.card]&&!mine.disabled){mine.disabled=true;
      roleWheel(ms.card,[],()=>{mine.disabled=false;_mine.call(mine,ev);fx.reveal()});return}
    _mine.call(this,ev);fx.reveal()}}

/* ---------- Undercover : la roue désigne qui commence ---------- */
if(typeof ucTurn==="function"){const _uc=ucTurn;
  window.ucTurn=ucTurn=function(){_uc.apply(this,arguments);try{
    const who=$("starter").textContent.replace(/ commence$/,"");const alive=game.players.filter(p=>p.alive);
    const idx=alive.findIndex(p=>p.name===who);if(idx<0||alive.length<2||game.turn!==1)return;
    const segs=alive.map((p,i)=>{const ph=photoOf(p.name),pr=prof(p.name);return{img:ph||null,text:ph?null:pr.e,label:p.name,color:SEGC[i%SEGC.length]}});
    setTimeout(()=>wheelShow({title:"Qui commence ?",sub:"Tour "+game.turn,segs,idx,cta:"C'est parti",hub:"?"}),350)}catch(e){}}}

/* ---------- cartes de rôle : illustrations à la place des emojis ---------- */
if(typeof roleCard==="function"){const _rc=roleCard;
  window.roleCard=roleCard=function(key){const c=_rc.apply(this,arguments);const em=c.querySelector(".em");if(em&&ROLE_ICON[key]&&ICONS[ROLE_ICON[key]])em.innerHTML=ico(ROLE_ICON[key]);return c}}

/* ---------- voix du narrateur : chargées seulement pour le Loup-garou ---------- */
let voiceP=null;
function loadVoice(){if(window.CLIPS||voiceP)return voiceP;voiceP=new Promise(res=>{const sc=document.createElement("script");sc.src="voice.js";sc.async=true;sc.onload=sc.onerror=()=>res();document.head.appendChild(sc)});return voiceP}
window.zbLoadVoice=loadVoice;
document.addEventListener("pointerdown",e=>{if(e.target.closest("#lgVoiceTest,#lgStart"))loadVoice()},true);

/* ---------- nouveaux jeux : le bon endroit pour ajouter des joueurs ---------- */
if(typeof needPlayers==="function"){const _np=needPlayers;
  window.needPlayers=needPlayers=function(errId){const ok=_np.apply(this,arguments);if(!ok){const e=$(errId);if(e)e.textContent=e.textContent.replace("Ajoutez-en sur l'accueil.","Ajoutez-en dans « Qui joue ? » juste au-dessus.")}return ok}}

/* ---------- réglages : le nom du jeu est déjà sur l'enseigne ---------- */
document.querySelectorAll("section.scr[id$=-setup]").forEach(sec=>{const c=[...sec.children].find(x=>x.classList&&x.classList.contains("card")&&!x.classList.contains("zbteam"));
  const h=c&&c.querySelector(":scope>h2");if(h&&!h.dataset.keep)h.textContent="Les réglages"});

/* ---------- illustrations à la place des derniers emojis de l'interface ---------- */
const scan=$("scanBtn");if(scan)scan.innerHTML=ico("camera","zbi")+"<span>Scanner le QR code</span>";
function phoneIcons(root){root.querySelectorAll(".tile .m, #multiPick .hint").forEach(m=>{if(m.textContent.includes("📱"))m.innerHTML=esc(m.textContent).replace(/📱\s?/g,ico("phone","zbi"))})}
if(typeof multiPickRender==="function"){const _mp=multiPickRender;window.multiPickRender=multiPickRender=function(){_mp.apply(this,arguments);phoneIcons(document)}}
phoneIcons(document);

/* ---------- confettis aux couleurs du plateau ---------- */
if(typeof confetti==="function"){const _cf=confetti;window.confetti=confetti=function(){return _cf.call(this,["#FFC22E","#FF3346","#19C6FF","#FF3D9A","#22DD8E","#FFFFFF","#8C5CFF"])}}

/* premier rendu */
try{renderPlayers()}catch(e){}
})();

/* ================= MODE APPLI (téléphone) =================
   Barre de titre fixe, onglets en bas, transitions entre écrans,
   feuille « Quitter ? » native. Actif seulement sous 700 px. */
(function appShell(){
  const MQ=matchMedia("(max-width:699px)"),REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOP=["home","glob","custom","tour-setup"];
  const ic=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const TABS=[
    ["jeux","Jeux",ic('<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>')],
    ["multi","Multi",ic('<rect x="2.5" y="5" width="8" height="14" rx="2"/><rect x="13.5" y="5" width="8" height="14" rx="2"/><path d="M6.5 16h0M17.5 16h0"/>')],
    ["tour-setup","Tournoi",ic('<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>')],
    ["glob","Scores",ic('<path d="M5 20V11M12 20V5M19 20v-6"/>')],
    ["custom","Cartes",ic('<rect x="4" y="3" width="12" height="16" rx="2"/><path d="M8 21h10a2 2 0 0 0 2-2V7"/>')]];
  const bar=document.createElement("div");bar.className="zbapp";
  bar.innerHTML=`<button class="zbback" type="button" aria-label="Retour">${ic('<path d="M15 5l-7 7 7 7"/>')}</button><div class="zbttl"></div><div class="zbslot"></div>`;
  const tabs=document.createElement("nav");tabs.className="zbtabs";tabs.setAttribute("aria-label","Navigation");
  tabs.innerHTML=TABS.map(([k,l,s])=>`<button type="button" data-tab="${k}">${s}<span>${l}</span></button>`).join("");
  const sheet=document.createElement("div");sheet.className="zbsheet";sheet.hidden=true;
  sheet.innerHTML=`<div class="zbsh-in" role="dialog" aria-modal="true"><b>Quitter la partie ?</b><p>La partie en cours sera perdue.</p><button type="button" class="btn" data-q="1">Quitter</button><button type="button" class="ghost" data-q="0">Continuer à jouer</button></div>`;
  document.body.append(bar,tabs,sheet);
  const snd=document.querySelector(".zbsound");
  function mount(){const on=MQ.matches;document.body.classList.toggle("zbm",on);
    if(snd){if(on)bar.querySelector(".zbslot").append(snd);else{const t=document.querySelector(".zbtop");t&&t.append(snd)}}}
  MQ.addEventListener?MQ.addEventListener("change",mount):MQ.addListener(mount);mount();

  let tab="jeux",prev="home";
  const depth=id=>TOP.includes(id)?0:/-setup$/.test(id)?1:2;
  const title=id=>{if(id==="home")return tab==="multi"?"Multi":"ZBEUL";
    const s=document.getElementById(id),h=s&&s.querySelector("h2");
    if(id==="glob")return"Scores";if(id==="custom")return"Mes cartes";if(id==="tour-setup")return"Tournoi";
    const l1=document.getElementById("l1"),l2=document.getElementById("l2");
    const t=[l1&&l1.textContent,l2&&!l2.hidden&&l2.textContent].filter(Boolean).join(" ");
    return t&&t!=="ZBEUL"?t:(h?h.textContent:"ZBEUL")};
  function paint(id){document.body.dataset.tab=id==="home"?tab:id;
    bar.querySelector(".zbttl").textContent=title(id);
    bar.classList.toggle("top",depth(id)===0);bar.classList.toggle("brand",id==="home"&&tab==="jeux");
    tabs.hidden=depth(id)!==0;
    tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.tab===(id==="home"?tab:id)))}
  function anim(id,from){if(!MQ.matches||REDUCE)return;const s=document.getElementById(id);if(!s)return;
    const a=depth(id),b=depth(from);const c=a>b?"zb-push":a<b?"zb-pop":"zb-fade";
    s.classList.remove("zb-push","zb-pop","zb-fade");void s.offsetWidth;s.classList.add(c);
    s.addEventListener("animationend",()=>s.classList.remove(c),{once:true})}
  const _s=window.show;
  window.show=show=function(id){const from=prev;prev=id;if(id!=="home"&&TOP.includes(id))tab="jeux";
    _s.apply(this,arguments);paint(id);if(id!==from)anim(id,from)};
  tabs.addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;const k=b.dataset.tab;
    if(k==="jeux"||k==="multi"){const was=document.body.dataset.tab;tab=k;
      if(prev!=="home")show("home");else{paint("home");if(was!==k)anim("home",k==="multi"?"x-setup":"home")}}
    else show(k);
    window.scrollTo(0,0)});
  function back(){const s=document.getElementById(prev);const bk=s&&s.querySelector(".back");
    if(bk){bk.click();return}
    if(depth(prev)>=2&&prev!=="pass"||prev==="pass"){sheet.hidden=false;return}
    show("home")}
  bar.querySelector(".zbback").onclick=back;
  sheet.addEventListener("click",e=>{const q=e.target.closest("[data-q]");if(e.target===sheet||q){sheet.hidden=true;if(q&&q.dataset.q==="1")show("home")}});
  /* petit retour haptique (Android) */
  document.addEventListener("click",e=>{if(MQ.matches&&e.target.closest("button,.tile")&&navigator.vibrate){try{navigator.vibrate(8)}catch(_){}}},true);
  paint(document.body.dataset.scr||"home");
})();

/* ---------- mise à jour de l'appli installée ----------
   Le nouveau service worker prend la main dès qu'il est prêt : on recharge
   aussitôt si on est sur l'accueil, sinon au prochain retour à l'accueil,
   pour ne jamais couper une partie. On revérifie à chaque retour dans l'appli. */
(function autoUpdate(){
  if(!("serviceWorker" in navigator))return;
  const had=!!navigator.serviceWorker.controller;let pending=false,done=false;
  const atHome=()=>(document.body.dataset.scr||"home")==="home";
  const go=()=>{if(done)return;done=true;location.reload()};
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!had)return;if(atHome())go();else pending=true});
  if(typeof show==="function"){const _s=window.show;window.show=show=function(id){_s.apply(this,arguments);if(pending&&id==="home")go()}}
  const check=()=>navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
})();
