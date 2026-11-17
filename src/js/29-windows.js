// ---------- nowe okno, okno incognito i menu przeglądarki ----------
// Okno incognito: karty w osobnej sesji w pamięci (ustala ją proces główny), bez historii i bez zapisu stanu; po zamknięciu
// ostatniego okna incognito ciasteczka i dane stron znikają. Motyw to przyciemniona i wyszarzała wersja kolorów użytkownika.

// ikonka kapelusza i okularów (karty incognito)
function incHatSvg(cls){
  return `<svg class="${cls||'incg'}" viewBox="0 0 24 24" aria-hidden="true"><path class="ih" d="M6.6 10.6 8.1 4.6c.3-1.3 1.3-1.8 2.4-1.3l1.5.7 1.5-.7c1.1-.5 2.1 0 2.4 1.3l1.5 6z"/><path class="ih" d="M1.8 11.6c3-1.7 6.4-2.4 10.2-2.4s7.2.7 10.2 2.4c-3 1.4-6.4 2-10.2 2s-7.2-.6-10.2-2z"/><circle class="ig" cx="7.8" cy="17.6" r="3.3"/><circle class="ig" cx="16.2" cy="17.6" r="3.3"/><path class="ig" d="M11.1 17.2c.6-.6 1.2-.6 1.8 0"/></svg>`;
}
// napis „inCognito” na stronie startowej okna incognito: własne, odręcznie narysowane litery (nie czcionka systemowa) – grube, proste, bez szeryfów
// i zawijasów. Wszystkie krawędzie (góra i dół kresek, boki poprzeczki „t”, końce „C” i ogona „g”) są lekko zaokrąglone tym samym promieniem R,
// żeby litery miały jeden spójny wygląd. Siatka: linia podstawy y=15, małe litery y=3…15, wielkie y=0…15, grubość kreski 3,2.
// „in” jest prawie białe (iw1), „Cognito” wyraźnie szare (iw2); każda litera ma delikatny połysk (gradient w pionie z miękkim uskokiem).
// Litery są ściśnięte: okrągłe zachodzą na siebie (odstępy w tablicy GAP). Na końcu kropka w kolorze motywu (zmienna --incdot).
function incWordSvg(){
  const R=.9, W=3.2, n2=v=>+v.toFixed(2);
  // prostokąt z wybiernie zaokrąglonymi narożnikami [lewy-góra, prawy-góra, prawy-dół, lewy-dół]
  const rr=(x0,y0,x1,y1,[a,b,c,d])=>`<path d="M${n2(x0+a)} ${y0}H${n2(x1-b)}Q${x1} ${y0} ${x1} ${n2(y0+b)}V${n2(y1-c)}Q${x1} ${y1} ${n2(x1-c)} ${y1}H${n2(x0+d)}Q${x0} ${y1} ${x0} ${n2(y1-d)}V${n2(y0+a)}Q${x0} ${y0} ${n2(x0+a)} ${y0}Z"/>`;
  // gruby łuk (pierścień z przerwą) z zaokrąglonymi narożnikami na obu końcach; kąty w radianach (y w dół), od aS do aE
  const arc=(cx,cy,r,aS,aE,f)=>{
    const s=aE>aS?1:-1, Ro=r+W/2, Ri=r-W/2, dO=Math.asin(f/(Ro-f)), dI=Math.asin(f/(Ri+f)), sw=s>0?1:0;
    const P=(a,q)=>`${n2(cx+q*Math.cos(a))} ${n2(cy+q*Math.sin(a))}`, big=Math.abs(aE-aS)-2*dO>Math.PI?1:0;
    return `<path d="M${P(aS,(Ri+f)*Math.cos(dI))}L${P(aS,(Ro-f)*Math.cos(dO))}A${f} ${f} 0 0 ${sw} ${P(aS+s*dO,Ro)}A${Ro} ${Ro} 0 ${big} ${sw} ${P(aE-s*dO,Ro)}A${f} ${f} 0 0 ${sw} ${P(aE,(Ro-f)*Math.cos(dO))}L${P(aE,(Ri+f)*Math.cos(dI))}A${f} ${f} 0 0 ${sw} ${P(aE-s*dI,Ri)}A${Ri} ${Ri} 0 ${big} ${1-sw} ${P(aS+s*dI,Ri)}A${f} ${f} 0 0 ${sw} ${P(aS,(Ri+f)*Math.cos(dI))}Z"/>`;
  };
  const ring=x=>`<circle class="st" cx="${n2(x+6)}" cy="9" r="4.4"/>`, d2r=g=>g*Math.PI/180;
  const L={
    i:{w:3.2,s:x=>rr(x,3,x+W,15,[R,R,R,R])+`<circle cx="${n2(x+1.6)}" cy="-.7" r="2"/>`},
    n:{w:10.8,s:x=>rr(x,3,x+W,15,[R,0,R,R])+rr(x+7.6,8.4,x+10.8,15,[0,0,R,R])+`<path class="st" d="M${n2(x+1.6)} 8.6C${n2(x+1.6)} 5.6 ${n2(x+3.6)} 4.6 ${n2(x+5.7)} 4.6C${n2(x+8.2)} 4.6 ${n2(x+9.2)} 6.2 ${n2(x+9.2)} 8.6"/>`},
    C:{w:13.1,s:x=>arc(x+7.5,7.5,5.9,-d2r(42),-d2r(318),R)},
    o:{w:12,s:ring},
    g:{w:12,s:x=>ring(x)+`<path class="st" d="M${n2(x+10.4)} 9V16.2C${n2(x+10.4)} 18.6 ${n2(x+8.6)} 19.8 ${n2(x+6.2)} 19.8H${n2(x+4.6)}"/>`+rr(x+2.6,18.2,x+4.6,21.4,[R,0,0,R])},
    t:{w:7.2,s:x=>rr(x+2,-1.4,x+5.2,15,[R,R,R,R])+rr(x,3,x+7.2,6.2,[R,R,R,R])}
  };
  // odstępy między sąsiednimi literami: kreski proste ~1, okrągłe litery nachodzą na siebie (wartości ujemne)
  const GAP={'i>n':.9,'n>C':.3,'C>o':-.7,'o>g':-.7,'g>n':.9,'n>i':.9,'i>t':.9,'t>o':-1};
  const word='inCognito'; let x=0, out='';
  [...word].forEach((ch,k)=>{ out+=`<g class="${k<2?'iw1':'iw2'}">${L[ch].s(n2(x))}</g>`; x+=L[ch].w+(k<word.length-1?GAP[ch+'>'+word[k+1]]:0); });
  const gr=(id,st)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="3" x2="0" y2="15">${st.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const defs=`<defs>${gr('iwg1',[[0,'#ffffff'],[.46,'#f1f1f5'],[.5,'#dedee4'],[1,'#c2c2ca']])}${gr('iwg2',[[0,'#b0b0b7'],[.46,'#9a9aa1'],[.5,'#86868d'],[1,'#6a6a71']])}</defs>`;
  return `<svg class="iw" viewBox="-.5 -3.2 ${n2(x+6.3)} 25.2" role="img" aria-label="Incognito">${defs}${out}<circle class="ip" cx="${n2(x+3.3)}" cy="13.1" r="1.9"/></svg>`;
}
// iskra Arkany w kapeluszu i okularach (strona startowa okna incognito; bez koła alchemicznego)
function incSparkSvg(){
  const c=[60,73], ray=k=>{ const a=k*Math.PI/4, r0=15, r1=k%2?33:45, p=r=>`${(c[0]+Math.sin(a)*r).toFixed(1)} ${(c[1]-Math.cos(a)*r).toFixed(1)}`; return `M${p(r0)}L${p(r1)}`; };
  return `<svg class="incsp" viewBox="0 0 120 120" aria-hidden="true"><g class="isr"><path d="${[...Array(8)].map((_,k)=>ray(k)).join('')}"/></g>`
    +`<path class="ihat" d="M38 45 43 19c.9-4.4 4.4-6.1 8.2-4.4L60 18.6l8.8-4c3.8-1.7 7.3 0 8.2 4.4l5 26z"/><path class="iband" d="M39.4 37.6c13.7 2.4 27.5 2.4 41.2 0l1.4 7.4H38z"/>`
    +`<path class="ihat" d="M16 49C29 42.2 43.5 39 60 39s31 3.2 44 10c-13 5.8-27.5 8.6-44 8.6S29 54.8 16 49z"/>`
    +`<g class="igl"><circle cx="46" cy="70" r="10.5"/><circle cx="74" cy="70" r="10.5"/><path d="M56.5 68.6c2.3-2.4 4.7-2.4 7 0"/></g></svg>`;
}
// wyrównanie pionowe napisu w logo incognito: środek zapisu „Arkana + inCognito” (wg faktycznej tuszu liter, nie ramek) leży na środku iskry w kapeluszu,
// więc napis wystaje nad i pod logo o tyle samo. Mierzone w oknie (czcionka może się zmienić), przeliczane przy zmianie rozmiaru i po załadowaniu czcionek.
function incAlign(){
  const l=$('logo'); if(!l) return; const w=l.querySelector('.incw'), sp=l.querySelector('.incsp'); if(!w||!sp) return;
  const b=w.querySelector('b'), iw=w.querySelector('.iw'); if(!b||!iw) return;
  w.style.setProperty('--incdy','0px');
  const sr=sp.getBoundingClientRect(), ir=iw.getBoundingClientRect(); if(!sr.height||!ir.height) return;
  const k=sr.height/120, hat=sp.querySelector('.ihat'), rays=sp.querySelector('.isr');
  if(!hat||!rays||!hat.getBBox) return; const hb=hat.getBBox(), rb=rays.getBBox();
  const sTop=sr.top+(hb.y-.6)*k, sBot=sr.top+(rb.y+rb.height+3.2)*k;                 // tusz iskry: góra ronda kapelusza, dół najdłuższego promienia z zaokrąglonym końcem
  const pr=document.createElement('i'); pr.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline'; b.appendChild(pr);
  const base=pr.getBoundingClientRect().bottom; pr.remove();
  const cs=getComputedStyle(b); let asc=.72*parseFloat(cs.fontSize);
  try{ const g=document.createElement('canvas').getContext('2d'); g.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily; const m=g.measureText('Arkana'); if(m.actualBoundingBoxAscent) asc=m.actualBoundingBoxAscent; }catch{}
  const vk=ir.height/25.2, tTop=base-asc, tBot=ir.top+(21.4+3.2)*vk;                    // tusz napisu: góra „Arkana” (wg czcionki) i dół ogona „g”
  const dy=((sTop+sBot)-(tTop+tBot))/2; w.style.setProperty('--incdy',(Math.round(dy*10)/10)+'px');
}
function incAlignInit(){ const l=$('logo'); if(!l||l.__ia) return; l.__ia=1; incAlign();
  try{ new ResizeObserver(()=>incAlign()).observe(l); }catch{} try{ document.fonts&&document.fonts.ready.then(incAlign); }catch{} window.addEventListener('resize',incAlign); }
function winState(folder){
  const f=folder||{id:uid(),name:t('Folder')+' 1',icon:'📁',tabs:[],active:null};
  if(!f.tabs.length) f.tabs.push({id:uid(),url:'',title:''});
  if(!f.tabs.some(x=>x.id===f.active)) f.active=f.tabs[0].id;
  const st={folders:[f],cur:f.id,panel:false,pw:S.pw,closed:[],zoom:{...(S.zoom||{})},settings:JSON.parse(JSON.stringify(S.settings)),aw:{open:[],pos:{},links:[],data:{}}};
  st.settings.apps.on=false;    // aplikacje (notatki, historia) zostają w oknie głównym
  return st;
}
function newWindow(inc,folder){
  try{ window.api.newWin({state:winState(folder),inc:!!inc}); return true; }catch{ toast(t('Brak obsługi – podmień main.js i preload.js na nowe.')); return false; }
}
// otwiera podane karty (np. kartę lub cały folder) w nowym oknie incognito; w oknie zostają tylko adresy, bez ikon i historii
function openIncognito(list,name,icon){
  const tabs=(list||[]).filter(x=>x&&x.url).map(x=>({id:uid(),url:x.url,title:x.title||'',pinned:!!x.pinned}));
  return newWindow(true,{id:uid(),name:name||t('Incognito'),icon:icon||'📁',tabs,active:null});
}
Object.assign(ACTS,{ 'new-window':()=>newWindow(false), 'incognito':()=>newWindow(true) });

// menu przeglądarki (przycisk ⋮ na górnym pasku)
function browserMenu(){
  const b=$('menub'), r=b.getBoundingClientRect();
  showMenu(r.right-230,r.bottom+4,[
    {l:'Nowa karta',a:'new-tab',f:()=>newTab()},
    {l:'Nowe okno',a:'new-window',f:()=>newWindow(false)},
    {l:'Nowe okno incognito',a:'incognito',f:()=>newWindow(true)},
    'sep',
    {l:T()&&isGp(T().id)?'Odepnij ze wszystkich folderów':'Przypnij we wszystkich folderach',a:'pin-global',off:INC||!T()||!T().url,f:()=>toggleGlobal(T().id)},
    {l:'Historia',a:'history',off:INC,f:()=>toggleHist()},
    {l:'Szukaj na stronie',a:'find',off:!curView(),f:()=>act('find')},
    {l:'Drukuj stronę',a:'print',off:!curView(),f:()=>act('print')},
    'sep',
    {l:'Ustawienia',a:'settings',f:()=>toggleSet(true)}
  ]);
  const m=$('cm'), mr=m.getBoundingClientRect(); m.style.left=Math.max(6,Math.min(r.right-mr.width,innerWidth-mr.width-6))+'px';
}
if(INC) document.title='Arkana Browser – Incognito';
let menuWas=false;   // kliknięcie ⋮ przy otwartym menu zamyka je (mousedown zamyka menu wcześniej niż click)
addEventListener('mousedown',e=>{ menuWas=!!(e.target.closest&&e.target.closest('#menub'))&&$('cm').classList.contains('open'); },true);
$('menub').onclick=()=>{ if(menuWas){ menuWas=false; return; } browserMenu(); };
