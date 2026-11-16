// ---------- poradnik po interfejsie: pokazuje się sam tylko raz (S.tourSeen), potem z Ustawienia → System ----------
// Każdy krok podświetla fragment interfejsu (reszta jest przyciemniona) i pokazuje małe okno z opisem, numerem kroku i przyciskiem „Pomiń poradnik”.
// Kroki, których element jest teraz niewidoczny (np. ukryty panel asystenta, brak przypiętych kart), są pomijane.
const TOUR_STEPS=[
  {h:'Witaj w Arkanie',p:'Ten krótki poradnik pokaże Ci najważniejsze miejsca interfejsu i do czego służą. Możesz go w każdej chwili pominąć.'},
  {sel:['#brand','#back','#fwd','#reload'],h:'Logo i nawigacja',p:'Logo Arkany wraca do strony startowej. Strzałki cofają i przesuwają do przodu historię karty, a przycisk obok odświeża stronę.'},
  {sel:['#url'],h:'Pasek adresu',p:'Wpisz tu adres strony albo pytanie. Adres otworzy się od razu, a tekst zostanie wyszukany wybraną wyszukiwarką.'},
  {sel:['#tabs','#nt'],h:'Karty',p:'Każda strona to osobna karta. Plus dodaje nową kartę, a prawy przycisk myszy na karcie otwiera jej menu. Karty możesz przeciągać, by zmienić ich kolejność.'},
  {sel:['#pins'],h:'Przypięte karty',p:'Tu pojawiają się przypięte karty. Przypinasz je z menu prawego przycisku na karcie – zajmują mało miejsca i są zawsze pod ręką.'},
  {sel:['#fl'],side:'l',h:'Foldery',p:'Foldery to osobne zestawy kart, np. Praca i Prywatne. Kliknij folder, by do niego przejść, a przerywany przycisk na dole dodaje nowy. Prawy przycisk otwiera opcje folderu.'},
  {sel:['#gear'],side:'l',h:'Ustawienia',p:'Tu zmienisz motyw i kolory, wygląd interfejsu, skróty klawiszowe, prywatność i blokowanie reklam oraz język. Stąd też uruchomisz ten poradnik ponownie.'},
  {sel:['#toggle'],side:'l',h:'Panel asystenta',p:'Otwiera boczny panel z asystentem AI obok przeglądanej strony. Zaloguj się w nim raz, a potem zadawaj pytania, nie opuszczając strony.'},
  {sel:['#rl'],side:'r',h:'Aplikacje',p:'Pasek z wbudowanymi programami i grami, takimi jak kalkulator, notatnik, zegar czy konwerter. Otwierają się w pływających oknach, które możesz przesuwać.'},
  {sel:['#hbtn'],side:'r',h:'Historia',p:'Pokazuje listę odwiedzonych stron z wyszukiwarką. Zapisywanie historii i czas jej przechowywania ustawisz w Ustawieniach.'},
  {sel:['#menub'],h:'Menu',p:'Znajdziesz tu nowe okno, okno incognito bez zapisywania historii, szukanie na stronie, drukowanie i skrót do Ustawień.'},
  {h:'To już wszystko',p:'Poradnik możesz uruchomić ponownie w dowolnej chwili: Ustawienia → System → Pokaż poradnik ponownie. Miłego korzystania z Arkany!'}
];
let tourOn=false, tourList=[], tourI=0, tourTm=0, tourEl=null;
// ramka obejmująca widoczne elementy z listy selektorów (null = żaden nie jest widoczny)
function tourRect(sels){
  let r=null;
  for(const s of sels){
    const el=document.querySelector(s); if(!el) continue;
    const b=el.getBoundingClientRect(); if(b.width<2||b.height<2) continue;
    const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
    r=r?{l:Math.min(r.l,b.left),t:Math.min(r.t,b.top),r:Math.max(r.r,b.right),b:Math.max(r.b,b.bottom)}:{l:b.left,t:b.top,r:b.right,b:b.bottom};
  }
  return r;
}
function tourBuild(){
  if(tourEl) return tourEl;
  const d=document.createElement('div'); d.id='tour';
  d.innerHTML='<div id="tourh"></div><div id="tourc" role="dialog" aria-live="polite"><h4 id="tourt"></h4><p id="tourp"></p><div class="tn"><button id="tourb" type="button"></button><button id="tourn" type="button" class="ok"></button></div><div class="tf"><span id="tours"></span><button id="tourx" type="button"></button></div></div>';
  document.body.appendChild(d); tourEl=d;
  d.addEventListener('mousedown',e=>e.preventDefault());   // przyciski nie biorą fokusu, więc Enter obsługuje tylko skrót klawiszowy
  d.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('button'); if(!b) return; if(b.id==='tourn') tourGo(1); else if(b.id==='tourb') tourGo(-1); else if(b.id==='tourx') tourEnd(); });
  return d;
}
// okno z opisem: najchętniej obok podświetlenia (nie zasłania go), zawsze w całości na ekranie
function tourPlace(r,side){
  const c=$('tourc'), h=$('tourh'), W=innerWidth, H=innerHeight, M=12, G=16, P=6, cw=c.offsetWidth, ch=c.offsetHeight;
  let x,y;
  if(!r){ h.className='c'; h.style.left=(W/2)+'px'; h.style.top=(H/2)+'px'; h.style.width='0px'; h.style.height='0px'; x=(W-cw)/2; y=(H-ch)/2; }
  else {
    h.className=''; h.style.left=(r.l-P)+'px'; h.style.top=(r.t-P)+'px'; h.style.width=(r.r-r.l+2*P)+'px'; h.style.height=(r.b-r.t+2*P)+'px';
    const cand={ b:[r.l,r.b+P+G], a:[r.l,r.t-P-G-ch], r:[r.r+P+G,r.t], l:[r.l-P-G-cw,r.t] };
    const order=side==='l'?['r','b','a','l']:side==='r'?['l','b','a','r']:['b','a','r','l'];
    const clampX=v=>Math.max(M,Math.min(v,W-cw-M)), clampY=v=>Math.max(M,Math.min(v,H-ch-M));
    const hit=(px,py)=>!(px+cw<=r.l-P||px>=r.r+P||py+ch<=r.t-P||py>=r.b+P);
    for(const k of order){ const px=clampX(cand[k][0]), py=clampY(cand[k][1]); if(!hit(px,py)||k===order[order.length-1]){ x=px; y=py; break; } }
  }
  c.style.left=Math.round(x)+'px'; c.style.top=Math.round(y)+'px';
}
function tourShow(i){
  const st=tourList[i], last=i===tourList.length-1; tourI=i; tourBuild();
  $('sidewrap').classList.toggle('tourx',st.side==='l'); $('rwrap').classList.toggle('tourx',st.side==='r');
  const draw=()=>{
    if(!tourOn||tourI!==i) return;
    $('tourt').textContent=t(st.h); $('tourp').textContent=t(st.p);
    $('tours').textContent=t('Krok {n}/{m}').replace('{n}',i+1).replace('{m}',tourList.length);
    $('tourb').textContent=t('Wstecz'); $('tourb').style.visibility=i?'':'hidden';
    $('tourn').textContent=t(last?'Zakończ':'Następny krok'); $('tourx').textContent=t('Pomiń poradnik'); $('tourx').style.visibility=last?'hidden':'';
    tourPlace(st.sel?tourRect(st.sel):null,st.side);
  };
  draw(); clearTimeout(tourTm);
  if(st.side) tourTm=setTimeout(draw,420);   // paski boczne rozwijają się ok. 0,3 s – wtedy poprawiamy położenie podświetlenia
}
function tourGo(d){ const n=tourI+d; if(n<0) return; if(n>=tourList.length) return tourEnd(); tourShow(n); }
function tourKey(e){
  if(!tourOn) return;
  const k=e.key; if(k!=='Escape'&&k!=='Enter'&&k!=='ArrowRight'&&k!=='ArrowLeft') return;
  e.preventDefault(); e.stopImmediatePropagation();
  if(k==='Escape') tourEnd(); else if(k==='ArrowLeft') tourGo(-1); else tourGo(1);
}
const tourResize=()=>{ if(tourOn&&tourList[tourI]) tourShow(tourI); };
function tourStart(manual){
  if(tourOn) return;
  tourOn=true; S.tourSeen=true; save();   // „widziany” zapisujemy od razu, więc przerwany poradnik nie wraca przy kolejnym uruchomieniu
  try{ toggleSet(false); toggleCl(false); closeMenu(); if($('hist').classList.contains('open')) toggleHist(false); }catch{}
  document.addEventListener('keydown',tourKey,true); addEventListener('resize',tourResize);
  tourBuild().classList.add('on');
  setTimeout(()=>{   // po ręcznym uruchomieniu czekamy, aż zamknie się szuflada ustawień
    if(!tourOn) return;
    tourList=TOUR_STEPS.filter(s=>!s.sel||tourRect(s.sel)); tourShow(0);
  },manual?380:60);
}
function tourEnd(){
  if(!tourOn) return;
  tourOn=false; clearTimeout(tourTm);
  document.removeEventListener('keydown',tourKey,true); removeEventListener('resize',tourResize);
  $('sidewrap').classList.remove('tourx'); $('rwrap').classList.remove('tourx');
  if(tourEl) tourEl.classList.remove('on');
}
// przy pierwszym uruchomieniu: po zakończeniu animacji startowej; nie w oknach oderwanych i incognito
function tourAuto(){
  if(SEC||INC||S.tourSeen) return;
  let n=0; const wait=()=>{ if(S.tourSeen||tourOn) return; if($('boot')&&n++<300) return setTimeout(wait,200); setTimeout(()=>{ if(!S.tourSeen) tourStart(false); },500); };
  wait();
}
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#tourbtn')) tourStart(true); });
tourAuto();
