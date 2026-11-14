// ---------- ustawienia: każdy parametr jest niezależny ----------
let P={}, accRgb='232,130,90', acc2Rgb='242,179,107', fgRgb='245,237,227', svT, gT;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function hsl2rgb(h,s,l){ s/=100; l/=100; const a=s*Math.min(l,1-l), f=n=>{ const k=(n+h/30)%12; return l-a*Math.max(-1,Math.min(k-3,9-k,1)); }; return [f(0),f(8),f(4)].map(x=>Math.round(x*255)); }
function rgb2hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn, l=(mx+mn)/2; let h=0,s=0;
  if(d){ s=d/(1-Math.abs(2*l-1)); h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4; h=(h*60+360)%360; } return [h,s*100,l*100]; }
const hex=a=>'#'+a.map(x=>x.toString(16).padStart(2,'0')).join('');
const unhex=h=>{ const m=/^#?([0-9a-f]{6})$/i.exec(String(h).trim()); return m?[0,2,4].map(i=>parseInt(m[1].substr(i,2),16)):null; };
const saveSoon=()=>{ clearTimeout(svT); svT=setTimeout(save,300); };
const setPath=(p,v)=>{ const k=p.split('.'); S.settings[k[0]][k[1]]=v; };
// kolor bazowy (R,G,B) + korekty nasycenia i jasności, z których żadna nie zmienia pozostałych
function calcBg(b){ const q=rgb2hsl(b.r,b.g,b.b), h=q[1]>.5?q[0]:b.hold; return [h,clamp(q[1]+(b.sat-50)*2,0,100),clamp(q[2]+(b.bri-50)*.8,0,100)]; }
function applySettings(){
  applyUi();
  const st=S.settings, [h,s,l]=calcBg(st.bg), light=l>55, dir=light?-1:1;
  const col=(dl,ds=1,ll=l)=>hex(hsl2rgb(h,s*ds,clamp(ll+dl*dir,0,100))), lg=Math.min(l,40);
  P={bg:col(0),panel:col(3.7),panel2:col(7.4),line:col(12,.9),mut:hex(hsl2rgb(h,Math.min(s,12),light?36:62)),fg:light?'#1b1612':'#f5ede3',
     gbg:hex(hsl2rgb(h,s,lg)),gpanel:hex(hsl2rgb(h,s,lg+3.7)),gline:hex(hsl2rgb(h,s*.9,lg+12))};
  fgRgb=light?'27,22,18':'245,237,227';
  const ar=unhex(st.acc)||[232,130,90], ah=rgb2hsl(...ar), a2=hsl2rgb((ah[0]+12)%360,ah[1],clamp(ah[2]+12,0,90));
  P.acc=hex(ar); P.acc2=hex(a2); accRgb=ar.join(','); acc2Rgb=a2.join(',');
  const r=document.documentElement.style;
  for(const k of ['bg','panel','panel2','line','mut','acc','acc2','fg']) r.setProperty('--'+k,P[k]);
  r.setProperty('--accrgb',accRgb);
  { const c=unhex(P.panel); r.setProperty('--cc',(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.55?'#000':'#fff'); }
  const im=st.img, bi=$('bgimg');
  bi.style.backgroundImage=im.data?`url("${im.data}")`:'none';
  bi.style.backgroundSize=im.fit==='contain'?'contain':'cover';
  bi.style.opacity=im.op/100; bi.style.filter=`blur(${im.blur}px) saturate(${im.sat}%)`; bi.style.transform=im.blur?'scale(1.1)':'none';
  $('bgdim').style.background=im.data?`rgba(${hsl2rgb(h,s,l).join(',')},${im.dim/100})`:'none';
  try{ window.api.setTitlebar(P.panel,P.fg); }catch{}
  clearTimeout(gT); gT=setTimeout(()=>{ for(const k in views){ injG(views[k]); injS(views[k]); } injS(cw); sendIcon(); },150);
  try{ localStorage.setItem('cb-bg',getComputedStyle(document.body).getPropertyValue('--bg').trim()); }catch{}
}
const SW=[[26,19,7.3],[0,0,3],[220,8,9],[222,45,10],[212,55,12],[185,50,9],[145,35,8],[75,30,8],[285,35,10],[320,40,11],[350,50,10],[12,50,10],[250,40,11],[200,14,12]];
const swCol=c=>c[1]>15?`hsl(${c[0]} ${Math.min(75,Math.round(c[1]*1.3+15))}% 46%)`:`hsl(${c[0]} ${c[1]}% ${Math.round(c[2]*2.2+6)}%)`;   // wyraźna, stała próbka (bez wpływu nasycenia i jasności)
const AC=['#e8825a','#f2b36b','#e5c158','#7fc97f','#4fc3b7','#5aa9e8','#9b8cf0','#e06ba8','#e5534b'];
const FX=[['all','Wszystkie efekty'],['dust','Świecący pył'],['waves','Fale'],['stars','Migoczące gwiazdy'],['aurora','Zorza'],['rain','Deszcz światła']];
const fmt=(p,v)=>{ if(p==='hist.step'){ const d=HSTEPS[v]; return d?t('Dni: {n}').replace('{n}',d):t('Bez limitu'); } if(p==='bg.sat'||p==='bg.bri'){ const d=(v-50)*2; return (d>0?'+':'')+d; } return p.startsWith('bg.')?String(v):p==='img.blur'?v+'px':v+'%'; };
const stp=p=>p==='hist.step'?1:(S.settings.ui.step5?5:1);
const sla=(k,label,val)=>`<div class="sr"><span>${label}<b>${val}</b></span><div class="rg" data-k="${k}"><i class="tr"></i><i class="fl"></i><input type="range" data-a="${k}" min="0" max="255" step="${stp('acc')}" value="${val}"></div></div>`;
const sl=(p,label,min,max,val,kind)=>`<div class="sr"><span>${label}<b>${fmt(p,val)}</b></span><div class="rg" data-k="${kind}"><i class="tr"></i><i class="fl"></i>${kind==='fx'?`<canvas class="mf" data-fx="${p.split('.')[1]}"></canvas>`:''}<input type="range" data-p="${p}" min="${min}" max="${max}" step="${stp(p)}" value="${val}"></div></div>`;
const dispCol=b=>{ const [h,s,l]=calcBg(b); return `hsl(${h} ${s}% ${l*.65+20}%)`; };
function paintSliders(){
  const b=S.settings.bg;
  $('set').querySelectorAll('.rg').forEach(g=>{ const i=g.querySelector('input'); g.style.setProperty('--v',(i.value-i.min)/(i.max-i.min)*100);
    const k=g.dataset.k; if(k==='sat'||k==='bri') g.style.setProperty('--g',`linear-gradient(90deg,${[0,25,50,75,100].map(x=>dispCol({...b,[k]:x})).join(',')})`); });
}
function renderSet(){
  const tabFn={keys:renderKeys,ui:renderUi,apps:renderApps,priv:renderPrivTab,hist:renderHistTab,sys:renderSysTab}[setTab];
  if(tabFn) return tabFn();
  const st=S.settings, b=st.bg, im=st.img;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>KOLOR TŁA</h5><div class="sw">${SW.map((c,i)=>`<i data-sw="${i}" style="background:${swCol(c)}"></i>`).join('')}</div>
  ${sl('bg.sat','Nasycenie',0,100,b.sat,'sat')}${sl('bg.bri','Jasność',0,100,b.bri,'bri')}
  <label class="ck"><input type="checkbox" id="adv" ${st.adv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
  <div class="ad ${st.adv?'open':''}"><div class="adi"><div id="rgb">${sl('bg.r','R — czerwony',0,255,b.r,'r')}${sl('bg.g','G — zielony',0,255,b.g,'g')}${sl('bg.b','B — niebieski',0,255,b.b,'b')}<input id="hx" value="${hex([b.r,b.g,b.b])}" maxlength="7"><p class="hint">Każdy suwak działa niezależnie. Nasycenie i jasność są korektą nałożoną na kolor z RGB.</p></div></div></div>
  <h5>KOLOR AKCENTU</h5><div class="sw">${AC.map(c=>`<i data-ac="${c}" style="background:${c}"></i>`).join('')}</div>
  <label class="ck"><input type="checkbox" id="accadv" ${st.accAdv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
  <div class="ad ${st.accAdv?'open':''}" id="accad"><div class="adi"><div id="argb">${(ac=>sla('r','R — czerwony',ac[0])+sla('g','G — zielony',ac[1])+sla('b','B — niebieski',ac[2]))(unhex(st.acc)||[232,130,90])}<input id="ahx" value="${st.acc}" maxlength="7"></div></div></div>
  <h5>EFEKTY TŁA</h5>${FX.map(([k,n])=>sl('fx.'+k,n,0,100,st.fx[k],'fx')).join('')}
  <h5>OBRAZ TŁA</h5><div class="br"><button id="pick">Wybierz obraz…</button>${im.data?'<button id="rmimg">Usuń obraz</button>':''}</div><input type="file" id="fi" accept="image/*" hidden>
  ${im.data?sl('img.op','Krycie obrazu',0,100,im.op,'img')+sl('img.blur','Rozmycie',0,30,im.blur,'img')+sl('img.dim','Przyciemnienie',0,90,im.dim,'img')+sl('img.sat','Nasycenie obrazu',0,200,im.sat,'img')+`<label class="sr"><span>Dopasowanie</span><select data-p="img.fit"><option value="cover" ${im.fit==='cover'?'selected':''}>Wypełnij</option><option value="contain" ${im.fit==='contain'?'selected':''}>Dopasuj</option></select></label>`:''}`;
  paintSliders();
}
function syncAcc(){ const c=unhex(S.settings.acc)||[232,130,90]; $('set').querySelectorAll('[data-a]').forEach(i=>{ const v=c['rgb'.indexOf(i.dataset.a)]; i.value=v; i.closest('.sr').querySelector('b').textContent=v; }); const ah=$('ahx'); if(ah&&document.activeElement!==ah) ah.value=S.settings.acc; paintSliders(); }
function syncRgb(){ const b=S.settings.bg;
  $('set').querySelectorAll('[data-p^="bg."]').forEach(i=>{ const k=i.dataset.p.slice(3); if('rgb'.includes(k)&&k.length===1){ i.value=b[k]; i.closest('.sr').querySelector('b').textContent=b[k]; } }); }
function holdHue(){ const b=S.settings.bg, q=rgb2hsl(b.r,b.g,b.b); if(q[1]>.5) b.hold=q[0]; }
$('set').addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.p){ const p=t.dataset.p, v=t.type==='range'?+t.value:t.value; setPath(p,v);
    if(t.type==='range') t.closest('.sr').querySelector('b').textContent=fmt(p,v);
    if(/^bg\.[rgb]$/.test(p)){ holdHue(); const hx=$('hx'); if(hx) hx.value=hex([S.settings.bg.r,S.settings.bg.g,S.settings.bg.b]); }
    paintSliders(); applySettings(); saveSoon(); }
  else if(t.dataset.a){ const c=unhex(S.settings.acc)||[232,130,90]; c['rgb'.indexOf(t.dataset.a)]=+t.value; S.settings.acc=hex(c); t.closest('.sr').querySelector('b').textContent=t.value; const ah=$('ahx'); if(ah) ah.value=S.settings.acc; paintSliders(); applySettings(); saveSoon(); }
  else if(t.id==='ahx'){ const c=unhex(t.value); if(c){ S.settings.acc=hex(c); syncAcc(); applySettings(); saveSoon(); } }
  else if(t.id==='hx'){ const c=unhex(t.value); if(c){ const b=S.settings.bg; [b.r,b.g,b.b]=c; holdHue(); syncRgb(); paintSliders(); applySettings(); saveSoon(); } }
});
$('set').addEventListener('change',e=>{ if(e.target.id==='appson'){ S.settings.apps.on=e.target.checked; $('appsad').classList.toggle('open',e.target.checked); renderBar(); save(); } if(e.target.dataset.an){ S.settings.ui.anim[e.target.dataset.an]=e.target.checked; applyUi(); save(); }
  if(e.target.id==='lng'){ S.settings.ui.lang=e.target.value; save(); setTimeout(()=>location.reload(),150); } if(e.target.id==='adv'){ S.settings.adv=e.target.checked; $('set').querySelector('.ad').classList.toggle('open',e.target.checked); save(); } if(e.target.id==='fi'&&e.target.files[0]) loadImg(e.target.files[0]); });
$('set').addEventListener('click',e=>{
  const t=e.target, d=t.dataset, kbEl=t.closest('[data-kb]');
  if(t.closest('.ap')){ const c=t.closest('.ap'); toggleAdd(c.dataset.ap,c.dataset.add==='1'); }
  else if(t.closest('.seg')&&d.v){ const sg=t.closest('.seg'); S.settings.ui[sg.dataset.seg]=d.v; sg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t)); applyUi(); save(); }
  else if(t.closest('[data-tab]')){ if(recAct) stopRec(); setTab=t.closest('[data-tab]').dataset.tab; renderSet(); $('set').scrollTop=0; }
  else if(kbEl){ if(recAct) stopRec(); startRec(kbEl.dataset.kb); }
  else if(d.kc){ S.settings.keys[d.kc]=''; pushKeys(); save(); renderKeys(); }
  else if(t.id==='rk') ask('Przywrócić domyślne skróty?','Wszystkie skróty klawiszowe wrócą do ustawień fabrycznych.','Przywróć').then(ok=>{ if(ok){ S.settings.keys={...DEF.keys}; pushKeys(); save(); renderKeys(); } });
  else if(d.sw!==undefined){ const c=SW[d.sw], rgb=hsl2rgb(c[0],c[1],c[2]); Object.assign(S.settings.bg,{r:rgb[0],g:rgb[1],b:rgb[2],hold:c[0],sat:50,bri:50}); renderSet(); applySettings(); save(); }
  else if(d.ac){ S.settings.acc=d.ac; syncAcc(); applySettings(); save(); }
  else if(t.id==='sx') toggleSet(false);
  else if(t.id==='pick') $('fi').click();
  else if(t.id==='rmimg'){ S.settings.img.data=''; renderSet(); applySettings(); save(); }
  else if(t.id==='ex') exportCfg();
  else if(t.id==='imp') importCfg();
  else if(t.id==='rs') ask('Przywrócić ustawienia domyślne?','Wszystkie ustawienia (motyw, interfejs, aplikacje, historia i skróty) wrócą do wartości fabrycznych. Karty i foldery zostaną bez zmian.','Przywróć').then(ok=>{ if(ok){ S.settings=merge(DEF,{}); renderSet(); applySettings(); pushKeys(); renderBar(); save(); } });
});
function loadImg(file){
  const r=new FileReader();
  r.onload=()=>{ const im=new Image(); im.onload=()=>{
    const k=Math.min(1,1920/Math.max(im.width,im.height)), c=document.createElement('canvas'); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height); S.settings.img.data=c.toDataURL('image/jpeg',.85);
    renderSet(); applySettings(); save(); }; im.src=r.result; };
  r.readAsDataURL(file);
}
const msg=t=>{ const e=$('sst'); if(e) e.textContent=t; };
async function exportCfg(){ try{ const p=await window.api.exportConfig(JSON.stringify({app:'arkana-browser',version:2,settings:S.settings}),t('Zapisz konfigurację')); msg(p?t('Zapisano:')+' '+p:'Anulowano.'); }catch{ msg('Brak obsługi – podmień main.js i preload.js na nowe.'); } }
async function importCfg(){ try{ const txt=await window.api.importConfig(t('Wczytaj konfigurację')); if(!txt) return msg('Anulowano.');
  const o=JSON.parse(txt); if(!o.settings) throw 0; S.settings=merge(DEF,normalize(o.settings)); renderSet(); applySettings(); pushKeys(); renderBar(); save(); msg('Wczytano konfigurację ✓'); }catch{ msg('Nie udało się wczytać pliku konfiguracji.'); } }
function toggleSet(v){ const o=v===undefined?!$('set').classList.contains('open'):v; if(!o&&recAct) stopRec(); if(o){ toggleCl(false); renderSet(); } $('set').classList.toggle('open',o); }
$('gear').onclick=()=>toggleSet();
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if($('cm').classList.contains('open')) closeMenu(); else{ toggleSet(false); toggleCl(false); } } });

// ---------- skróty klawiszowe ----------
const ACT=[
  ['Karty',[['new-tab','Nowa karta'],['close-tab','Zamknij kartę'],['dup-tab','Duplikuj kartę'],['reload-tab','Odśwież kartę'],['pin-tab','Przypnij / odepnij kartę'],['mute-tab','Wycisz / włącz dźwięk karty'],['restore-tab','Przywróć zamkniętą kartę']]],
  ['Wszystkie karty',[['close-all','Zamknij wszystkie karty'],['reload-all','Odśwież wszystkie karty'],['pin-all','Przypnij / odepnij wszystkie'],['mute-all','Wycisz / włącz dźwięk wszystkich']]],
  ['Nawigacja',[['next-tab','Następna karta'],['prev-tab','Poprzednia karta'],['focus-url','Pasek adresu'],['back','Wstecz'],['forward','Dalej'],['go-home','Strona startowa']]],
  ['Foldery',[['new-folder','Nowy folder'],['dup-folder','Duplikuj bieżący folder'],['rename-folder','Zmień nazwę bieżącego folderu'],['next-folder','Następny folder'],['prev-folder','Poprzedni folder']]],
  ['Strona',[['find','Szukaj na stronie'],['zoom-in','Powiększ stronę'],['zoom-out','Pomniejsz stronę'],['zoom-reset','Zresetuj powiększenie'],['print','Drukuj stronę'],['devtools','Narzędzia deweloperskie strony']]],
  ['Interfejs',[['settings','Ustawienia'],['toggle-panel','Panel asystenta'],['history','Historia'],['ui-devtools','Narzędzia deweloperskie interfejsu']]]
];
const ANAME=Object.fromEntries(ACT.flatMap(g=>g[1]));
let setTab='theme', recAct=null; const held=new Set(), peak=new Set();
const MODS=['Ctrl','Alt','Shift'];
const NAMES={Comma:',',Period:'.',Slash:'/',Semicolon:';',Quote:"'",BracketLeft:'[',BracketRight:']',Backslash:'\\',Minus:'-',Equal:'=',Backquote:'`',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'};
const keyLabel=c=>/^Key[A-Z]$/.test(c)?c[3]:/^Digit\d$/.test(c)?c[5]:NAMES[c]||c;
const modOf=c=>/^Control/.test(c)?'Ctrl':/^Alt/.test(c)?'Alt':/^Shift/.test(c)?'Shift':/^Meta/.test(c)?'Meta':null;
const canon=arr=>{ const x=[...new Set(arr)]; return [...MODS.filter(m=>x.includes(m)),...x.filter(k=>!MODS.includes(k)).sort()]; };
const same=(x,y)=>canon(x).join('+')===canon(y).join('+');
function clash(x,y){
  if(same(x,y)) return true;
  const sub=(p,q)=>{ const mp=p.filter(k=>!MODS.includes(k)); return mp.length>1&&mp.some(k=>same(p.filter(z=>z!==k),q)); };
  return sub(x,y)||sub(y,x);
}
const pushKeys=()=>{ try{ window.api.setKeys(S.settings.keys); }catch{} };
const STABS=[
  ['theme','Motyw','<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.9 4.9 0 0 0 22 10.6C22 5.8 17.5 2 12 2z"/>'],
  ['ui','Interfejs','<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>'],
  ['apps','Aplikacje','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'],
  ['priv','Prywatność','<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'],
  ['hist','Historia','<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>'],
  ['keys','Skróty','<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'],
  ['sys','System','<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>']
];
const tabsHtml=()=>`<div class="stabs">${STABS.map(([k,n,ic])=>`<button data-tab="${k}" class="${setTab===k?'on':''}"><svg viewBox="0 0 24 24">${ic}</svg><span>${n}</span></button>`).join('')}</div>`;
const chips=k=>k?k.split('+').map(x=>`<kbd>${esc(x)}</kbd>`).join(''):'<em>brak</em>';
function renderKeys(){
  const K=S.settings.keys;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <p class="hint">Kliknij skrót i naciśnij nową kombinację (do 4 klawiszy naraz). Wymagany jest Ctrl lub Alt albo klawisz F1–F12. Esc anuluje.</p>
  ${ACT.map(([g,list])=>`<h5>${g.toUpperCase()}</h5>${list.map(([a,n])=>`<div class="kr"><span>${n}</span><div class="kb${recAct===a?' rec':''}" data-kb="${a}">${recAct===a?'<em>Naciśnij klawisze…</em>':chips(K[a])}</div>${K[a]&&recAct!==a?`<button class="kc" data-kc="${a}" title="Usuń skrót">×</button>`:'<i class="kcs"></i>'}</div>`).join('')}`).join('')}
  <div class="br" style="margin-top:18px"><button id="rk">Przywróć domyślne skróty</button></div><div id="sst"></div>`;
}
function renderUi(){
  const u=S.settings.ui, seg=(k,o)=>`<div class="seg" data-seg="${k}">${o.map(([v,l])=>`<button data-v="${v}" class="${u[k]===v?'on':''}">${l}</button>`).join('')}</div>`;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PRZYCISKI OKNA</h5><p class="hint">Minimalizuj, maksymalizuj, zamknij</p>${seg('win',[['win','Windows'],['simple','Prosty'],['fancy','Rozbudowany']])}
  <h5>PRZYCISKI NAWIGACJI</h5><p class="hint">Strzałki, odświeżanie i napis Arkana</p>${seg('nav',[['simple','Prosty'],['fancy','Rozbudowany']])}
  <h5>WYSZUKIWARKA</h5><p class="hint">Używana, gdy w pasku adresu wpiszesz tekst zamiast adresu.</p>
  <div class="sew">${Object.keys(SE).map(k=>`<button class="seb${S.settings.search.engine===k?' on':''}" data-se="${k}">${SE[k].n}</button>`).join('')}<button class="seb${S.settings.search.engine==='custom'?' on':''}" data-se="custom">Własna...</button></div>
  ${S.settings.search.engine==='custom'?`<input id="secust" class="sein${seValid(S.settings.search.custom)?'':' bad'}" placeholder="https://example.com/search?q=%s" value="${esc(S.settings.search.custom||'')}"><p class="hint">Wpisz adres wyszukiwania z %s w miejscu zapytania.</p>`:''}
  <h5>PANELE BOCZNE</h5>
  <label class="ck"><input type="checkbox" id="asstbtn" ${u.asst!==false?'checked':''}><span class="tg"></span>Pokaż przycisk panelu asystenta</label>
  <label class="ck"><input type="checkbox" id="clbtnon" ${u.clb!==false?'checked':''}><span class="tg"></span>Pokaż przycisk ChangeLog</label>
  <p class="hint">Skrót klawiszowy panelu asystenta działa także przy ukrytym przycisku (zakładka Skróty).</p>
  <h5>ANIMACJE</h5><p class="hint">Wyłącz animacje osobno dla każdego miejsca.</p>
  ${[['btn','Przyciski'],['fold','Foldery'],['tab','Karty'],['panel',"Panel asystenta"],['boot','Uruchamianie przeglądarki'],['bootsnd','Dźwięk uruchamiania']].map(([k,n])=>`<label class="ck"><input type="checkbox" data-an="${k}" ${u.anim[k]?'checked':''}><span class="tg"></span>${n}</label>`).join('')}
  <h5>SUWAKI</h5><label class="ck"><input type="checkbox" id="st5" ${u.step5?'checked':''}><span class="tg"></span>Suwaki przesuwają się co 5</label><p class="hint">Wszystkie suwaki w ustawieniach zmieniają wartość o 5 zamiast o 1 (np. efekty tła o 5%).</p>`;
  paintSliders();
}

function renderHistTab(){
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5 id="hsec">ZAPISYWANIE HISTORII</h5><label class="ck"><input type="checkbox" id="hon" ${S.settings.hist.on?'checked':''}><span class="tg"></span>Zapisuj historię przeglądania</label>
  ${sl('hist.step','Przechowuj historię',0,10,S.settings.hist.step,'hist')}<p class="hint">Starsze wpisy są usuwane automatycznie.</p>
  <h5>STRONY POMIJANE</h5><div class="hk"><input id="hkin" placeholder="np. google.com lub zwierzaki" autocomplete="off" spellcheck="false"><button id="hkadd">Dodaj</button></div><div id="hkl">${hkChips()}</div>
  <p class="hint">Wpis z kropką, ukośnikiem lub „www” pasuje do całego adresu (np. www.google.com). Samo słowo (np. zwierzaki) pasuje tylko do nazwy strony przed końcówką .com, .pl itd. Pasujące wejścia nie są zapisywane, a istniejące zostają usunięte. Dotyczy to także haseł wyszukiwanych w Google.</p>`;
  paintSliders();
}

function renderSysTab(){
  const u=S.settings.ui;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>JĘZYK</h5>${langPicker(u.lang)}<p class="hint">Zmiana języka odświeża interfejs.</p><p class="hint">Morse i Braille zamieniają tekst interfejsu w danym języku na kod (uproszczone tabele, bez skrótów). Dotyczy tylko interfejsu Arkany, nie stron internetowych. Zmiana odświeża aplikację.</p>
  <h5>AKTUALIZACJE</h5><div id="updbox"></div>
  <label class="ck"><input type="checkbox" id="upauto" ${S.settings.upd.auto?'checked':''}><span class="tg"></span>Sprawdzaj aktualizacje automatycznie</label>
  <label class="ck"><input type="checkbox" id="updl" ${S.settings.upd.dl?'checked':''}><span class="tg"></span>Pobieraj aktualizacje automatycznie</label>
  <p class="hint">Aktualizacje pochodzą z oficjalnych wydań projektu na GitHubie. Pobrane pliki są weryfikowane sumą SHA-512, a zainstalowana aktualizacja uruchamia się przy zamknięciu przeglądarki lub od razu na życzenie.</p>
  <h5>IMPORT Z INNEJ PRZEGLĄDARKI</h5><p class="hint">Zakładki, historia i ciasteczka z Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi lub z pliku zakładek.</p><div class="br"><button id="impopen">Importuj dane...</button></div>
  <h5>KONFIGURACJA</h5><div class="br"><button id="ex">Zapisz do pliku…</button><button id="imp">Wczytaj z pliku…</button><button id="rs">Domyślne</button></div><p class="hint">Zapis i wczytanie obejmują wszystkie ustawienia, ale nie karty i foldery.</p><div id="sst"></div>
  <h5>O PROGRAMIE</h5>
  <p class="hint">Arkana Browser ${UPD.cur?'v'+UPD.cur:VERSION}</p>`;
  paintSliders(); updPaint();
}
function applyUi(){
  const u=S.settings.ui, c=document.body.classList;
  ['win','simple','fancy'].forEach(m=>c.toggle('wb-'+m,u.win===m)); ['simple','fancy'].forEach(m=>c.toggle('nb-'+m,u.nav===m));
  c.toggle('round',!!u.round); c.toggle('no-asst',u.asst===false); c.toggle('no-cl',u.clb===false); c.toggle('na-btn',!u.anim.btn); c.toggle('na-fold',!u.anim.fold); c.toggle('na-tab',!u.anim.tab); c.toggle('na-panel',!u.anim.panel); c.toggle('na-apps',!u.anim.apps);
  const ws=document.querySelectorAll('.aw'); if(ws.length){ ws.forEach(w=>{ w.__rs=0; place(w,rectOf(w)); roundSync(w); }); updateContacts(); }
}
function startRec(a){ recAct=a; held.clear(); peak.clear(); try{ window.api.pauseKeys(true); }catch{} renderKeys(); }
function stopRec(){ recAct=null; held.clear(); peak.clear(); try{ window.api.pauseKeys(false); }catch{} }
document.addEventListener('keydown',e=>{
  if(!recAct) return; e.preventDefault(); e.stopPropagation(); if(e.repeat) return;
  const m=modOf(e.code); if(m==='Meta') return; const lab=m||keyLabel(e.code);
  if(e.code==='Escape'&&!peak.size){ stopRec(); renderKeys(); return; }
  if(peak.size>=4&&!peak.has(lab)){ msg('Maksymalnie 4 klawisze naraz.'); return; }
  held.add(lab); peak.add(lab);
},true);
document.addEventListener('keyup',e=>{
  if(!recAct) return; e.preventDefault(); held.delete(modOf(e.code)||keyLabel(e.code));
  if(!held.size&&peak.size) finishRec();
},true);
async function finishRec(){
  const a=recAct, combo=canon([...peak]), mods=combo.filter(x=>MODS.includes(x)), main=combo.filter(x=>!MODS.includes(x)), str=combo.join('+'), K=S.settings.keys;
  stopRec();
  if(!main.length||!(mods.includes('Ctrl')||mods.includes('Alt')||main.some(x=>/^F\d{1,2}$/.test(x)))){ renderKeys(); return msg('Skrót musi zawierać klawisz z Ctrl lub Alt (albo F1–F12).'); }
  const reserved=['Ctrl+C','Ctrl+V','Ctrl+X','Ctrl+A','Ctrl+Z','Ctrl+Y'].includes(str), altgr=mods.length===2&&mods.includes('Ctrl')&&mods.includes('Alt')&&main.length===1&&'ACELNOSXZ'.includes(main[0]);
  if(reserved||altgr){ renderKeys(); await ask('Ta kombinacja jest zarezerwowana',(reserved?t('{k} służy do kopiowania, wklejania i cofania w polach tekstowych. Wybierz inną kombinację.'):t('{k} to AltGr+{x}, czyli polskie znaki. Wybierz inną kombinację.')).replace('{k}',str).replace('{x}',main[0]),'Rozumiem'); return; }
  const other=Object.keys(K).find(b=>b!==a&&K[b]&&clash(K[b].split('+'),combo));
  if(other){ const ok=await ask('Ten skrót jest już używany',t('Kombinacja {k} jest przypisana do opcji „{a}”. Przypisanie jej tutaj usunie ją z tamtej opcji.').replace('{k}',str).replace('{a}',t(ANAME[other]||other)),'Przypisz tutaj'); if(!ok){ renderKeys(); return; } K[other]=''; }
  K[a]=str; pushKeys(); save(); renderKeys();
}

// ---------- animacje wewnątrz suwaków efektów ----------
const hh=i=>{ const x=Math.sin(i*12.9898)*43758.5453; return x-Math.floor(x); };
function drawMini(g,fx,w,h,v,t){
  const A=accRgb, B=acc2Rgb, F=fgRgb;
  const dust=()=>{ const n=4+Math.round(v*w/10); for(let i=0;i<n;i++){ const x=hh(i+1)*w, y=h+3-((t*.012*(.5+hh(i+2))+hh(i+3)*h*3)%(h+6)), r=(1+hh(i+4)*1.6)*2.6, al=(.35+.55*hh(i+5))*(.4+.6*v), c=i%2?B:F, gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${c},${al})`); gr.addColorStop(1,`rgba(${c},0)`); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,6.283); g.fill(); } };
  const waves=()=>{ for(let k=0;k<2;k++){ g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x+=4) g.lineTo(x,h*(.62+.14*k)+Math.sin(x*.07+t*.003*(1+k*.4)+k*2)*h*(.1+.22*v)); g.lineTo(w,h); g.closePath(); g.fillStyle=`rgba(${k?B:A},${.3+.3*v})`; g.fill(); } };
  const stars=()=>{ const n=3+Math.round(v*w/8); for(let i=0;i<n;i++){ g.fillStyle=`rgba(${F},${(.2+.8*Math.abs(Math.sin(t*.003*(.5+hh(i+3))+i)))*(.4+.6*v)})`; g.beginPath(); g.arc(hh(i)*w,hh(i+9)*h,.7+hh(i+2)*.6,0,6.283); g.fill(); } };
  const aurora=()=>{ for(let k=0;k<3;k++){ const x=w*(.15+.3*k+.12*Math.sin(t*.0008+k*2)), c=[A,B,F][k], gr=g.createRadialGradient(x,h/2,0,x,h/2,h*2.2); gr.addColorStop(0,`rgba(${c},${.3+.45*v})`); gr.addColorStop(1,`rgba(${c},0)`); g.fillStyle=gr; g.fillRect(0,0,w,h); } };
  const rain=()=>{ const n=3+Math.round(v*w/9); g.lineWidth=1; g.strokeStyle=`rgba(${B},${.4+.5*v})`; for(let i=0;i<n;i++){ const x=hh(i)*w, y=((t*.05*(.6+hh(i+1))+hh(i+2)*h*3)%(h+8))-4; g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+5); g.stroke(); } };
  ({dust,waves,stars,aurora,rain,all:()=>{ aurora(); waves(); dust(); }})[fx]();
}
function mini(t){
  requestAnimationFrame(mini);
  if(!$('set').classList.contains('open')||t-(mini.l||0)<28) return; mini.l=t;
  $('set').querySelectorAll('canvas.mf').forEach(c=>{
    const w=c.clientWidth, h=c.clientHeight; if(c.width!==w) c.width=w; if(c.height!==h) c.height=h;
    const g=c.getContext('2d'); g.clearRect(0,0,w,h); const v=c.parentElement.querySelector('input').value/100; if(v<=0) return;
    g.save(); g.beginPath(); g.roundRect(0,0,w*v,h,9); g.clip(); drawMini(g,c.dataset.fx,w,h,v,t); g.restore(); });
}
requestAnimationFrame(mini);

