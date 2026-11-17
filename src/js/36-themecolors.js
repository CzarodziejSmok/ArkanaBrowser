// ---------- kolory motywu i akcentu (v49 / v49.1) ----------
// Motyw: lista 1–4 kolorów (każdy: kolor RGB, nasycenie, jasność). Z nich powstaje przejście (--tg0/1/2), które CSS kładzie na dużych powierzchniach
// z background-attachment:fixed, więc jest ciągłe w całym oknie. Kształt, intensywność, powtórzenia, ruch i przechodzenie w miejscu to szkic (GD):
// widać go (także w ruchu) w podglądzie, a w aplikacji działa po „Zastosuj”. Kolory i korekty uniwersalne działają od razu.
// Akcent: lista 1–4 kolorów, opcjonalne płynne przechodzenie w czasie, własne korekty uniwersalne.
// Uwaga: dane są zwracane przez funkcje (nie stałe modułu), bo applySettings może zawołać ten kod zanim plik się wykona do końca.
function tmShapes(){ return [['h','Poziomo'],['v','Pionowo'],['dl','Ukośnie ↙'],['dr','Ukośnie ↘'],['rad','Od środka'],['full','Pełny ekran']]; }
function tmInts(){ return [['short','Szybkie'],['mid','Średnie'],['long','Długie']]; }
// kierunki ruchu zależne od kształtu: kolory przesuwają się wzdłuż osi przejścia (poziomo = poziome pasy kolorów płynące w dół/w górę itd.)
function tmDirs(){ return {h:[['down','↓ W dół'],['up','↑ W górę']],v:[['right','→ W prawo'],['left','← W lewo']],dl:[['bl','↙ W lewy dół'],['tr','↗ W prawą górę']],dr:[['br','↘ W prawy dół'],['tl','↖ W lewą górę']],rad:[['out','Na zewnątrz'],['in','Do środka']],full:[['up','↑ W górę'],['down','↓ W dół'],['left','← W lewo'],['right','→ W prawo']]}; }
function tmSlideOk(shape,k){ return !!k&&(tmDirs()[shape]||[]).some(x=>x[0]===k); }
function tmSt(){ return tmSt.s||(tmSt.s={raf:0,t0:performance.now(),last:0}); }
function tmMix(a,b,f){ const A=unhex(a)||[0,0,0], B=unhex(b)||[0,0,0]; return hex(A.map((v,i)=>Math.round(v+(B[i]-v)*f))); }
// przechodzenie w miejscu: łączenia stoją, a kolor każdego pasa płynie w kolejny kolor z listy (phase = liczba kroków kolorów)
function tmFade(cols,phase){ const n=cols.length, k=Math.floor(phase), f=phase-k; return cols.map((_,i)=>tmMix(cols[(i+k)%n],cols[(i+k+1)%n],f)); }
// przejście dla listy kolorów. o: {rep: powtórzenia 1–5, slide: kierunek ruchu lub '', u: faza ruchu 0..1 (jeden okres)}
function gradCss(cols,shape,inten,o){
  o=o||{}; const n=cols.length, solid=c=>`linear-gradient(${c},${c})`; if(n<1) return 'none'; if(n<2) return solid(cols[0]);
  const rep=Math.max(1,Math.min(5,Math.round(o.rep)||1)), hd0=({short:.8,mid:.4,long:0})[inten], hd=hd0===undefined?.4:hd0, u=o.u||0;
  if(shape==='full'){   // cały ekran jednym kolorem; kolejne wsuwają się tylko dzięki ruchowi (przechodzenie w miejscu zmienia sam kolor)
    if(!o.slide) return solid(cols[0]);
    const hz=o.slide==='left'||o.slide==='right', un=hz?'vw':'vh', sg=(o.slide==='right'||o.slide==='down')?1:-1, off=sg*u*n*100;
    return `repeating-linear-gradient(${hz?'to right':'to bottom'},${cols.map((c,i)=>`${c} ${(i*100+off).toFixed(2)}${un} ${((i+1)*100+off).toFixed(2)}${un}`).join(',')})`;
  }
  const dir={h:'to bottom',v:'to right',dl:'to bottom left',dr:'to bottom right'}[shape], rad=shape==='rad', st=[];
  const sg={down:1,right:1,bl:1,br:1,out:1,up:-1,left:-1,tr:-1,tl:-1,in:-1}[o.slide]||1, periodic=rep>1||!!o.slide;
  const cut=Array.isArray(o.cut)&&o.cut.length===n-1?o.cut:null;
  if(cut){   // niestandardowy podział: granice kolorów w podanych miejscach (wskazówka koloru = środek przejścia dokładnie na granicy)
    const P=100/rep, off=o.slide?sg*u*P:0, pos=periodic?(x=>(off+x*P).toFixed(3)+'%'):(x=>(x*100).toFixed(2)+'%'), b=[0,...cut,1], sp=[];
    for(let i=0;i<n;i++){ const len=b[i+1]-b[i], c=(b[i]+b[i+1])/2, h=hd*len/2, s0=c-h, e0=c+h;
      if(i===0&&!periodic){ sp.push(`${cols[0]} ${pos(0)}`); if(h>0) sp.push(`${cols[0]} ${pos(e0)}`); }
      else if(i===n-1&&!periodic){ if(h>0) sp.push(`${cols[i]} ${pos(s0)}`); sp.push(`${cols[i]} ${pos(1)}`); }
      else { sp.push(`${cols[i]} ${pos(s0)}`); if(h>0) sp.push(`${cols[i]} ${pos(e0)}`); }
      if(i<n-1) sp.push(pos(b[i+1])); }
    if(periodic){ const f0=(b[0]+b[1])/2-hd*(b[1]-b[0])/2; sp.push(pos(1)); sp.push(`${cols[0]} ${pos(f0+1)}`); }   // okres kończy się tym samym kolorem co zaczyna, więc powtórzenia i ruch nie mają szwu
    const body=sp.join(',');
    return rad?`${periodic?'repeating-':''}radial-gradient(circle farthest-corner at 50% 50%,${body})`:`${periodic?'repeating-':''}linear-gradient(${dir},${body})`;
  }
  if(!periodic){   // jedno przejście od pierwszego do ostatniego koloru
    cols.forEach((c,i)=>{ if(!hd) st.push(`${c} ${(i/(n-1)*100).toFixed(1)}%`); else { const c0=(i+.5)/n*100, h=hd*100/n/2; st.push(`${c} ${(c0-h).toFixed(1)}%`,`${c} ${(c0+h).toFixed(1)}%`); } });
    return rad?`radial-gradient(circle farthest-corner at 50% 50%,${st.join(',')})`:`linear-gradient(${dir},${st.join(',')})`;
  }
  // okresowe (powtórzenia i/lub ruch): okres = 100%/rep długości przejścia, kolor 1 na początku i na końcu okresu, więc ruch nie ma szwu
  const P=100/rep, off=o.slide?sg*u*P:0, pos=x=>(off+x*P).toFixed(3)+'%', w=hd?hd/n/2:0;
  cols.forEach((c,i)=>{ if(!hd) st.push(`${c} ${pos(i/n)}`); else if(i===0) st.push(`${c} ${pos(0)}`,`${c} ${pos(w)}`); else st.push(`${c} ${pos(i/n-w)}`,`${c} ${pos(i/n+w)}`); });
  if(hd) st.push(`${cols[0]} ${pos(1-w)}`); st.push(`${cols[0]} ${pos(1)}`);
  return rad?`repeating-radial-gradient(circle farthest-corner at 50% 50%,${st.join(',')})`:`repeating-linear-gradient(${dir},${st.join(',')})`;
}
// kolory jednego poziomu (tło / panel / panel2) dla podanej listy kolorów – ta sama matematyka co w applySettings (z korektą uniwersalną)
function themeLv(bgs){
  const cl=bgs.map(b=>{ let [h,s,l]=calcBg(effBg(b,S.settings.bgAdj)); if(INC){ s*=.18; l=l>55?l-9:l*.8; } return [h,s,l]; });
  const light=cl.reduce((a,c)=>a+c[2],0)/cl.length>55, dir=light?-1:1;
  const f=dl=>cl.map(([h,s,l])=>hex(hsl2rgb(h,s,clamp(l+dl*dir,0,100)))); f.light=light; return f;
}
const tmEff=b=>dispCol(effBg(b,S.settings.bgAdj));
// jeden kadr przejścia dla koloru poziomu dl, konfiguracji cfg i czasu sec
function tmOne(cols,cfg,sec){ const n=cols.length; if(cfg.fade&&n>1) cols=tmFade(cols,sec/cfg.spd);
  return gradCss(cols,cfg.shape,cfg.int,{rep:cfg.rep,cut:cfg.cut,slide:tmSlideOk(cfg.shape,cfg.slide)?cfg.slide:'',u:n>1?(sec/(n*cfg.spd))%1:0}); }
const tmCfg=()=>{ const s=S.settings; return {shape:s.bgShape,int:s.bgInt,rep:s.bgRep,slide:s.bgSlide,fade:s.bgFade,spd:s.bgSpd,cut:s.bgCut&&s.bgCut.length===s.bgs.length-1?s.bgCut:null}; };
const tmMoves=c=>c.fade||tmSlideOk(c.shape,c.slide);
function tmAccList(){ const s=S.settings; return s.accs.map(h=>effAcc(h,s.accAdj)); }
function tmAccAt(sec){ const L=tmAccList(), n=L.length, ph=sec/S.settings.accSpd, k=Math.floor(ph), f=ph-k, A=L[k%n], B=L[(k+1)%n]; return A.map((v,i)=>Math.round(v+(B[i]-v)*f)); }
function tmSec(){ return (performance.now()-tmSt().t0)/1000; }
// malowanie: przejścia motywu i (przy przechodzeniu w czasie) akcent. Wołane z applySettings oraz z pętli animacji.
// Wydajność (v49.8): kolory poziomów (themeLv) liczymy tylko po zmianie kolorów lub korekty, a zmienne CSS ustawiamy tylko, gdy ich wartość naprawdę się zmieniła
// (np. przy samym przechodzeniu akcentu przejście motywu stoi, więc przeglądarka nie przelicza stylów dużych powierzchni co klatkę).
function tmLv(bs){ const T=tmSt(), k=JSON.stringify(bs)+'|'+JSON.stringify(S.settings.bgAdj); if(T.lk!==k){ const L=themeLv(bs); T.lk=k; T.lv={light:L.light,c:[0,3.7,7.4].map(dl=>L(dl))}; } return T.lv; }
function tmProp(r,k,v){ const T=tmSt(), pv=T.pv||(T.pv={}); if(pv[k]===v) return; pv[k]=v; r.setProperty(k,v); }
function tmPaint(sec,fast){
  const s=S.settings, r=document.documentElement.style, bs=fast&&Array.isArray(s.bgs)&&s.bgs.length?s.bgs:fixBgs();   // fast = klatka animacji: ustawienia są już znormalizowane przez applySettings
  const multi=bs.length>1;
  if(!multi) [0,1,2].forEach(i=>tmProp(r,'--tg'+i,'none'));
  else { const L=tmLv(bs), cfg=tmCfg(); L.c.forEach((cols,i)=>tmProp(r,'--tg'+i,tmOne(cols,cfg,sec))); tmProp(r,'--tgov',L.light?'rgba(0,0,0,.045)':'rgba(255,255,255,.045)'); }
  if(document.body){ document.body.classList.toggle('tgx',multi); if(multi&&!$('tgl')){ const e=document.createElement('div'); e.id='tgl'; document.body.insertBefore(e,document.body.firstChild); } }
  if(s.accFade&&s.accs.length>1) accApply(tmAccAt(sec));
}
function tmPrevCfg(){ const d=gd(); return {shape:d.shape,int:d.int,rep:d.rep,slide:d.slide,fade:d.fade,spd:d.spd,cut:d.cut}; }
function tmPrevCss(sec){ const d=gd(), bs=d.ord.map(i=>S.settings.bgs[i]), L=themeLv(bs), cfg=tmPrevCfg();
  return [0,3.7].map(dl=>bs.length<2?`linear-gradient(${L(dl)[0]},${L(dl)[0]})`:tmOne(L(dl),cfg,sec)); }
function tmPreview(sec){ const g=$('gprev'); if(!g) return; const [m,p]=tmPrevCss(sec); g.style.background=m; g.firstChild.style.background=p; }
function tmNeeds(){ const s=S.settings, app=(s.bgs.length>1&&tmMoves(tmCfg()))||(s.accFade&&s.accs.length>1), prev=!!$('gprev')&&S.settings.bgs.length>1&&tmMoves(tmPrevCfg()); return {app,prev}; }
function tmLoop(ts){ const T=tmSt(); T.raf=0; let nd; try{ nd=tmNeeds(); }catch{ return; } if(!nd.app&&!nd.prev) return;
  if(fr30(T,ts)){ T.last=ts; const sec=tmSec(); if(nd.app) tmPaint(sec,true); if(nd.prev) tmPreview(sec); }
  T.raf=requestAnimationFrame(tmLoop); }
function tmSync(){ try{ const T=tmSt(), sec=tmSec(); tmPaint(sec); const nd=tmNeeds(); if((nd.app||nd.prev)&&!T.raf) T.raf=requestAnimationFrame(tmLoop); }catch{} }
// ----- szkic ustawień przejść (podgląd przed zatwierdzeniem) -----
function gd(){ const s=S.settings; if(!GD_()||GD_().n!==s.bgs.length) GD_(null,{n:s.bgs.length,cut:(s.bgCut&&s.bgCut.length===s.bgs.length-1)?s.bgCut.slice():null,shape:s.bgShape,int:s.bgInt,rep:s.bgRep,slide:tmSlideOk(s.bgShape,s.bgSlide)?s.bgSlide:'',fade:s.bgFade,spd:s.bgSpd,ord:s.bgs.map((_,i)=>i)}); return GD_(); }
function GD_(clear,v){ if(v) GD_.v=v; else if(clear===null) GD_.v=null; return GD_.v; }
const gdDirty=()=>{ const d=gd(), s=S.settings; return d.shape!==s.bgShape||d.int!==s.bgInt||d.rep!==s.bgRep||d.slide!==(tmSlideOk(s.bgShape,s.bgSlide)?s.bgSlide:'')||d.fade!==s.bgFade||d.spd!==s.bgSpd||d.ord.some((v,i)=>v!==i)||JSON.stringify(d.cut)!==JSON.stringify((s.bgCut&&s.bgCut.length===s.bgs.length-1)?s.bgCut:null); };
function gdCommit(){ const d=gd(), s=S.settings; if(!gdDirty()) return; const old=s.bgs, sel=d.ord.indexOf(s.bgSel);
  s.bgs=d.ord.map(i=>old[i]); s.bgSel=Math.max(0,sel); s.bgShape=d.shape; s.bgInt=d.int; s.bgRep=d.rep; s.bgSlide=d.slide; s.bgFade=d.fade; s.bgSpd=d.spd; s.bgCut=(d.cut&&d.cut.length===s.bgs.length-1)?d.cut.slice():[]; GD_(null); }
function gprevHtml(){ const [m,p]=tmPrevCss(tmSec()); return `<div class="gprev" id="gprev" style="background:${m}"><i class="gpl" style="background:${p}"></i></div>`; }
function themeRefresh(){
  tmPreview(tmSec());
  S.settings.bgs.forEach((b,i)=>{ const e=$('set').querySelector(`.tch[data-l="bg"][data-i="${i}"] .tcs`); if(e) e.style.background=tmEff(b); });
  S.settings.accs.forEach((h,i)=>{ const e=$('set').querySelector(`.tch[data-l="ac"][data-i="${i}"] .tcs`); if(e) e.style.background=hex(effAcc(h,S.settings.accAdj)); });
  const d=gd(), bsd=d.ord.map(i=>S.settings.bgs[i]).map(tmEff);
  $('set').querySelectorAll('.gsb[data-gs],.gsb[data-gi]').forEach(e=>{ const i=e.firstChild; if(!i||i.tagName!=='I') return; i.style.background=e.dataset.gs==='full'?fullIco(bsd):gradCss(bsd,e.dataset.gs||d.shape,e.dataset.gi||d.int,{rep:1}); });
}
const fullIco=cs=>`linear-gradient(to right,${cs.map((c,i)=>`${c} ${(i/cs.length*100).toFixed(0)}% ${((i+1)/cs.length*100).toFixed(0)}%`).join(',')})`;
const slG=(k,label,min,max,val,unit)=>`<div class="sr"><span>${label}<b>${val}${unit||''}</b></span><div class="rg" data-k="gs"><i class="tr"></i><i class="fl"></i><input type="range" data-g="${k}" min="${min}" max="${max}" step="1" value="${val}"></div></div>`;
const adjHtml=k=>{ const a=S.settings[k+'Adj'], nm=k==='bg'?'MOTYWU':'AKCENTU';
  return `<h5>KOREKTA WSZYSTKICH KOLORÓW ${nm}</h5><p class="hint">Przesuwa jasność, nasycenie i składowe RGB każdego koloru o podaną wartość (nie ustawia ich na stałe). Gdy któryś kolor dojdzie do granicy zakresu, zostaje na niej.</p>
  ${sl(k+'Adj.bri','Jasność',-100,100,a.bri,'adj')}${sl(k+'Adj.sat','Nasycenie',-100,100,a.sat,'adj')}${sl(k+'Adj.r','R — czerwony',-255,255,a.r,'adj')}${sl(k+'Adj.g','G — zielony',-255,255,a.g,'adj')}${sl(k+'Adj.b','B — niebieski',-255,255,a.b,'adj')}
  <button class="seb" data-adjr="${k}" style="margin-top:6px">Zeruj korektę</button>`; };
function themeColorsHtml(){
  const st=S.settings, d=gd(), bgs=st.bgs, n=bgs.length, b=curBg();
  const rows=d.ord.map((i,pos)=>{ const c=bgs[i], open=i===st.bgSel;
    const body=open?`<div class="tcb"><div class="sw">${SW.map((q,k)=>`<i data-sw="${k}" style="background:${swCol(q)}"></i>`).join('')}</div>
      ${sl('bg.sat','Nasycenie',0,100,b.sat,'sat')}${sl('bg.bri','Jasność',0,100,b.bri,'bri')}
      <label class="ck"><input type="checkbox" id="adv" ${st.adv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
      <div class="ad ${st.adv?'open':''}"><div class="adi"><div id="rgb">${sl('bg.r','R — czerwony',0,255,b.r,'r')}${sl('bg.g','G — zielony',0,255,b.g,'g')}${sl('bg.b','B — niebieski',0,255,b.b,'b')}<input id="hx" value="${hex([b.r,b.g,b.b])}" maxlength="7"><p class="hint">Każdy suwak działa niezależnie. Nasycenie i jasność są korektą nałożoną na kolor z RGB.</p></div></div></div></div>`:'';
    return `<div class="tci${open?' open':''}" data-l="bg" data-i="${i}"><div class="tch" data-l="bg" data-i="${i}" draggable="${n>1}"><span class="tdr" title="Przeciągnij, aby zmienić kolejność">⠿</span><i class="tcs" style="background:${tmEff(c)}"></i><b><span>Kolor</span> ${pos+1}</b><button class="tce" data-l="bg" data-i="${i}" title="Pipeta: wybierz kolor z ekranu">${EYD_ICON}</button><button class="tcx" data-l="bg" data-i="${i}" title="Usuń kolor" ${n<2?'disabled':''}>×</button></div>${body}</div>`; }).join('');
  const bsd=d.ord.map(i=>bgs[i]).map(tmEff), full=d.shape==='full', dirs=tmDirs()[d.shape]||[];
  const multi=n>1?`<h5>PRZEJŚCIA KOLORÓW</h5><p class="hint">Kształt przejścia kolorów (kolejność kolorów na liście to kolejność w aplikacji):</p>
    <div class="gsr">${tmShapes().map(([k,l])=>`<button class="gsb${d.shape===k?' on':''}" data-gs="${k}"><i style="background:${k==='full'?fullIco(bsd):gradCss(bsd,k,d.int,{rep:1})}"></i><span>${l}</span></button>`).join('')}</div>
    ${full?'':`    <p class="hint">Intensywność przejść:</p><div class="gsr g3">${tmInts().map(([k,l])=>`<button class="gsb${d.int===k?' on':''}" data-gi="${k}"><i style="background:${gradCss(bsd,d.shape,k,{rep:1})}"></i><span>${l}</span></button>`).join('')}</div>
    <p class="hint">Szybkie: większość ekranu w jednym z kolorów. Średnie: złoty środek. Długie: prawie każdy punkt to mieszanka dwóch kolorów.</p>
    ${slG('rep','Powtórzenia przejścia',1,5,d.rep,'×')}<p class="hint">Ile razy cała kolejność kolorów powtarza się na obszarze aplikacji (np. 1→2→3→4→1→2→3→4).</p>`}
    <h5>RUCH KOLORÓW</h5><p class="hint">${full?'W trybie pełnego ekranu widać tylko jeden kolor, a pozostałe pokazuje ruch lub przechodzenie.':'Kierunek przesuwania się kolorów:'}</p>
    <div class="gsr gdr"><button class="gsb tx${d.slide?'':' on'}" data-gd=""><span>Wyłączony</span></button>${dirs.map(([k,l])=>`<button class="gsb tx${d.slide===k?' on':''}" data-gd="${k}"><span>${l}</span></button>`).join('')}</div>
    <label class="ck"><input type="checkbox" id="gfade" ${d.fade?'checked':''}><span class="tg"></span>Przechodzenie kolorów w miejscu (łączenia stoją, kolory płyną jeden w drugi)</label>
    ${d.fade||d.slide?slG('spd','Czas przejścia jednego koloru',1,60,d.spd,' s'):''}
    <h5>PODGLĄD</h5>${gprevHtml()}
    ${full?'':`<div class="gsr gdr cutrow"><button class="gsb tx sm${d.cut?'':' on'}" data-gcut="eq"><span>Równy podział</span></button><button class="gsb tx sm${d.cut?' on':''}" data-gcut="edit"><span>Niestandardowy podział…</span></button></div>${d.cut?`<p class="hint"><span>Linie podziału:</span> <b>${d.cut.map(v=>Math.round(v*100)+'%').join(', ')}</b></p>`:''}`}
    <div class="gap${gdDirty()?' open':''}"><button id="gap" class="seb on">Zastosuj</button><button id="gcn" class="seb">Cofnij</button></div>
    <p class="hint">Podgląd pokazuje tło oraz górny i lewy pasek (z ruchem, jeśli jest włączony). Kształt, intensywność, powtórzenia, ruch i czas działają w aplikacji po kliknięciu „Zastosuj”.</p>`:'';
  return `<h5>KOLORY MOTYWU</h5><p class="hint">Do 4 kolorów motywu. Kliknij kolor, aby edytować jego barwę, nasycenie i jasność. Kolejność zmienisz przeciągając ⠿.</p>
    <div class="tcl" id="tcl">${rows}</div>${n<4?'<button id="tcadd" class="seb">+ Dodaj kolor</button>':''}${multi}${adjHtml('bg')}`;
}
function accentHtml(){
  const st=S.settings, n=st.accs.length, cur=accGet(), a=unhex(cur)||[232,130,90];
  const rows=st.accs.map((h,i)=>{ const open=i===st.accSel;
    const body=open?`<div class="tcb"><div class="sw">${AC.map(c=>`<i data-ac="${c}" style="background:${c}"></i>`).join('')}</div>
      <label class="ck"><input type="checkbox" id="accadv" ${st.accAdv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
      <div class="ad ${st.accAdv?'open':''}" id="accad"><div class="adi"><div id="argb">${sla('r','R — czerwony',a[0])+sla('g','G — zielony',a[1])+sla('b','B — niebieski',a[2])}<input id="ahx" value="${cur}" maxlength="7"></div></div></div></div>`:'';
    return `<div class="tci${open?' open':''}" data-l="ac" data-i="${i}"><div class="tch" data-l="ac" data-i="${i}" draggable="${n>1}"><span class="tdr" title="Przeciągnij, aby zmienić kolejność">⠿</span><i class="tcs" style="background:${hex(effAcc(h,st.accAdj))}"></i><b><span>Kolor</span> ${i+1}</b><button class="tce" data-l="ac" data-i="${i}" title="Pipeta: wybierz kolor z ekranu">${EYD_ICON}</button><button class="tcx" data-l="ac" data-i="${i}" title="Usuń kolor" ${n<2?'disabled':''}>×</button></div>${body}</div>`; }).join('');
  return `<h5>KOLOR AKCENTU</h5><p class="hint">Do 4 kolorów akcentu. Bez przechodzenia w czasie akcentem jest pierwszy kolor z listy.</p>
    <div class="tcl">${rows}</div>${n<4?'<button id="acadd" class="seb">+ Dodaj kolor</button>':''}
    ${n>1?`<label class="ck"><input type="checkbox" id="accfade" ${st.accFade?'checked':''}><span class="tg"></span>Przechodzenie kolorów akcentu w czasie</label>
    ${st.accFade?slG('accspd','Czas przejścia jednego koloru',1,120,st.accSpd,' s'):''}`:''}${adjHtml('acc')}`;
}
function themeApply(){ renderSet(); applySettings(); save(); }
// ----- zdarzenia -----
$('set').addEventListener('click',e=>{
  const t=e.target; if(!t.closest) return;
  const pe=t.closest('.tce'); if(pe){ eyedrop(pe.dataset.l,+pe.dataset.i); return; }
  const x=t.closest('.tcx'), h=t.closest('.tch'), gs=t.closest('[data-gs]'), gi=t.closest('[data-gi]'), gdr=t.closest('[data-gd]'), ar=t.closest('[data-adjr]');
  if(x){ if(x.disabled) return; const i=+x.dataset.i, s=S.settings;
    if(x.dataset.l==='ac'){ if(s.accs.length<2) return; s.accs.splice(i,1); if(s.accSel>=i&&s.accSel>0) s.accSel--; s.acc=s.accs[0]; themeApply(); }
    else { gdCommit(); if(s.bgs.length<2) return; s.bgs.splice(i,1); s.bgCut=[]; if(s.bgSel>=i&&s.bgSel>0) s.bgSel--; GD_(null); themeApply(); } }
  else if(h){ const i=+h.dataset.i, k=h.dataset.l==='ac'?'accSel':'bgSel'; if(S.settings[k]===i) return; S.settings[k]=i; renderSet(); }
  else if(t.id==='tcadd'){ gdCommit(); const s=S.settings; if(s.bgs.length>=4) return; const b=curBg(), q=rgb2hsl(b.r,b.g,b.b), nh=(q[0]+60)%360, c=q[1]<8?hsl2rgb(SW[3][0],SW[3][1],SW[3][2]):hsl2rgb(nh,Math.max(q[1],35),q[2]);
    s.bgs.push({r:c[0],g:c[1],b:c[2],hold:q[1]<8?SW[3][0]:nh,sat:50,bri:50}); s.bgSel=s.bgs.length-1; s.bgCut=[]; GD_(null); themeApply(); }
  else if(t.id==='acadd'){ const s=S.settings; if(s.accs.length>=4) return; const q=rgb2hsl(...(unhex(accGet())||[232,130,90])), c=hsl2rgb((q[0]+70)%360,Math.max(q[1],45),Math.min(Math.max(q[2],45),65));
    s.accs.push(hex(c)); s.accSel=s.accs.length-1; themeApply(); }
  else if(gs){ const d=gd(); d.shape=gs.dataset.gs; if(d.slide&&!tmSlideOk(d.shape,d.slide)) d.slide=tmDirs()[d.shape][0][0]; renderSet(); }
  else if(gi){ gd().int=gi.dataset.gi; renderSet(); }
  else if(t.closest('[data-gcut]')){ const k=t.closest('[data-gcut]').dataset.gcut; if(k==='eq'){ gd().cut=null; renderSet(); } else cutOpen(); }
  else if(gdr){ gd().slide=gdr.dataset.gd; renderSet(); }
  else if(ar){ S.settings[ar.dataset.adjr+'Adj']={bri:0,sat:0,r:0,g:0,b:0}; themeApply(); }
  else if(t.id==='gap'){ gdCommit(); themeApply(); }
  else if(t.id==='gcn'){ GD_(null); renderSet(); }
});
$('set').addEventListener('change',e=>{
  if(e.target.id==='gfade'){ gd().fade=e.target.checked; renderSet(); }
  else if(e.target.id==='accfade'){ S.settings.accFade=e.target.checked; themeApply(); }
});
$('set').addEventListener('input',e=>{ const t=e.target, g=t.dataset&&t.dataset.g; if(!g) return; const v=+t.value, b=t.closest('.sr').querySelector('b');
  if(g==='accspd'){ S.settings.accSpd=v; b.textContent=v+' s'; applySettings(); saveSoon(); }
  else { const d=gd(); d[g]=v; b.textContent=g==='rep'?v+'×':v+' s'; const gp=$('set').querySelector('.gap'); if(gp) gp.classList.toggle('open',gdDirty()); tmSync(); }
  paintSliders(); });
// zmiana kolejności kolorów (motyw: szkic do „Zastosuj”; akcent: od razu): przeciągnięcie nagłówka wiersza
(function(){
  let from=null; const clr=()=>$('set').querySelectorAll('.tci').forEach(e=>e.classList.remove('dro-t','dro-b','dragging'));
  $('set').addEventListener('dragstart',e=>{ const h=e.target.closest&&e.target.closest('.tch'); if(!h||h.getAttribute('draggable')!=='true') return; from={l:h.dataset.l,i:+h.dataset.i}; e.dataTransfer.effectAllowed='move'; try{ e.dataTransfer.setData('text/plain',String(from.i)); }catch{} h.parentNode.classList.add('dragging'); });
  $('set').addEventListener('dragover',e=>{ if(!from) return; const r=e.target.closest&&e.target.closest('.tci'); if(!r||r.dataset.l!==from.l) return; e.preventDefault(); e.dataTransfer.dropEffect='move';
    const hd=r.querySelector('.tch').getBoundingClientRect(), top=e.clientY<hd.top+hd.height/2; $('set').querySelectorAll('.tci').forEach(x=>x.classList.remove('dro-t','dro-b')); if(+r.dataset.i!==from.i) r.classList.add(top?'dro-t':'dro-b'); });
  $('set').addEventListener('drop',e=>{ if(!from) return; const r=e.target.closest&&e.target.closest('.tci'); if(!r||r.dataset.l!==from.l) return; e.preventDefault();
    const hd=r.querySelector('.tch').getBoundingClientRect(), top=e.clientY<hd.top+hd.height/2, to=+r.dataset.i, s=S.settings; clr();
    const move=ord=>{ ord.splice(ord.indexOf(from.i),1); let p=ord.indexOf(to); if(!top) p++; ord.splice(p,0,from.i); return ord; };
    if(to!==from.i){ if(from.l==='bg') move(gd().ord); else { const ord=move(s.accs.map((_,i)=>i)); s.accs=ord.map(i=>s.accs[i]); s.accSel=ord.indexOf(s.accSel); s.acc=s.accs[0]; from=null; themeApply(); return; } }
    from=null; renderSet(); });
  $('set').addEventListener('dragend',()=>{ from=null; clr(); });
})();
tmSync();

// ----- edytor niestandardowego podziału: prostokąt o proporcjach okna, linia podąża za kursorem, kliknięcie stawia ją na stałe -----
// Położenie granicy = pozycja wzdłuż przejścia (0–1): poziomo/pionowo to odległość od krawędzi, ukośnie rzut na oś przejścia (CSS „to bottom right/left”), od środka promień/promień do najdalszego rogu.
function cutT(shape,x,y,W,H){
  if(shape==='h') return y/H; if(shape==='v') return x/W;
  if(shape==='dr') return (x*H+y*W)/(2*W*H); if(shape==='dl') return ((W-x)*H+y*W)/(2*W*H);
  return Math.hypot(x-W/2,y-H/2)/Math.hypot(W/2,H/2);
}
function cutLine(shape,t,W,H,cls){   // linia stałej wartości t (izolinia), przycięta do prostokąta
  if(shape==='h') return `<line class="${cls}" x1="0" y1="${t*H}" x2="${W}" y2="${t*H}"/>`;
  if(shape==='v') return `<line class="${cls}" x1="${t*W}" y1="0" x2="${t*W}" y2="${H}"/>`;
  if(shape==='rad') return `<circle class="${cls}" cx="${W/2}" cy="${H/2}" r="${t*Math.hypot(W/2,H/2)}"/>`;
  const pts=[], add=(x,y)=>{ if(x>=-1e-6&&x<=W+1e-6&&y>=-1e-6&&y<=H+1e-6) pts.push([x,y]); };
  if(shape==='dr'){ add(0,2*t*H); add(W,(2*t-1)*H); add(2*t*W,0); add((2*t-1)*W,H); }
  else { add(0,(2*t-1)*H); add(W,2*t*H); add((1-2*t)*W,0); add(2*W*(1-t),H); }
  if(pts.length<2) return ''; let a=pts[0], b=pts[0], dm=-1; for(const p of pts) for(const q of pts){ const d=Math.hypot(p[0]-q[0],p[1]-q[1]); if(d>dm){ dm=d; a=p; b=q; } }
  return `<line class="${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
}
function cutOpen(){
  const d=gd(), n=d.ord.length, shape=d.shape; if(n<2||shape==='full'||$('cutm')) return;
  const need=n-1, W=Math.max(320,innerWidth), H=Math.max(240,innerHeight), bs=d.ord.map(i=>S.settings.bgs[i]), L=themeLv(bs);
  let placed=[], hov=null, rep=d.rep;
  const m=document.createElement('div'); m.id='cutm';
  m.innerHTML=`<div class="cutp"><h4>Niestandardowy podział</h4><p class="hint">Kliknij w prostokącie, aby postawić linię podziału. Linia podąża za kursorem, a podgląd pokazuje wygląd podziału w tym miejscu.</p><p class="hint" id="cuth"></p>
    <div class="sr"><span><span>Powtórzenia przejścia</span> <b id="cutrv"></b></span><div class="rg" data-k="gs"><i class="tr"></i><i class="fl"></i><input type="range" id="cutrep" min="1" max="5" step="1" value="${d.rep}"></div></div>
    <p class="hint">Granica jest ustawiana raz w obrębie jednego przejścia, a linie pokazują jej położenie w każdym powtórzeniu (np. 1/3 przejścia to 1/6 ekranu przy 2 powtórzeniach i 1/9 przy 3).</p>
    <div class="cutw"><div class="cutr" id="cutr"><svg id="cuts" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"></svg></div></div>
    <div class="gap open"><button id="cutu" class="seb">Cofnij</button><button id="cutok" class="seb on">Zatwierdź</button><button id="cutx" class="seb">Anuluj</button></div></div>`;
  document.body.appendChild(m);
  const r=m.querySelector('#cutr'), sv=m.querySelector('#cuts'), hint=m.querySelector('#cuth'), okb=m.querySelector('#cutok'), unb=m.querySelector('#cutu');
  const sc=Math.min(Math.min(innerWidth*.86,1100)/W,(innerHeight*.58)/H); r.style.width=Math.round(W*sc)+'px'; r.style.height=Math.round(H*sc)+'px';
  const lines=(t,cls)=>Array.from({length:rep},(_,k)=>cutLine(shape,(t+k)/rep,W,H,cls)).join('');   // granica w każdym powtórzeniu: (t+k)/rep wzdłuż całego przejścia
  const fill=c=>{ const a=c.slice().sort((p,q)=>p-q); const mx=a.length?a[a.length-1]:0, rem=need-a.length; for(let j=0;j<rem;j++) a.push(mx+(1-mx)*(j+1)/(rem+1)); return a.sort((p,q)=>p-q); };
  const upd=()=>{
    const cur=hov!==null&&placed.length<need?placed.concat([hov]):placed;
    r.style.background=gradCss(L(0),shape,d.int,{cut:fill(cur),rep});
    sv.innerHTML=placed.map(t=>lines(t,'cl')).join('')+(hov!==null&&placed.length<need?lines(hov,'hl'):'');
    const rv=m.querySelector('#cutrv'); rv.textContent=rep+'×'; m.querySelector('#cutrep').parentNode.style.setProperty('--v',(rep-1)/4*100);
    hint.innerHTML=placed.length<need?`<span>Pozostało linii do postawienia:</span> <b>${need-placed.length}</b>`:'<span>Wszystkie linie postawione. Zatwierdź albo cofnij ostatnią.</span>';
    okb.disabled=placed.length<need; okb.style.opacity=okb.disabled?.45:1; unb.disabled=!placed.length; unb.style.opacity=unb.disabled?.45:1; };
  const tAt=e=>{ const b=r.getBoundingClientRect(); const x=Math.min(W,Math.max(0,(e.clientX-b.left)/b.width*W)), y=Math.min(H,Math.max(0,(e.clientY-b.top)/b.height*H)); const raw=Math.min(1,Math.max(0,cutT(shape,x,y,W,H))); return Math.min(.98,Math.max(.02,(raw*rep)%1||0.02)); };   // położenie kursora → ułamek jednego przejścia (przy powtórzeniach tylko jego część ekranu)
  const close=()=>{ document.removeEventListener('keydown',kd,true); m.remove(); };
  const kd=e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } };
  document.addEventListener('keydown',kd,true);
  r.addEventListener('mousemove',e=>{ hov=tAt(e); upd(); });
  r.addEventListener('mouseleave',()=>{ hov=null; upd(); });
  r.addEventListener('click',e=>{ if(placed.length<need){ placed.push(tAt(e)); hov=null; upd(); } });
  m.querySelector('#cutrep').addEventListener('input',e=>{ rep=d.rep=+e.target.value; upd(); });
  unb.onclick=()=>{ placed.pop(); upd(); };
  okb.onclick=()=>{ if(placed.length<need) return; d.cut=placed.slice().sort((p,q)=>p-q); close(); renderSet(); };
  m.querySelector('#cutx').onclick=close;
  m.addEventListener('mousedown',e=>{ if(e.target===m) close(); });
  upd();
}
