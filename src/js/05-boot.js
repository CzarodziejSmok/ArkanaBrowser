// ---------- animacja uruchamiania ----------
const BOOT={on:false,pend:new Map(),skip:false,fin:false,t0:0};   // pend: zadania ładowane w tle (etykieta wyświetlana na końcowym ekranie)
try{ BOOT.on=!SEC&&S.settings.ui.anim.boot!==false&&!sessionStorage.getItem('cb-booted'); }catch{}
function bootTask(label){ if(!BOOT.on) return ()=>{}; const k=Symbol(label); BOOT.pend.set(k,label); const done=()=>BOOT.pend.delete(k); setTimeout(done,7000); return done; }
function bootWait(el,label){ if(!el||!BOOT.on) return; const d=bootTask(label); ['did-stop-loading','did-fail-load'].forEach(ev=>el.addEventListener(ev,d,{once:true})); }
const bEO=p=>1-Math.pow(1-Math.min(1,Math.max(0,p)),3), bEIO=p=>{ p=Math.min(1,Math.max(0,p)); return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; }, bLerp=(a,b,p)=>a+(b-a)*p;
const BTM={T1:900,T2:520,T3:650}; BTM.tImp=BTM.T1+BTM.T2; BTM.T3s=BTM.tImp+520; BTM.tEnd=BTM.tImp+1900;   // czasy (ms) liczone od startu logo
// stan ikony w chwili ms: JEDEN ciągły tor od dołu do środka (spirala wokół środka: z dołu w górę po lewej, półkole nad środkiem, wejście w środek po prawej).
// Kąt rośnie ze stale dodatnią prędkością kątową, więc logo nigdy się nie zatrzymuje ani nie łamie kierunku – tylko zmienia prędkość. Obrót ma wielomianową prędkość kątową (też bez zatrzymania).
function bootIcon(L,ms){
  const {T1,tImp,T3s,T3}=BTM, o={x:L.cx,y:L.cy,s:L.fin,rot:720,sh:[6,8],vis:1};
  if(ms<0){ o.vis=0; return o; }
  if(ms<tImp){
    const TH=4.95, w0=.00135, kk=2*(TH-w0*tImp)/(tImp*tImp), dth=w0*ms+.5*kk*ms*ms, rho0=L.H/2+L.s0*.35;   // kąt od startu; tor z dołu ekranu
    const base=L.R+(rho0-L.R)*Math.exp(-1.6*dth), xs=Math.min(1,Math.max(0,(dth-3.4)/(TH-3.4))), rho=base*(1-xs*xs), th=Math.PI/2+dth;
    o.x=L.cx+rho*Math.cos(th); o.y=L.cy+rho*Math.sin(th);
    const u=ms/tImp; o.rot=tImp*(.6*u-2.46*u*u/2+3.41*u*u*u/3);   // prędkość kątowa 0,6 → ~0,16 → 1,55 °/ms, razem 720°
    if(ms<T1){ const p=ms/T1; o.s=bLerp(L.s0,L.peak,1-Math.pow(1-p,2.2)); o.sh=[bLerp(10,46,p),bLerp(12,44,p)]; }
    else { const q=(ms-T1)/BTM.T2; o.s=bLerp(L.peak,L.fin,q*q); o.sh=[bLerp(46,6,q*q),bLerp(44,8,q*q)]; }
  }
  else { const u=Math.min(1,(ms-tImp)/300), dm=Math.exp(-7*u); o.s=L.fin*(1-.07*Math.exp(-6*u)*Math.cos(u*16)); o.rot=720+1.6*dm*Math.sin(u*34); o.x=L.cx+L.U*2.2*dm*Math.sin(u*28); o.y=L.cy+L.U*1.4*dm*Math.sin(u*22); }
  if(ms>=T3s) o.x=bLerp(L.cx,L.icF,bEIO((ms-T3s)/T3));
  return o;
}
// dźwięk startu: cała ścieżka jest syntezowana z góry (WebAudio) z tych samych wzorów co animacja, więc pasuje do prędkości, położenia i obrotu logo
function bootSound(ctx,t0,L,vol){
  const T=BTM, S=ms=>t0+ms/1000, sr=ctx.sampleRate, comp=ctx.createDynamicsCompressor(), master=ctx.createGain();
  comp.threshold.value=-14; comp.ratio.value=3; comp.attack.value=.005; comp.release.value=.25; master.gain.value=vol; master.connect(comp); comp.connect(ctx.destination);
  const irLen=Math.floor(sr*2.4), ir=ctx.createBuffer(2,irLen,sr); for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<irLen;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/irLen,2.6); }
  const conv=ctx.createConvolver(); conv.buffer=ir; const rvIn=ctx.createGain(), rvLp=ctx.createBiquadFilter(), wet=ctx.createGain(); rvLp.type='lowpass'; rvLp.frequency.value=6500; wet.gain.value=.7; rvIn.connect(conv); conv.connect(rvLp); rvLp.connect(wet); wet.connect(master);
  const nb=ctx.createBuffer(1,sr*2,sr), nd=nb.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
  const noise=()=>{ const s=ctx.createBufferSource(); s.buffer=nb; s.loop=true; return s; };
  const route=(node,pan,send,dry)=>{ const p=ctx.createStereoPanner(); p.pan.value=pan; node.connect(p); const d=ctx.createGain(); d.gain.value=dry; p.connect(d); d.connect(master); if(send){ const sg=ctx.createGain(); sg.gain.value=send; p.connect(sg); sg.connect(rvIn); } return p; };
  const env=(gn,at,peak,dur,tail)=>{ gn.gain.setValueAtTime(0,at); gn.gain.linearRampToValueAtTime(peak,at+.006); gn.gain.exponentialRampToValueAtTime(.0008,at+dur); if(tail) gn.gain.setValueAtTime(0,at+dur+.01); };
  // próbkowanie toru logo co 20 ms: prędkość, położenie (pan), rozmiar, obroty/s
  const N=Math.round(T.tImp/20)+1, sp=new Float32Array(N), pn=new Float32Array(N), sz=new Float32Array(N), om=new Float32Array(N); let prev=bootIcon(L,0), mxs=1e-6;
  for(let i=0;i<N;i++){ const s=bootIcon(L,i*20); if(i){ sp[i]=Math.hypot(s.x-prev.x,s.y-prev.y)/20; om[i]=Math.abs(s.rot-prev.rot)/20*1000/360; } pn[i]=Math.max(-1,Math.min(1,(s.x-L.cx)/(L.W*.35)))*.75; sz[i]=(s.s-L.s0)/(L.peak-L.s0); prev=s; }
  sp[0]=sp[1]; om[0]=om[1]; for(let i=0;i<N;i++) mxs=Math.max(mxs,sp[i]);
  const dur=T.tImp/1000, ramp=i=>Math.min(1,i/3)*Math.min(1,(N-1-i)/2), wg=new Float32Array(N), wf=new Float32Array(N), sg=new Float32Array(N), sf=new Float32Array(N), lf=new Float32Array(N);
  for(let i=0;i<N;i++){ const v=sp[i]/mxs; wg[i]=.9*Math.pow(v,.85)*ramp(i); wf[i]=380+2300*(.55*v+.45*Math.max(0,sz[i])); sg[i]=.22*Math.pow(Math.min(1,Math.max(0,(om[i]-1.2)/3.6)),1.4)*ramp(i); sf[i]=80+om[i]*75; lf[i]=.5+om[i]*5; }
  { const s=noise(), bp=ctx.createBiquadFilter(), g=ctx.createGain(), p=ctx.createStereoPanner(); bp.type='bandpass'; bp.Q.value=.8; s.connect(bp); bp.connect(g); g.connect(p); p.connect(master);
    const sd=ctx.createGain(); sd.gain.value=.25; p.connect(sd); sd.connect(rvIn);   // WHOOSH: szum przefiltrowany pasmowo; głośność ~ prędkość, barwa ~ prędkość i wielkość, pan ~ położenie
    g.gain.setValueCurveAtTime(wg,t0,dur); bp.frequency.setValueCurveAtTime(wf,t0,dur); p.pan.setValueCurveAtTime(pn,t0,dur); s.start(t0); s.stop(S(T.tImp)+.05); }
  { const o=ctx.createOscillator(), lp=ctx.createBiquadFilter(), am=ctx.createGain(), lfo=ctx.createOscillator(), lg=ctx.createGain(), g=ctx.createGain(), p=ctx.createStereoPanner();   // OBRÓT: piłokształtny świst z modulacją „łopatek” zgodną z obrotami logo
    o.type='sawtooth'; lp.type='lowpass'; lp.frequency.value=1300; am.gain.value=.55; lg.gain.value=.45; lfo.connect(lg); lg.connect(am.gain); o.connect(lp); lp.connect(am); am.connect(g); g.connect(p); p.connect(master);
    g.gain.setValueCurveAtTime(sg,t0,dur); o.frequency.setValueCurveAtTime(sf,t0,dur); lfo.frequency.setValueCurveAtTime(lf,t0,dur); p.pan.setValueCurveAtTime(pn,t0,dur); o.start(t0); lfo.start(t0); o.stop(S(T.tImp)+.05); lfo.stop(S(T.tImp)+.05); }
  const ti=S(T.tImp);   // THUD: opadnięcie na półsprężystą płachtę
  { const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.setValueAtTime(130,ti); o.frequency.exponentialRampToValueAtTime(46,ti+.25); env(g,ti,.95,.45); o.connect(g); route(g,0,.15,1); o.start(ti); o.stop(ti+.5); }
  { const s=noise(), lp=ctx.createBiquadFilter(), g=ctx.createGain(); lp.type='lowpass'; lp.frequency.value=520; env(g,ti,.55,.14); s.connect(lp); lp.connect(g); route(g,0,.1,1); s.start(ti); s.stop(ti+.2); }
  { const o=ctx.createOscillator(), vb=ctx.createOscillator(), vg=ctx.createGain(), g=ctx.createGain(); o.frequency.value=78; vb.frequency.value=11; vg.gain.setValueAtTime(9,ti); vg.gain.exponentialRampToValueAtTime(.2,ti+.7); vb.connect(vg); vg.connect(o.frequency); env(g,ti+.01,.3,.7); o.connect(g); route(g,0,.2,1); o.start(ti); vb.start(ti); o.stop(ti+.8); vb.stop(ti+.8); }
  const te=S(T.tEnd);   // krystaliczny ambient: dzwonkowe nuty z pogłosem + miękka poduszka + szmer, wygasa przy końcu animacji
  [[659.25,0,-.4],[987.77,120,.3],[1318.51,250,-.2],[1479.98,400,.45],[1975.53,580,-.5],[2637.02,800,.2]].forEach(([f,d,pan])=>{ const at=ti+.03+d/1000, du=Math.max(.8,Math.min(2.7,te-at+.25));
    [[1,1],[2.76,.32],[5.4,.1],[8.9,.04]].forEach(([r,a],k)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine'; o.frequency.value=f*r*(1+(k?.0015*k:0)); env(g,at,.085*a,du/(1+k*.5)); o.connect(g); route(g,pan,.9,.45); o.start(at); o.stop(at+du+.05); }); });
  [[329.63,-4],[493.88,4],[659.25,-3]].forEach(([f,c],k)=>{ const o=ctx.createOscillator(), lp=ctx.createBiquadFilter(), g=ctx.createGain(); o.type='triangle'; o.frequency.value=f; o.detune.value=c; lp.type='lowpass'; lp.frequency.value=1600;
    g.gain.setValueAtTime(0,ti); g.gain.linearRampToValueAtTime(.05-k*.01,ti+.7); g.gain.setValueAtTime(.05-k*.01,te-.2); g.gain.linearRampToValueAtTime(0,te+.45); o.connect(lp); lp.connect(g); route(g,k-1?0:(k?.3:-.3),.8,.5); o.start(ti); o.stop(te+.5); });
  { const s=noise(), hp=ctx.createBiquadFilter(), g=ctx.createGain(); hp.type='highpass'; hp.frequency.value=5500; g.gain.setValueAtTime(0,ti); g.gain.linearRampToValueAtTime(.022,ti+.6); g.gain.linearRampToValueAtTime(0,te); s.connect(hp); hp.connect(g); route(g,0,.5,.6); s.start(ti); s.stop(te+.1); }
  { const t3=S(T.T3s), d3=T.T3/1000, s=noise(), bp=ctx.createBiquadFilter(), g=ctx.createGain(), p=route(g,0,.25,1);   // wysuwanie nazwy: miękki przesuw w górę pasma + szklany „tik” na końcu
    bp.type='bandpass'; bp.Q.value=1.2; bp.frequency.setValueAtTime(700,t3); bp.frequency.exponentialRampToValueAtTime(3200,t3+d3); g.gain.setValueAtTime(0,t3); g.gain.linearRampToValueAtTime(.2,t3+d3*.4); g.gain.linearRampToValueAtTime(0,t3+d3);
    p.pan.setValueAtTime(-.1,t3); p.pan.linearRampToValueAtTime(.35,t3+d3); s.connect(bp); bp.connect(g); s.start(t3); s.stop(t3+d3+.05);
    [[1760,.06],[2349.3,.035]].forEach(([f,a])=>{ const o=ctx.createOscillator(), og=ctx.createGain(); o.frequency.value=f; env(og,t3+d3,a,.55); o.connect(og); route(og,.3,.8,.6); o.start(t3+d3); o.stop(t3+d3+.6); }); }
  master.gain.setValueAtTime(vol,te); master.gain.linearRampToValueAtTime(0,te+.6);
  return {master,fade(ms){ const n=ctx.currentTime; master.gain.cancelScheduledValues(n); master.gain.setValueAtTime(master.gain.value,n); master.gain.linearRampToValueAtTime(0,n+(ms||140)/1000); }};
}
function bootGo(){
  const el=$('boot'); if(!el) return;
  if(!BOOT.on){ el.remove(); return; }
  try{ sessionStorage.setItem('cb-booted','1'); }catch{}
  try{ const tb=T(); if(tb&&tb.url&&views[tb.id]) bootWait(views[tb.id],'Wczytywanie karty…'); }catch{}
  if(S.panel) bootWait(cw,"Ładowanie panelu asystenta…");
  const cv=$('bootc'), g=cv.getContext('2d'), im=$('booti'), nm=$('bootn'), lb=$('bootl'), L={}; BOOT.L=L;
  let dpr=1, bgc=null, tw=0, nh=0, PA=[], BR=null; const A=accRgb, A2=acc2Rgb, F=fgRgb;
  const glow=c=>{ const s=document.createElement('canvas'); s.width=s.height=64; const x=s.getContext('2d'), r=x.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,`rgba(${c},1)`); r.addColorStop(.35,`rgba(${c},.35)`); r.addColorStop(1,`rgba(${c},0)`); x.fillStyle=r; x.fillRect(0,0,64,64); return s; };
  const GS={[A]:glow(A),[A2]:glow(A2),[F]:glow(F)};
  function layout(){   // wszystko zależy od bieżącego rozmiaru okna (okno może zmienić rozmiar w trakcie startu)
    const W=innerWidth, H=innerHeight; L.W=W; L.H=H; dpr=Math.min(2,devicePixelRatio||1); cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); g.setTransform(dpr,0,0,dpr,0,0);
    const U=Math.max(.45,Math.min(screen.height/1080,W/760,H/640)); L.U=U; L.cx=W/2; L.cy=H/2; L.fin=150*U; L.peak=215*U; L.s0=36*U; L.R=.55*L.fin; L.RMAX=Math.hypot(W,H)/2*1.1;
    im.style.width=im.style.height=L.peak+'px'; nm.querySelector('b').style.fontSize=(88*U)+'px'; nm.querySelector('small').style.fontSize=(17*U)+'px'; tw=nm.offsetWidth; nh=nm.offsetHeight;
    const TW=L.fin+26*U+tw, x0=L.cx-TW/2; L.icF=x0+L.fin/2; L.txF=x0+L.fin+26*U; L.tx0=L.cx+L.fin/2-tw;
    bgc=document.createElement('canvas'); bgc.width=cv.width; bgc.height=cv.height; const b=bgc.getContext('2d'); b.scale(dpr,dpr);   // statyczne tło liczone raz
    const lg=b.createLinearGradient(0,0,0,H); lg.addColorStop(0,`rgba(${A},.10)`); lg.addColorStop(.55,`rgba(${A},0)`); lg.addColorStop(1,`rgba(${A2},.16)`); b.fillStyle=lg; b.fillRect(0,0,W,H);
    const rg=b.createRadialGradient(L.cx,L.cy,0,L.cx,L.cy,Math.max(W,H)*.65); rg.addColorStop(0,`rgba(${A},.20)`); rg.addColorStop(1,`rgba(${A},0)`); b.fillStyle=rg; b.fillRect(0,0,W,H);
    if(!PA.length){ const N=Math.round(46+W*H/45000); for(let i=0;i<N;i++) PA.push({x:Math.random()*W,y:Math.random()*H,r:(1.2+Math.random()*3.4)*U,v:(4+Math.random()*10)*U,a:.25+Math.random()*.5,c:Math.random()<.3?A2:Math.random()<.5?A:F,ph:Math.random()*6.28}); }
    else PA.forEach(p=>{ p.x=Math.min(p.x,W); p.y=Math.min(p.y,H); });
  }
  el.style.background=getComputedStyle(document.body).getPropertyValue('--bg').trim()||'#16120f';
  im.src=drawIcon(); layout(); addEventListener('resize',layout);
  const {T1,tImp,T3s,tEnd}=BTM, RS=[0,170,360], LIFE=1500;
  const rings=ms=>{ const o=[]; RS.forEach((d,i)=>{ const age=ms-tImp-d; if(age<0||age>LIFE) return; const u=age/LIFE; o.push({r:L.RMAX*(1-Math.pow(1-u,1.7)),w:(34+u*80)*L.U,a:Math.min(1,Math.pow(1-u,1.1)*(1.25-i*.2))}); }); return o; };
  function draw(clk,ms){
    const W=L.W, H=L.H, U=L.U, cx=L.cx, cy=L.cy; g.clearRect(0,0,W,H); g.globalAlpha=Math.min(1,clk/450); g.drawImage(bgc,0,0,W,H); g.globalAlpha=1;
    const ra=rings(ms), fl=ms-tImp;
    if(fl>=0&&fl<600){ const k=1-fl/600, fg=g.createRadialGradient(cx,cy,0,cx,cy,300*U); fg.addColorStop(0,`rgba(${A2},${.6*k})`); fg.addColorStop(1,`rgba(${A},0)`); g.fillStyle=fg; g.fillRect(0,0,W,H); }
    for(const q of ra){   // fala: pas z mocniejszym kolorem motywu + jasny grzbiet i cień (naprężenie materiału)
      const r0=Math.max(0,q.r-q.w), r1=q.r+q.w, k=(q.r-r0)/(r1-r0), gr=g.createRadialGradient(cx,cy,r0,cx,cy,r1);
      gr.addColorStop(0,`rgba(${A},0)`); gr.addColorStop(k*.3,`rgba(0,0,0,${.15*q.a})`); gr.addColorStop(k*.6,`rgba(${A},${.45*q.a})`); gr.addColorStop(k*.88,`rgba(${A2},${.85*q.a})`);
      gr.addColorStop(k,`rgba(255,255,255,${.14*q.a})`); gr.addColorStop(Math.min(.99,k+.1),`rgba(${A},${.28*q.a})`); gr.addColorStop(1,`rgba(${A},0)`);
      g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,r1,0,6.2832); g.fill(); }
    for(const p of PA){   // pył (gotowe sprite'y zamiast gradientów na klatkę): fala unosi i przesuwa cząstki, które mija
      const bx=p.x+Math.sin(clk*.0004+p.ph)*8*U, by=((p.y-p.v*clk/1000)%H+H)%H, dx=bx-cx, dy=by-cy, d=Math.hypot(dx,dy)||1; let off=0, lift=0;
      for(const q of ra){ const z=(d-q.r)/q.w, e=Math.exp(-z*z); off+=q.a*22*U*z*e; lift+=q.a*e; }
      const sz=p.r*(1+2*lift)*3, al=Math.min(1,p.a*(1+3*lift)); g.globalAlpha=al; g.drawImage(GS[p.c],bx+dx/d*off-sz,by+dy/d*off-sz,sz*2,sz*2); }
    g.globalAlpha=1;
    const o=bootIcon(L,ms);
    if(o.vis){ const so=o.sh[0]*U, sr=o.s*.55+o.sh[1]*U*.7, sg=g.createRadialGradient(o.x,o.y+so,0,o.x,o.y+so,sr); sg.addColorStop(0,'rgba(0,0,0,.5)'); sg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=sg; g.beginPath(); g.arc(o.x,o.y+so,sr,0,6.2832); g.fill(); }
    const fr=ms-tImp, TR=470;   // koło alchemiczne: błysk przy uderzeniu, szybki obrót przeciwny do obrotu ikony, wyhamowanie i zanik przed ruszeniem ikony w lewo (tImp+520)
    if(fr>=0&&fr<TR){ const u=fr/TR, a=Math.min(1,fr/40)*(1-Math.pow(Math.max(0,(u-.35)/.65),1.6)), th=-(420*Math.PI/180)*(1-Math.pow(1-u,2.6)), sc=.8+.28*(1-Math.pow(1-u,3)), R=L.fin*.95;
      if(!BR||BR.k!==Math.round(R)) BR={k:Math.round(R),c:bootRing(R)};
      g.save(); g.translate(o.x,o.y); g.rotate(th); g.scale(sc,sc); g.globalAlpha=Math.max(0,a); g.globalCompositeOperation='lighter'; g.drawImage(BR.c,-BR.c.width/2,-BR.c.height/2); g.restore(); }
    im.style.opacity=o.vis?1:0; im.style.transform=`translate(${o.x-L.peak/2}px,${o.y-L.peak/2}px) rotate(${o.rot}deg) scale(${o.s/L.peak})`;
    if(ms>=T3s){ const q3=bEIO((ms-T3s)/BTM.T3), tl=bLerp(L.tx0,L.txF,q3); nm.style.opacity=1; nm.style.transform=`translate(${tl}px,${cy-nh/2}px)`; nm.style.clipPath=`inset(0 0 0 ${Math.max(0,o.x+L.fin/2-tl)}px)`; }
  }
  let clk=0, ls=null, last=performance.now(), stable=0, icOK=false, snd=null, ctx=null;
  (im.decode?im.decode():Promise.resolve()).then(()=>{ icOK=true; },()=>{ icOK=true; });
  function start(){   // start logo dopiero, gdy ikona jest zdekodowana, a klatki płynne (tło z efektami pojawia się wcześniej)
    ls=clk+80; { const R=L.fin*.95; BR={k:Math.round(R),c:bootRing(R)}; }   // koło alchemiczne gotowe przed uderzeniem (bez przycięcia klatki)
    if(S.settings.ui.anim.bootsnd!==false){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); ctx.resume(); snd=bootSound(ctx,ctx.currentTime+.08,L,.5); setTimeout(()=>{ if(ctx&&ctx.state!=='running'){ try{ ctx.close(); }catch{} snd=null; } },300); }catch{ snd=null; } } }
  function finish(fast){ if(BOOT.fin) return; BOOT.fin=true; removeEventListener('resize',layout); el.classList.add('out'); setTimeout(()=>el.remove(),520); if(snd&&fast) snd.fade(140); if(ctx) setTimeout(()=>{ try{ ctx.close(); }catch{} },3500); }
  el.addEventListener('mousedown',()=>{ BOOT.skip=true; }); document.addEventListener('keydown',()=>{ BOOT.skip=true; },{once:true});
  BOOT.dbg=()=>({clk,ls}); BOOT.draw=draw;
  (function frame(now){ if(BOOT.fin) return; requestAnimationFrame(frame);
    const dt=now-last; last=now; clk+=Math.min(dt,34);   // zegar animacji ignoruje zacięcia: po przestoju animacja wznawia się płynnie zamiast przeskakiwać
    if(ls===null){ stable=dt<=22?stable+1:0; if((icOK&&stable>=6&&clk>=450)||clk>=1800) start(); }
    const ms=ls===null?-1:clk-ls; draw(clk,ms);
    if(BOOT.skip){ finish(true); return; }
    if(ms>=tEnd&&!BOOT.pend.size){ finish(false); return; }
    if(ms>=tEnd){ lb.textContent=t([...BOOT.pend.values()].pop()); lb.classList.add('show'); } })(performance.now());
}
