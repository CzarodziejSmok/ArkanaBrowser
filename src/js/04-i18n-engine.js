
// ---------- tryb kodu: Morse i Braille (osobno dla każdego języka; chiński niedostępny - brak tabeli znaków) ----------
const CODEMODE=(()=>{ const u=S.settings.ui, m=(u.lmode||{})[u.lang]; return (m==='morse'||m==='braille')&&u.lang!=='zh'?m:''; })();
const cdTab=x=>{ const o={}; x.split('|').forEach(p=>{ o[p[0]]=p.slice(2); }); return o; };
const MRS_L=cdTab('A .-|B -...|C -.-.|D -..|E .|F ..-.|G --.|H ....|I ..|J .---|K -.-|L .-..|M --|N -.|O ---|P .--.|Q --.-|R .-.|S ...|T -|U ..-|V ...-|W .--|X -..-|Y -.--|Z --..|0 -----|1 .----|2 ..---|3 ...--|4 ....-|5 .....|6 -....|7 --...|8 ---..|9 ----.|. .-.-.-|, --..--|? ..--..|\' .----.|! -.-.--|/ -..-.|( -.--.|) -.--.-|& .-...|: ---...|; -.-.-.|= -...-|+ .-.-.|- -....-|_ ..--.-|" .-..-.|$ ...-..-|@ .--.-.|Ą .-.-|Ä .-.-|Ć -.-..|Ç -.-..|Ę ..-..|É ..-..|Ł .-..-|Ń --.--|Ñ --.--|Ó ---.|Ö ---.|Ś ...-...|Ź --..-.|Ż --..-|Ü ..--|ß ...--..|À .--.-|Å .--.-|È .-..-|Ê -..-.|¿ ..-.-|¡ --...-');
const MRS_H=cdTab('א .-|ב -...|ג --.|ד -..|ה ---|ו .|ז --..|ח ....|ט ..-|י ..|כ -.-|ך -.-|ל .-..|מ --|ם --|נ -.|ן -.|ס -.-.|ע .---|פ .--.|ף .--.|צ .--|ץ .--|ק --.-|ר .-.|ש ...|ת -');
const cdSkip=/(\{[^}]*\}|&\w+;|<[^>]+>)/;
const cdMark=(txt,fn)=>{ const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(txt); return m[1]+fn(m[2])+m[3]; };
function encMorse(txt){ const he=S.settings.ui.lang==='he';
  const code=c=>{ if(he&&MRS_H[c]) return MRS_H[c]; const u=c==='ß'?c:c.toUpperCase(); if(MRS_L[u]) return MRS_L[u]; const b=c.normalize('NFD')[0].toUpperCase(); return MRS_L[b]||null; };
  const conv=w=>w.split(cdSkip).map((p,i)=>i%2?p:[...p].map(c=>{ const k=code(c); return k?k.replace(/\./g,'·').replace(/-/g,'−'):c; }).join(' ')).join('');
  return cdMark(txt,x=>x.split(/(\n+)/).map((l,i)=>i%2?l:l.split(/\s+/).map(conv).join(' / ')).join('')); }
const BRA={}; 'abcdefghijklmnopqrstuvwxyz'.split('').forEach((c,i)=>{ BRA[c]='⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'[i]; });
const BRD='⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊';
const BRX={pl:cdTab('ą ⠡|ć ⠩|ę ⠱|ł ⠣|ń ⠹|ó ⠬|ś ⠪|ź ⠮|ż ⠯'),de:cdTab('ä ⠜|ö ⠪|ü ⠳|ß ⠮'),es:cdTab('á ⠷|é ⠮|í ⠌|ó ⠬|ú ⠾|ü ⠳|ñ ⠻|¿ ⠢|¡ ⠖'),fr:cdTab('à ⠷|â ⠡|ç ⠯|é ⠿|è ⠮|ê ⠣|ë ⠫|î ⠩|ï ⠻|ô ⠹|ù ⠾|û ⠱|ü ⠳|œ ⠪'),en:{},
  he:cdTab('א ⠁|ב ⠃|ג ⠛|ד ⠙|ה ⠓|ו ⠺|ז ⠵|ח ⠭|ט ⠞|י ⠚|כ ⠡|ך ⠡|ל ⠇|מ ⠍|ם ⠍|נ ⠝|ן ⠝|ס ⠎|ע ⠪|פ ⠏|ף ⠏|צ ⠯|ץ ⠯|ק ⠟|ר ⠗|ש ⠩|ת ⠹')};
BRX.szl=BRX.pl;
const BRP={'.':'⠲',',':'⠂',';':'⠆',':':'⠒','!':'⠖',"'":'⠄','’':'⠄','-':'⠤','–':'⠤','/':'⠌','"':'⠶','“':'⠶','”':'⠶','«':'⠶','»':'⠶','…':'⠲⠲⠲'};
function encBraille(txt){ const L=S.settings.ui.lang, X=BRX[L]||{}, en=L==='en', cap=(L==='es'||L==='fr')?'⠨':'⠠';
  const P=Object.assign({},BRP,{'?':en?'⠦':'⠢','(':en?'⠐⠣':L==='fr'?'⠦':'⠶',')':en?'⠐⠜':L==='fr'?'⠴':'⠶'},en?{'&':'⠈⠯','@':'⠈⠁','%':'⠨⠴','+':'⠐⠖','=':'⠐⠶','*':'⠐⠔'}:{});
  const isL=c=>c.toLowerCase()!==c.toUpperCase()||X[c.toLowerCase()];
  const word=w=>{ const ch=[...w], ls=ch.filter(c=>c.toLowerCase()!==c.toUpperCase()), all=ls.length>1&&ls.every(c=>c===c.toUpperCase()); let o='', num=false, capDone=false;
    ch.forEach((c,i)=>{ if(c>='0'&&c<='9'){ if(!num){ o+='⠼'; num=true; } o+=BRD[+c]; return; }
      if(num&&(c==='.'||c===',')&&ch[i+1]>='0'&&ch[i+1]<='9'){ o+=P[c]; return; } num=false;
      const lo=c.toLowerCase(), up=c!==lo;
      let b=X[lo]||BRA[lo]; if(!b&&isL(c)){ const bs=lo.normalize('NFD')[0]; b=BRA[bs]; }
      if(b){ if(up&&X[c]===undefined){ if(all){ if(!capDone){ o+=cap+cap; capDone=true; } } else o+=cap; } o+=b; return; }
      o+=P[c]||c; });
    return o; };
  const conv=w=>w.split(cdSkip).map((p,i)=>i%2?p:word(p)).join('');
  return cdMark(txt,x=>x.split(/(\s+)/).map((p,i)=>i%2?p:conv(p)).join('')); }
const enc=CODEMODE==='morse'?encMorse:CODEMODE==='braille'?encBraille:(x=>x);
const LCODES=['en','de','es','fr','he','zh','szl'];
let LD=null, TRM=null;   // LD: polski -> język interfejsu; TRM (tylko w trybie kodu): to samo, ale z tekstami niezmienionymi
(()=>{ const i=LCODES.indexOf(S.settings.ui.lang); if(i>=0){ LD={};
  for(const r of LROWS){ const v=r[i+1]; if(v===r[0]) continue; LD[r[0]]=v; LD[r[0].toUpperCase()]=v.toUpperCase(); } }
  if(CODEMODE){ TRM={}; for(const r of LROWS){ const v=i>=0?r[i+1]:r[0]; TRM[r[0]]=v; TRM[r[0].toUpperCase()]=v.toUpperCase(); } } })();
const t=k=>enc((LD&&LD[k])||k);
const trLook=k=>CODEMODE?(TRM[k]===undefined?null:enc(TRM[k])):(LD&&LD[k]);
function trText(n){ if(!LD&&!CODEMODE) return; const v=n.nodeValue, k=v.trim(); if(!k) return; const o=trLook(k); if(o&&o!==k) n.nodeValue=v.replace(k,()=>o); }
function trAttr(el,a){ if(!LD&&!CODEMODE) return; const v=el.getAttribute(a); if(!v) return; const o=trLook(v.trim()); if(o&&o!==v) el.setAttribute(a,o); }
function trNode(root){ if(!LD&&!CODEMODE) return;
  if(root.nodeType===3) return trText(root); if(root.nodeType!==1) return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())) trText(n);
  const els=[root,...root.querySelectorAll('[title],[placeholder]')]; els.forEach(e=>{ trAttr(e,'title'); trAttr(e,'placeholder'); }); }
function applyLang(){ if(!LD&&!CODEMODE) return; document.documentElement.lang=S.settings.ui.lang==='szl'?'szl':IL(); trNode(document.body);
  new MutationObserver(ms=>{ for(const m of ms){ if(m.type==='childList') m.addedNodes.forEach(trNode); else if(m.type==='characterData') trText(m.target); else if(m.type==='attributes') trAttr(m.target,m.attributeName); } })
    .observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']}); }

const save=()=>{ if(SEC) return; try{localStorage.setItem('cb-state',JSON.stringify(S))}catch{} try{window.api&&window.api.saveState&&window.api.saveState(S)}catch{}};
window.addEventListener('beforeunload',save);
const F=()=>S.folders.find(f=>f.id===S.cur);
const T=()=>F().tabs.find(t=>t.id===F().active);
const views={}; let editing=null;

const gcss=()=>`html,body,#gb,#gbw,#main,#cnt,#center_col,#rcnt,#rso,#appbar,#searchform,#hdtb,#hdtb-msb,#top_nav,#sfcnt,.sfbg,.minidiv,#tsf,header,[role=banner],[role=navigation],#botstuff,#foot,#fbar,.fbar,#footcnt,.appbar,#extabar,#slim_appbar{background:${P.gbg}!important;background-color:${P.gbg}!important}
body{color:#f5ede3!important}a h3,h3 a,.LC20lb{color:${P.acc2}!important}cite,.tjvcx,.VuuXrf,.byrV5b{color:${P.mut}!important}
.VwiC3b,.c7r1q,.lEBKkf,.st{color:#d9cdbf!important}input,textarea{background-color:transparent!important;color:#f5ede3!important}
.RNNXgb{background:${P.gpanel}!important;border-color:${P.gline}!important}.SDkEP,.a4bIc,form[role=search]>div{background:transparent!important}
hr,.sfbgg,#hdtb{border-color:${P.gline}!important}`;
// skrypt wykonywany w stronie Google: ujednolica szare powierzchnie u góry i ukrywa przycisk „Tryb AI”
function gpage(c){
  window.__cbc=c;
  if(window.__cbRun){ window.__cbRun(); return; }
  const role=st=>{ const m=/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(st); if(!m) return null;
    const r=+m[1], g=+m[2], b=+m[3], a=m[4]===undefined?1:+m[4];
    if(a<.9||Math.max(r,g,b)-Math.min(r,g,b)>26) return null;
    const l=(r+g+b)/3; if(l>78) return null; return l<37?'bg':l<57?'panel':'line'; };
  const run=()=>{ window.__cbq=false;
    document.querySelectorAll('body, body *').forEach(el=>{
      if(/^(IMG|SVG|PATH|VIDEO|CANVAS|SCRIPT|STYLE|G)$/i.test(el.tagName)) return;
      const b=el.getBoundingClientRect(); if(b.width<40||b.height<8||b.top>300||b.bottom<0) return;
      const r=el.__cbr||role(getComputedStyle(el).backgroundColor);
      if(r){ el.__cbr=r; el.style.setProperty('background-color',window.__cbc[r],'important');
        const pr=el.parentElement?parseFloat(getComputedStyle(el.parentElement).borderTopLeftRadius):0; if(pr>0&&!parseFloat(getComputedStyle(el).borderTopLeftRadius)) el.style.setProperty('border-radius','inherit','important'); } });
    document.querySelectorAll('a,[role=tab],[role=link],button').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t.length<12&&/^(Tryb AI|AI Mode)$/i.test(t)) (el.closest('[role=listitem]')||el).style.setProperty('display','none','important'); });
  };
  window.__cbRun=run; run();
  new MutationObserver(()=>{ if(!window.__cbq){ window.__cbq=true; setTimeout(run,350); } }).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('load',run); addEventListener('resize',run);
}
const scrollCss=()=>`::-webkit-scrollbar{width:10px!important;height:10px!important}::-webkit-scrollbar-track{background:transparent!important}::-webkit-scrollbar-thumb{background:${P.mut}66!important;border-radius:10px!important;border:2px solid transparent!important;background-clip:content-box!important}::-webkit-scrollbar-thumb:hover{background:${P.acc}!important;background-clip:content-box!important}::-webkit-scrollbar-corner{background:transparent!important}`;
function injS(w){ try{ Promise.resolve(w._sk&&w.removeInsertedCSS(w._sk)).catch(()=>{}).then(()=>w.insertCSS(scrollCss())).then(k=>{w._sk=k}).catch(()=>{}); }catch{} }
function injG(w){ try{ if(!isG(w.getURL())) return;
  Promise.resolve(w._ck&&w.removeInsertedCSS(w._ck)).catch(()=>{}).then(()=>w.insertCSS(gcss())).then(k=>{w._ck=k}).catch(()=>{});
  w.executeJavaScript(`(${gpage.toString()})(${JSON.stringify({bg:P.gbg,panel:P.gpanel,line:P.gline})})`).catch(()=>{}); }catch{} }

