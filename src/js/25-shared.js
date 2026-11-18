// ---------- wspólne dla rdzenia i modułu aplikacji (v49.9) ----------
// Te funkcje leżały w plikach aplikacji (14 i 17), ale używa ich też rdzeń (lista języków, tłumaczenie listy zmian), a rdzeń musi działać bez modułu aplikacji.
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
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
