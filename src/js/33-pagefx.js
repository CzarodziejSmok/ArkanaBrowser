// ---------- gradient kolorów: kolor otwartej strony na paskach interfejsu (Ustawienia → Interfejs → Kolory stron → „Gradient kolorów”) ----------
// Całe obramowanie okna (pasek górny z kartami oraz oba paski boczne) jest JEDNYM polem kolorów: od koloru motywu przy krawędzi okna do koloru otwartej
// strony przy zawartości. Pole rysuje element #pgframe pod paskami (maska = góra × lewy bok × prawy bok), dzięki czemu w narożnikach gradienty nie dają
// szwów, a na wewnętrznych krawędziach pasków kolor jest dokładnie taki jak kolor strony. Kolor strony to jeden najczęstszy kolor krawędzi jej zrzutu
// (pagecolor.js); gdy zrzut się nie uda, odczytujemy tło elementów przy krawędziach strony (PG_DOM).
// Zmienna PGF jest „var”, bo applyUi() wywołuje applyPgfx() zanim ten plik się wykona.
var PGF=null;
const pgLum=c=>{ const f=v=>{ v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4); }; return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]); };
const pgCon=(a,b)=>{ const x=pgLum(a), y=pgLum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const pgMixC=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
// kolor, do którego dochodzą paski: pełny kolor strony, o ile napisy (fg) na nim pozostają czytelne (kontrast ≥ 4,5); inaczej tak daleko od koloru
// panelu w stronę koloru strony, jak pozwala czytelność (jasna strona przy ciemnym motywie nie zamieni pasków w biel)
function pgMix(panel,page,fg){
  if(pgCon(fg,page)>=4.5) return page;
  let lo=0, hi=1; for(let i=0;i<14;i++){ const m=(lo+hi)/2; if(pgCon(fg,pgMixC(panel,page,m))>=4.5) lo=m; else hi=m; }
  return pgMixC(panel,page,lo);
}
// zapasowy odczyt koloru strony z jej DOM: tło elementu w kilku punktach przy krawędziach (przezroczyste = biała domyślna karta)
const PG_DOM="(()=>{try{const W=innerWidth,H=innerHeight,pts=[],m=new Map();for(const f of [.15,.35,.55,.75,.9]){pts.push([3,H*f],[W-4,H*f],[W*f,3]);}"
  +"for(const p of pts){let el=document.elementFromPoint(p[0],p[1]),c=null;while(el&&!c){const k=/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/.exec(getComputedStyle(el).backgroundColor);if(k&&(k[4]===undefined||+k[4]>.5))c=[+k[1],+k[2],+k[3]];else el=el.parentElement;}"
  +"c=c||[255,255,255];const key=c.join(',');m.set(key,(m.get(key)||0)+1);}let b=null,n=0;for(const e of m)if(e[1]>n){n=e[1];b=e[0];}return b?b.split(',').map(Number):null;}catch(e){return null;}})()";
const pgOn=()=>S.settings.ui.pgmode==='gradient';
function pgSet(cols){
  const pa=unhex(P.panel)||[27,24,22], fg=unhex(P.fg)||[245,237,227], bg=unhex(P.bg)||pa; cols=cols||{}; PGF.cols=cols;
  const c=cols.c||cols.t||cols.l||cols.r;
  document.documentElement.style.setProperty('--pgC',hex(pgMix(pa,Array.isArray(c)?c:bg,fg)));
}
function pgRefresh(){ if(PGF&&pgOn()) pgSet(PGF.cols); }   // po zmianie motywu: ten sam kolor strony, nowe kolory paska
// wymiary pola: wysokość części górnej (pasek, karty, przypięte) oraz szerokość zwiniętych pasków bocznych (--pgLB/--pgRB) – od nich zależy, gdzie gradient
// dochodzi do koloru strony; szerokość chwilowo rozsuniętego panelu (--pgLW/--pgRW) ustawia i animuje CSS (css/app.css), razem z wysuwaniem panelu
function pgLayout(){
  if(!PGF||!pgOn()) return;
  const r=document.documentElement.style, m=$('main').getBoundingClientRect(), l=$('sidewrap').getBoundingClientRect(), rw=$('rwrap'), rr=rw.getBoundingClientRect();
  r.setProperty('--pgTH',Math.max(1,Math.round(m.top))+'px'); r.setProperty('--pgLB',Math.max(1,Math.round(l.width))+'px');
  r.setProperty('--pgRB',Math.max(1,rw.offsetParent===null?1:Math.round(rr.width))+'px');
}
async function pgSample(){
  if(!PGF||PGF.busy||!pgOn()) return; PGF.busy=true;
  try{
    const t=T(), w=t&&views[t.id]; let cols=null;
    if(w&&t.url&&home.style.display==='none'){   // strona startowa: kolor tła interfejsu
      try{ cols=await window.api.pageColors(w.getWebContentsId()); }catch{}
      if(!cols||!cols.c){ try{ const c=await w.executeJavaScript(PG_DOM); if(Array.isArray(c)) cols={c}; }catch{} }
    }
    if(pgOn()) pgSet(cols);
  }catch{}
  PGF.busy=false;
}
function pgSoon(){ if(!PGF||!pgOn()) return; clearTimeout(PGF.tm); PGF.tm=setTimeout(pgSample,320); }
function pgHook(w){ for(const ev of ['did-stop-loading','did-navigate','did-navigate-in-page','dom-ready']) w.addEventListener(ev,pgSoon); }
function applyPgfx(){
  if(!PGF) return;
  const u=S.settings.ui, on=pgOn(), c=document.body.classList;
  if(PGF.mode!==u.pgmode){ const was=PGF.mode; PGF.mode=u.pgmode; if(was!==undefined) for(const k in views) injG(views[k]); }   // tryb „Kolor motywu” (kolorowanie stron Google) włączony/wyłączony na otwartych kartach
  c.toggle('pgb',on);
  if(on&&!$('pgframe')){ const d=document.createElement('div'); d.id='pgframe'; document.body.insertBefore(d,document.body.firstChild); }
  clearInterval(PGF.iv); PGF.iv=0;
  if(on){ pgLayout(); pgSample(); PGF.iv=setInterval(()=>{ if(!document.hidden&&document.hasFocus()) pgSample(); },2500); }   // strona może się przewinąć lub zmienić kolor
}
PGF={busy:false,iv:0,tm:0,cols:{},mode:undefined};
addEventListener('resize',()=>{ pgLayout(); pgSoon(); });
try{ const ro=new ResizeObserver(()=>pgLayout()); for(const id of ['main','sidewrap','rwrap','tabrow','bar']) ro.observe($(id)); }catch{}
applyPgfx();
