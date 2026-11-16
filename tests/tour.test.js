'use strict';
// Poradnik po interfejsie (src/js/30-tour.js): uruchamiany w sztucznym środowisku strony (bez prawdziwego DOM).
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', '30-tour.js'), 'utf8');
const DATA = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', '03-i18n-data.js'), 'utf8');
const rows = eval(DATA.slice(DATA.indexOf('['), DATA.lastIndexOf(']]') + 2)), KEYS = new Set(rows.map(r => r[0]));

function env(opts = {}) {
  const els = {}, timers = [], listeners = {}, saved = { n: 0 };
  const mk = id => { const e = { id, style: {}, className: '', textContent: '', offsetWidth: 340, offsetHeight: 180, listeners: {},
    classList: { s: new Set(), add(c) { this.s.add(c); }, remove(c) { this.s.delete(c); }, contains(c) { return this.s.has(c); }, toggle(c, v) { v ? this.s.add(c) : this.s.delete(c); } },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }, appendChild() {}, getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; } }; els[id] = e; return e; };
  ['sidewrap', 'rwrap', 'hist'].forEach(mk);
  const rects = Object.assign({ '#brand': [10, 5, 90, 40], '#back': [100, 5, 130, 40], '#fwd': [135, 5, 165, 40], '#reload': [170, 5, 200, 40], '#url': [210, 5, 800, 40], '#tabs': [10, 50, 300, 80], '#nt': [305, 50, 335, 80],
    '#pins': null, '#fl': [0, 100, 184, 500], '#gear': [8, 600, 176, 640], '#toggle': [8, 700, 176, 740], '#rl': [900, 100, 1100, 500], '#hbtn': [900, 700, 1100, 740], '#menub': [1150, 5, 1180, 40] }, opts.rects || {});
  const doc = { body: { appendChild() {} }, getElementById: id => els[id] || null, querySelector: s => { const r = rects[s]; return r ? { getBoundingClientRect: () => ({ left: r[0], top: r[1], right: r[2], bottom: r[3], width: r[2] - r[0], height: r[3] - r[1] }), _s: s } : null; },
    createElement: () => { const d = mk('tour'); Object.defineProperty(d, 'innerHTML', { set(h) { for (const m of h.matchAll(/id="(\w+)"/g)) if (m[1] !== 'tour') mk(m[1]); } }); return d; },
    addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); }, removeEventListener: (t, f) => { listeners[t] = (listeners[t] || []).filter(x => x !== f); } };
  const S = Object.assign({ tourSeen: false }, opts.S || {});
  const ctx = { document: doc, S, SEC: !!opts.SEC, INC: !!opts.INC, innerWidth: 1280, innerHeight: 800, $: id => els[id], t: k => k, save: () => { saved.n++; },
    toggleSet() {}, toggleCl() {}, closeMenu() {}, toggleHist() {}, getComputedStyle: () => ({ display: 'block', visibility: 'visible' }),
    setTimeout: (f, ms) => { timers.push({ f, ms }); return timers.length; }, clearTimeout() {}, addEventListener: (t, f) => { (listeners['w' + t] = listeners['w' + t] || []).push(f); }, removeEventListener() {} };
  ctx.window = ctx; vm.createContext(ctx);
  if (opts.boot) mk('boot');
  vm.runInContext(SRC + '\n;globalThis.__t={TOUR_STEPS,tourStart,tourEnd,tourGo,tourAuto,tourList:()=>tourList,tourI:()=>tourI,on:()=>tourOn,tourPlace,tourRect};', ctx);
  const flush = () => { let n = 0; while (timers.length && n++ < 50) timers.shift().f(); };
  const key = k => { let prevented = false; (listeners.keydown || []).forEach(f => f({ key: k, preventDefault() { prevented = true; }, stopImmediatePropagation() {} })); return prevented; };
  return { ctx, els, S, saved, flush, timers, key, T: ctx.__t, click: id => (els.tour.listeners.click || []).forEach(f => f({ target: { id, closest: () => ({ id }) } })) };
}
module.exports = async () => {
  // teksty: każdy krok ma tłumaczenia we wszystkich językach (klucze w LROWS)
  const e0 = env(); const steps = e0.T.TOUR_STEPS;
  ok(steps.length >= 10 && steps.length <= 14, 'poradnik ma kilkanaście kroków (' + steps.length + ')');
  eq(steps.flatMap(s => [s.h, s.p]).filter(k => !KEYS.has(k)), [], 'każdy tytuł i opis kroku ma wiersz w LROWS');
  eq(['Krok {n}/{m}', 'Pomiń poradnik', 'Następny krok', 'Zakończ', 'Wstecz', 'Poradnik', 'Krótki przewodnik po najważniejszych miejscach interfejsu. Sam pokazuje się tylko przy pierwszym uruchomieniu.', 'Pokaż poradnik ponownie'].filter(k => !KEYS.has(k)), [], 'teksty przycisków i ustawień mają tłumaczenia');
  ok(steps.every(s => !s.sel || s.sel.every(x => /^[#.][\w-]+$/.test(x))), 'selektory to proste id');
  { const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'); const ids = new Set([...html.matchAll(/id="([\w-]+)"/g)].map(m => m[1])); ids.add('nf'); ids.add('rl');
    eq(steps.flatMap(s => s.sel || []).map(x => x.slice(1)).filter(i => !ids.has(i)), [], 'wszystkie podświetlane elementy istnieją w index.html'); }
  // przebieg: pomija niewidoczne (#pins), numeruje, kończy
  const e = env(); e.T.tourStart(false); eq(e.S.tourSeen, true, 'start zapisuje, że poradnik został pokazany'); ok(e.saved.n >= 1, 'stan zapisany od razu'); e.flush();
  const list = e.T.tourList(); ok(!list.some(s => s.sel && s.sel[0] === '#pins'), 'niewidoczne przypięte karty są pomijane'); eq(list.length, steps.length - 1, 'reszta kroków jest');
  eq(e.els.tours.textContent, 'Krok 1/' + list.length, 'numer kroku w oknie'); eq(e.els.tourt.textContent, 'Witaj w Arkanie', 'pierwszy krok: powitanie'); eq(e.els.tourh.className, 'c', 'powitanie: samo przyciemnienie, bez ramki');
  eq(e.els.tourb.style.visibility, 'hidden', 'pierwszy krok: brak „Wstecz”'); eq(e.els.tourx.textContent, 'Pomiń poradnik', 'przycisk pominięcia');
  e.click('tourn'); eq(e.els.tourt.textContent, 'Logo i nawigacja', 'drugi krok'); eq(e.els.tours.textContent, 'Krok 2/' + list.length, 'numer drugiego kroku');
  eq([e.els.tourh.style.left, e.els.tourh.style.top], ['4px', '-1px'], 'ramka obejmuje logo i przyciski nawigacji (z zapasem 6 px)'); eq(e.els.tourh.style.width, '202px', 'szerokość ramki = suma elementów');
  ok(e.els.tourb.style.visibility !== 'hidden', 'drugi krok: jest „Wstecz”'); e.click('tourb'); eq(e.els.tours.textContent, 'Krok 1/' + list.length, '„Wstecz” wraca');
  e.key('ArrowRight'); e.key('ArrowRight'); eq(e.els.tourt.textContent, 'Pasek adresu', 'strzałka w prawo = dalej');
  // okno z opisem zawsze na ekranie i nie przykrywa podświetlenia
  for (let i = 0; i < list.length; i++) {
    const c = e.els.tourc, x = parseInt(c.style.left), y = parseInt(c.style.top);
    ok(x >= 0 && y >= 0 && x + 340 <= 1280 && y + 180 <= 800, 'krok ' + (e.T.tourI() + 1) + ': okno mieści się na ekranie');
    const st = list[e.T.tourI()]; if (st.sel) { const r = e.T.tourRect(st.sel), P = 6; const overlap = !(x + 340 <= r.l - P || x >= r.r + P || y + 180 <= r.t - P || y >= r.b + P); ok(!overlap, 'krok ' + (e.T.tourI() + 1) + ': okno nie zasłania podświetlenia'); }
    if (i < list.length - 1) e.T.tourGo(1);
  }
  // paski boczne rozwijane tylko w krokach bocznych
  const e2 = env(); e2.T.tourStart(false); e2.flush(); const idx = n => e2.T.tourList().findIndex(s => s.h === n);
  e2.T.tourGo(idx('Foldery') - e2.T.tourI()); ok(e2.els.sidewrap.classList.contains('tourx') && !e2.els.rwrap.classList.contains('tourx'), 'krok Foldery: rozwinięty lewy pasek');
  e2.T.tourGo(idx('Aplikacje') - e2.T.tourI()); ok(!e2.els.sidewrap.classList.contains('tourx') && e2.els.rwrap.classList.contains('tourx'), 'krok Aplikacje: rozwinięty prawy pasek');
  e2.T.tourGo(idx('Menu') - e2.T.tourI()); ok(!e2.els.sidewrap.classList.contains('tourx') && !e2.els.rwrap.classList.contains('tourx'), 'krok Menu: paski zwinięte');
  e2.T.tourGo(1); eq([e2.els.tourn.textContent, e2.els.tourx.style.visibility], ['Zakończ', 'hidden'], 'ostatni krok: „Zakończ”, bez „Pomiń”'); e2.click('tourn'); eq(e2.T.on(), false, '„Zakończ” zamyka poradnik'); ok(!e2.els.tour.classList.contains('on'), 'nakładka ukryta');
  // pominięcie i Esc
  const e3 = env(); e3.T.tourStart(false); e3.flush(); e3.click('tourx'); eq(e3.T.on(), false, '„Pomiń poradnik” zamyka całość');
  const e4 = env(); e4.T.tourStart(false); e4.flush(); eq(e4.key('Escape'), true, 'Esc obsłużony (nie trafia do reszty aplikacji)'); eq(e4.T.on(), false, 'Esc zamyka poradnik'); eq(e4.key('Escape'), false, 'po zamknięciu klawisze wracają do aplikacji');
  // elementy ukryte w ustawieniach (asystent) są pomijane
  const e5 = env({ rects: { '#toggle': null } }); e5.T.tourStart(false); e5.flush(); ok(!e5.T.tourList().some(s => s.h === 'Panel asystenta'), 'ukryty panel asystenta: krok pominięty');
  // jednorazowość i okna specjalne
  const a = env({ boot: true }); a.T.tourAuto(); a.flush(); eq(a.T.on(), false, 'trwa animacja startu: poradnik czeka');
  const b = env(); b.T.tourAuto(); b.flush(); eq([b.T.on(), b.S.tourSeen], [true, true], 'pierwsze uruchomienie: poradnik startuje sam');
  const c = env({ S: { tourSeen: true } }); c.T.tourAuto(); c.flush(); eq(c.T.on(), false, 'kolejne uruchomienie: nie pokazuje się');
  const d = env({ INC: true }); d.T.tourAuto(); d.flush(); eq(d.T.on(), false, 'okno incognito: bez poradnika'); const s = env({ SEC: true }); s.T.tourAuto(); s.flush(); eq(s.T.on(), false, 'okno oderwane: bez poradnika');
  const m = env({ S: { tourSeen: true } }); m.T.tourStart(true); m.flush(); eq(m.T.on(), true, 'ręczne uruchomienie z ustawień działa mimo zapisanej flagi');
};
