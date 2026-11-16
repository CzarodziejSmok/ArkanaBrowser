'use strict';
// Przyciski myszy w skrótach: proces główny, skrypt kart, okno przeglądarki, nagrywanie w ustawieniach.
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm');
const rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/\r\n/g, '\n');
const slice = (src, a, b) => { const i = src.indexOf(a), j = b ? src.indexOf(b, i) : src.length; if (i < 0 || j < 0) throw new Error('brak fragmentu: ' + a); return src.slice(i, j); };
const DATA = rd('src/js/03-i18n-data.js'), rows = eval(DATA.slice(DATA.indexOf('['), DATA.lastIndexOf(']]') + 2)), KEYS = new Set(rows.map(r => r[0]));
const ev = (type, b, o = {}) => { const e = Object.assign({ type, button: b, ctrlKey: false, altKey: false, shiftKey: false, prevented: 0, stopped: 0 }, o); e.preventDefault = () => e.prevented++; e.stopImmediatePropagation = () => e.stopped++; e.stopPropagation = () => {}; return e; };
module.exports = async () => {
  // ---- proces główny: dopasowanie przypisania ----
  const main = rd('main.js'), core = slice(main, 'const MOUSE_RE', '// strona (karta lub okno');
  const fired = []; const mctx = { bindings: {}, runAction: (w, a) => fired.push(a), Number, Date, Map, Object, console }; vm.createContext(mctx);
  vm.runInContext(core + '\nglobalThis.f={findMouseBinding,mouseFire};', mctx);
  const find = (n, m = {}) => mctx.f.findMouseBinding({ n, ctrl: false, alt: false, shift: false, ...m });
  mctx.bindings = { 'new-tab': 'Mouse3', back: 'Mouse4', forward: 'Ctrl+Mouse4', 'close-tab': 'Ctrl+Alt+Shift+Mouse7', find: 'Ctrl+F', bad1: 'Mouse1', bad2: 'Mouse2', bad3: 'Ctrl+K+Mouse4', empty: '' };
  eq([find(3), find(4), find(4, { ctrl: true }), find(7, { ctrl: true, alt: true, shift: true })], ['new-tab', 'back', 'forward', 'close-tab'], 'środkowy, boczne i warianty z modyfikatorami');
  eq([find(5), find(3, { ctrl: true }), find(4, { alt: true }), find(7, { ctrl: true })], [null, null, null, null], 'inny przycisk lub inne modyfikatory: bez dopasowania (modyfikatory są opcjonalne tylko w sensie wyboru wariantu)');
  eq([find(1), find(2), find(0), find(65), find(-1), mctx.f.findMouseBinding(null), mctx.f.findMouseBinding({ n: '4' })], [null, null, null, null, null, null, null], 'lewy, prawy i nieprawidłowe numery są odrzucane');
  mctx.bindings = { a: 'Mouse1', b: 'Mouse2', c: 'Ctrl+K+Mouse4' }; eq([find(1), find(2), find(4, { ctrl: true })], [null, null, null], 'przypisania lewego/prawego i z literą są ignorowane nawet w pliku');
  mctx.bindings = { back: 'Mouse4' }; const w = { id: 7 }; const D0 = Date.now; let now = 1000; mctx.Date = { now: () => now };
  mctx.f.mouseFire(w, 4, 'mouse', 'back'); now += 100; mctx.f.mouseFire(w, 4, 'app', 'back'); eq(fired, ['back'], 'ten sam klik z dwóch dróg (mysz i polecenie systemu) wykonuje się raz');
  now += 1000; mctx.f.mouseFire(w, 4, 'app', 'back'); eq(fired.length, 2, 'kolejny klik po dłuższej chwili wykonuje się znowu'); now += 50; mctx.f.mouseFire(w, 4, 'app', 'back'); eq(fired.length, 3, 'szybkie kliknięcia z tego samego źródła nie są gubione');
  // ---- skrypt karty i panelu (wv-preload.js / wv-shim.js) ----
  for (const f of ['wv-preload.js', 'wv-shim.js']) {
    const sn = slice(rd(f), '// Przyciski myszy przypisane do skrótów'), L = {}; let asked = [], bound = new Set(['4', 'c4']), clock = 1000;
    const ctx = { window: { addEventListener: (t, fn) => { (L[t] = L[t] || []).push(fn); } }, Date: { now: () => clock }, ipcRenderer: { sendSync: (ch, m) => { asked.push(m); return ch === 'mouse-key' && bound.has((m.ctrl ? 'c' : '') + m.n); } } };
    vm.createContext(ctx); vm.runInContext(sn, ctx);
    const fire = (type, b, o) => { if (type === 'pointerdown' || (type === 'mousedown' && !fire.pd)) clock += 500; fire.pd = type === 'pointerdown'; const e = ev(type, b, o); (L[type] || []).forEach(fn => fn(e)); return e; };
    ok(['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'auxclick'].every(t => L[t]), f + ': nasłuch zdarzeń myszy');
    let e = fire('mousedown', 0); eq([asked.length, e.prevented], [0, 0], f + ': lewy przycisk nie jest nawet zgłaszany');
    e = fire('mousedown', 2); eq([asked.length, e.prevented], [0, 0], f + ': prawy przycisk nie jest nawet zgłaszany');
    e = fire('mousedown', 1); eq([asked[0].n, e.prevented], [3, 0], f + ': środkowy zgłaszany jako 3, nieprzypisany – strona go dostaje');
    asked = []; let p = fire('pointerdown', 3), m = fire('mousedown', 3); eq([asked.length, asked[0].n, p.prevented, p.stopped, m.prevented], [1, 4, 1, 1, 1], f + ': przypisany boczny: jedno zapytanie, strona nie dostaje klika');
    let u = fire('pointerup', 3), u2 = fire('mouseup', 3), u3 = fire('auxclick', 3); eq([u.prevented, u2.prevented, u3.prevented], [1, 1, 1], f + ': puszczenie przycisku też jest zatrzymane');
    const other = fire('mouseup', 4); eq(other.prevented, 0, f + ': inny przycisk nie jest zatrzymywany');
    asked = []; e = fire('mousedown', 3, { ctrlKey: true }); ok(asked[0].ctrl === true && asked[0].n === 4, f + ': modyfikatory są przekazywane'); eq(e.prevented, 1, f + ': wariant z Ctrl przypisany');
    e = fire('mousedown', 4); eq([asked[asked.length - 1].n, e.prevented], [5, 0], f + ': drugi boczny = 5, nieprzypisany');
    e = fire('mouseup', 4); eq(e.prevented, 0, f + ': nieprzypisany nie jest zatrzymywany przy puszczeniu');
  }
  // ---- okno przeglądarki (src/js/31-mousekeys.js) ----
  { const L = {}, asked = []; const ctx = { recAct: null, tourOn: false, Date, window: { api: { mouseKey: m => { asked.push(m); return m.n === 4; } } }, addEventListener: (t, fn) => { (L[t] = L[t] || []).push(fn); } };
    vm.createContext(ctx); vm.runInContext(rd('src/js/31-mousekeys.js'), ctx); const fire = (t, b) => { const e = ev(t, b); (L[t] || []).forEach(fn => fn(e)); return e; };
    let e = fire('mousedown', 3); eq([e.prevented, e.stopped], [1, 1], 'okno: przypisany boczny przycisk nie wykonuje domyślnej akcji'); eq(fire('mouseup', 3).prevented, 1, 'okno: puszczenie też zatrzymane');
    asked.length = 0; eq([fire('mousedown', 0).prevented, fire('mousedown', 2).prevented, asked.length], [0, 0, 0], 'okno: lewy i prawy nietknięte');
    e = fire('mousedown', 1); eq(e.prevented, 0, 'okno: nieprzypisany środkowy (np. zamykanie karty) działa jak dotąd');
    ctx.recAct = 'back'; asked.length = 0; e = fire('mousedown', 3); eq([e.prevented, asked.length], [0, 0], 'okno: podczas nagrywania skrótu nic nie jest wykonywane'); ctx.recAct = null;
    ctx.tourOn = true; asked.length = 0; fire('mousedown', 3); eq(asked.length, 0, 'okno: podczas poradnika skróty myszy nie działają'); }
  // ---- nagrywanie w ustawieniach ----
  { const src = rd('src/js/09-settings.js'), rec = slice(src, 'const mouseNumOf', 'async function finishRec'), L = {}; const msgs = [], asks = [];
    const ctx = { recAct: 'back', peak: new Set(), MODS: ['Ctrl', 'Alt', 'Shift'], S: { settings: { keys: { back: '', 'new-tab': 'Ctrl+T', forward: 'Mouse5' } } }, Date, Promise, Object,
      document: { addEventListener: (t, fn) => { (L[t] = L[t] || []).push(fn); } }, msg: m => msgs.push(m), stopRec: () => { ctx.recAct = null; ctx.peak.clear(); }, renderKeys() {}, pushKeys() {}, save() {}, ask: async (...a) => { asks.push(a); return true; },
      t: s => s, keyTokLabel: x => x, ANAME: { forward: 'Dalej' } };
    vm.createContext(ctx); vm.runInContext(rec, ctx);
    const down = (b, o = {}, target) => { const e = ev('mousedown', b, { target: target || { closest: () => null }, ...o }); L.mousedown.forEach(fn => fn(e)); return e; };
    const wait = () => new Promise(r => setTimeout(r, 5)), K = () => ctx.S.settings.keys;
    down(3); await wait(); eq(K().back, 'Mouse4', 'nagrywanie: boczny przycisk bez klawiszy = Mouse4'); ctx.recAct = 'back';
    down(1); await wait(); eq(K().back, 'Mouse3', 'nagrywanie: środkowy = Mouse3'); ctx.recAct = 'back';
    down(5); await wait(); eq(K().back, 'Mouse6', 'nagrywanie: kolejny (szósty) przycisk = Mouse6'); ctx.recAct = 'back';
    down(9); await wait(); eq(K().back, 'Mouse10', 'nagrywanie: dowolna liczba przycisków'); ctx.recAct = 'back';
    down(3, { ctrlKey: true }); await wait(); eq(K().back, 'Ctrl+Mouse4', 'nagrywanie: z Ctrl (opcjonalnie)'); ctx.recAct = 'back';
    down(3, { ctrlKey: true, altKey: true, shiftKey: true }); await wait(); eq(K().back, 'Ctrl+Alt+Shift+Mouse4', 'nagrywanie: wszystkie modyfikatory w kolejności Ctrl, Alt, Shift'); ctx.recAct = 'back';
    ctx.peak.add('Shift'); down(3); await wait(); eq(K().back, 'Shift+Mouse4', 'nagrywanie: modyfikator wciśnięty wcześniej też jest liczony'); ctx.recAct = 'back';
    K().back = ''; msgs.length = 0; let e = down(0, {}, { closest: s => s === '.kb.rec' ? {} : null }); await wait(); eq([K().back, e.prevented, msgs.length], ['', 1, 1], 'nagrywanie: lewy przycisk na polu jest odrzucony z komunikatem');
    msgs.length = 0; e = down(2, {}, { closest: s => s === '.kb.rec' ? {} : null }); await wait(); eq([K().back, e.prevented, msgs.length], ['', 1, 1], 'nagrywanie: prawy przycisk na polu jest odrzucony z komunikatem');
    msgs.length = 0; e = down(0); await wait(); eq([K().back, e.prevented, msgs.length, ctx.recAct], ['', 0, 0, 'back'], 'nagrywanie: lewy klik poza polem działa normalnie (interfejs nie jest blokowany)');
    ctx.peak.add('K'); down(3); await wait(); eq([K().back, msgs.length], ['', 1], 'nagrywanie: litera z przyciskiem myszy jest odrzucona'); ctx.recAct = 'back'; ctx.peak.clear();
    down(70); await wait(); eq(K().back, '', 'nagrywanie: numer powyżej 64 jest odrzucony'); ctx.recAct = 'back';
    asks.length = 0; down(4); await wait(); eq([K().back, K().forward, asks.length], ['Mouse5', '', 1], 'nagrywanie: zajęty skrót pyta o przeniesienie i zabiera go z poprzedniej opcji');
    ctx.recAct = null; const e2 = down(3); eq(e2.prevented, 0, 'bez nagrywania nic nie jest przechwytywane'); }
  // ---- czyszczenie przypisań i etykiety ----
  { const blk = slice(rd('src/js/01-state.js'), '{ const K=S.settings.keys, re=', 'S.tourSeen'); const ctx = { S: { settings: { keys: { a: 'Mouse1', b: 'Mouse2', c: 'Ctrl+K+Mouse4', d: 'Mouse99', e: 'Mouse4', f: 'Ctrl+Mouse5', g: 'F12', h: 'Ctrl+Alt+Shift+Mouse12', i: 'Mouse', j: '', k: 'Mouse3' } } } }; vm.createContext(ctx); vm.runInContext(blk, ctx);
    eq(ctx.S.settings.keys, { a: '', b: '', c: '', d: '', e: 'Mouse4', f: 'Ctrl+Mouse5', g: 'F12', h: 'Ctrl+Alt+Shift+Mouse12', i: '', j: '', k: 'Mouse3' }, 'wczytane ustawienia: nieprawidłowe przypisania myszy znikają, reszta zostaje'); }
  { const fn = slice(rd('src/js/09-settings.js'), 'function keyTokLabel', 'const chips='); const ctx = { t: s => s }; vm.createContext(ctx); vm.runInContext(fn + '\nglobalThis.k=keyTokLabel;', ctx); const k = ctx.k;
    eq([k('Ctrl'), k('Mouse3'), k('Mouse4'), k('Mouse5'), k('Mouse6'), k('Mouse12')], ['Ctrl', 'Mysz: środkowy', 'Mysz 4 (wstecz)', 'Mysz 5 (dalej)', 'Mysz 6', 'Mysz 12'], 'nazwy przycisków myszy w skrótach'); }
  // ---- teksty ----
  const need = ['Naciśnij klawisze lub przycisk myszy…', 'Mysz: środkowy', 'Mysz 4 (wstecz)', 'Mysz 5 (dalej)', 'Mysz {n}', 'Lewego i prawego przycisku myszy nie można przypisać do skrótu.', 'Do przycisku myszy można dodać tylko Ctrl, Alt lub Shift.',
    'Możesz też przypisać przycisk myszy: środkowy lub dowolny boczny (lewy i prawy są zablokowane, żeby nie zepsuć nawigacji). Przycisk myszy działa sam, bez żadnego klawisza. Jeśli chcesz wariant z klawiszem, przytrzymaj przy kliknięciu Ctrl, Alt lub Shift.',
    'Przeglądarka domyślna', 'Sprawdzam…', 'Arkana jest teraz przeglądarką domyślną ✓', 'Arkana nie jest przeglądarką domyślną.', 'Ustaw Arkanę jako domyślną', 'Nie udało się zarejestrować Arkany w systemie.', 'Ta funkcja nie jest dostępna w tym oknie.', 'Ustawia Arkanę jako domyślną przeglądarkę w systemie.'];
  eq(need.filter(k => !KEYS.has(k)), [], 'nowe teksty mają tłumaczenia');
  const s9 = rd('src/js/09-settings.js'); ok(s9.includes('Naciśnij klawisze lub przycisk myszy…') && s9.includes('id="defset"') && s9.includes('PRZEGLĄDARKA DOMYŚLNA'), 'ustawienia: pole nagrywania i sekcja przeglądarki domyślnej');
};
