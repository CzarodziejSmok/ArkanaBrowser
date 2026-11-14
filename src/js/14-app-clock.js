// ---------- aplikacja: zegar, alarmy, minutnik, stoper i kalendarz ----------
const pad2=n=>String(n).padStart(2,'0');
const dkey=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const CLD=()=>{ const D=(S.aw.data.clock=S.aw.data.clock||{});
  const d={tab:'clock',style:'a',h24:true,alarms:[],snooze:[],timer:{dur:300,end:0,left:300,run:false},tsnd:'beep',sw:{run:false,t0:0,acc:0,laps:[]},events:{},sel:'',cm:''};
  for(const k in d) if(D[k]===undefined) D[k]=d[k]; return D; };
// --- dźwięki (WebAudio, bez plików) ---
const SNDN=[['bell','Dzwonek'],['beep','Budzik'],['rise','Narastający'],['chime','Melodia'],['pulse','Cichy puls']];
let AUDX=null, sndT=null;
function audio(){ try{ AUDX=AUDX||new (window.AudioContext||window.webkitAudioContext)(); if(AUDX.state==='suspended') AUDX.resume(); }catch{} return AUDX; }
function tone(f,t0,dur,type,vol){ const o=AUDX.createOscillator(), g=AUDX.createGain(); o.type=type; o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(vol,t0+.015); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g); g.connect(AUDX.destination); o.start(t0); o.stop(t0+dur+.05); }
const SND={
  bell:t=>{ [880,1320,1760].forEach((f,i)=>tone(f,t,1.5/(i+1),'sine',.24/(i+1))); return 2; },
  beep:t=>{ for(let i=0;i<4;i++) tone(1000,t+i*.18,.1,'square',.1); return 1.4; },
  rise:t=>{ [523,659,784,1047].forEach((f,i)=>tone(f,t+i*.2,.4,'triangle',.22)); return 1.6; },
  chime:t=>{ [659,587,523,587,659,659,659].forEach((f,i)=>tone(f,t+i*.28,.32,'sine',.22)); return 2.4; },
  pulse:t=>{ tone(440,t,.5,'sine',.2); tone(440,t+.7,.5,'sine',.2); return 1.6; }
};
function stopSnd(){ clearInterval(sndT); sndT=null; }
function playSnd(id,loop){ stopSnd(); if(!audio()) return; const f=SND[id]||SND.bell;
  const once=()=>{ try{ return f(AUDX.currentTime+.03); }catch{ return 2; } }, per=once(); if(loop) sndT=setInterval(once,(per+.7)*1000); }
// --- dzwonienie alarmu: otwiera aplikację lub wynosi ją na wierzch ---
const RING=[]; let CLK=null;   // CLK = uchwyt otwartej aplikacji (ring/refresh)
function ringStart(r){
  RING.push(r); playSnd(r.snd,true); document.body.classList.remove('noapps');
  try{ window.api.attention(); }catch{}
  const w=winOf('clock'); if(w&&!w.classList.contains('out')) focusWin(w); else openApp('clock');
  CLK&&CLK.ring();
}
function clockTick(){
  if(SEC) return;
  const D=CLD(), now=new Date(), ms=+now, stamp=dkey(now)+' '+pad2(now.getHours())+':'+pad2(now.getMinutes()); let dirty=false;
  D.alarms.forEach(a=>{ if(!a.on) return; const lab=pad2(a.h)+':'+pad2(a.m);
    if(a.days&&a.days.length){
      if(a.h===now.getHours()&&a.m===now.getMinutes()&&a.days.includes(now.getDay())&&a.last!==stamp){ a.last=stamp; dirty=true; ringStart({t:lab,n:a.note||'',snd:a.snd}); } }
    else { const at=new Date(a.date+'T'+lab+':00').getTime();
      if(ms>=at){ a.on=false; a.last=stamp; dirty=true; if(ms-at<120000) ringStart({t:lab,n:a.note||'',snd:a.snd}); else a.missed=true; } } });
  const sn=D.snooze.length; D.snooze=D.snooze.filter(s=>{ if(ms<s.until) return true; ringStart({t:s.t,n:s.n,snd:s.snd}); return false; }); if(D.snooze.length!==sn) dirty=true;
  const T=D.timer; if(T.run&&ms>=T.end){ T.run=false; T.left=T.dur; dirty=true; ringStart({t:t('Minutnik'),n:t('Czas minął'),snd:D.tsnd,timer:1}); }
  if(RING.length&&!winOf('clock')){ RING.length=0; stopSnd(); renderBar(); }   // zamknięcie okna = wyciszenie
  if(dirty){ save(); CLK&&CLK.refresh(); }
}
setInterval(clockTick,1000);
// --- tarcze ---
function anSvg(st){ const a=st==='a'; let s='<svg viewBox="-100 -100 200 200" class="cl-an"><circle r="97" class="cl-rim"/>';
  for(let i=0;i<60;i++){ const big=i%5===0; if(!a&&!big) continue; const r1=big?(a?80:78):89, g=i*Math.PI/30, sn=Math.sin(g), cs=-Math.cos(g);
    s+=`<line class="cl-tk${big?' b':''}" x1="${(sn*r1).toFixed(2)}" y1="${(cs*r1).toFixed(2)}" x2="${(sn*92).toFixed(2)}" y2="${(cs*92).toFixed(2)}"/>`; }
  if(a) for(let n=1;n<=12;n++){ const g=n*Math.PI/6; s+=`<text class="cl-nm" x="${(Math.sin(g)*64).toFixed(2)}" y="${(-Math.cos(g)*64).toFixed(2)}">${n}</text>`; }
  return s+'<line class="cl-hh" x1="0" y1="8" x2="0" y2="-44"/><line class="cl-mh" x1="0" y1="10" x2="0" y2="-66"/><line class="cl-sh" x1="0" y1="16" x2="0" y2="-76"/><circle r="4" class="cl-pin"/></svg>'; }
const SEG7={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
const hseg=(x1,x2,y,t=3.2)=>`${x1},${y} ${x1+t},${y-t} ${x2-t},${y-t} ${x2},${y} ${x2-t},${y+t} ${x1+t},${y+t}`;
const vseg=(x,y1,y2,t=3.2)=>`${x},${y1} ${x+t},${y1+t} ${x+t},${y2-t} ${x},${y2} ${x-t},${y2-t} ${x-t},${y1+t}`;
const SEGP={a:hseg(5,31,4),g:hseg(5,31,35),d:hseg(5,31,66),b:vseg(34,6,33),c:vseg(34,37,64),f:vseg(2,6,33),e:vseg(2,37,64)};
const DIGX=[0,46,112,158,224,270];
function digSvg(){ let s='<svg viewBox="-4 -2 316 74" class="cl-dg">';
  DIGX.forEach((x,i)=>{ s+=`<g transform="translate(${x},0)" data-i="${i}">`+Object.keys(SEGP).map(k=>`<polygon class="sg" data-s="${k}" points="${SEGP[k]}"/>`).join('')+'</g>'; });
  [98,210].forEach(x=>{ s+=`<circle class="cl-col" cx="${x}" cy="22" r="3.6"/><circle class="cl-col" cx="${x}" cy="48" r="3.6"/>`; });
  return s+'</svg>'; }
function mountClock(el,w){
  const D=CLD(), L=IL();
  if(!D.cm) D.cm=dkey(new Date()).slice(0,7); if(!D.sel) D.sel=dkey(new Date());
  el.innerHTML='<div class="clk" tabindex="0"><div class="cl-tabs"><i class="cl-ind"></i></div><div class="cl-body"></div><div class="cl-rg"></div></div>';
  const root=el.firstElementChild, tabs=root.querySelector('.cl-tabs'), ind=tabs.querySelector('.cl-ind'), holder=root.querySelector('.cl-body'), rg=root.querySelector('.cl-rg');
  let body=document.createElement('div'); body.className='cl-pg'; holder.appendChild(body);
  const TABS=[['clock','Zegar'],['alarms','Alarmy'],['timer','Minutnik'],['sw','Stoper'],['cal','Kalendarz']];
  let edit=null, live=null, pickOpen=false, pickY=0;
  const wd=i=>new Date(2024,0,7+i).toLocaleDateString(L,{weekday:'short'}), WD=[1,2,3,4,5,6,0];
  const sndOpts=sel=>SNDN.map(([k,n])=>`<option value="${k}"${sel===k?' selected':''}>${n}</option>`).join('');
  const fmtT=s=>{ s=Math.max(0,Math.ceil(s-1e-6)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60); return (h?h+':'+pad2(m):m)+':'+pad2(s%60); };
  const fmtS=ms=>{ const cs=Math.floor(ms/10)%100, s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000)%60, h=Math.floor(ms/3600000); return (h?h+':'+pad2(m):m)+':'+pad2(s)+'.'+pad2(cs); };
  const dsum=a=>a.days&&a.days.length?(a.days.length===7?t('Codziennie'):WD.filter(d=>a.days.includes(d)).map(wd).join(' ')):new Date(a.date+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'});
  // ===== zegar =====
  function vClock(){
    const st=D.style;
    body.innerHTML=`<div class="cl-pc"><div class="cl-chips">${[['a','Tarcza'],['d','Cyfrowy'],['m','Bez numerów']].map(([k,n])=>`<button data-st="${k}" class="${st===k?'on':''}">${n}</button>`).join('')}</div>
      <div class="cl-face">${st==='d'?digSvg():anSvg(st)}</div><div class="cl-date"></div>${st==='d'?`<label class="ck"><input type="checkbox" class="cl-h24"${D.h24?' checked':''}><span class="tg"></span>Format 24-godzinny</label>`:''}</div>`;
    const dt=body.querySelector('.cl-date'); let dl='';
    const setDate=(n,ap)=>{ const k=dkey(n)+ap; if(k===dl) return; dl=k; dt.textContent=(ap?ap.trim()+' · ':'')+capF(n.toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long',year:'numeric'})); };
    if(st==='d'){ const gs=[...body.querySelectorAll('.cl-dg g')], cols=body.querySelectorAll('.cl-col'), last=[]; let lc=null;
      live=()=>{ const n=new Date(); let h=n.getHours(), ap=''; if(!D.h24){ ap=h<12?' AM':' PM'; h=h%12||12; }
        const ds=pad2(h)+pad2(n.getMinutes())+pad2(n.getSeconds());
        gs.forEach((g,i)=>{ if(last[i]===ds[i]) return; last[i]=ds[i]; const on=SEG7[ds[i]]; g.querySelectorAll('.sg').forEach(p=>p.classList.toggle('on',on.includes(p.dataset.s))); });
        const c=n.getSeconds()%2===0; if(c!==lc){ lc=c; cols.forEach(x=>x.classList.toggle('off',!c)); } setDate(n,ap); }; }
    else { const hh=body.querySelector('.cl-hh'), mh=body.querySelector('.cl-mh'), sh=body.querySelector('.cl-sh');
      live=()=>{ const n=new Date(), s=n.getSeconds()+n.getMilliseconds()/1000, m=n.getMinutes()+s/60, h=(n.getHours()%12)+m/60;
        hh.setAttribute('transform','rotate('+h*30+')'); mh.setAttribute('transform','rotate('+m*6+')'); sh.setAttribute('transform','rotate('+s*6+')'); setDate(n,''); }; }
    live();
  }
  // ===== alarmy =====
  function vAlarms(){
    if(edit) return vForm();
    const al=[...D.alarms].sort((x,y)=>x.h*60+x.m-(y.h*60+y.m));
    body.innerHTML=`<div class="cl-pc"><div class="cl-top"><button class="cl-new">＋ Nowy alarm</button></div><div class="cl-al">${al.length?al.map(a=>
      `<div class="cl-a${a.on?' on':''}"><div class="cl-at"><b>${pad2(a.h)}:${pad2(a.m)}</b><small>${esc(dsum(a))}${a.missed&&!a.on?' · '+esc(t('ominięty')):''}</small>${a.note?`<em>${esc(a.note)}</em>`:''}</div>
      <label class="ck"><input type="checkbox" data-tg="${a.id}"${a.on?' checked':''}><span class="tg"></span></label><button class="cl-ib" data-ed="${a.id}" title="Edytuj">✎</button><button class="cl-ib" data-rm="${a.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak alarmów.</p>'}</div></div>`;
  }
  function vForm(){
    const e=edit;
    body.innerHTML=`<div class="cl-pc"><label class="cl-f"><span>Godzina</span><input type="time" class="cl-tm" value="${pad2(e.h)}:${pad2(e.m)}"></label>
      <label class="cl-f"><span>Data</span><input type="date" class="cl-dt" value="${e.date}"></label>
      <div class="cl-f"><span>Powtarzaj</span><div class="cl-chips">${WD.map(d=>`<button data-wd="${d}" class="${e.days.includes(d)?'on':''}">${wd(d)}</button>`).join('')}</div></div>
      <p class="hint">Bez zaznaczonych dni alarm zadzwoni jednorazowo w wybranym dniu.</p>
      <label class="cl-f"><span>Notatka</span><input type="text" class="cl-nt" maxlength="120" placeholder="Notatka do alarmu…" value="${esc(e.note)}"></label>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-sn">${sndOpts(e.snd)}</select><button class="cl-ib cl-pv" title="Odsłuchaj">▶</button></div></div>
      <div class="cl-btns"><button class="cl-ok">Zapisz</button><button class="cl-cn">Anuluj</button></div></div>`;
  }
  function saveForm(){
    const e=edit, tm=body.querySelector('.cl-tm').value; if(!/^\d\d:\d\d$/.test(tm)) return toast(t('Podaj godzinę'));
    e.h=+tm.slice(0,2); e.m=+tm.slice(3); e.date=body.querySelector('.cl-dt').value||dkey(new Date()); e.note=body.querySelector('.cl-nt').value.trim(); e.snd=body.querySelector('.cl-sn').value;
    if(!e.days.length&&new Date(e.date+'T'+tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
    e.on=true; e.missed=false; e.last=''; const i=D.alarms.findIndex(a=>a.id===e.id); if(i>=0) D.alarms[i]=e; else D.alarms.push(e);
    edit=null; save(); draw();
  }
  // ===== minutnik =====
  function vTimer(){
    const T=D.timer, idle=!T.run&&T.left===T.dur, h=Math.floor(T.dur/3600), m=Math.floor(T.dur%3600/60), s=T.dur%60;
    body.innerHTML=`<div class="cl-pc"><div class="cl-rn"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="cl-r0"/><circle cx="60" cy="60" r="54" class="cl-r1" transform="rotate(-90 60 60)"/></svg>
      <div class="cl-big">${idle?`<div class="cl-ti"><input type="number" min="0" max="99" class="cl-n" data-u="h" value="${h}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="m" value="${pad2(m)}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="s" value="${pad2(s)}"></div>`:'<span class="cl-td"></span>'}</div></div>
      <div class="cl-chips cl-pr">${[[60,'1 min'],[300,'5 min'],[600,'10 min'],[900,'15 min'],[1800,'30 min'],[3600,'1 h']].map(([v,n])=>`<button data-pr="${v}"${T.dur===v?' class="on"':''}>${n}</button>`).join('')}</div>
      <div class="cl-btns"><button class="cl-go"${T.dur<=0?' disabled':''}>${T.run?'Pauza':T.left<T.dur?'Wznów':'Start'}</button><button class="cl-rs">Resetuj</button></div>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-tsn">${sndOpts(D.tsnd)}</select><button class="cl-ib cl-pv2" title="Odsłuchaj">▶</button></div></div></div>`;
    const td=body.querySelector('.cl-td'), r1=body.querySelector('.cl-r1'), C=2*Math.PI*54; r1.style.strokeDasharray=C;
    live=()=>{ const rem=T.run?Math.max(0,(T.end-Date.now())/1000):T.left; if(td){ const ts=fmtT(rem); if(td.textContent!==ts){ td.textContent=ts; td.classList.toggle('h',rem>=3600); } } r1.style.strokeDashoffset=T.dur>0?C*(1-rem/T.dur):C; };
    live();
  }
  // ===== stoper =====
  const swEl=()=>D.sw.acc+(D.sw.run?Date.now()-D.sw.t0:0);
  function vSw(){
    const W=D.sw, laps=W.laps, sp=laps.map(l=>l.s), mn=Math.min(...sp), mx=Math.max(...sp);
    body.innerHTML=`<div class="cl-pc"><div class="cl-sd">0:00.00</div><div class="cl-btns"><button class="cl-sg">${W.run?'Stop':W.acc>0?'Wznów':'Start'}</button><button class="cl-lp"${W.run?'':' disabled'}>Okrążenie</button><button class="cl-rs2"${!W.run&&W.acc>0?'':' disabled'}>Resetuj</button></div>
      <div class="cl-laps">${laps.map((l,i)=>`<div class="cl-l${laps.length>1&&l.s===mn?' best':laps.length>1&&l.s===mx?' worst':''}"><span>${laps.length-i}</span><b>${fmtS(l.s)}</b><small>${fmtS(l.tot)}</small></div>`).join('')}</div></div>`;
    const sd=body.querySelector('.cl-sd'); live=()=>{ const ms=swEl(); sd.textContent=fmtS(ms); sd.classList.toggle('sm',ms>=3600000); }; live();
  }
  // ===== kalendarz =====
  function pkHtml(Y,M){ const now=new Date(), ys=[]; for(let y=1900;y<=2200;y++) ys.push(y);
    return `<div class="cl-pk"><div class="cl-pkm">${Array.from({length:12},(_,i)=>`<button data-pm="${i}" class="${pickY===Y&&i===M-1?'on':''}${pickY===now.getFullYear()&&i===now.getMonth()?' now':''}">${esc(capF(new Date(2024,i,1).toLocaleDateString(L,{month:'long'})))}</button>`).join('')}</div>
      <div class="cl-pky">${ys.map(y=>`<button data-py="${y}" class="${y===pickY?'on':''}${y===now.getFullYear()?' now':''}">${y}</button>`).join('')}</div></div>`; }
  function vCal(){
    const [Y,M]=D.cm.split('-').map(Number), off=(new Date(Y,M-1,1).getDay()+6)%7, today=dkey(new Date()); let cells='';
    for(let i=0;i<42;i++){ const d=new Date(Y,M-1,1-off+i), k=dkey(d), has=(D.events[k]||[]).length;
      cells+=`<button class="cl-d${d.getMonth()!==M-1?' o':''}${k===today?' td':''}${k===D.sel?' sel':''}" data-d="${k}">${d.getDate()}${has?'<i></i>':''}</button>`; }
    body.innerHTML=`<div class="cl-pc"><div class="cl-ch"><button class="cl-ib" data-m="-1">‹</button><button class="cl-mt${pickOpen?' open':''}" title="Wybierz miesiąc i rok">${esc(capF(new Date(Y,M-1,1).toLocaleDateString(L,{month:'long',year:'numeric'})))}</button><button class="cl-ib" data-m="1">›</button><button class="cl-tdb">Dziś</button></div>
      ${pickOpen?pkHtml(Y,M):''}<div class="cl-wd">${WD.map(d=>`<span>${wd(d)}</span>`).join('')}</div><div class="cl-gr">${cells}</div><div class="cl-ev"></div></div>`;
    if(pickOpen){ const yl=body.querySelector('.cl-pky'), on=yl&&yl.querySelector('.on'); if(on) yl.scrollTop=on.offsetTop-yl.clientHeight/2+on.offsetHeight/2; }
    evList();
  }
  function evList(){
    const box=body.querySelector('.cl-ev'); if(!box) return; const list=(D.events[D.sel]||[]).slice().sort((a,b)=>(a.tm||'99').localeCompare(b.tm||'99'));
    box.innerHTML=`<div class="cl-evh">${esc(capF(new Date(D.sel+'T12:00').toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long'})))}</div>
      <div class="cl-evl">${list.length?list.map(e=>`<div class="cl-e"><span>${e.tm?esc(e.tm):'•'}</span><b>${esc(e.tt)}</b>${e.tm?`<button class="cl-ib" data-eal="${e.id}" title="Dodaj alarm">🔔</button>`:''}<button class="cl-ib" data-edl="${e.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak wydarzeń w tym dniu.</p>'}</div>
      <div class="cl-eva"><input type="time" class="cl-et"><input type="text" class="cl-etx" maxlength="80" placeholder="Nowe wydarzenie…"><button class="cl-ib cl-eab" title="Dodaj">＋</button></div>`;
  }
  // ===== wspólne =====
  const V={clock:vClock,alarms:vAlarms,timer:vTimer,sw:vSw,cal:vCal};
  const ORDER=TABS.map(x=>x[0]); let shown=null;
  tabs.insertAdjacentHTML('beforeend',TABS.map(([k,n])=>`<button data-t="${k}">${n}</button>`).join(''));
  function moveInd(anim){ const b=tabs.querySelector('button.on'); if(!b) return; ind.style.transition=anim?'':'none'; ind.style.left=b.offsetLeft+'px'; ind.style.width=b.offsetWidth+'px'; }
  new ResizeObserver(()=>moveInd(false)).observe(tabs);
  function draw(dir){   // dir: >0 nowa zakładka jest po prawej, <0 po lewej (animacja przejścia)
    live=null; tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===D.tab));
    const change=shown!==null&&shown!==D.tab;
    if(change&&dir&&!document.body.classList.contains('na-apps')){ const old=body; old.classList.add(dir>0?'o-l':'o-r'); setTimeout(()=>old.remove(),260); body=document.createElement('div'); body.className='cl-pg '+(dir>0?'i-r':'i-l'); holder.appendChild(body); }
    else if(change) body.innerHTML='';
    moveInd(shown!==null); shown=D.tab; (V[D.tab]||vClock)();
  }
  const newAlarm=()=>{ const n=new Date(Date.now()+3600000); return {id:uid(),h:n.getHours(),m:0,date:dkey(n),days:[],note:'',snd:'bell',on:true}; };
  const ring=()=>{ const r=RING[0]; rg.classList.toggle('on',!!r);
    rg.innerHTML=r?`<div class="cl-rb"><div class="cl-rk">${r.timer?'⏲️':'⏰'}</div><b class="cl-rt">${esc(r.t)}</b>${r.n?`<p class="cl-rnt">${esc(r.n)}</p>`:''}${RING.length>1?`<small>+${RING.length-1}</small>`:''}<div class="cl-btns"><button class="cl-off">Wyłącz</button><button class="cl-snz">Drzemka 5 min</button></div></div>`:''; };
  const dismiss=snz=>{ const r=RING.shift(); if(!r) return; if(snz) D.snooze.push({until:Date.now()+300000,t:r.t,n:r.n,snd:r.snd});
    save(); if(RING.length) playSnd(RING[0].snd,true); else { stopSnd(); renderBar(); } ring(); };
  const api={el,ring,refresh(){ if((D.tab==='alarms'&&!edit)||D.tab==='timer') draw(); }}; CLK=api;
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input,select,textarea')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    if(pickOpen&&!e.target.closest('.cl-pk,.cl-mt')){ pickOpen=false; if(D.tab==='cal') draw(); }
    const b=e.target.closest('button'); if(!b) return; const d=b.dataset;
    if(b.classList.contains('cl-off')) return dismiss(false); if(b.classList.contains('cl-snz')) return dismiss(true);
    if(d.t){ const dir=ORDER.indexOf(d.t)-ORDER.indexOf(D.tab); D.tab=d.t; edit=null; pickOpen=false; saveSoon(); return draw(dir); }
    if(d.st){ D.style=d.st; saveSoon(); return draw(); }
    if(b.classList.contains('cl-new')){ edit=newAlarm(); return draw(); }
    if(d.ed){ const a=D.alarms.find(x=>x.id===d.ed); if(a){ edit={...a,days:[...a.days]}; draw(); } return; }
    if(d.rm){ D.alarms=D.alarms.filter(x=>x.id!==d.rm); save(); return draw(); }
    if(d.wd){ const n=+d.wd, i=edit.days.indexOf(n); if(i<0) edit.days.push(n); else edit.days.splice(i,1); return b.classList.toggle('on',i<0); }
    if(b.classList.contains('cl-cn')){ edit=null; return draw(); } if(b.classList.contains('cl-ok')) return saveForm();
    if(b.classList.contains('cl-pv')) return playSnd(body.querySelector('.cl-sn').value,false);
    if(b.classList.contains('cl-pv2')) return playSnd(D.tsnd,false);
    const T=D.timer;
    if(d.pr){ T.dur=+d.pr; T.left=T.dur; T.run=false; saveSoon(); return draw(); }
    if(b.classList.contains('cl-go')){ audio();
      if(!T.run){ if(T.dur<=0) return; if(T.left<=0) T.left=T.dur; T.end=Date.now()+T.left*1000; T.run=true; } else { T.left=Math.max(0,(T.end-Date.now())/1000); T.run=false; }
      save(); return draw(); }
    if(b.classList.contains('cl-rs')){ T.run=false; T.left=T.dur; save(); return draw(); }
    const W=D.sw;
    if(b.classList.contains('cl-sg')){ if(W.run){ W.acc+=Date.now()-W.t0; W.run=false; } else { W.t0=Date.now(); W.run=true; } save(); return draw(); }
    if(b.classList.contains('cl-lp')){ if(!W.run) return; const tot=swEl(), prev=W.laps.length?W.laps[0].tot:0; W.laps.unshift({s:tot-prev,tot}); saveSoon(); return draw(); }
    if(b.classList.contains('cl-rs2')){ W.run=false; W.acc=0; W.laps=[]; save(); return draw(); }
    if(b.classList.contains('cl-mt')){ pickOpen=!pickOpen; pickY=+D.cm.slice(0,4); return draw(); }
    if(d.py){ pickY=+d.py; return draw(); }
    if(d.pm!==undefined){ D.cm=pickY+'-'+pad2(+d.pm+1); pickOpen=false; saveSoon(); return draw(); }
    if(d.m){ const [Y,M]=D.cm.split('-').map(Number), n=new Date(Y,M-1+(+d.m),1); D.cm=dkey(n).slice(0,7); saveSoon(); return draw(); }
    if(b.classList.contains('cl-tdb')){ const n=new Date(); D.sel=dkey(n); D.cm=D.sel.slice(0,7); saveSoon(); return draw(); }
    if(d.d){ D.sel=d.d; if(d.d.slice(0,7)!==D.cm){ D.cm=d.d.slice(0,7); saveSoon(); return draw(); }
      body.querySelectorAll('.cl-d').forEach(x=>x.classList.toggle('sel',x.dataset.d===D.sel)); saveSoon(); return evList(); }
    if(b.classList.contains('cl-eab')){ const tx=body.querySelector('.cl-etx').value.trim(); if(!tx) return body.querySelector('.cl-etx').focus();
      (D.events[D.sel]=D.events[D.sel]||[]).push({id:uid(),tt:tx,tm:body.querySelector('.cl-et').value}); saveSoon(); return draw(); }
    if(d.edl){ D.events[D.sel]=(D.events[D.sel]||[]).filter(x=>x.id!==d.edl); if(!D.events[D.sel].length) delete D.events[D.sel]; saveSoon(); return draw(); }
    if(d.eal){ const ev=(D.events[D.sel]||[]).find(x=>x.id===d.eal); if(!ev||!ev.tm) return;
      if(new Date(D.sel+'T'+ev.tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
      D.alarms.push({id:uid(),h:+ev.tm.slice(0,2),m:+ev.tm.slice(3),date:D.sel,days:[],note:ev.tt,snd:'bell',on:true}); save(); return toast(t('Alarm dodany')); }
  });
  root.addEventListener('change',e=>{ const i=e.target;
    if(i.dataset.tg){ const a=D.alarms.find(x=>x.id===i.dataset.tg); if(!a) return; a.on=i.checked; a.missed=false; a.last='';
      if(a.on&&!a.days.length){ const tm=pad2(a.h)+':'+pad2(a.m); let d=new Date(a.date+'T'+tm+':00'); if(d<=new Date()){ const n=new Date(); if(new Date(dkey(n)+'T'+tm+':00')<=n) n.setDate(n.getDate()+1); a.date=dkey(n); } }
      save(); return draw(); }
    if(i.classList.contains('cl-h24')){ D.h24=i.checked; saveSoon(); }
    else if(i.classList.contains('cl-tsn')){ D.tsnd=i.value; saveSoon(); } });
  root.addEventListener('input',e=>{ const i=e.target; if(!i.classList.contains('cl-n')) return;
    const n=[...body.querySelectorAll('.cl-n')].map(x=>Math.max(0,parseInt(x.value,10)||0)); D.timer.dur=Math.min(359999,n[0]*3600+n[1]*60+n[2]); D.timer.left=D.timer.dur; D.timer.run=false; saveSoon();
    const go=body.querySelector('.cl-go'); if(go) go.disabled=D.timer.dur<=0; body.querySelectorAll('[data-pr]').forEach(x=>x.classList.toggle('on',+x.dataset.pr===D.timer.dur)); });
  let lt=0; const loop=ts=>{ if(!el.isConnected){ if(CLK===api) CLK=null; return; } if(ts-lt>33){ lt=ts; if(live) live(); } requestAnimationFrame(loop); };
  draw(); ring(); requestAnimationFrame(loop);
}
