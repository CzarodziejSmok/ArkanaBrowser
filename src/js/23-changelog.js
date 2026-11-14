// ---------- ChangeLog: panel czytający CHANGELOG.txt z folderu aplikacji ----------
// Nagłówek wersji = linia znaków, linia "numer - nazwa", taka sama linia znaków. Znak = oznacza wersję niewydaną, znak * wydaną.
const CL={items:null,err:false,open:new Set(),c:{},busy:false,fail:false};
const clSep=/^([=*])\1{9,}\s*$/, CLT={en:'en',de:'de',es:'es',fr:'fr',he:'iw',zh:'zh-TW'};
const CLL=()=>CLT[S.settings.ui.lang]||'';   // '' = oryginał po polsku (polski, śląski)
const clHash=x=>{ let h=2166136261; for(let i=0;i<x.length;i++){ h^=x.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0).toString(36); };
function clParse(text){
  const L=text.replace(/^\uFEFF/,'').replace(/\r/g,'').split('\n'), hd=[];
  for(let i=0;i+2<L.length;i++) if(clSep.test(L[i])&&L[i+1].trim()&&!clSep.test(L[i+1])&&clSep.test(L[i+2])&&L[i][0]===L[i+2][0]){ hd.push({at:i,rel:L[i][0]==='*',title:L[i+1].trim()}); i+=2; }
  return hd.map((h,k)=>{
    const body=L.slice(h.at+3,k+1<hd.length?hd[k+1].at:L.length), m=/^((?:v?\d+(?:\.\d+)*)(?:\s*,\s*v?\d+(?:\.\d+)*)*)\s*(?:[-–—:]\s*)?(.*)$/.exec(h.title), items=[];
    body.forEach(l=>{ if(!l.trim()) return; if(/^- /.test(l)) items.push(l.slice(2).trim()); else if(items.length&&/^\s/.test(l)) items[items.length-1]+=' '+l.trim(); else items.push(l.trim()); });
    const vl=m?m[1].split(/\s*,\s*/):[], v=vl.join(', '), name=m?m[2]:h.title,
      vn=vl.map(x=>x.replace(/^v/i,'').split('.').map(Number)).sort((a,b)=>{ for(let i=0;i<Math.max(a.length,b.length);i++){ const d=(b[i]||0)-(a[i]||0); if(d) return d; } return 0; })[0]||[];
    return {id:'e'+k,k,v,vn,name,rel:h.rel,items,hash:clHash(h.title+'\n'+items.join('\n')),nh:clHash(name)}; })
  .sort((a,b)=>{ for(let i=0;i<Math.max(a.vn.length,b.vn.length);i++){ const d=(b.vn[i]||0)-(a.vn[i]||0); if(d) return d; } return b.k-a.k; });
}
const clGet=k=>{ if(k in CL.c) return CL.c[k]; let v=null; try{ v=JSON.parse(localStorage.getItem(k)); }catch{} return CL.c[k]=v; };
const clPut=(k,v)=>{ CL.c[k]=v; try{ localStorage.setItem(k,JSON.stringify(v)); }catch{ try{ Object.keys(localStorage).filter(x=>x.startsWith('cb-cl')).forEach(x=>localStorage.removeItem(x)); localStorage.setItem(k,JSON.stringify(v)); }catch{} } };
const clName=e=>{ const tl=CLL(); return enc((tl&&clGet('cb-clnm-'+tl+'-'+e.nh))||e.name); };
const clItems=e=>{ const tl=CLL(), c=tl&&clGet('cb-cltr-'+tl+'-'+e.hash); return c&&c.length===e.items.length?c:e.items; };
const clLi=x=>'<li dir="auto">'+esc(enc(x)).replace(/`([^`]+)`/g,'<code>$1</code>')+'</li>';
const clShown=()=>(CL.items||[]).filter(e=>e.rel?S.settings.cl.rel:S.settings.cl.unrel);
function clStatus(){ const el=$('clstat'); if(!el) return; el.textContent=!CLL()?'':CL.busy?t('Tłumaczenie na język interfejsu...'):CL.fail?t('Pokazano oryginał (po polsku), bo tłumaczenie jest niedostępne.'):''; }
function clRender(){
  const el=$('cl'), st=S.settings.cl, old=el.querySelector('.cllist'), top=old?old.scrollTop:0, list=clShown();
  const card=e=>`<div class="clc ${e.rel?'rel':'unrel'}${CL.open.has(e.id)?' open':''}" data-id="${e.id}"><div class="clh" role="button" tabindex="0" aria-expanded="${CL.open.has(e.id)}">${e.v?`<span class="clv">${esc(e.v)}</span>`:''}<span class="cln" dir="auto">${esc(clName(e))}</span><span class="clst">${e.rel?t('Wydana'):t('Niewydana')}</span><i class="clar"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></i></div><div class="clb"><div class="cli"><ul>${clItems(e).map(clLi).join('')}</ul></div></div></div>`;
  el.innerHTML=`<div class="sh"><b>ChangeLog</b><button id="clx">x</button></div>
  <div class="clbar"><label class="clchip ${st.rel?'on':''}"><input type="checkbox" data-f="rel" ${st.rel?'checked':''}>Wydane</label><label class="clchip ${st.unrel?'on':''}"><input type="checkbox" data-f="unrel" ${st.unrel?'checked':''}>Niewydane</label><span class="clcnt">${t('Wersji: {n}').replace('{n}',list.length)}</span></div>
  <p class="clstat" id="clstat"></p>
  <div class="cllist">${CL.err?`<p class="clempty">${t('Nie udało się wczytać pliku CHANGELOG.txt z folderu aplikacji.')}</p>`:list.length?list.map(card).join(''):`<p class="clempty">${t('Brak wpisów do pokazania.')}</p>`}</div>`;
  const nl=el.querySelector('.cllist'); if(nl) nl.scrollTop=top; clStatus();
}
async function clBatch(arr,tl){
  try{ const r=await trTranslate(arr.join('\n'),'pl',tl), o=r.text.replace(/\r/g,'').split('\n'); if(o.length===arr.length) return o;
    const res=[]; for(const x of arr){ const q=await trTranslate(x,'pl',tl); res.push(q.text.replace(/\n/g,' ').trim()); } return res; }
  catch{ return null; }
}
async function clTrNames(tl){
  const seen=new Set(), need=CL.items.filter(e=>e.name&&!clGet('cb-clnm-'+tl+'-'+e.nh)&&!seen.has(e.nh)&&seen.add(e.nh));
  if(!need.length) return true;
  const out=await clBatch(need.map(e=>e.name),tl); if(!out) return false;
  need.forEach((e,i)=>out[i]&&clPut('cb-clnm-'+tl+'-'+e.nh,out[i])); return true;
}
async function clTrBody(e,tl){
  const k='cb-cltr-'+tl+'-'+e.hash, c=clGet(k); if(c&&c.length===e.items.length) return true;
  const out=await clBatch(e.items,tl); if(!out) return false; clPut(k,out); return true;
}
function clPaint(e){
  const c=$('cl').querySelector(`.clc[data-id="${e.id}"]`); if(!c) return;
  c.querySelector('.cln').textContent=clName(e); c.querySelector('ul').innerHTML=clItems(e).map(clLi).join('');
}
let clTok=0;
async function clTr(){
  const tl=CLL(), tok=++clTok; CL.fail=false; CL.busy=false; if(!tl||!CL.items) return clStatus();
  CL.busy=true; clStatus(); let ok=await clTrNames(tl); if(tok!==clTok) return;
  CL.items.forEach(clPaint);
  for(const e of CL.items){ if(!CL.open.has(e.id)) continue; if(!(await clTrBody(e,tl))) ok=false; if(tok!==clTok) return; clPaint(e); }
  CL.busy=false; CL.fail=!ok; clStatus();
}
async function clTrOne(e){
  const tl=CLL(); if(!tl) return; CL.busy=true; clStatus(); const ok=await clTrBody(e,tl); CL.busy=false; CL.fail=!ok; clPaint(e); clStatus();
}
async function clLoad(){
  try{ const r=await window.api.changelog(); if(!r||!r.ok) throw 0; CL.items=clParse(r.text); CL.err=false; }catch{ CL.err=true; CL.items=CL.items||[]; }
  clRender(); clTr();
}
function toggleCl(v){
  const el=$('cl'), o=v===undefined?!el.classList.contains('open'):v; if(o===el.classList.contains('open')) return;
  if(o){ toggleSet(false); clRender(); el.classList.add('open'); clLoad(); } else el.classList.remove('open');
  $('clbtn').classList.toggle('on',o);
}
$('clbtn').onclick=()=>toggleCl();
$('cl').addEventListener('click',e=>{
  if(e.target.closest('#clx')) return toggleCl(false);
  const h=e.target.closest('.clh'); if(!h) return;
  const c=h.parentElement, id=c.dataset.id, on=!c.classList.contains('open'); c.classList.toggle('open',on); h.setAttribute('aria-expanded',on);
  on?CL.open.add(id):CL.open.delete(id);
  const en=on&&CL.items.find(x=>x.id===id); if(en) clTrOne(en);
});
$('cl').addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('clh')){ e.preventDefault(); e.target.click(); } });
$('cl').addEventListener('change',e=>{ const f=e.target.dataset.f; if(!f) return; S.settings.cl[f]=e.target.checked; save(); clRender(); });

// efekt kliknięcia: delikatna fala od miejsca dotknięcia (przyciski u góry, na dole paska i przycisk Arkana)
document.addEventListener('pointerdown',e=>{
  if(e.button||document.body.classList.contains('na-btn')) return;
  const b=e.target.closest&&e.target.closest('#bar button,#wc button,#sb .fd,#nf,#brand'); if(!b) return;
  const r=b.getBoundingClientRect(), z=Math.max(r.width,r.height)*2.2, w=document.createElement('span'), i=document.createElement('i');
  w.className='rpl'; i.style.cssText=`left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:${z}px;height:${z}px`; w.append(i); b.append(w); i.onanimationend=()=>w.remove();
},true);

