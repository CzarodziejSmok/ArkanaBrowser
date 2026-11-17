
const $=id=>document.getElementById(id), url=$('url'), home=$('home'), right=$('right'), split=$('split'), cw=$('cw');
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return u}};
const isUrl=s=>/^https?:\/\//i.test(s)||/^[^\s]+\.[a-z]{2,}(\/\S*)?$/i.test(s);
const isG=u=>{try{return /(^|\.)google\.[a-z.]+$/.test(new URL(u).hostname)}catch{return false}};

// ---------- stan (zapamiętywany między uruchomieniami) ----------
let S, SEC=false, INC=false, INCP=''; try{ const ini=window.api&&window.api.getInit&&window.api.getInit(); if(ini&&ini.secondary){ SEC=true; S=ini.state; INC=!!ini.inc; INCP=ini.part||''; } }catch{}   // SEC = okno oderwane (stan jednorazowy), INC = okno incognito
if(!S){ try{S=window.api&&window.api.loadState&&window.api.loadState()}catch{} }
if(!S&&!SEC){try{S=JSON.parse(localStorage.getItem('cb-state'))}catch{}}
if(!S||!S.folders||!S.folders.length) S={folders:[{id:'f1',name:'Praca',tabs:[],active:null},{id:'f2',name:'Prywatne',tabs:[],active:null}],cur:'f1',panel:false,pw:430};
const DEF={login:{gfix:true,passkeys:false},pw:{on:true},adblock:{on:true},search:{engine:'googleweb',custom:''},imp:{hint:true},cl:{rel:true,unrel:true},hist:{on:true,step:6,skip:[]},upd:{auto:true,dl:true},afx:{on:true,calc:50,notes:50,clock:50,conv:50,tr:50,files:50,gej:50,dice:50,mine:50,snake:50},bg:{r:22,g:18,b:15,hold:26,sat:50,bri:50},bgs:[],bgSel:0,bgShape:'h',bgInt:'mid',bgRep:1,bgCut:[],bgSlide:'',bgFade:false,bgSpd:6,bgAdj:{bri:0,sat:0,r:0,g:0,b:0},accs:[],accSel:0,accFade:false,accSpd:6,accAdj:{bri:0,sat:0,r:0,g:0,b:0},acc:'#e8825a',adv:false,accAdv:false,fx:{all:100,dust:45,waves:50,stars:0,aurora:0,rain:0},img:{data:'',op:100,blur:0,dim:30,sat:100,fit:'cover'},keys:{'new-tab':'Ctrl+T','close-tab':'Ctrl+W','dup-tab':'Ctrl+Shift+D','reload-tab':'Ctrl+R','pin-tab':'Ctrl+Shift+P','pin-global':'','mute-tab':'Ctrl+Shift+M','restore-tab':'Ctrl+Shift+T','close-all':'Ctrl+Shift+W','reload-all':'Ctrl+Shift+R','pin-all':'Ctrl+Alt+P','mute-all':'Ctrl+Alt+M','next-tab':'Ctrl+Tab','prev-tab':'Ctrl+Shift+Tab','focus-url':'Ctrl+L','back':'Alt+←','forward':'Alt+→','go-home':'Alt+Home','new-folder':'Ctrl+Shift+N','dup-folder':'Ctrl+Alt+D','rename-folder':'F2','next-folder':'Ctrl+Alt+↓','prev-folder':'Ctrl+Alt+↑','settings':'Ctrl+,','toggle-panel':'Ctrl+Shift+K','history':'Ctrl+H','devtools':'F12','ui-devtools':'Ctrl+Shift+F12','new-window':'Ctrl+N','incognito':'Ctrl+Shift+I','find':'Ctrl+F','zoom-in':'Ctrl+=','zoom-in-alt':'Ctrl+Shift+=','zoom-in-np':'Ctrl+NumpadAdd','zoom-out':'Ctrl+-','zoom-out-np':'Ctrl+NumpadSubtract','zoom-reset':'Ctrl+0','print':'Ctrl+P'},ui:{font:'',cmode:'',pinpos:'top',dynicon:true,pgmode:'theme',lmode:{pl:'',en:'',de:'',es:'',fr:'',he:'',zh:'',szl:''},asst:true,clb:true,win:'simple',nav:'simple',anim:{btn:true,fold:true,tab:true,panel:true,apps:true,boot:true,bootsnd:true},lang:'pl',round:false,step5:false},apps:{on:true,bar:[]}};
function merge(d,o){ const r=JSON.parse(JSON.stringify(d)); if(o&&typeof o==='object') for(const k in r){ if(k in o){ if(Array.isArray(r[k])){ if(Array.isArray(o[k])) r[k]=o[k]; } else if(r[k]&&typeof r[k]==='object') r[k]=merge(r[k],o[k]); else if(typeof o[k]===typeof r[k]) r[k]=o[k]; } } return r; }
function normalize(st){ if(st&&st.ui&&typeof st.ui==='object'&&st.ui.cmode===undefined&&st.ui.lmode&&typeof st.ui.lmode==='object'){ const m=st.ui.lmode[st.ui.lang]; st.ui.cmode=(m==='morse'||m==='braille')?m:''; }   /* v47 → v48: tryb tekstu jest jeden dla wszystkich języków */
  if(st&&st.ui&&typeof st.ui==='object'&&st.ui.pgmode===undefined){ if(st.ui.pgfx===true) st.ui.pgmode='gradient'; else if(st.ui.gtheme===false) st.ui.pgmode='off'; }   /* v45 → v46: dwa przełączniki zastąpił jeden wybór */
  if(st&&st.bg&&st.bg.l!==undefined){ const c=hsl2rgb(st.bg.h,st.bg.s,st.bg.l); st.bg={r:c[0],g:c[1],b:c[2],hold:st.bg.h,sat:50,bri:50}; } return st; }
S.settings=merge(DEF,normalize(S.settings)); fixBgs();
// kolory motywu (v49): lista 1–4 kolorów {r,g,b,hold,sat,bri}; bgSel = rozwinięty (edytowany) kolor; bgShape/bgInt = kształt i intensywność przejść
function fixBgs(){ const s=S.settings, num=(v,a,b,d)=>{ v=+v; return Number.isFinite(v)?Math.min(b,Math.max(a,v)):d; };
  if(!Array.isArray(s.bgs)||!s.bgs.length) s.bgs=[{...s.bg}];
  s.bgs=s.bgs.slice(0,4).map(b=>{ b=b&&typeof b==='object'?b:{}; const d=DEF.bg; return {r:Math.round(num(b.r,0,255,d.r)),g:Math.round(num(b.g,0,255,d.g)),b:Math.round(num(b.b,0,255,d.b)),hold:num(b.hold,0,360,d.hold),sat:num(b.sat,0,100,50),bri:num(b.bri,0,100,50)}; });
  s.bgSel=Math.min(s.bgs.length-1,Math.max(0,s.bgSel|0));
  if(!['h','v','dl','dr','rad','full'].includes(s.bgShape)) s.bgShape='h'; if(!['short','mid','long'].includes(s.bgInt)) s.bgInt='mid';
  // v49.1: powtórzenia (1–5), ruch (bgSlide = kierunek lub ''), przechodzenie w miejscu (bgFade), czas jednego koloru, korekty uniwersalne, kilka kolorów akcentu
  s.bgRep=Math.round(num(s.bgRep,1,5,1)); s.bgSpd=num(s.bgSpd,1,60,6); s.accSpd=num(s.accSpd,1,120,6); s.bgFade=!!s.bgFade; s.accFade=!!s.accFade; if(typeof s.bgSlide!=='string') s.bgSlide='';
  s.bgCut=Array.isArray(s.bgCut)&&s.bgCut.length===s.bgs.length-1&&s.bgCut.every(v=>Number.isFinite(+v)&&v>0&&v<1)?s.bgCut.map(Number).sort((a,b)=>a-b):[];   // niestandardowy podział: n−1 pozycji granic (0–1 wzdłuż przejścia), pusty = równy podział
  const adj=a=>{ a=a&&typeof a==='object'?a:{}; return {bri:Math.round(num(a.bri,-100,100,0)),sat:Math.round(num(a.sat,-100,100,0)),r:Math.round(num(a.r,-255,255,0)),g:Math.round(num(a.g,-255,255,0)),b:Math.round(num(a.b,-255,255,0))}; };
  s.bgAdj=adj(s.bgAdj); s.accAdj=adj(s.accAdj);
  const hx=/^#[0-9a-f]{6}$/i; s.accs=(Array.isArray(s.accs)?s.accs:[]).filter(h=>typeof h==='string'&&hx.test(h)).map(h=>h.toLowerCase()).slice(0,4);
  if(!s.accs.length) s.accs=[hx.test(s.acc||'')?s.acc.toLowerCase():'#e8825a']; s.accSel=Math.min(s.accs.length-1,Math.max(0,s.accSel|0)); s.acc=s.accs[0];
  return s.bgs; }
{ const K=S.settings.keys, re=/^(?:Ctrl\+)?(?:Alt\+)?(?:Shift\+)?Mouse(\d{1,2})$/;   // przycisk myszy w skrócie: tylko środkowy/boczne (3–64), bez klawiszy innych niż Ctrl/Alt/Shift; reszta (np. z ręcznie zmienionego pliku) znika
  for(const a in K){ const v=K[a]; if(typeof v==='string'&&v.includes('Mouse')){ const m=re.exec(v); if(!m||+m[1]<3||+m[1]>64) K[a]=''; } } }
S.tourSeen=!!S.tourSeen;   // poradnik po interfejsie pokazał się już raz (v41)
S.gpins=Array.isArray(S.gpins)?S.gpins:[];   // strony przypięte we wszystkich folderach (widoczne zawsze, karta nie zamyka się przy zmianie folderu)
const VERSION='v49';
