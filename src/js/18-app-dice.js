// ---------- aplikacja: kości do gry ----------
const DC_T=[3,4,5,6,8,10,12,16,20,24,30,100], DC_MAX=30, DC_FS={3:26,4:21,5:25,6:30,8:25,10:26,12:25,16:23,20:19,24:23,30:21,100:24};
const DC_PIPS={1:[[50,50]],2:[[34,34],[66,66]],3:[[34,34],[50,50],[66,66]],4:[[34,34],[66,34],[34,66],[66,66]],5:[[34,34],[66,34],[50,50],[34,66],[66,66]],6:[[34,31],[66,31],[34,50],[66,50],[34,69],[66,69]]};
function dcRand(n){ const a=new Uint32Array(1), lim=Math.floor(4294967296/n)*n; do{ crypto.getRandomValues(a); }while(a[0]>=lim); return a[0]%n+1; }   // równomiernie, bez przesunięcia modulo
const dcPts=(n,rot,r,cx=50,cy=50)=>Array.from({length:n},(_,i)=>{ const a=(rot+i*360/n)*Math.PI/180; return [cx+r*Math.sin(a),cy-r*Math.cos(a)]; });
const dcSc=(a,k,c)=>a.map(p=>[c[0]+(p[0]-c[0])*k,c[1]+(p[1]-c[1])*k]);
function dcShape(n){   // sylwetki jak na prawdziwych kościach widzianych od frontu
  switch(n){
    case 3: return {o:dcPts(3,180,48,50,43),c:[50,43],k:.58};
    case 4: return {o:dcPts(3,0,50,50,57),c:[50,57],k:.58};
    case 5: return {o:dcPts(5,180,46,50,47),c:[50,47],k:.6};
    case 6: return {o:[[10,10],[90,10],[90,90],[10,90]],c:[50,50],k:.72};
    case 8: return {o:[[50,4],[90,50],[50,96],[10,50]],c:[50,50],k:.6};
    case 10: case 100: return {o:[[50,4],[91,38],[50,96],[9,38]],c:[50,46],k:.6};
    case 12: return {o:dcPts(5,0,47,50,54),c:[50,54],k:.62};
    case 16: return {o:dcPts(8,22.5,47),c:[50,50],k:.62};
    case 20: return {o:dcPts(6,0,47),c:[50,50],k:.6,tri:1};
    case 24: return {o:dcPts(10,0,47),c:[50,50],k:.62};
    default: return {o:dcPts(12,15,47),c:[50,50],k:.64};
  }
}
function dcSvg(n,v,pips){
  const s=dcShape(n), P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  let g=`<polygon class="dco" points="${P(s.o)}"/>`, ins;
  if(s.tri){ const O=s.o; ins=dcPts(3,0,47*s.k);   // D20: środkowy trójkąt i trzy „skrzydła” ścianek
    for(let m=0;m<3;m++) g+=`<polygon class="dcf${m%2}" points="${P([ins[m],O[2*m],O[(2*m+1)%6],O[(2*m+2)%6],ins[(m+1)%3]])}"/>`; }
  else { ins=dcSc(s.o,s.k,s.c); const L=s.o.length; for(let i=0;i<L;i++){ const j=(i+1)%L; g+=`<polygon class="dcf${i%2}" points="${P([s.o[i],s.o[j],ins[j],ins[i]])}"/>`; } }
  g+=`<polygon class="dci" points="${P(ins)}"/>`;
  if(n===6&&pips) (DC_PIPS[v]||[]).forEach(p=>{ g+=`<circle class="dcq" cx="${p[0]}" cy="${p[1]}" r="6.4"/>`; });
  else { const d=String(v).length, fs=DC_FS[n]*(d===1?1:d===2?.84:.66); g+=`<text class="dct" x="${s.c[0]}" y="${s.c[1]}" font-size="${fs.toFixed(1)}">${v}</text>`; }
  return `<svg viewBox="0 0 100 100" class="dcs">${g}</svg>`;
}
function mountDice(el,w){
  const D=(S.aw.data.dice=S.aw.data.dice||{pool:{6:1},mod:0,hist:[]});
  D.pool=D.pool&&typeof D.pool==='object'?D.pool:{6:1}; D.mod=Math.max(-999,Math.min(999,D.mod|0)); D.hist=Array.isArray(D.hist)?D.hist.slice(0,15):[];
  DC_T.forEach(n=>{ D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]|0)); });
  el.innerHTML=`<div class="dcr"><div class="dcx"><div class="dcsum"><span>Suma</span><b class="dctot">–</b><small class="dcrng"></small></div>
    <div class="dcst"><p class="dch">Wybierz kości i rzuć</p></div><div class="dcfm"></div></div>
    <div class="dcbr"><button class="dcroll">Rzuć kośćmi</button><button class="dcbt dcclr">Wyczyść wybór</button></div>
    <div class="dcl"><span>Wybierz kości</span></div><div class="dcg">${DC_T.map(n=>`<div class="dcc" data-n="${n}"><button class="dcp" title="Dodaj">${dcSvg(n,n,false)}<em></em></button><span>D${n}</span><button class="dcm" title="Usuń">−</button></div>`).join('')}</div>
    <div class="dcmod"><span>Modyfikator</span><button class="dcbt" data-m="-1">−</button><b class="dcmv"></b><button class="dcbt" data-m="1">+</button></div>
    <div class="dcl"><span>Historia rzutów</span><button class="dchc">Wyczyść historię</button></div><ul class="dchs"></ul>
    <p class="hint">Kliknij kość w wyniku, aby rzucić nią ponownie.</p></div>`;
  const q=s=>el.querySelector(s), live=()=>el.isConnected, anim=()=>!document.body.classList.contains('na-apps');
  let cur=[], fm='', rmod=0, busy=0, iv=null;
  const cnt=()=>DC_T.reduce((a,n)=>a+D.pool[n],0), hl=d=>d.n>=6&&d.v===d.n?' mx':(d.n===20&&d.v===1?' mn':''), total=()=>cur.reduce((a,d)=>a+d.v,0)+rmod;
  const label=()=>DC_T.filter(n=>D.pool[n]).map(n=>(D.pool[n]>1?D.pool[n]:'')+'D'+n).join(' + ')+(D.mod?(D.mod>0?' + ':' − ')+Math.abs(D.mod):'');
  function paintPool(n){ const c=q(`.dcc[data-n="${n}"]`); c.classList.toggle('on',D.pool[n]>0); c.querySelector('em').textContent=D.pool[n]||''; }
  function range(){ const c=cnt(), mx=DC_T.reduce((a,n)=>a+D.pool[n]*n,0); q('.dcrng').textContent=c?t('Zakres: {a}–{b}').replace('{a}',c+D.mod).replace('{b}',mx+D.mod):''; q('.dcmv').textContent=D.mod>0?'+'+D.mod:String(D.mod); }
  function histR(){ q('.dchs').innerHTML=D.hist.length?D.hist.map(h=>`<li><b>${h.tot}</b><span>${esc(h.fm)}</span><i>${esc(h.v)}</i></li>`).join(''):'<li class="dce">Brak rzutów</li>'; }
  function stage(){ const st=q('.dcst'), n=cur.length;
    if(!n){ st.innerHTML='<p class="dch">Wybierz kości i rzuć</p>'; return; }
    st.style.setProperty('--ds',(n<=6?72:n<=12?58:n<=20?48:40)+'px'); st.classList.toggle('sh',n<=12);
    st.innerHTML=cur.map((d,i)=>`<button class="dcd" data-i="${i}" title="Rzuć ponownie tą kością">${dcSvg(d.n,d.v,true)}</button>`).join(''); }
  function settle(targets,full){
    const ds=q('.dcst').querySelectorAll('.dcd'); targets.forEach(i=>{ const b=ds[i], d=cur[i]; if(!b) return; b.className='dcd'+hl(d); b.style.animationDelay=''; b.innerHTML=dcSvg(d.n,d.v,true); });
    const tt=q('.dctot'); tt.textContent=total(); q('.dcfm').textContent=fm+' = '+total(); if(anim()){ tt.classList.remove('pop'); void tt.offsetWidth; tt.classList.add('pop'); }
    const rec={fm,tot:total(),v:cur.map(d=>d.v).join(', ')};
    if(full) D.hist.unshift(rec); else if(D.hist.length) D.hist[0]=rec;
    D.hist.length=Math.min(D.hist.length,15); histR(); save(); busy=0; }
  function roll(i){
    if(busy||!live()) return; const full=i===undefined;
    if(full){ const list=[]; DC_T.forEach(n=>{ for(let k=0;k<D.pool[n];k++) list.push(n); });
      if(!list.length) return toast(t('Wybierz co najmniej jedną kość'));
      cur=list.map(n=>({n,v:dcRand(n)})); fm=label(); rmod=D.mod; stage(); }
    else { const d=cur[i]; if(!d) return; d.v=dcRand(d.n); }
    const targets=full?cur.map((_,k)=>k):[i];
    if(!anim()){ settle(targets,full); return; }
    busy=1; const ds=q('.dcst').querySelectorAll('.dcd'), t0=performance.now(), end=targets.map((_,k)=>520+Math.min(k*35,420));
    q('.dctot').textContent='…';
    targets.forEach((i2,k)=>{ const b=ds[i2]; b.classList.add('rl'); b.style.animationDelay=Math.min(k*35,420)+"ms"; });
    clearInterval(iv); iv=setInterval(()=>{
      if(!live()){ clearInterval(iv); return; } const ms=performance.now()-t0; let done=true;
      targets.forEach((i2,k)=>{ const d=cur[i2], b=ds[i2]; if(!b) return; if(ms<end[k]){ done=false; if(d.n!==6||Math.random()<.5) b.innerHTML=dcSvg(d.n,dcRand(d.n),true); } else if(b.dataset.f!=='1'){ b.dataset.f='1'; b.innerHTML=dcSvg(d.n,d.v,true); } });
      if(done){ clearInterval(iv); settle(targets,full); targets.forEach(i2=>{ if(ds[i2]) ds[i2].dataset.f=''; }); }
    },75); }
  function add(n,dv){ if(dv>0&&cnt()>=DC_MAX) return toast(t('Maksymalnie {n} kości naraz').replace('{n}',DC_MAX)); D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]+dv)); paintPool(n); range(); saveSoon(); }
  el.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!el.contains(b)) return;
    if(b.classList.contains('dcroll')) return roll();
    if(b.classList.contains('dcd')) return roll(+b.dataset.i);
    const ch=b.closest('.dcc'); if(ch&&b.classList.contains('dcp')) return add(+ch.dataset.n,1); if(ch&&b.classList.contains('dcm')) return add(+ch.dataset.n,-1);
    if(b.dataset.m){ D.mod=Math.max(-999,Math.min(999,D.mod+ +b.dataset.m)); range(); saveSoon(); return; }
    if(b.classList.contains('dcclr')){ DC_T.forEach(n=>{ D.pool[n]=0; paintPool(n); }); range(); saveSoon(); return; }
    if(b.classList.contains('dchc')){ D.hist=[]; histR(); save(); } });
  el.addEventListener('contextmenu',e=>{ const ch=e.target.closest('.dcc'); if(ch){ e.preventDefault(); add(+ch.dataset.n,-1); } });
  DC_T.forEach(paintPool); range(); histR();
  el.__dc={roll,get cur(){ return cur; }};
}

