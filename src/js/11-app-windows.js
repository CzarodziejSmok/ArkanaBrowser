// ---------- aplikacje (prawy pasek i pływające okna) ----------
const APPS=[
  {id:'calc',ic:'🧮',n:'Kalkulator',d:'Kalkulator prosty i naukowy z historią obliczeń',w:320,h:480,mount:mountCalc},
  {id:'notes',ic:'📝',n:'Notatnik',d:'Wiele notatek z obsługą emoji',w:580,h:400,mount:mountNotes},
  {id:'clock',ic:'🕒',n:'Zegar',d:'Zegar, alarmy, minutnik, stoper i kalendarz',w:430,h:560,mount:mountClock},{id:'conv',ic:'🔁',n:'Konwerter',d:'Konwerter jednostek z rzadkimi jednostkami (np. lata świetlne)',w:430,h:640,mount:mountConv},{id:'files',ic:'🗃️',n:'Zmieniacz formatów',d:'Konwertuje pliki: obrazy, dźwięk, wideo, dokumenty, dane i archiwa',w:600,h:720,mount:mountFc},{id:'gej',ic:'🎲',n:'Gejos.exe',d:'Kostki z fizyką: łap, rzucaj i niszcz',w:520,h:420,mount:mountGej},{id:'dice',ic:'🔟',n:'Kości',d:'Rzuty kośćmi: od D3 do D100, wiele kości naraz',w:440,h:660,mount:mountDice},{id:'mine',ic:'💣',n:'Saper',d:'Klasyczny Saper: własna plansza, życia i zawinięte krawędzie',w:520,h:660,mount:mountMine},{id:'snake',ic:'🐍',n:'Snake',d:'Wąż z jabłkami: plansza, tempo, złote i trujące jabłka oraz przeszkody',w:540,h:640,mount:mountSnake},{id:'wx',ic:'⛅',n:'Pogoda',ph:1},{id:'tr',ic:'🌐',n:'Tłumacz',d:'Tłumacz tekstów (bez logowania i opłat, wymaga internetu)',w:640,h:420,mount:mountTr},{id:'mus',ic:'🎵',n:'Odtwarzacz',ph:1}
];
const AIC={calc:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="8" y="5.5" width="8" height="3.5" rx=".8"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',notes:'<path d="M18 12.5V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5"/><path d="M8.5 8.5h6M8.5 12h3"/><path d="m20.5 15.2-5.7 5.7-2.8.6.6-2.8 5.7-5.7a1.4 1.4 0 0 1 2.2 2.2z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',conv:'<path d="M4 8h14M14.5 4.5 18 8l-3.5 3.5M20 16H6M9.5 12.5 6 16l3.5 3.5"/>',files:'<path d="M12 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l5 5v3"/><path d="M13 3v5h5"/><path d="M14 17h7M18 13.8l3 3.2-3 3.2"/>',gej:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>',dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none"/>',mine:'<circle cx="10.5" cy="14" r="6.5"/><path d="M7.3 13a3.3 3.3 0 0 1 3.2-3"/><path d="m15.2 9.3 2.6-2.6"/><path d="M19.5 2.5v3M18 4h3"/>',snake:'<path d="M19 6H8.5a3.5 3.5 0 0 0 0 7h7a3.5 3.5 0 0 1 0 7H5"/><circle cx="19" cy="6" r="1" fill="currentColor" stroke="none"/>',wx:'<path d="M17.5 19H9a6 6 0 1 1 5.8-7.6h2.7a3.8 3.8 0 0 1 0 7.6z"/>',tr:'<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 6 7M12 6c-.5 3-3 6-7.5 7.5"/><path d="m12 20 4.5-10L21 20M13.5 17h6"/>',mus:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8"/>'};
APPS.forEach(a=>{ if(AIC[a.id]) a.ic=`<svg viewBox="0 0 24 24">${AIC[a.id]}</svg>`; });   // ikony aplikacji: liniowe SVG w stylu ikon ustawień i ChangeLog
const APP=Object.fromEntries(APPS.map(a=>[a.id,a]));
S.aw=S.aw||{}; S.aw.open=S.aw.open||[]; S.aw.pos=S.aw.pos||{}; S.aw.links=S.aw.links||[]; S.aw.data=S.aw.data||{};
S.aw.open=S.aw.open.filter(id=>APP[id]); S.settings.apps.bar=S.settings.apps.bar.filter(id=>APP[id]);   // usuń aplikacje, których już nie ma (np. okno testowe)
let zTop=1, toastT;
const GRID='<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
function toast(m){ const e=$('toast'); e.textContent=m; e.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('show'),2300); }
function renderBar(){
  const A=S.settings.apps; document.body.classList.toggle('noapps',!A.on);
  $('rl').innerHTML='<h6>APLIKACJE</h6>'+(A.bar.length
    ? A.bar.filter(id=>APP[id]).map(id=>{ const a=APP[id]; return `<div class="fd app${S.aw.open.includes(id)?' on':''}" data-app="${id}" title="${esc(a.n)}"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span></div>`; }).join('')
    : `<div class="rempty"><i class="ic re-i">${GRID}</i><p>Brak aplikacji na pasku.</p><p class="sm">Aplikacje możesz dodać w ustawieniach, w sekcji Aplikacje.</p><button id="rset">Otwórz ustawienia</button></div>`);
}
$('rl').addEventListener('click',e=>{
  if(e.target.id==='rset'){ setTab='apps'; toggleSet(true); return; }
  const it=e.target.closest('.app'); if(it) toggleApp(it.dataset.app);
});
const winOf=id=>document.querySelector(`.aw[data-app="${id}"]`);
const liveWins=()=>[...document.querySelectorAll('.aw:not(.out)')];
const rectOf=w=>({x:parseFloat(w.style.left),y:parseFloat(w.style.top),w:parseFloat(w.style.width),h:parseFloat(w.style.height)});
function toggleApp(id){ const w=winOf(id); if(w&&!w.classList.contains('out')) closeApp(id); else openApp(id); }
// --- okrągłe okna: stały kształt koła, zawinięty pasek tytułu, styki po łuku ---
const RMIN=330, RBAND=30, RANG=42*Math.PI/180;
const isRound=()=>document.body.classList.contains('round');
function roundSync(w){
  const h=w.querySelector('.awh'), b=w.querySelector('.awb'); if(!h||!b||!w.isConnected) return;
  let sv=h.querySelector('.awr'); const on=isRound();
  if(!on){ if(sv) sv.remove(); h.style.clipPath=''; ['left','right','top','bottom'].forEach(k=>b.style[k]=''); h.querySelectorAll('.ic,.awx').forEach(e=>{ e.style.left=e.style.top=e.style.transform=''; }); w.__rs=0; return; }
  const s=w.clientWidth; if(!s) return; if(w.__rs===s&&sv) return; w.__rs=s;
  const c=s/2, R=c, Ri=R-RBAND, A=RANG, rm=Ri+RBAND/2, f=n=>n.toFixed(1), P=(a,r)=>[c+r*Math.sin(a),c-r*Math.cos(a)];
  const [x1,y1]=P(-A,R-.5), [x2,y2]=P(A,R-.5), [x3,y3]=P(A,Ri), [x4,y4]=P(-A,Ri);
  const d=`M${f(x1)} ${f(y1)}A${R-.5} ${R-.5} 0 0 1 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${Ri} ${Ri} 0 0 0 ${f(x4)} ${f(y4)}Z`;
  const rb=Ri+RBAND/2-4.5, ta=A-34/rm, [tx1,ty1]=P(-ta,rb), [tx2,ty2]=P(ta,rb), pid='awp-'+w.dataset.app, L=rb*2*ta;
  const title=t(APP[w.dataset.app].n);
  if(!sv){ sv=document.createElementNS('http://www.w3.org/2000/svg','svg'); sv.setAttribute('class','awr'); h.prepend(sv); }
  sv.innerHTML=`<path class="bf" d="${d}"/><path class="bs" d="${d}"/><path id="${pid}" d="M${f(tx1)} ${f(ty1)}A${f(rb)} ${f(rb)} 0 0 1 ${f(tx2)} ${f(ty2)}" fill="none"/><text><textPath href="#${pid}" startOffset="50%" text-anchor="middle"></textPath></text>`;
  const tp=sv.querySelector('textPath'); tp.textContent=title;
  let n=title.length; while(n>1&&tp.getComputedTextLength()>L){ n--; tp.textContent=title.slice(0,n).trimEnd()+'…'; }
  h.style.clipPath=`path('${d}')`;
  const put=(e,a)=>{ if(!e) return; const [x,y]=P(a,rm); e.style.left=(x-e.offsetWidth/2)+'px'; e.style.top=(y-e.offsetHeight/2)+'px'; e.style.transform=''; };
  put(h.querySelector('.ic'),-(A-16/rm)); put(h.querySelector('.awx'),A-16/rm);
  // prostokąt zawartości: górne rogi pod wewnętrznym łukiem paska, dolne wewnątrz koła
  const u=Ri-3, v=R-5; let best=0, bw=0, bt=0, bb=0;
  for(let hw=40;hw<Math.min(u,v);hw++){ const ht=Math.sqrt(u*u-hw*hw), hb=Math.sqrt(v*v-hw*hw), ar=hw*(ht+hb); if(ar>best){ best=ar; bw=hw; bt=ht; bb=hb; } }
  b.style.left=(c-bw)+'px'; b.style.right=(c-bw)+'px'; b.style.top=(c-bt)+'px'; b.style.bottom=(c-bb)+'px';
}
function place(w,p){
  if(isRound()){ const s=Math.max(RMIN,p.w,p.h); p={...p,w:s,h:s}; }
  w.style.left=p.x+'px'; w.style.top=p.y+'px'; w.style.width=p.w+'px'; w.style.height=p.h+'px'; if(w.isConnected) roundSync(w);
}
// punkt styku dwóch kół: odcinek wspólnej prostej, na którym odstęp między okręgami ≤ G
function arcTouch(Lw,Rw,vert){
  const G=5, rad=o=>Math.min(o.w,o.h)/2, cx=o=>o.x+o.w/2, cy=o=>o.y+o.h/2, rl=rad(Lw), rr=rad(Rw); let lo=null, hi=null;
  const a0=vert?Math.max(Lw.y,Rw.y):Math.max(Lw.x,Rw.x), a1=vert?Math.min(Lw.y+Lw.h,Rw.y+Rw.h):Math.min(Lw.x+Lw.w,Rw.x+Rw.w);
  for(let q=Math.ceil(a0);q<=a1;q++){
    const dl=vert?q-cy(Lw):q-cx(Lw), dr=vert?q-cy(Rw):q-cx(Rw); if(Math.abs(dl)>=rl||Math.abs(dr)>=rr) continue;
    const gl=Math.sqrt(rl*rl-dl*dl), gr=Math.sqrt(rr*rr-dr*dr);
    const gap=vert?(cx(Rw)-gr)-(cx(Lw)+gl):(cy(Rw)-gr)-(cy(Lw)+gl);
    if(gap<=G){ if(lo===null) lo=q; hi=q; } }
  return lo===null?null:{s:lo,l:Math.max(6,hi-lo)};
}
function savePos(w){ S.aw.pos[w.dataset.app]=rectOf(w); save(); }
function focusWin(w){ document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));
  groupOf(w.dataset.app).forEach(i=>{ const m=winOf(i); if(m&&m!==w) m.style.zIndex=++zTop; }); w.style.zIndex=++zTop; try{ w.focus({preventScroll:true}); }catch{} updateContacts(); }
function openApp(id){
  const a=APP[id]; if(!a) return;
  if(a.ph){ toast(t(a.n)+' — '+t('wkrótce')); return; }
  let w=winOf(id); if(w&&!w.classList.contains('out')){ focusWin(w); return; }
  const k=Object.keys(S.aw.pos).length%5, aw=a.w||420, ah=a.h||300, p=S.aw.pos[id]||{x:Math.max(80,innerWidth/2-aw/2)+k*34,y:90+k*34,w:aw,h:ah};
  w=document.createElement('div'); w.className='aw'+(an('apps')?' ent':''); w.dataset.app=id; w.tabIndex=-1;
  w.innerHTML=`<div class="awh"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span><button class="awx" title="Zamknij aplikację">×</button></div><div class="awb"></div>`+['n','s','e','w','ne','nw','se','sw'].map(d=>`<i class="rz ${d}" data-d="${d}"></i>`).join('');
  place(w,p); $('aws').appendChild(w); roundSync(w); focusWin(w);
  if(a.mount) a.mount(w.querySelector('.awb'),w);
  w.querySelector('.awb').prepend(Object.assign(document.createElement('canvas'),{className:'afx'}));   // tło z cząsteczkami (wspólne)
  if(!S.aw.open.includes(id)) S.aw.open.push(id); savePos(w); renderBar(); updateContacts();
}
function closeApp(id){
  const w=winOf(id); S.aw.open=S.aw.open.filter(x=>x!==id); S.aw.links=S.aw.links.filter(l=>!l.includes(id));
  if(w){ savePos(w); w.classList.add('out'); later('apps',180,()=>{ w.remove(); updateContacts(); }); }
  save(); renderBar(); updateContacts();
}
$('aws').addEventListener('click',e=>{ const x=e.target.closest('.awx'); if(x) closeApp(x.closest('.aw').dataset.app); });
// --- styki i scalanie okien ---
function contactList(){
  const ws=liveWins().map(w=>({id:w.dataset.app,...rectOf(w)})), out=[], T=1.5;
  for(let i=0;i<ws.length;i++) for(let j=i+1;j<ws.length;j++){ const a=ws[i], b=ws[j];
    const oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y), ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
    const rd=isRound(), add=(L,Rr,v,x,y,l)=>{ if(!rd){ out.push({a:a.id,b:b.id,v,x,y,l}); return; }
      const q=arcTouch(L,Rr,v); if(q) out.push({a:a.id,b:b.id,v,x,y,l:q.l,r:1,...(v?{y:q.s}:{x:q.s})}); };
    if(oy>6){ if(Math.abs(a.x+a.w-b.x)<=T) add(a,b,1,b.x,Math.max(a.y,b.y),oy); else if(Math.abs(b.x+b.w-a.x)<=T) add(b,a,1,a.x,Math.max(a.y,b.y),oy); }
    if(ox>6){ if(Math.abs(a.y+a.h-b.y)<=T) add(a,b,0,Math.max(a.x,b.x),b.y,ox); else if(Math.abs(b.y+b.h-a.y)<=T) add(b,a,0,Math.max(a.x,b.x),a.y,ox); } }
  return out;
}
const linked=(a,b)=>S.aw.links.some(l=>(l[0]===a&&l[1]===b)||(l[0]===b&&l[1]===a));
let collide=false;   // tryb kolizji (Shift podczas przesuwania)
function updateContacts(){
  const box=$('aws'); box.querySelectorAll('.cs').forEach(e=>e.remove());
  const cs=contactList(), T=3, R=14;      // R = promień zaokrąglenia rogów okna: linia obejmuje tylko prostą część krawędzi
  cs.forEach(c=>{ const lk=linked(c.a,c.b); if(!lk&&!collide) return;
    const st=(c.v?c.y:c.x)+(c.r?0:R), len=c.l-(c.r?0:2*R); if(len<4) return;
    const e=document.createElement('i'); e.className='cs'+(lk?' lk':'');
    if(c.v){ e.style.left=(c.x-T/2)+'px'; e.style.top=st+'px'; e.style.width=T+'px'; e.style.height=len+'px'; }
    else { e.style.top=(c.y-T/2)+'px'; e.style.left=st+'px'; e.style.height=T+'px'; e.style.width=len+'px'; }
    e.style.zIndex=Math.max(+(winOf(c.a)?.style.zIndex)||0,+(winOf(c.b)?.style.zIndex)||0);
    box.appendChild(e); });
  return cs;
}
function groupOf(id){ const seen=new Set([id]), q=[id];
  while(q.length){ const x=q.pop(); S.aw.links.forEach(([a,b])=>{ const o=a===x?b:b===x?a:null; if(o&&!seen.has(o)){ seen.add(o); q.push(o); } }); }
  return [...seen].filter(i=>winOf(i)); }
function sweepMove(rects,ddx,ddy,others){
  let ax=ddx;
  for(const r of rects) for(const o of others){ if(r.y<o.y+o.h&&r.y+r.h>o.y){
    if(ddx>0&&r.x+r.w<=o.x+.01) ax=Math.min(ax,o.x-(r.x+r.w)); else if(ddx<0&&r.x>=o.x+o.w-.01) ax=Math.max(ax,o.x+o.w-r.x); } }
  const mx=rects.map(r=>({...r,x:r.x+ax})); let ay=ddy;
  for(const r of mx) for(const o of others){ if(r.x<o.x+o.w&&r.x+r.w>o.x){
    if(ddy>0&&r.y+r.h<=o.y+.01) ay=Math.min(ay,o.y-(r.y+r.h)); else if(ddy<0&&r.y>=o.y+o.h-.01) ay=Math.max(ay,o.y+o.h-r.y); } }
  return [ax,ay];
}
// --- pasek podpowiedzi klawiszy ---
function showHint(mode){
  const chips=mode==='move'?[['Shift','Blokuj o okna i krawędzie ekranu','sh'],['M','Scal stykające się okna','mg hide'],['U','Oddziel okno od grupy','um hide'],['Esc','Anuluj przesuwanie','es']]:[['Esc','Anuluj zmianę rozmiaru','es']];
  $('kh').querySelector('.khi').innerHTML=chips.map(([k,l,c])=>`<span class="khc ${c}"><kbd>${k}</kbd>${l}</span>`).join(''); $('kh').classList.add('show');
}
const hideHint=()=>$('kh').classList.remove('show');
const hintChip=(c,on)=>{ const e=$('kh').querySelector('.'+c); if(!e) return; if(c==='sh'){ e.classList.toggle('on',on); return; }
  const was=!e.classList.contains('hide'); e.classList.toggle('hide',!on); if(on&&!was){ e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } };
// --- przytrzymanie okna: przesuwanie / zmiana rozmiaru ---
$('aws').addEventListener('mousedown',e=>{
  const w=e.target.closest('.aw'); if(!w||w.classList.contains('out')) return; focusWin(w);
  const rz=e.target.closest('.rz'), h=e.target.closest('.awh');
  if(!rz&&!(h&&!e.target.closest('.awx'))) return; e.preventDefault();
  startHold(w,rz?rz.dataset.d:'',e);
});
function startHold(w,d,e){
  const id=w.dataset.app, box=$('aws').getBoundingClientRect(), BW=box.width, BH=box.height;
  let grp,others,start,cur,sx=e.clientX,sy=e.clientY,lastX=sx,lastY=sy,done=false;
  const orig=new Map();
  const hl=()=>document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',grp.includes(x)||x===w));   // podświetl całą grupę scalonych okien
  const rebase=()=>{ grp=d?[w]:groupOf(id).map(winOf); others=liveWins().filter(o=>!grp.includes(o)).map(rectOf); start=grp.map(rectOf); cur={dx:0,dy:0}; sx=lastX; sy=lastY; grp.forEach(g=>{ if(!orig.has(g)) orig.set(g,rectOf(g)); }); hl(); };
  rebase();
  const refresh=()=>{ const cs=updateContacts(), ids=grp.map(g=>g.dataset.app);
    hintChip('mg',collide&&cs.some(c=>ids.includes(c.a)!==ids.includes(c.b))); hintChip('um',S.aw.links.some(l=>l.includes(id))); };
  document.body.classList.add('dragging'); showHint(d?'resize':'move'); hintChip('sh',e.shiftKey); collide=!d&&e.shiftKey; refresh();
  const mv=ev=>{ lastX=ev.clientX; lastY=ev.clientY; hintChip('sh',ev.shiftKey); collide=!d&&ev.shiftKey;
    if(d&&isRound()){ const st=start[0], dx=lastX-sx, dy=lastY-sy, hz=d==='e'||d==='w';   // koło: jeden wymiar zmienia drugi, środek drugiej osi zostaje
      const sz=Math.max(RMIN,d==='e'?st.w+dx:d==='w'?st.w-dx:d==='s'?st.h+dy:st.h-dy);
      let x=hz?(d==='w'?st.x+st.w-sz:st.x):st.x-(sz-st.w)/2, y=hz?st.y-(sz-st.h)/2:(d==='n'?st.y+st.h-sz:st.y);
      x=clamp(x,-sz+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:sz,h:sz}); }
    else if(d){ const st=start[0], dx=lastX-sx, dy=lastY-sy; let x=st.x,y=st.y,ww=st.w,hh=st.h;
      if(d.includes('e')) ww=st.w+dx; if(d.includes('s')) hh=st.h+dy; if(d.includes('w')) ww=st.w-dx; if(d.includes('n')) hh=st.h-dy;
      ww=Math.max(220,ww); hh=Math.max(140,hh); if(d.includes('w')) x=st.x+st.w-ww; if(d.includes('n')) y=st.y+st.h-hh;
      x=clamp(x,-ww+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:ww,h:hh}); }
    else { let lo=-1e9,hi=1e9,lo2=-1e9,hi2=1e9;
      const tight=ev.shiftKey;   // z Shiftem okno nie może wystawać poza ekran
      start.forEach(r=>{ lo=Math.max(lo,(tight?0:-r.w+90)-r.x); hi=Math.min(hi,(tight?BW-r.w:BW-90)-r.x); lo2=Math.max(lo2,-r.y); hi2=Math.min(hi2,(tight?BH-r.h:BH-40)-r.y); });
      const dx=clamp(lastX-sx,lo,hi), dy=clamp(lastY-sy,lo2,hi2); let ddx=dx-cur.dx, ddy=dy-cur.dy;
      if(ev.shiftKey&&others.length){ const rects=start.map(r=>({...r,x:r.x+cur.dx,y:r.y+cur.dy})); [ddx,ddy]=sweepMove(rects,ddx,ddy,others); }
      cur.dx+=ddx; cur.dy+=ddy; grp.forEach((g,i)=>place(g,{x:start[i].x+cur.dx,y:start[i].y+cur.dy,w:start[i].w,h:start[i].h})); }
    refresh(); };
  const end=()=>{ if(done) return; done=true; document.body.classList.remove('dragging'); removeEventListener('mousemove',mv); removeEventListener('mouseup',end);
    document.removeEventListener('keydown',kd,true); document.removeEventListener('keyup',ku,true); hideHint(); collide=false;
    document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));   // po puszczeniu zostaje tylko okno chwycone
    orig.forEach((r,g)=>{ if(g.isConnected) savePos(g); }); updateContacts(); };
  const merge=()=>{ if(!collide) return; const ids=grp.map(g=>g.dataset.app), cs=contactList().filter(c=>ids.includes(c.a)!==ids.includes(c.b));
    if(!cs.length) return;
    cs.forEach(c=>{ const mine=ids.includes(c.a)?c.a:c.b, other=mine===c.a?c.b:c.a; if(!linked(mine,other)) S.aw.links.push([mine,other]); });
    save(); rebase(); grp.forEach(g=>{ g.style.zIndex=++zTop; }); w.style.zIndex=++zTop; toast(t('Okna scalone')); refresh(); };
  const unmerge=()=>{ if(!S.aw.links.some(l=>l.includes(id))) return; S.aw.links=S.aw.links.filter(l=>!l.includes(id)); save(); rebase(); toast(t('Okno oddzielone')); refresh(); };
  const kd=ev=>{ const k=ev.key;
    if(k==='Escape'){ ev.stopPropagation(); orig.forEach((r,g)=>place(g,r)); end(); }
    else if(k==='Shift'){ hintChip('sh',true); collide=!d; refresh(); }
    else if(!d&&(k==='m'||k==='M')){ ev.preventDefault(); merge(); }
    else if(!d&&(k==='u'||k==='U')){ ev.preventDefault(); unmerge(); } };
  const ku=ev=>{ if(ev.key==='Shift'){ hintChip('sh',false); collide=false; refresh(); } };
  addEventListener('mousemove',mv); addEventListener('mouseup',end); document.addEventListener('keydown',kd,true); document.addEventListener('keyup',ku,true);
}
addEventListener('resize',()=>{ const box=$('aws').getBoundingClientRect(); document.querySelectorAll('.aw').forEach(w=>{ const x=clamp(parseFloat(w.style.left),-parseFloat(w.style.width)+90,Math.max(0,box.width-90)), y=clamp(parseFloat(w.style.top),0,Math.max(0,box.height-40)); w.style.left=x+'px'; w.style.top=y+'px'; }); updateContacts(); });
function setWinSize(w,nw,nh){ const r=rectOf(w), box=$('aws').getBoundingClientRect(); place(w,{x:clamp(r.x,0,Math.max(0,box.width-nw)),y:r.y,w:nw,h:nh}); savePos(w); updateContacts(); }
// sekcja w ustawieniach
function appCard(id,added){ const a=APP[id]; return `<div class="ap${added?' added':''}" data-ap="${id}" data-add="${added?0:1}"><i class="ic">${a.ic}</i><div class="apn"><b>${esc(a.n)}</b><small>${a.ph?'wkrótce':esc(a.d||'')}</small></div><em class="apact">${added?'− Usuń':'＋ Dodaj'}</em></div>`; }
function renderApps(){
  const A=S.settings.apps, bar=A.bar.filter(id=>APP[id]), avail=APPS.filter(a=>!bar.includes(a.id)), u=S.settings.ui;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PASEK APLIKACJI</h5>
  <label class="ck"><input type="checkbox" id="appson" ${A.on?'checked':''}><span class="tg"></span>Pokaż pasek aplikacji</label>
  <div class="ad ${A.on?'open':''}" id="appsad"><div class="adi" id="applists">${appLists(bar,avail)}</div></div>
  <h5>OKNA APLIKACJI</h5><label class="ck"><input type="checkbox" id="rnd" ${u.round?'checked':''}><span class="tg"></span>Okrągłe okna aplikacji 🙃</label><p class="hint">Żartobliwa opcja: okna stają się kołami, a pasek tytułu zajmuje górny łuk.</p>
  <label class="ck"><input type="checkbox" data-an="apps" ${u.anim.apps?'checked':''}><span class="tg"></span>Animacje aplikacji</label>
  <h5>TŁO APLIKACJI</h5><label class="ck"><input type="checkbox" id="afxon" ${S.settings.afx.on?'checked':''}><span class="tg"></span>Spokojne cząsteczki w tle aplikacji</label>
  ${[['calc','Kalkulator'],['notes','Notatnik'],['clock','Zegar'],['conv','Konwerter'],['files','Zmieniacz formatów'],['tr','Tłumacz'],['gej','Gejos.exe'],['dice','Kości'],['mine','Saper'],['snake','Snake']].map(([k,n])=>sl('afx.'+k,n,0,100,S.settings.afx[k],'afx')).join('')}<p class="hint">0% wyłącza efekt w danej aplikacji.</p>`;
  paintSliders();
}
const APPCATS=[['prog','Programy'],['game','Gry']], APPGAMES=new Set(['gej','dice','mine','snake']), appCat=id=>APPGAMES.has(id)?'game':'prog';
const appLists=(bar,avail)=>`<h5>DODANE DO PASKA</h5>${bar.length?bar.map(id=>appCard(id,true)).join(''):'<p class="hint">Kliknij aplikację poniżej, aby ją dodać.</p>'}
  <h5>DOSTĘPNE APLIKACJE</h5>${avail.length?APPCATS.map(([k,n])=>{ const l=avail.filter(a=>appCat(a.id)===k); return l.length?`<div class="apcat">${n}</div>`+l.map(a=>appCard(a.id,false)).join(''):''; }).join(''):'<p class="hint">Wszystkie aplikacje są już na pasku.</p>'}`;
function toggleAdd(id,add){
  const A=S.settings.apps; if(!APP[id]) return;
  if(add){ if(!A.bar.includes(id)) A.bar.push(id); } else { A.bar=A.bar.filter(x=>x!==id); if(winOf(id)) closeApp(id); }
  const bar=A.bar.filter(i=>APP[i]), avail=APPS.filter(a=>!bar.includes(a.id)), box=$('applists');
  if(box) box.innerHTML=appLists(bar,avail);
  renderBar(); save();
}

