// ---------- gry: wspólne elementy konfiguratora (Saper, Snake) ----------
const gmHsl=(rgb,d,s,l)=>{ const [r,g,b]=rgb.split(',').map(Number).map(v=>v/255), mx=Math.max(r,g,b), mn=Math.min(r,g,b), dd=mx-mn; let h=0; if(dd){ h=mx===r?((g-b)/dd)%6:mx===g?(b-r)/dd+2:(r-g)/dd+4; h*=60; if(h<0) h+=360; } return `hsl(${Math.round((h+d+360)%360)} ${s}% ${l}%)`; };   // kolory pochodne od akcentu motywu
const gmSl=(k,label,min,max,val,step=1)=>`<div class="gms"><span>${label}<b data-o="${k}"></b></span><div class="rg"><i class="tr"></i><i class="fl"></i><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${val}"></div></div>`;
const gmTg=(k,label,on)=>`<label class="ck"><input type="checkbox" data-k="${k}"${on?' checked':''}><span class="tg"></span>${label}</label>`;
const gmPaint=root=>root.querySelectorAll('.rg').forEach(g=>{ const i=g.querySelector('input'); g.style.setProperty('--v',(i.value-i.min)/(i.max-i.min)*100); });
const gmRingSvg='<svg viewBox="0 0 64 64" class="gmrs"><circle cx="32" cy="32" r="26" class="gmr0"/><circle cx="32" cy="32" r="26" class="gmr1"/><text x="32" y="33" class="gmrt"></text></svg>';
const gmRing=(root,p,txt,lab)=>{ root.querySelector('.gmr1').style.strokeDasharray=(Math.max(0,Math.min(1,p))*163.4).toFixed(1)+' 163.4'; root.querySelector('.gmrt').textContent=txt; root.querySelector('.gmd').textContent=t(lab); };
const gmDiff=d=>d<.3?'Łatwy':d<.5?'Średni':d<.7?'Trudny':'Ekstremalny';
function gmFrame(cls,inner,panel){ return `<div class="gj ${cls}">${inner}<button class="gjm" title="Ustawienia gry"><i></i></button><div class="gmp"><div class="gmt">Ustawienia gry</div>${panel}</div></div>`; }
const gmRR=(cx,x,y,w,h,r)=>{ cx.beginPath(); if(cx.roundRect) cx.roundRect(x,y,w,h,r); else cx.rect(x,y,w,h); };
const gmAnim=()=>!document.body.classList.contains('na-apps');

// ---------- aplikacja: Saper ----------
const MN_DEF={pre:'easy',w:9,h:9,m:10,cell:32,fit:true,safe:true,chord:true,ques:false,wrap:false,lives:1}, MN_PRE={easy:[9,9,10],mid:[16,16,40],hard:[30,16,99]};
const mnMax=(w,h)=>Math.max(1,Math.floor(w*h*.55));
const mnPerm=(()=>{ const c={}; return n=>c[n]||(c[n]=(()=>{ const a=Array.from({length:n},(_,i)=>i); let s=n*7919+13; for(let i=n-1;i>0;i--){ s=(s*1103515245+12345)&0x7fffffff; const j=s%(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; })()); })();
function mnNb(w,h,wrap){ const NB=[]; for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const a=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; let nx=x+dx, ny=y+dy; if(wrap){ nx=(nx+w)%w; ny=(ny+h)%h; } else if(nx<0||ny<0||nx>=w||ny>=h) continue; const j=ny*w+nx; if(j!==y*w+x&&!a.includes(j)) a.push(j); } NB.push(a); } return NB; }
function mountMine(el,wn){
  const D=(S.aw.data.mine=S.aw.data.mine||{cfg:{},best:{},st:{p:0,w:0}}); D.best=D.best||{}; D.st=D.st||{p:0,w:0};
  const C=D.cfg=Object.assign({},MN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(40,Math.max(5,C.w|0)); C.h=Math.min(30,Math.max(5,C.h|0)); C.m=Math.min(mnMax(C.w,C.h),Math.max(1,C.m|0)); C.cell=Math.min(56,Math.max(20,C.cell|0)); C.lives=Math.min(5,Math.max(1,C.lives|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('mn',`<div class="gmh"><div class="gmi" title="Pozostało min">💣<b class="mnm">0</b></div><button class="gmbt mnf" title="Nowa gra">🙂</button><div class="gmi">⏱<b class="mnt">0</b></div><div class="mnl"></div><button class="gmbt mnfl" title="Tryb flagi">🚩</button></div><div class="gmb"><canvas class="mnv"></canvas></div><div class="gmx"><span class="mnbs"></span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('easy','Łatwy')}${preBtn('mid','Średni')}${preBtn('hard','Trudny')}${preBtn('custom','Własny')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',5,40,C.w)}${gmSl('h','Wiersze',5,30,C.h)}${gmSl('m','Miny',1,mnMax(C.w,C.h),C.m)}${gmSl('cell','Rozmiar pola',20,56,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}
     <div class="gmg">Zasady</div>${gmSl('lives','Życia',1,5,C.lives)}${gmTg('safe','Bezpieczny pierwszy klik',C.safe)}${gmTg('chord','Akordy (klik na cyfrę)',C.chord)}${gmTg('ques','Znaki zapytania',C.ques)}${gmTg('wrap','Zawinięta plansza',C.wrap)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Prawy przycisk myszy: flaga. Zmiana rozmiaru planszy lub liczby min zaczyna nową grę po kliknięciu przycisku powyżej.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d');
  let G=null, cs=30, dpr=window.devicePixelRatio||1, hov=-1, down=-1, flagMode=false, raf=0, tmr=null, shake=0, pvRaf=0, ff=getComputedStyle(el).fontFamily;
  const now=()=>performance.now();
  // ----- logika gry -----
  function place(first){ const ban=new Set(); if(first>=0){ ban.add(first); if(C.safe) G.NB[first].forEach(j=>ban.add(j)); }
    let cand=[]; for(let i=0;i<G.n;i++) if(!ban.has(i)) cand.push(i); if(cand.length<G.m){ cand=[]; for(let i=0;i<G.n;i++) if(i!==first) cand.push(i); }
    for(let k=0;k<G.m;k++){ const r=k+Math.floor(Math.random()*(cand.length-k)); [cand[k],cand[r]]=[cand[r],cand[k]]; G.mine[cand[k]]=1; }
    for(let i=0;i<G.n;i++){ let c=0; for(const j of G.NB[i]) c+=G.mine[j]; G.near[i]=c; } G.placed=true; }
  function newGame(){ fix(); clearInterval(tmr); const n=C.w*C.h; G={w:C.w,h:C.h,n,m:C.m,NB:mnNb(C.w,C.h,C.wrap),mine:new Uint8Array(n),near:new Uint8Array(n),st:new Uint8Array(n),boom:new Uint8Array(n),rv:new Float64Array(n),placed:false,opened:0,flags:0,booms:0,lives:C.lives,over:0,t0:0,ms:0,wt:0};
    if(!C.safe) place(-1); layout(); head(); redraw(); }
  function flood(i){ const t=now(), a=gmAnim(), qu=[[i,0]]; G.st[i]=1; G.rv[i]=t; G.opened++;
    for(let k=0;k<qu.length;k++){ const [c,d]=qu[k]; if(G.near[c]) continue; for(const j of G.NB[c]) if(G.st[j]===0||G.st[j]===3){ G.st[j]=1; G.opened++; G.rv[j]=t+(a?(d+1)*22:0); qu.push([j,d+1]); } } }
  function hit(i){ G.st[i]=1; G.boom[i]=1; G.rv[i]=now(); G.booms++; G.lives--; shake=now();
    if(G.lives<=0){ G.over=2; clearInterval(tmr); G.ms=now()-G.t0; D.st.p++; const t=now(), x0=i%G.w, y0=(i/G.w)|0, a=gmAnim();
      for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]===0||G.mine[j]&&G.st[j]===3){ G.st[j]=4; G.rv[j]=t+(a?80+Math.hypot(j%G.w-x0,((j/G.w)|0)-y0)*38:0); } save(); }
    else toast(t('Życie utracone! Zostało: {n}').replace('{n}',G.lives)); }
  function check(){ if(G.over||G.opened!==G.n-G.m) return; G.over=1; clearInterval(tmr); G.ms=now()-G.t0; G.wt=now(); G.flags=G.m-G.booms;
    for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]!==1) G.st[j]=2; D.st.p++; D.st.w++; const k=bestKey(); toast(t('Wygrana! Czas: {t} s').replace('{t}',(G.ms/1000).toFixed(1)));
    if(!D.best[k]||G.ms<D.best[k]){ D.best[k]=Math.round(G.ms); setTimeout(()=>toast(t('Nowy rekord!')),1800); } save(); }
  function open(i){ if(G.over||G.st[i]===1||G.st[i]===2) return; if(!G.placed) place(i); if(!G.t0){ G.t0=now(); tmr=setInterval(tick,200); }
    if(G.mine[i]) hit(i); else flood(i); check(); head(); redraw(); }
  function chord(i){ if(G.over||G.st[i]!==1||!G.near[i]||G.mine[i]) return; let f=0; for(const j of G.NB[i]) if(G.st[j]===2||(G.st[j]===1&&G.boom[j])) f++; if(f!==G.near[i]) return;
    for(const j of G.NB[i]){ if(G.over) break; if(G.st[j]!==0&&G.st[j]!==3) continue; if(G.mine[j]) hit(j); else flood(j); } check(); head(); redraw(); }
  function flag(i){ if(G.over||G.st[i]===1) return; const s=G.st[i]; if(s===0){ G.st[i]=2; G.flags++; } else if(s===2){ G.flags--; G.st[i]=C.ques?3:0; } else G.st[i]=0; head(); redraw(); }
  const bestKey=()=>`${C.w}x${C.h}-${C.m}${C.wrap?'w':''}${C.lives>1?'l'+C.lives:''}`;
  function tick(){ if(!root.isConnected){ clearInterval(tmr); return; } q('.mnt').textContent=G.t0?Math.min(999,Math.floor((now()-G.t0)/1000)):0; }
  function head(){ q('.mnm').textContent=G.m-G.flags-G.booms; q('.mnf').textContent=G.over===1?'😎':G.over===2?'😵':(down>=0?'😮':'🙂');
    q('.mnt').textContent=G.t0?Math.min(999,Math.floor((G.over?G.ms:now()-G.t0)/1000)):0;
    q('.mnl').innerHTML=C.lives>1?Array.from({length:C.lives},(_,k)=>`<i class="${k<G.lives?'':'off'}">♥</i>`).join(''):'';
    const b=D.best[bestKey()]; q('.mnbs').textContent=b?t('Rekord')+': '+(b/1000).toFixed(1)+' s':''; }
  // ----- rysowanie -----
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(12,Math.min(64,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
  const NCK={k:'',v:[]};
  function ncol(n){ if(NCK.k!==accRgb){ NCK.k=accRgb; NCK.v=Array.from({length:9},(_,k)=>gmHsl(accRgb,k*47+20,72,68)); } return NCK.v[n]; }
  function flagIco(x,y,c){ const X=x+c*.5, T=y+c*.2, B=y+c*.8; cx.fillStyle=P.acc; cx.beginPath(); cx.moveTo(X,T); cx.lineTo(X+c*.28,T+c*.17); cx.lineTo(X,T+c*.34); cx.closePath(); cx.fill(); cx.fillStyle=P.fg; cx.fillRect(X-c*.03,T,c*.055,B-T); cx.fillRect(X-c*.2,B-c*.04,c*.4,c*.075); }
  function bomb(x,y,c,hot){ const X=x+c/2, Y=y+c/2, r=c*.2; if(hot){ cx.fillStyle=`rgba(${accRgb},.55)`; cx.beginPath(); cx.arc(X,Y,c*.46,0,6.283); cx.fill(); }
    cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.2,c*.06); for(let k=0;k<4;k++){ const a=k*Math.PI/4; cx.beginPath(); cx.moveTo(X-Math.cos(a)*r*1.75,Y-Math.sin(a)*r*1.75); cx.lineTo(X+Math.cos(a)*r*1.75,Y+Math.sin(a)*r*1.75); cx.stroke(); }
    cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r*1.2,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(X-r*.4,Y-r*.4,r*.35,0,6.283); cx.fill(); }
  function draw(){ const t=now(), w=G.w; let busy=false; cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,w*cs,G.h*cs);
    if(gmAnim()&&shake&&t-shake<380){ cx.translate(Math.sin((t-shake)*.07)*(1-(t-shake)/380)*cs*.22,0); busy=true; }
    cx.font=`700 ${Math.round(cs*.52)}px ${ff}`; cx.textAlign='center'; cx.textBaseline='middle'; const g=Math.max(1,cs*.05), r=cs*.2;
    for(let i=0;i<G.n;i++){ const x=(i%w)*cs, y=((i/w)|0)*cs; let s=G.st[i], a=1;
      if(s===1||s===4){ const dt=t-G.rv[i]; if(dt<0){ s=0; busy=true; } else if(dt<240){ a=dt/240; busy=true; } }
      if(s===1||s===4){ const k=a<1?.55+.45*(1+2.7*Math.pow(a-1,3)+1.7*Math.pow(a-1,2)):1; cx.save(); cx.translate(x+cs/2,y+cs/2); cx.scale(k,k); cx.translate(-x-cs/2,-y-cs/2); cx.globalAlpha=a;
        cx.fillStyle=G.boom[i]?`rgba(${accRgb},.3)`:'rgba(0,0,0,.27)'; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill();
        if(G.mine[i]) bomb(x,y,cs,G.boom[i]); else if(G.near[i]){ cx.fillStyle=ncol(G.near[i]); cx.fillText(G.near[i],x+cs/2,y+cs/2+cs*.03); } cx.restore(); }
      else { const hot=i===hov&&!G.over||i===down; cx.fillStyle=`rgba(${accRgb},${hot?.4:.22})`; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill(); cx.strokeStyle=`rgba(${fgRgb},.09)`; cx.lineWidth=1; cx.beginPath(); cx.moveTo(x+r+g,y+g+.5); cx.lineTo(x+cs-r-g,y+g+.5); cx.stroke();
        if(s===2){ flagIco(x,y,cs); if(G.over===2&&!G.mine[i]){ cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.5,cs*.07); cx.beginPath(); cx.moveTo(x+cs*.22,y+cs*.22); cx.lineTo(x+cs*.78,y+cs*.78); cx.moveTo(x+cs*.78,y+cs*.22); cx.lineTo(x+cs*.22,y+cs*.78); cx.stroke(); } }
        else if(s===3){ cx.fillStyle=P.mut; cx.fillText('?',x+cs/2,y+cs/2+cs*.03); } else if(s===4) bomb(x,y,cs,false); } }
    if(G.over===1&&gmAnim()&&t-G.wt<1500){ busy=true; const fr=(t-G.wt)/1500*(w+G.h+8)-4; for(let i=0;i<G.n;i++){ const al=Math.max(0,1-Math.abs((i%w)+((i/w)|0)-fr)/4.5)*.55; if(al>.02){ cx.fillStyle=`rgba(${acc2Rgb},${al})`; gmRR(cx,(i%w)*cs+g,((i/w)|0)*cs+g,cs-2*g,cs-2*g,r); cx.fill(); } } }
    return busy; }
  const loop=()=>{ raf=0; if(!root.isConnected||!G) return; if(draw()) raf=requestAnimationFrame(loop); };
  const redraw=()=>{ if(!raf) raf=requestAnimationFrame(loop); };
  // ----- mysz -----
  const cellAt=e=>{ const r=cv.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/cs), y=Math.floor((e.clientY-r.top)/cs); return x<0||y<0||x>=G.w||y>=G.h?-1:y*G.w+x; };
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('pointerdown',e=>{ const i=cellAt(e); if(i<0) return; if(e.button===2){ flag(i); return; } if(e.button===1){ e.preventDefault(); chord(i); return; } if(e.button===0){ down=i; head(); redraw(); } });
  cv.addEventListener('pointerup',e=>{ if(e.button!==0) return; const i=cellAt(e), d=down; down=-1; head(); redraw(); if(i<0||i!==d) return; if(flagMode) flag(i); else if(G.st[i]===1){ if(C.chord) chord(i); } else open(i); });
  cv.addEventListener('pointermove',e=>{ const i=cellAt(e); if(i!==hov){ hov=i; redraw(); } });
  cv.addEventListener('pointerleave',()=>{ hov=-1; down=-1; head(); redraw(); });
  q('.mnf').addEventListener('click',newGame);
  q('.mnfl').addEventListener('click',e=>{ flagMode=!flagMode; e.currentTarget.classList.toggle('on',flagMode); });
  new ResizeObserver(()=>{ if(G){ layout(); redraw(); } }).observe(q('.gmb'));
  // ----- konfigurator z podglądem na żywo -----
  function pvDraw(t=now()){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); const c=Math.max(2,Math.min((W-14*dpr)/C.w,(H-14*dpr)/C.h)), bw=c*C.w, bh=c*C.h, ox=(W-bw)/2, oy=(H-bh)/2, ord=mnPerm(C.w*C.h), mine=new Uint8Array(C.w*C.h);
    for(let k=0;k<C.m;k++) mine[ord[k]]=1; const gp=Math.max(.5,c*.08);
    for(let i=0;i<mine.length;i++){ const x=ox+(i%C.w)*c, y=oy+((i/C.w)|0)*c; px.fillStyle=`rgba(${accRgb},.17)`; px.fillRect(x+gp,y+gp,c-2*gp,c-2*gp);
      if(mine[i]){ const p=.5+.5*Math.sin(t*.004+i*1.7); px.fillStyle=`rgba(${acc2Rgb},${.55+.45*p})`; px.beginPath(); px.arc(x+c/2,y+c/2,c*(.2+.1*p),0,6.283); px.fill(); } }
    if(C.wrap){ px.save(); px.strokeStyle=P.acc; px.lineWidth=2*dpr; px.setLineDash([5*dpr,4*dpr]); px.lineDashOffset=-(t*.02)%(9*dpr); px.shadowColor=P.acc; px.shadowBlur=8*dpr; px.strokeRect(ox-3*dpr,oy-3*dpr,bw+6*dpr,bh+6*dpr); px.restore(); } }
  function pvLoop(t){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; pvDraw(t); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; }, d=C.m/(C.w*C.h);
    pn.querySelector('[data-k=m]').max=mnMax(C.w,C.h); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('m',C.m+' · '+Math.round(d*100)+'%'); o('cell',C.cell+' px'); o('lives',C.lives); pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>b.classList.toggle('on',b.dataset.p===C.pre)); gmPaint(pn);
    const d2=d*(C.wrap?1.12:1)*(1-(C.lives-1)*.06); gmRing(pn,d/.3,Math.round(d*100)+'%',['Łatwy','Średni','Trudny','Ekstremalny'][d2<.14?0:d2<.18?1:d2<.23?2:3]); if(!pvRaf) pvDraw(); }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; if(k==='w'||k==='h'||k==='m') C.pre='custom'; fix(); sync(); if(k==='cell'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; if(k==='wrap') C.pre='custom'; sync(); if(k==='fit'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ const p=b.dataset.p; C.pre=p; if(p!=='custom'){ [C.w,C.h,C.m]=MN_PRE[p]; } sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); } });
  newGame(); sync();
  el.__mn={ get G(){ return G; }, open, flag, chord, newGame, C };
}

// ---------- aplikacja: Snake ----------
const SN_DEF={w:20,h:16,speed:9,accel:3,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:6,obs:0,wrap:false,cell:28,fit:true};
const SN_PRE={cl:{w:20,h:16,speed:8,accel:0,len:3,grow:1,apples:1,every:1,life:0,gold:0,poison:0,obs:0,wrap:false},
  fast:{w:24,h:18,speed:16,accel:4,len:3,grow:1,apples:3,every:2,life:12,gold:10,poison:8,obs:0,wrap:false},
  maze:{w:26,h:18,speed:10,accel:2,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:5,obs:24,wrap:false},
  open:{w:22,h:22,speed:9,accel:2,len:3,grow:1,apples:3,every:2,life:0,gold:12,poison:0,obs:0,wrap:true}};
function snNew(C){ const w=C.w, h=C.h, cy=h>>1, x0=Math.max(C.len+1,w>>2), G={w,h,wrap:C.wrap,snake:[],dir:{x:1,y:0},q:[],apples:[],obs:new Uint8Array(w*h),score:0,grow:0,alive:true,speed:C.speed,sa:0,eaten:0,prev:null,t:0,poison:0};
  for(let i=0;i<C.len;i++) G.snake.push({x:x0-i,y:cy});
  for(let n=C.obs, k=0; n>0&&k<3000; k++){ const x=(Math.random()*w)|0, y=(Math.random()*h)|0; if(Math.abs(y-cy)<=1&&x<x0+9) continue; if(G.obs[y*w+x]) continue; G.obs[y*w+x]=1; n--; }
  snSpawn(G,C); return G; }
function snFree(G,x,y){ if(G.obs[y*G.w+x]) return false; for(const s of G.snake) if(s.x===x&&s.y===y) return false; for(const a of G.apples) if(a.x===x&&a.y===y) return false; return true; }
function snSpawn(G,C){ for(let k=0;k<300;k++){ const x=(Math.random()*G.w)|0, y=(Math.random()*G.h)|0; if(!snFree(G,x,y)) continue; const r=Math.random()*100; let kind=r<C.poison?2:r<C.poison+C.gold?1:0;
    if(kind===2&&!G.apples.some(a=>a.k!==2)) kind=0;   // zawsze musi być co najmniej jedno zdrowe jabłko
    G.apples.push({x,y,k:kind,exp:C.life?G.t+C.life*1000:0}); return true; } return false; }
function snTick(G,C,dt){ G.t+=dt; const n0=G.apples.length; G.apples=G.apples.filter(a=>!a.exp||G.t<a.exp); if(!G.apples.length) snSpawn(G,C);
  G.sa+=dt; if(G.sa>=C.every*1000){ G.sa=0; if(G.apples.length<C.apples) snSpawn(G,C); } return n0; }
function snStep(G,C){ G.prev=G.snake.map(s=>({x:s.x,y:s.y})); const d=G.q.length?G.q.shift():G.dir; G.dir=d; const h=G.snake[0]; let nx=h.x+d.x, ny=h.y+d.y;
  if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h){ G.alive=false; return 'wall'; }
  if(G.obs[ny*G.w+nx]){ G.alive=false; return 'obs'; }
  const L=G.snake.length-(G.grow>0?0:1); for(let i=0;i<L;i++){ const s=G.snake[i]; if(s.x===nx&&s.y===ny){ G.alive=false; return 'self'; } }
  G.snake.unshift({x:nx,y:ny}); let ate=-1, ai=G.apples.findIndex(a=>a.x===nx&&a.y===ny);
  if(ai>=0){ const a=G.apples.splice(ai,1)[0]; ate=a.k; G.eaten++; if(a.k===0){ G.score+=10; G.grow+=C.grow; } else if(a.k===1){ G.score+=30; G.grow+=C.grow+2; } else { G.score=Math.max(0,G.score-5); G.poison=2; } G.speed=Math.min(30,G.speed*(1+C.accel/100)); }
  if(G.grow>0) G.grow--; else G.snake.pop();
  if(G.poison){ for(let k=0;k<G.poison&&G.snake.length>2;k++) G.snake.pop(); G.poison=0; }
  if(!G.apples.length) snSpawn(G,C);
  return ate>=0?'ate'+ate:''; }
function snAI(G){ const h=G.snake[0], DD=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]; let best=null, bd=1e9;
  for(const d of DD){ if(d.x===-G.dir.x&&d.y===-G.dir.y) continue; let nx=h.x+d.x, ny=h.y+d.y; if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h) continue;
    if(G.obs[ny*G.w+nx]||G.snake.some((s,i)=>i<G.snake.length-1&&s.x===nx&&s.y===ny)) continue;
    let m=1e9; for(const a of G.apples){ if(a.k===2) continue; let dx=Math.abs(a.x-nx), dy=Math.abs(a.y-ny); if(G.wrap){ dx=Math.min(dx,G.w-dx); dy=Math.min(dy,G.h-dy); } m=Math.min(m,dx+dy); } m+=Math.random()*.4; if(m<bd){ bd=m; best=d; } }
  if(best) G.q=[best]; }
function snBg(G,C,cs,dpr){ const W=G.w*cs, H=G.h*cs, c=document.createElement('canvas'); c.width=Math.round(W*dpr); c.height=Math.round(H*dpr); const x=c.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0);
  x.fillStyle='rgba(0,0,0,.26)'; gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.fill();
  for(let j=0;j<G.h;j++) for(let i=0;i<G.w;i++){ if((i+j)&1){ x.fillStyle=`rgba(${accRgb},.05)`; x.fillRect(i*cs,j*cs,cs,cs); } if(G.obs[j*G.w+i]){ x.fillStyle=`rgba(${accRgb},.4)`; gmRR(x,i*cs+cs*.06,j*cs+cs*.06,cs*.88,cs*.88,cs*.2); x.fill(); x.strokeStyle=P.acc; x.lineWidth=Math.max(1,cs*.05); x.stroke(); } }
  x.save(); x.strokeStyle=G.wrap?P.acc2:P.acc; x.lineWidth=G.wrap?Math.max(1.5,cs*.08):Math.max(2,cs*.14); if(G.wrap){ x.setLineDash([cs*.4,cs*.3]); x.shadowColor=P.acc2; x.shadowBlur=cs*.4; } gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.stroke(); x.restore(); return c; }
function snDraw(cx,G,cs,t,f,dead){
  for(const a of G.apples){ if(a.exp&&a.exp-G.t<1600&&((G.t/140)|0)%2) continue; const X=(a.x+.5)*cs, Y=(a.y+.5)*cs, r=cs*.34*(1+.07*Math.sin(t*.006+a.x*2+a.y));
    if(a.k===0){ cx.fillStyle=P.acc2; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.fillStyle=`rgba(${fgRgb},.55)`; cx.beginPath(); cx.arc(X-r*.35,Y-r*.35,r*.28,0,6.283); cx.fill(); cx.fillStyle=P.acc; cx.beginPath(); cx.ellipse(X+r*.3,Y-r*1.02,r*.34,r*.17,-.6,0,6.283); cx.fill(); }
    else if(a.k===1){ cx.save(); cx.shadowColor=P.fg; cx.shadowBlur=cs*.45; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.restore(); cx.strokeStyle=P.acc; cx.lineWidth=Math.max(1.2,cs*.07); cx.beginPath(); cx.arc(X,Y,r*.62,0,6.283); cx.stroke(); }
    else { cx.fillStyle=gmHsl(accRgb,180,52,52); cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.strokeStyle=P.bg; cx.lineWidth=Math.max(1.4,cs*.08); cx.beginPath(); cx.moveTo(X-r*.42,Y-r*.42); cx.lineTo(X+r*.42,Y+r*.42); cx.moveTo(X+r*.42,Y-r*.42); cx.lineTo(X-r*.42,Y+r*.42); cx.stroke(); } }
  const L=G.snake.length, A=accRgb.split(',').map(Number), B=acc2Rgb.split(',').map(Number); cx.globalAlpha=dead?.5:1;
  for(let i=L-1;i>=0;i--){ const s=G.snake[i], p=G.prev&&G.prev[i], dx=p?s.x-p.x:0, dy=p?s.y-p.y:0; let x=s.x, y=s.y; if(p&&Math.abs(dx)<=1&&Math.abs(dy)<=1){ x=p.x+dx*f; y=p.y+dy*f; }
    const k=L>1?i/(L-1):0, sz=cs*(i===0?.98:.9-.2*k), X=(x+.5)*cs, Y=(y+.5)*cs; cx.fillStyle=`rgb(${Math.round(A[0]+(B[0]-A[0])*k)},${Math.round(A[1]+(B[1]-A[1])*k)},${Math.round(A[2]+(B[2]-A[2])*k)})`; gmRR(cx,X-sz/2,Y-sz/2,sz,sz,sz*.38); cx.fill(); }
  cx.globalAlpha=1; const h=G.snake[0], hp=G.prev&&G.prev[0]; let hx=h.x, hy=h.y; if(hp&&Math.abs(h.x-hp.x)<=1&&Math.abs(h.y-hp.y)<=1){ hx=hp.x+(h.x-hp.x)*f; hy=hp.y+(h.y-hp.y)*f; }
  const X=(hx+.5)*cs, Y=(hy+.5)*cs, d=G.dir, px=-d.y, py=d.x; for(const sg of [-1,1]){ const ex=X+d.x*cs*.17+px*sg*cs*.2, ey=Y+d.y*cs*.17+py*sg*cs*.2; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(ex,ey,cs*.115,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(ex+d.x*cs*.04,ey+d.y*cs*.04,cs*.055,0,6.283); cx.fill(); } }

function mountSnake(el,wn){
  const D=(S.aw.data.snake=S.aw.data.snake||{cfg:{},best:{}}); D.best=D.best||{}; const C=D.cfg=Object.assign({},SN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(50,Math.max(10,C.w|0)); C.h=Math.min(40,Math.max(10,C.h|0)); C.speed=Math.min(30,Math.max(3,C.speed|0)); C.accel=Math.min(10,Math.max(0,C.accel|0)); C.len=Math.min(10,Math.max(2,C.len|0)); C.grow=Math.min(5,Math.max(1,C.grow|0));
    C.apples=Math.min(10,Math.max(1,C.apples|0)); C.every=Math.min(10,Math.max(.5,+C.every||3)); C.life=Math.min(30,Math.max(0,C.life|0)); if(C.life>0&&C.life<3) C.life=3; C.gold=Math.min(40,Math.max(0,C.gold|0)); C.poison=Math.min(40,Math.max(0,C.poison|0));
    C.obs=Math.min(Math.floor(C.w*C.h*.12),Math.max(0,C.obs|0)); C.cell=Math.min(48,Math.max(14,C.cell|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('sn',`<div class="gmh"><div class="gmi">🍎<b class="snsc">0</b></div><div class="gmi">🏆<b class="snbs">0</b></div><div class="gmi"><span>Długość</span><b class="snln">0</b></div><button class="gmbt snpz" title="Pauza">⏸</button></div><div class="gmb"><canvas class="mnv"></canvas><div class="gmov"><b></b><span></span><button class="gjbt">Zagraj ponownie</button></div></div><div class="gmx"><span>Strzałki lub WASD: sterowanie, spacja: pauza.</span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('cl','Klasyczny')}${preBtn('fast','Szybki')}${preBtn('maze','Labirynt')}${preBtn('open','Bez ścian')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',10,50,C.w)}${gmSl('h','Wiersze',10,40,C.h)}${gmSl('obs','Przeszkody',0,Math.floor(C.w*C.h*.12),C.obs)}${gmSl('cell','Rozmiar pola',14,48,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}${gmTg('wrap','Przenikanie ścian',C.wrap)}
     <div class="gmg">Wąż</div>${gmSl('speed','Szybkość',3,30,C.speed)}${gmSl('accel','Przyspieszanie',0,10,C.accel)}${gmSl('len','Początkowa długość',2,10,C.len)}${gmSl('grow','Wzrost za jabłko',1,5,C.grow)}
     <div class="gmg">Jabłka</div>${gmSl('apples','Jabłka naraz',1,10,C.apples)}${gmSl('every','Nowe jabłko co',.5,10,C.every,.5)}${gmSl('life','Czas życia jabłka',0,30,C.life)}${gmSl('gold','Złote jabłka',0,40,C.gold)}${gmSl('poison','Trujące jabłka',0,40,C.poison)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Złote jabłko: +30 pkt i dłuższy wzrost. Trujące: -5 pkt i skrócenie węża. Zmiany planszy i węża obowiązują od nowej gry.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d'), ov=q('.gmov');
  let G=null, st='ready', cs=24, dpr=window.devicePixelRatio||1, bg=null, raf=0, last=0, acc=0, f=1, pvRaf=0, pvG=null, pvBg=null, pvKey='', pvAcc=0, pvLast=0;
  const now=()=>performance.now(), bestKey=()=>`${C.w}x${C.h}-s${C.speed}${C.wrap?'w':''}-o${C.obs}`;
  const show=(a,b,btn)=>{ ov.classList.toggle('show',!!a); if(a){ ov.querySelector('b').textContent=a; ov.querySelector('span').textContent=b||''; ov.querySelector('button').style.display=btn?'':'none'; } };
  function hud(){ q('.snsc').textContent=G.score; q('.snln').textContent=G.snake.length; const b=D.best[bestKey()]|0; q('.snbs').textContent=Math.max(b,G.score); }
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(10,Math.min(60,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); bg=snBg(G,C,cs,dpr); }
  function newGame(){ fix(); G=snNew(C); st='ready'; acc=0; f=1; layout(); hud(); show(t('Naciśnij strzałkę, aby zacząć'),'',false); q('.snpz').textContent='⏸'; render(now()); }
  function render(t0){ cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,G.w*cs,G.h*cs); cx.drawImage(bg,0,0,G.w*cs,G.h*cs); snDraw(cx,G,cs,t0,f,!G.alive); }
  function end(why){ st='over'; const k=bestKey(), nb=G.score>(D.best[k]|0); if(nb){ D.best[k]=G.score; save(); } hud(); show(t('Koniec gry'),t('Wynik: {n}').replace('{n}',G.score)+(nb&&G.score>0?' · '+t('Nowy rekord!'):''),true); }
  function frame(t0){ raf=0; if(!root.isConnected) return; const dt=Math.min(100,t0-(last||t0)); last=t0;
    if(st==='run'){ snTick(G,C,dt); acc+=dt; const sm=1000/G.speed; while(acc>=sm&&st==='run'){ acc-=sm; snStep(G,C); if(!G.alive){ end(); break; } hud(); } f=gmAnim()?Math.min(1,acc/sm):1; }
    render(t0); if(st==='run') raf=requestAnimationFrame(frame); }
  const kick=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(frame); } };
  function start(){ if(st==='ready'){ st='run'; show(''); acc=0; kick(); } }
  function pause(){ if(st==='run'){ st='pause'; q('.snpz').textContent='▶'; show(t('Pauza'),t('Naciśnij spację, aby wznowić'),false); render(now()); } else if(st==='pause'){ st='run'; q('.snpz').textContent='⏸'; show(''); kick(); } }
  function turn(d){ if(st==='over') return; if(st==='ready'){ if(d.x===-1) return; G.dir=d; start(); return; } if(st!=='run') return; const ref=G.q.length?G.q[G.q.length-1]:G.dir; if(d.x===-ref.x&&d.y===-ref.y||d.x===ref.x&&d.y===ref.y) return; if(G.q.length<2) G.q.push(d); }
  const KEYS={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0}};
  root.tabIndex=-1; root.style.outline='none';
  root.addEventListener('keydown',e=>{ if(e.ctrlKey||e.altKey||e.metaKey) return; const k=e.key.length===1?e.key.toLowerCase():e.key, d=KEYS[k]; if(d){ e.preventDefault(); turn(d); } else if(k===' '||k==='p'){ e.preventDefault(); pause(); } else if(k==='r'){ newGame(); } });
  root.addEventListener('pointerdown',e=>{ if(!e.target.closest('.gmp,.gjm,input,button')) root.focus({preventScroll:true}); });
  let sw=null; cv.addEventListener('pointerdown',e=>{ sw={x:e.clientX,y:e.clientY}; if(st==='pause') pause(); }); cv.addEventListener('pointerup',e=>{ if(!sw) return; const dx=e.clientX-sw.x, dy=e.clientY-sw.y; sw=null; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; turn(Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)}); });
  q('.snpz').addEventListener('click',()=>{ if(st==='ready') return; pause(); root.focus({preventScroll:true}); }); ov.querySelector('button').addEventListener('click',()=>{ newGame(); root.focus({preventScroll:true}); });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden&&st==='run') pause(); });
  new ResizeObserver(()=>{ if(G){ layout(); render(now()); } }).observe(q('.gmb'));
  // ----- konfigurator: podgląd na żywo (autopilot na planszy o wybranych ustawieniach) -----
  function pvReset(){ const key=[C.w,C.h,C.obs,C.wrap,C.len,C.apples,C.gold,C.poison,C.life].join(); if(key===pvKey&&pvG&&pvG.alive) return; pvKey=key; pvG=snNew(C); const W=pv.width, H=pv.height, c=Math.max(2,Math.min((W-10*dpr)/C.w,(H-10*dpr)/C.h)); pvBg=snBg(pvG,C,c,1); pvBg._c=c; }
  function pvDraw(t0){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); pvReset(); const c=pvBg._c; px.translate((W-c*C.w)/2,(H-c*C.h)/2); px.drawImage(pvBg,0,0,c*C.w,c*C.h); snDraw(px,pvG,c,t0,Math.min(1,pvAcc/(1000/Math.max(4,Math.min(20,pvG.speed)))),!pvG.alive); }
  function pvLoop(t0){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; const dt=Math.min(100,t0-(pvLast||t0)); pvLast=t0; pvReset(); const sp=Math.max(4,Math.min(20,C.speed)); pvAcc+=dt; snTick(pvG,C,dt);
    while(pvAcc>=1000/sp){ pvAcc-=1000/sp; snAI(pvG); snStep(pvG,C); if(!pvG.alive){ pvKey=''; pvReset(); break; } } pvDraw(t0); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; };
    pn.querySelector('[data-k=obs]').max=Math.floor(C.w*C.h*.12); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('obs',C.obs); o('cell',C.cell+' px'); o('speed',C.speed+'/s'); o('accel',C.accel+'%'); o('len',C.len); o('grow',C.grow); o('apples',C.apples); o('every',C.every+' s'); o('life',C.life?C.life+' s':t('bez limitu')); o('gold',C.gold+'%'); o('poison',C.poison+'%');
    pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>{ const p=SN_PRE[b.dataset.p]; b.classList.toggle('on',Object.keys(p).every(k=>C[k]===p[k])); }); gmPaint(pn);
    const sc=C.speed/30*.55+(C.wrap?0:.1)+Math.min(.25,C.obs/(C.w*C.h)*2.2)+C.poison/100*.5+C.accel/10*.15; gmRing(pn,C.speed/30,C.speed+'/s',gmDiff(sc)); pvKey=''; if(!pvRaf){ pvReset(); pvDraw(now()); } }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvLast=0; pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; fix(); sync(); if(k==='cell'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; sync(); if(k==='fit'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ Object.assign(C,SN_PRE[b.dataset.p]); sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); root.focus({preventScroll:true}); } });
  newGame(); sync(); root.focus({preventScroll:true});
  el.__sn={ get G(){ return G; }, get st(){ return st; }, turn, pause, newGame, step:()=>snStep(G,C), C };
}

