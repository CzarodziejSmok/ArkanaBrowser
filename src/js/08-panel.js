// ---------- nawigacja i panel asystenta ----------
const pwSet=()=>document.documentElement.style.setProperty('--pw',(S.pw||430)+'px');
function setPanel(v){ S.panel=v; right.classList.toggle('open',v); split.classList.toggle('open',v); $('toggle').classList.toggle('on',v); save(); }
function togglePanel(){ const v=!S.panel; setPanel(v); if(v&&cw.getAttribute('src')==='about:blank') cw.setAttribute('src','https://claude.ai/new'); }
const SE={googleweb:{n:'Google (tylko wyniki WWW)',url:'https://www.google.com/search?q=%s&udm=14'},google:{n:'Google',url:'https://www.google.com/search?q=%s'},bing:{n:'Bing',url:'https://www.bing.com/search?q=%s'},duckduckgo:{n:'DuckDuckGo',url:'https://duckduckgo.com/?q=%s'},brave:{n:'Brave Search',url:'https://search.brave.com/search?q=%s'},ecosia:{n:'Ecosia',url:'https://www.ecosia.org/search?q=%s'},yahoo:{n:'Yahoo',url:'https://search.yahoo.com/search?p=%s'},qwant:{n:'Qwant',url:'https://www.qwant.com/?q=%s'},yandex:{n:'Yandex',url:'https://yandex.com/search/?text=%s'}};
const seValid=u=>/^https?:\/\/[^\s]*%s/i.test(u||'');
const searchUrl=q=>{ const se=S.settings.search||{}, tpl=se.engine==='custom'&&seValid(se.custom)?se.custom:(SE[se.engine]||SE.googleweb).url; return tpl.replace('%s',()=>encodeURIComponent(q)); };
function go(input){
  input=input.trim(); if(!input) return; const t=T();
  const search=!isUrl(input);   // panel asystenta nie wysuwa się już sam: otwiera się przyciskiem lub skrótem
  t.url=search?searchUrl(input):(/^https?:/i.test(input)?input:'https://'+input);
  if(views[t.id]) views[t.id].setAttribute('src',t.url);
  activate(t.id);
}
url.addEventListener('keydown',e=>{ if(e.key==='Enter'){ go(url.value); url.blur(); } });
url.addEventListener('blur',setUrlBar);
$('hs').addEventListener('keydown',e=>{ if(e.key==='Enter'){ go(e.target.value); e.target.value=''; } });
document.querySelectorAll('.tile').forEach(x=>x.onclick=()=>go(x.dataset.u));
const V=()=>views[T()?.id];
$('back').onclick=()=>V()?.canGoBack()&&V().goBack();
$('fwd').onclick=()=>V()?.canGoForward()&&V().goForward();
$('reload').onclick=()=>V()?.reload();
function goHome(){ const t=T(); t.url=''; t.title=''; t.icon=''; if(views[t.id]){ views[t.id].remove(); delete views[t.id]; } activate(t.id); }
$('brand').onclick=goHome;
$('toggle').onclick=togglePanel;
$('close').onclick=()=>setPanel(false);
const ACTS={
  'new-tab':()=>newTab(),'close-tab':()=>closeTab(F().active),'dup-tab':()=>dupTab(F().active),'reload-tab':()=>reloadTab(F().active),
  'pin-tab':()=>pinTab(F().active),'mute-tab':()=>muteTab(F().active),'restore-tab':restoreTab,
  'close-all':closeAll,'reload-all':reloadAll,'pin-all':pinAll,'mute-all':muteAll,
  'next-tab':()=>cycle(1),'prev-tab':()=>cycle(-1),'focus-url':()=>{ url.focus(); url.select(); },
  'back':()=>$('back').onclick(),'forward':()=>$('fwd').onclick(),'go-home':goHome,
  'new-folder':addFolder,'dup-folder':()=>dupFolder(S.cur),'rename-folder':()=>{ editing=S.cur; renderSide(); },
  'next-folder':()=>cycleF(1),'prev-folder':()=>cycleF(-1),'settings':()=>toggleSet(),'toggle-panel':togglePanel,'history':()=>toggleHist()
};
const act=a=>{ if(ACTS[a]) ACTS[a](); };
try{window.api.onShortcut(act)}catch(e){console.warn('Zły preload.js',e)}
try{window.api.onOpenTab(u=>newTab(u))}catch(e){console.warn('Zły preload.js – podmień go na nowy',e)}
split.addEventListener('mousedown',e=>{ e.preventDefault(); document.body.classList.add('dragging'); split.classList.add('drag');
  const mv=ev=>{ S.pw=Math.round(Math.min(Math.max(innerWidth-ev.clientX,300),innerWidth*0.7)); pwSet(); };
  const up=()=>{ document.body.classList.remove('dragging'); split.classList.remove('drag'); removeEventListener('mousemove',mv); removeEventListener('mouseup',up); save(); };
  addEventListener('mousemove',mv); addEventListener('mouseup',up); });

// ---------- efekty tła ----------
const cv=$('bg'), cx=cv.getContext('2d'); let W=0,H=0,last=0;
new ResizeObserver(()=>{ const w=cv.clientWidth, h=cv.clientHeight; if(w===W&&h===H) return; W=cv.width=w; H=cv.height=h; draw(performance.now()); }).observe(cv);  // po zmianie rozmiaru płótno jest czyszczone, więc rysujemy od razu
const rnd=Math.random;
const DUST=Array.from({length:140},(_,i)=>({x:rnd(),y:rnd(),r:1+rnd()*2.6,v:.00005+rnd()*.00011,p:rnd()*6.28,c:i%3}));
const STARS=Array.from({length:120},()=>({x:rnd(),y:rnd(),r:.5+rnd()*1.1,p:rnd()*6.28,sp:.4+rnd()*1.2}));
const RAIN=Array.from({length:90},()=>({x:rnd(),y:rnd(),l:.03+rnd()*.05,v:.0003+rnd()*.0005}));
const fxv=k=>S.settings.fx[k]/100*S.settings.fx.all/100;
// sprite'y poświat (jedna tekstura na kolor zamiast gradientu na cząstkę i klatkę)
const GSP=new Map();
function glowSp(c,n){ const k=c+'|'+n; let s=GSP.get(k); if(!s){ if(GSP.size>40) GSP.clear(); s=document.createElement('canvas'); s.width=s.height=n; const x=s.getContext('2d'), m=n/2, g=x.createRadialGradient(m,m,0,m,m,m); g.addColorStop(0,`rgba(${c},1)`); g.addColorStop(1,`rgba(${c},0)`); x.fillStyle=g; x.fillRect(0,0,n,n); GSP.set(k,s); } return s; }
let bgIdle=false, bgLast=0;
function frame(t){ requestAnimationFrame(frame); if(t-bgLast<28) return; bgLast=t; draw(t); }   // ~30 kl./s wystarcza dla powolnych efektów
function draw(t){
  const dt=Math.min(50,(t-last)||16); last=t;
  if(home.style.display==='none'||!W) return;
  const fa=fxv('aurora'), fw=fxv('waves'), fs=fxv('stars'), fr=fxv('rain'), fd=fxv('dust');
  if(!(fa>0||fw>0||fs>0||fr>0||fd>0)){ if(!bgIdle){ cx.clearRect(0,0,W,H); bgIdle=true; } return; }   // bez efektów nic nie rysujemy
  bgIdle=false; cx.clearRect(0,0,W,H);
  const C=[accRgb,acc2Rgb,fgRgb]; let a=fa;
  if(a>0){ for(let k=0;k<3;k++){ const x=W*(.2+.3*k+.1*Math.sin(t*.00018+k*2)), y=H*(.22+.12*Math.cos(t*.00013+k*1.7)), g=cx.createRadialGradient(x,y,0,x,y,W*.42); g.addColorStop(0,`rgba(${C[k]},${.28*a})`); g.addColorStop(1,`rgba(${C[k]},0)`); cx.fillStyle=g; cx.fillRect(0,0,W,H); }
    // miękkie zanikanie przy bocznych krawędziach: poświata nie jest już ucinana na styku z paskiem
    const ew=Math.round(W*.16); cx.globalCompositeOperation='destination-out';
    let ge=cx.createLinearGradient(0,0,ew,0); ge.addColorStop(0,'rgba(0,0,0,1)'); ge.addColorStop(.5,'rgba(0,0,0,.3)'); ge.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=ge; cx.fillRect(0,0,ew,H);
    ge=cx.createLinearGradient(W-ew,0,W,0); ge.addColorStop(0,'rgba(0,0,0,0)'); ge.addColorStop(.5,'rgba(0,0,0,.3)'); ge.addColorStop(1,'rgba(0,0,0,1)'); cx.fillStyle=ge; cx.fillRect(W-ew,0,ew,H);
    cx.globalCompositeOperation='source-over'; }
  a=fw;
  if(a>0) for(let k=0;k<3;k++){ cx.beginPath(); cx.moveTo(0,H); for(let x=0;x<=W;x+=10) cx.lineTo(x,H*(.80+.055*k)+Math.sin(x*.0042+t*.00035*(1+k*.35)+k*2.1)*(10+14*a+k*5)); cx.lineTo(W,H); cx.closePath(); cx.fillStyle=`rgba(${accRgb},${(.05-k*.012)*(.3+1.4*a)})`; cx.fill(); }
  a=fs;
  if(a>0){ const n=Math.ceil(STARS.length*Math.min(1,a*1.2)); for(let i=0;i<n;i++){ const q=STARS[i]; cx.fillStyle=`rgba(${fgRgb},${a*(.15+.85*Math.abs(Math.sin(t*.001*q.sp+q.p)))})`; cx.beginPath(); cx.arc(q.x*W,q.y*H,q.r,0,6.283); cx.fill(); } }
  a=fr;
  if(a>0){ cx.lineWidth=1; cx.strokeStyle=`rgba(${acc2Rgb},${.3*a})`; const n=Math.ceil(RAIN.length*Math.min(1,a*1.2)); cx.beginPath(); for(let i=0;i<n;i++){ const d=RAIN[i]; d.y+=d.v*dt; if(d.y>1.05){ d.y=-.1; d.x=rnd(); } cx.moveTo(d.x*W,d.y*H); cx.lineTo(d.x*W,(d.y+d.l)*H); } cx.stroke(); }   // jedna ścieżka = jedno rysowanie
  a=fd;
  if(a>0){ const n=Math.ceil(DUST.length*Math.min(1,a*1.2)), sp=C.map(c=>glowSp(c,64)), ma=Math.min(1,.4+a); for(let i=0;i<n;i++){ const d=DUST[i]; d.y-=d.v*dt; if(d.y<-.02){ d.y=1.02; d.x=rnd(); }
    const x=(d.x+Math.sin(t*.0003+d.p)*.015)*W, y=d.y*H, R=d.r*5; cx.globalAlpha=(.25+.4*Math.abs(Math.sin(t*.001+d.p)))*ma; cx.drawImage(sp[d.c],x-R,y-R,2*R,2*R); } cx.globalAlpha=1; }
}
requestAnimationFrame(frame);

// ---------- okno dialogowe w stronie ----------
function ask(title,text,ok='OK'){ return new Promise(res=>{
  const m=$('md'); m.querySelector('h3').textContent=title; m.querySelector('p').textContent=text; $('mo').textContent=ok; m.classList.add('open'); $('mo').focus();
  const kd=e=>{ if(e.key==='Escape'){ e.stopPropagation(); done(false); } else if(e.key==='Enter'&&document.activeElement!==$('mc')){ e.preventDefault(); done(true); } };
  const bd=e=>{ if(e.target===m) done(false); };
  const done=v=>{ m.classList.remove('open'); document.removeEventListener('keydown',kd,true); m.removeEventListener('mousedown',bd); res(v); };
  document.addEventListener('keydown',kd,true); m.addEventListener('mousedown',bd); $('mo').onclick=()=>done(true); $('mc').onclick=()=>done(false);
}); }

