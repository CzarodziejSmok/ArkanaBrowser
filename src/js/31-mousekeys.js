// ---------- przyciski myszy przypisane do skrótów: okno przeglądarki (karty obsługuje wv-preload.js, panel asystenta wv-shim.js) ----------
// Środkowy i boczne przyciski myszy (dowolna ich liczba) można przypisać w Ustawienia → Skróty. Lewy i prawy są zablokowane.
// Proces główny sprawdza, czy kliknięta kombinacja jest przypisana, i sam wykonuje skrót; tu tylko zatrzymujemy domyślną reakcję okna na ten klik.
(function mouseKeysHost(){
  if(!(window.api&&window.api.mouseKey)) return;
  const num=b=>b===0?1:b===1?3:b===2?2:b+1;   // 1 lewy, 2 prawy, 3 środkowy, 4 i 5 boczne, 6… kolejne
  let last=null, eat=-1, eatT=0;
  const ask=e=>{
    const now=Date.now(); if(last&&last.b===e.button&&now-last.t<80) return last.hit;   // pointerdown i mousedown to ten sam klik
    let hit=false; try{ hit=!!window.api.mouseKey({n:num(e.button),ctrl:!!e.ctrlKey,alt:!!e.altKey,shift:!!e.shiftKey}); }catch{}
    last={b:e.button,t:now,hit}; return hit;
  };
  const down=e=>{
    if(e.button===0||e.button===2||recAct||tourOn) return;   // nagrywanie skrótu i poradnik same obsługują kliknięcia
    if(ask(e)){ eat=e.button; eatT=Date.now(); e.preventDefault(); e.stopImmediatePropagation(); } else eat=-1;
  };
  const up=e=>{ if(eat===e.button&&Date.now()-eatT<1500){ e.preventDefault(); e.stopImmediatePropagation(); } };
  addEventListener('pointerdown',down,true); addEventListener('mousedown',down,true);
  addEventListener('pointerup',up,true); addEventListener('mouseup',up,true); addEventListener('auxclick',up,true);
})();
