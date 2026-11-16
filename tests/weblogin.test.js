'use strict';
const { eq, ok } = require('./helpers'), vm = require('vm'), wl = require('../weblogin');
module.exports = async () => {
  // rozpoznawanie stron logowania Google
  ok(wl.isGoogleAuth('https://accounts.google.com/v3/signin/identifier?x=1'), 'accounts.google.com to logowanie');
  ok(wl.isGoogleAuth('https://accounts.youtube.com/accounts/SetSID'), 'accounts.youtube.com to logowanie');
  ok(!wl.isGoogleAuth('https://www.google.com/search?q=accounts.google.com'), 'wyszukiwarka Google to nie logowanie');
  ok(!wl.isGoogleAuth('https://accounts.google.com.evil.example/'), 'podszywająca się domena to nie logowanie');
  // nagłówki: marka Electron usuwana, reszta bez zmian
  const h = wl.rewriteHeaders('https://example.com/', { 'sec-ch-ua': '"Chromium";v="130", "Electron";v="33", "Not?A_Brand";v="99"', Accept: '*/*' });
  ok(!/Electron/.test(h['sec-ch-ua']), 'marka Electron usunięta z Client Hints'); eq(h.Accept, '*/*', 'pozostałe nagłówki bez zmian');
  // konfiguracja dla skryptu karty
  wl.setCfg({ gfix: true, passkeys: false }); const c = wl.pageCfg();
  ok(c.gfix && !c.passkeys && c.shim && c.pk, 'web-cfg zawiera uzupełnienie i blokadę kluczy');
  for (const [n, js] of [['CHROME_SHIM', wl.CHROME_SHIM], ['PASSKEY_BLOCK', wl.PASSKEY_BLOCK]]) { try { new vm.Script(js); ok(true, n + ': składnia'); } catch (e) { ok(false, n + ': ' + e.message); } }
  // działanie na atrapie środowiska Electron (pusty window.chrome, brak navigator.share)
  class Navigator {} class CredentialsContainer { get(o) { return Promise.resolve('pw:' + !!(o && o.password)); } create() { return Promise.resolve('c'); } }
  const nav = new Navigator(), cc = new CredentialsContainer();
  const perf = { timeOrigin: 1e12, now: () => 50, getEntriesByType: () => [{ requestStart: 1, startTime: 0, responseStart: 2, domContentLoadedEventEnd: 3, loadEventEnd: 4, nextHopProtocol: 'h2' }], getEntriesByName: () => [] };
  const win = { Navigator, CredentialsContainer, PublicKeyCredential: function () {}, performance: perf, chrome: {}, setTimeout,
    DOMException: class extends Error { constructor(m, n) { super(m); this.name = n; } } };
  win.window = win; const ctx = vm.createContext(win);
  vm.runInContext(wl.CHROME_SHIM, ctx); vm.runInContext(wl.PASSKEY_BLOCK, ctx);
  ok(win.chrome.app && typeof win.chrome.csi === 'function' && typeof win.chrome.loadTimes === 'function', 'window.chrome ma app, csi i loadTimes jak w Chrome');
  eq(vm.runInContext('chrome.loadTimes.toString()', ctx), 'function loadTimes() { [native code] }', 'uzupełnione funkcje wyglądają na natywne');
  eq(win.chrome.loadTimes().npnNegotiatedProtocol, 'h2', 'loadTimes korzysta z danych nawigacji');
  ok(typeof nav.share === 'function' && nav.canShare({ url: 'x' }) === true, 'navigator.share i canShare');
  ok(!('PublicKeyCredential' in win), 'PublicKeyCredential ukryte');
  let denied = ''; await cc.get({ publicKey: {} }).catch(e => { denied = e.name; });
  eq(denied, 'NotAllowedError', 'credentials.get z kluczem dostępu odrzucone bez okna systemowego');
  eq(await cc.get({ password: true }), 'pw:true', 'zwykłe credentials.get działa dalej');
};
