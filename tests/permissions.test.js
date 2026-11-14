'use strict';
const { eq, ok } = require('./helpers'), P = require('../permissions'), fs = require('fs'), os = require('os'), path = require('path'), EventEmitter = require('events');
module.exports = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arkana-perm-')), st = new P.Store(path.join(dir, 'p.json')), O = 'https://example.com';
  eq(P.originOf('https://a.com:8080/x?y'), 'https://a.com:8080', 'origin z adresu'); eq(P.originOf('about:blank'), '', 'about: bez origin'); eq(P.originOf('file:///C:/x'), 'file://', 'file://');
  eq(P.keyOf('media', { mediaTypes: ['video', 'audio'] }), 'media:audio+video', 'media: klucz łączy typy alfabetycznie');
  eq(P.decide(st, 'geolocation', O, 'geolocation', false), 'ask', 'lokalizacja: pytaj');
  eq(P.decide(st, 'fullscreen', O, 'fullscreen', false), 'allow', 'pełny ekran: od razu');
  eq(P.decide(st, 'unknown', O, 'unknown', false), 'deny', 'nieznane uprawnienie: odmowa');
  eq(P.decide(st, 'geolocation', '', 'geolocation', false), 'deny', 'brak origin: odmowa');
  eq(P.decide(st, 'geolocation', 'file://', 'geolocation', false), 'deny', 'file:// jako strona: odmowa');
  eq(P.decide(st, 'media', O, 'media:video', true), 'deny', 'własny interfejs: kamera zabroniona'); eq(P.decide(st, 'clipboard-read', O, 'clipboard-read', true), 'allow', 'własny interfejs: schowek dozwolony');
  st.set(O, 'geolocation', 'allow'); eq(P.decide(st, 'geolocation', O, 'geolocation', false), 'allow', 'zapamiętana zgoda'); st.set(O, 'notifications', 'deny'); eq(P.decide(st, 'notifications', O, 'notifications', false), 'deny', 'zapamiętana odmowa');
  eq(P.decide(st, 'geolocation', 'https://inna.com', 'geolocation', false), 'ask', 'zgoda dotyczy tylko tej witryny');
  st.set(O, 'media:video', 'allow'); eq(P.decide(st, 'media', O, 'media:audio+video', false), 'ask', 'kamera+mikrofon: brak zgody na mikrofon => pytaj'); st.set(O, 'media:audio', 'allow'); eq(P.decide(st, 'media', O, 'media:audio+video', false), 'allow', 'kamera+mikrofon: obie zgody => zezwól');
  const st2 = new P.Store(path.join(dir, 'p.json')); eq(st2.get(O, 'geolocation'), 'allow', 'zapis i odczyt z pliku'); st2.del(O, 'geolocation'); eq(st2.get(O, 'geolocation'), undefined, 'usuwanie'); st2.clear(); eq(st2.list(), [], 'czyszczenie');
  // pośrednik
  const ipc = new EventEmitter(); ipc.handlers = {}; ipc.handle = (n, f) => { ipc.handlers[n] = f; };
  const st3 = new P.Store(path.join(dir, 'q.json')), ask = P.broker(ipc, st3, { timeout: 80 }), sent = [];
  const wc = { send: (c, r) => sent.push([c, r]) }, req = { wc, origin: O, permission: 'geolocation', key: 'geolocation' };
  const p1 = ask(req), p2 = ask(req); eq(sent.length, 1, 'identyczne pytania są łączone w jedno okno');
  ipc.emit('perm-answer', {}, sent[0][1].id, true, true); eq([await p1, await p2], [true, true], 'odpowiedź trafia do obu oczekujących'); eq(st3.get(O, 'geolocation'), 'allow', 'zapamiętano zgodę');
  const p3 = ask({ wc, origin: O, permission: 'notifications', key: 'notifications' }); ipc.emit('perm-answer', {}, sent[1][1].id, false, false); eq(await p3, false, 'odmowa jednorazowa'); eq(st3.get(O, 'notifications'), undefined, 'odmowa jednorazowa nie jest zapamiętywana');
  const p4 = ask({ wc, origin: O, permission: 'midi', key: 'midi' }); eq(await p4, false, 'brak odpowiedzi w czasie => odmowa');
  const p5 = ask({ wc, origin: O, permission: 'media', key: 'media:audio+video' }); ipc.emit('perm-answer', {}, sent[sent.length - 1][1].id, true, true); await p5; eq([st3.get(O, 'media:audio'), st3.get(O, 'media:video')], ['allow', 'allow'], 'zgoda na kamerę+mikrofon zapamiętana też osobno');
  eq((await ipc.handlers['perm-list']()).map(x => x.origin), [O], 'lista zgód'); await ipc.handlers['perm-del']({}, O, 'media:audio'); eq(st3.get(O, 'media:audio'), undefined, 'usuwanie zgody przez IPC');
  const ipc2 = new EventEmitter(); ipc2.handle = () => {}; const badAsk = P.broker(ipc2, st3, { timeout: 50 }); eq(await badAsk({ wc: { send() { throw new Error('x'); } }, origin: O, permission: 'midi', key: 'midi' }), false, 'błąd wysyłania => odmowa');
  // obsługa sesji
  let reqH, chkH; const ses = { setPermissionRequestHandler: f => { reqH = f; }, setPermissionCheckHandler: f => { chkH = f; } }; P.install(ses, st3, ask);
  const guest = { hostWebContents: wc, getURL: () => O + '/p' }; let got; reqH(guest, 'fullscreen', v => { got = v; }, { requestingUrl: O + '/p' }); eq(got, true, 'sesja: pełny ekran przyznany');
  reqH(guest, 'webmidi-x', v => { got = v; }, { requestingUrl: O }); eq(got, false, 'sesja: nieznane odrzucone');
  eq(chkH(guest, 'geolocation', 'https://nowa.org', {}), false, 'kontrola synchroniczna: nierozstrzygnięte = false'); st3.set('https://nowa.org', 'geolocation', 'allow'); eq(chkH(guest, 'geolocation', 'https://nowa.org', {}), true, 'kontrola synchroniczna: zapamiętana zgoda = true');
  fs.rmSync(dir, { recursive: true, force: true });
};
