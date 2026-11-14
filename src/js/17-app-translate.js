// ---------- tło aplikacji: spokojne cząsteczki (wspólne dla wszystkich aplikacji) ----------
const AFXP=Array.from({length:40},(_,i)=>({x:Math.random(),y:Math.random(),r:(1+Math.random()*1.7)*2.4,s:.012+Math.random()*.02,a:.35+Math.random()*.55,k:i%2}));
let afxL=0;
setInterval(()=>{ if(document.hidden) return; const cs=document.querySelectorAll('canvas.afx'); if(!cs.length) return; const now=performance.now(), dt=afxL?Math.min(120,now-afxL):0; afxL=now;
  const A=S.settings.afx, still=document.body.classList.contains('na-apps');
  if(!still) AFXP.forEach(p=>{ p.y-=p.s*dt/500; if(p.y<-.05){ p.y=1.05; p.x=Math.random(); } });
  const spF=glowSp(fgRgb,64), spA=glowSp(acc2Rgb,64);
  cs.forEach(cv=>{ const w=cv.closest('.aw'); if(!w) return; const W=cv.clientWidth, H=cv.clientHeight; if(!W||!H) return;
    const v=A.on?(A[w.dataset.app]??50):0, k=v/100, sig=still?W+'|'+H+'|'+k+'|'+fgRgb+'|'+acc2Rgb:null;
    if(still&&cv._sg===sig) return;   // bez ruchu nie ma czego przerysowywać
    cv._sg=sig; if(cv.width!==W) cv.width=W; if(cv.height!==H) cv.height=H;
    const g=cv.getContext('2d'); g.clearRect(0,0,W,H); if(k<=0) return;
    const n=Math.min(AFXP.length,Math.round(6+34*k)), al=.08+.4*k;
    for(let i=0;i<n;i++){ const p=AFXP[i], r=p.r*2.2; g.globalAlpha=p.a*al; g.drawImage(p.k?spA:spF,p.x*W-r,p.y*H-r,2*r,2*r); }
    g.globalAlpha=1; }); },50);
// ---------- aplikacja: tłumacz (bez logowania i opłat, wymaga internetu) ----------
// Główne źródło: publiczny punkt końcowy tłumacza Google (bez klucza); zapasowe: MyMemory. Zapytania wykonuje proces główny.
const TRL=['af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','ny','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tl','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu'];
const TRFIX={iw:'he',jw:'jv'};   // kody Google -> kody ISO (nazwy języków, MyMemory)
function trChunks(text,MAX){ const out=[], enc=s=>encodeURIComponent(s).length; let cur='';
  const push=s=>{ if(cur&&enc(cur+s)>MAX){ out.push(cur); cur=''; } cur+=s; };
  text.split(/(?<=\n)/).forEach(line=>{ if(enc(line)<=MAX) return push(line);
    (line.match(/[^.!?。！？]*[.!?。！？]+\s*|[^.!?。！？]+$/g)||[line]).forEach(sen=>{ if(enc(sen)<=MAX) return push(sen); for(let i=0;i<sen.length;i+=Math.floor(MAX/9)) push(sen.slice(i,i+Math.floor(MAX/9))); }); });
  if(cur) out.push(cur); return out; }
const trErr=(r,svc)=>{ const m=(r&&r.err)||'net', e=new Error(m); e.svc=svc||/^http /.test(m)||m==='host'; return e; };
async function trGtx(chunk,sl,tl){
  const r=await window.api.httpGet(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`); if(!r||!r.ok) throw trErr(r);
  try{ const j=JSON.parse(r.body); return {text:j[0].map(s=>s[0]||'').join(''),det:j[2]||''}; }catch{ throw trErr(null,true); } }
async function trMym(chunk,sl,tl){
  const f=c=>TRFIX[c]||c, r=await window.api.httpGet(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent((sl==='auto'?'Autodetect':f(sl))+'|'+f(tl))}`); if(!r||!r.ok) throw trErr(r);
  try{ const j=JSON.parse(r.body); if(+j.responseStatus!==200) throw 0; return j.responseData.translatedText; }catch{ throw trErr(null,true); } }
async function trTranslate(text,sl,tl){
  try{ const parts=[]; let det=''; for(const c of trChunks(text,3000)){ const r=await trGtx(c,sl,tl); parts.push(r.text); det=det||r.det; } return {text:parts.join(''),det}; }
  catch(e){ if(!e.svc) throw e;   // błąd samej usługi -> spróbuj zapasowej; brak sieci -> przerwij
    const parts=[]; for(const c of trChunks(text,450)) parts.push(await trMym(c,sl,tl)); return {text:parts.join(''),det:''}; } }
function mountTr(el,w){
  const LC=S.settings.ui.lang, L=IL();
  const dflt={pl:'pl',szl:'pl',en:'en',de:'de',es:'es',fr:'fr',he:'iw',zh:'zh-TW'}[LC]||'en';
  const D=(S.aw.data.tr=S.aw.data.tr||{src:'auto',dst:dflt,text:''});
  if(D.src!=='auto'&&!TRL.includes(D.src)) D.src='auto'; if(!TRL.includes(D.dst)) D.dst=dflt; delete D.key;
  const nm=c=>{ try{ return capF(new Intl.DisplayNames([L],{type:'language'}).of(TRFIX[c]||c)); }catch{ return c; } };
  const opts=(sel,auto)=>(auto?`<option value="auto">${t('Wykryj język')}</option>`:'')+TRL.map(c=>[c,nm(c)]).sort((a,b)=>a[1].localeCompare(b[1],L)).map(([c,n])=>`<option value="${c}"${c===sel?' selected':''}>${esc(n)}</option>`).join('');
  el.innerHTML=`<div class="tr"><div class="tr-off">Brak połączenia z internetem. Tłumacz działa tylko online.</div><div class="tr-top"><select class="tr-sl"></select><button class="tr-sw" title="Zamień języki">⇄</button><select class="tr-dl"></select></div>
    <div class="tr-pn"><div class="tr-p"><textarea class="tr-in" placeholder="Wpisz tekst do przetłumaczenia…" spellcheck="false"></textarea><div class="tr-f"><span class="tr-cn"></span><button class="tr-x" title="Wyczyść">✕</button></div></div>
    <div class="tr-p tr-o"><textarea class="tr-ou" readonly placeholder="Tłumaczenie pojawi się tutaj"></textarea><div class="tr-f"><span class="tr-st"></span><button class="tr-cp" title="Kopiuj wynik">⧉</button></div></div></div></div>`;
  const root=el.firstElementChild, q=s=>root.querySelector(s), sl=q('.tr-sl'), dl=q('.tr-dl'), inn=q('.tr-in'), ou=q('.tr-ou'), cn=q('.tr-cn'), st=q('.tr-st'), off=q('.tr-off');
  let tok=0, tmr=0, det='';
  const fill=()=>{ sl.innerHTML=opts(D.src,true); dl.innerHTML=opts(D.dst,false); };
  const count=()=>{ cn.textContent=[...inn.value].length+' '+t('znaków'); };
  const net=()=>{ off.classList.toggle('on',!navigator.onLine); };
  async function run(){
    count(); D.text=inn.value; saveSoon(); clearTimeout(tmr); const txt=inn.value;
    if(!txt.trim()){ ou.value=''; st.textContent=''; ++tok; return; }
    if(!navigator.onLine){ ++tok; st.textContent=t('Brak połączenia z internetem. Tłumacz działa tylko online.'); return; }
    const my=++tok; st.textContent=t('Tłumaczenie…');
    try{ const r=await trTranslate(txt,D.src,D.dst); if(my!==tok||!el.isConnected) return;
      ou.value=r.text; det=r.det||''; st.textContent=D.src==='auto'&&det?t('Wykryto: {l}').replace('{l}',nm(det)):''; }
    catch(e){ if(my===tok&&el.isConnected) st.textContent=t(e.svc?'Usługa tłumaczenia jest chwilowo niedostępna. Spróbuj ponownie za chwilę.':'Brak połączenia z internetem. Tłumacz działa tylko online.'); } }
  sl.onchange=()=>{ D.src=sl.value; run(); }; dl.onchange=()=>{ D.dst=dl.value; run(); };
  inn.addEventListener('input',()=>{ count(); clearTimeout(tmr); tmr=setTimeout(run,650); });
  inn.addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){ e.preventDefault(); run(); } });
  q('.tr-x').onclick=()=>{ inn.value=''; ou.value=''; run(); inn.focus(); };
  q('.tr-cp').onclick=()=>{ if(!ou.value) return; try{ navigator.clipboard.writeText(ou.value).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} };
  q('.tr-sw').onclick=()=>{ const s=D.src==='auto'?(TRL.includes(det)?det:'en'):D.src; D.src=D.dst; D.dst=s; inn.value=ou.value; ou.value=''; fill(); run(); };
  const on=()=>{ if(!el.isConnected){ removeEventListener('online',on); removeEventListener('offline',on); return; } net(); if(navigator.onLine&&inn.value.trim()&&!ou.value) run(); };
  addEventListener('online',on); addEventListener('offline',on);
  new ResizeObserver(()=>root.classList.toggle('narrow',el.clientWidth<500)).observe(el);
  fill(); inn.value=D.text||''; count(); net(); if(inn.value.trim()) run();
}
$('set').addEventListener('change',e=>{ const i=e.target;
  if(i.id==='rnd'){ S.settings.ui.round=i.checked; applyUi(); save(); }
  else if(i.id==='asstbtn'){ S.settings.ui.asst=i.checked; applyUi(); if(!i.checked&&S.panel) setPanel(false); save(); }
  else if(i.id==='clbtnon'){ S.settings.ui.clb=i.checked; applyUi(); if(!i.checked) toggleCl(false); save(); }
  else if(i.id==='afxon'){ S.settings.afx.on=i.checked; save(); }
  else if(i.id==='hon'){ S.settings.hist.on=i.checked; save(); }
  else if(i.id==='upauto'){ S.settings.upd.auto=i.checked; save(); updPush(); }
  else if(i.id==='updl'){ S.settings.upd.dl=i.checked; save(); updPush(); }
  else if(i.id==='accadv'){ S.settings.accAdv=i.checked; $('accad').classList.toggle('open',i.checked); save(); }
  else if(i.id==='st5'){ S.settings.ui.step5=i.checked; save(); renderUi(); } });
