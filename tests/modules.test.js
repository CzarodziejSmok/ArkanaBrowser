'use strict';
// Moduły opcjonalne (v49.9): panel aplikacji i gry jest osobnym plikiem js/apps.js, wczytywanym dopiero po włączeniu. Test ładuje rdzeń i moduł w vm
// z „wszystkożernymi” atrapami DOM, więc wykrywa błędy kolejności ładowania (ReferenceError, TDZ) i sprawdza, że wyłączony moduł nie jest ładowany.
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm'), B = require('../tools/bundle.js');
const root = path.join(__dirname, '..'), rd = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const mk = name => new Proxy(function () {}, { get(t, k) { if (k === Symbol.toPrimitive) return () => ''; if (k === Symbol.iterator) return function* () {}; if (k === 'then') return undefined; if (k === 'length') return 0; if (k === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }); if (k === 'matches') return false; return mk(name + '.' + String(k)); }, set() { return true; }, apply() { return mk(name + '()'); }, construct() { return mk('new ' + name); }, has() { return true; } });
function env(state) {
  const scripts = [], timers = [];
  const doc = new Proxy({}, { get(t, k) { if (k === 'createElement') return tag => tag === 'script' ? { tag } : mk('el'); if (k === 'head') return { appendChild: s => scripts.push(s) }; if (k === 'querySelectorAll') return () => []; if (k === 'hidden') return false; return mk('document.' + String(k)); }, set() { return true; } });
  const api = new Proxy({}, { get: (t, k) => k === 'getInit' ? () => ({ secondary: false }) : k === 'loadState' ? () => state : () => { const p = Promise.resolve(null); return p; } });
  const c = { console: { log() {}, warn() {}, error() {} }, setTimeout: f => { timers.push(f); return 1; }, clearTimeout() {}, setInterval: () => 1, clearInterval() {}, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, performance: { now: () => 0 }, Math, JSON, Date, Array, Object, Number, String, Promise, Set, Map, RegExp, Intl, Symbol, Error, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Uint8Array, ArrayBuffer, Buffer, URL, TextEncoder, TextDecoder, Uint16Array, Uint32Array, Int32Array, Float32Array, Float64Array, DataView, WeakMap, WeakSet, Proxy, Reflect,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, navigator: { language: 'pl', userAgent: 'x', platform: 'Win32' }, location: { reload() {}, href: 'file:///x' }, innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1, getComputedStyle: () => mk('cs'), matchMedia: () => ({ matches: false, addEventListener() {} }), ResizeObserver: class { observe() {} }, MutationObserver: class { observe() {} }, IntersectionObserver: class { observe() {} }, FontFace: class { load() { return Promise.resolve(this); } }, NodeFilter: { SHOW_TEXT: 4 }, Image: class {}, Audio: class {}, AudioContext: class {}, Blob: class {}, FileReader: class {}, Notification: class {}, requestIdleCallback: () => 1, queueMicrotask, structuredClone: x => x, fetch: () => Promise.reject(1), addEventListener() {}, removeEventListener() {}, scrollTo() {}, alert() {}, confirm: () => true, open() {} };
  c.document = doc; c.window = c; c.self = c; c.globalThis = c; c.api = api;
  vm.createContext(c); const run = f => { try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), c, { filename: f }); return null; } catch (e) { return e; } };
  return { c, scripts, timers, run, ev: s => vm.runInContext(s, c) };
}
module.exports = async () => {
  B.build();
  // ---- podział na rdzeń i moduł ----
  const all = B.sources(), apps = B.appSources(), core = B.coreSources(); eq([apps.length, core.length + apps.length === all.length], [B.APPS.length, true], 'wszystkie pliki modułu aplikacji istnieją, a razem z rdzeniem dają komplet źródeł');
  ok(apps.every(f => /^(1[0-5]|1[7-9]|20)-/.test(f)), 'moduł aplikacji to pliki 10–15 i 17–20'); ok(core.includes('16-lang-picker.js') && core.includes('25-modules.js') && core.includes('25-shared.js') && core.includes('26-start.js'), 'rdzeń: wybór języka, ładowacz modułów, wspólne funkcje i start');
  ok(fs.readFileSync(path.join(root, 'js', 'bundle.js'), 'utf8') === B.text() && fs.readFileSync(path.join(root, 'js', 'apps.js'), 'utf8') === B.appsText(), 'js/bundle.js i js/apps.js zgodne ze źródłami');
  ok(!/const APPS=\[/.test(B.text()) && /const APPS=\[/.test(B.appsText()), 'definicje aplikacji są tylko w module');
  const html = rd('index.html'); ok(!/apps\.js/.test(html), 'index.html nie ładuje modułu na stałe (robi to 25-modules.js po włączeniu)'); ok(JSON.parse(rd('package.json')).build.files.includes('js/apps.js'), 'js/apps.js jest na liście pakowania');
  // rdzeń nie używa przy ładowaniu niczego z modułu: nazwy z modułu pojawiają się w rdzeniu tylko jako zaślepki (25-modules.js) lub wewnątrz funkcji
  const names = [...B.appsText().matchAll(/^(?:const|let|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]), cn = [...B.text().matchAll(/^(?:const|let|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
  eq(names.filter(n => cn.includes(n)).sort(), ['appsInit'.slice(0, 0)].filter(Boolean).concat(B.STUBS.slice().sort()), 'jedyne nazwy wspólne rdzenia i modułu to zaślepki rdzenia (' + B.STUBS.join(', ') + ')');
  // ---- ładowanie: aplikacje włączone ----
  { const e = env(null); let err = e.run('js/bundle.js'); eq(err && err.message, null, 'rdzeń ładuje się sam (bez modułu aplikacji) aż do końca startu');
    eq(e.scripts.map(s => s.src), ['js/apps.js'], 'aplikacje włączone: rdzeń prosi o js/apps.js'); eq(e.ev('MOD.apps.state'), 1, 'stan modułu: wczytywanie');
    eq(e.ev('typeof APPS+","+typeof APP'), 'undefined,undefined', 'przed wczytaniem moduł nie istnieje'); ok(/Moduł aplikacji jest wyłączony|Wczytywanie aplikacji/.test(e.ev('(()=>{ let h=""; $("set").innerHTML=""; return String(renderApps).includes("appLists")?"real":"stub"; })()')) === false, 'przed wczytaniem renderApps jest zaślepką');
    err = e.run('js/apps.js'); eq(err && err.message, null, 'moduł ładuje się po rdzeniu (bez błędów kolejności)'); e.scripts[0].onload(); eq(e.ev('MOD.apps.state'), 2, 'po wczytaniu: stan „gotowy”');
    eq(e.ev('[typeof APP, Object.keys(APP).length>=10, String(renderApps).includes("appLists"), String(renderBar).includes("A.bar"), String(openApp).includes("mount"), String(toggleAdd).includes("winOf")]'), ['object', true, true, true, true, true], 'zaślepki zastąpione właściwymi funkcjami modułu'); }
  // ---- wyłączone w zapisanych ustawieniach ----
  { const st = { folders: [{ id: 'f1', name: 'Praca', tabs: [], active: null }], cur: 'f1', panel: false, pw: 430, settings: { apps: { on: false, bar: [] } } }, e = env(st); const err = e.run('js/bundle.js'); eq(err && err.message, null, 'rdzeń z wyłączonym modułem ładuje się do końca');
    eq([e.scripts.length, e.ev('MOD.apps.state'), e.ev('typeof APP')], [0, 0, 'undefined'], 'aplikacje wyłączone: js/apps.js nie jest w ogóle wczytywany'); eq(e.ev('toast=()=>{}; openApp("calc"); 1'), 1, 'openApp z zaślepki nie rzuca wyjątku (komunikat zamiast aplikacji)');
    e.ev('appsSet(true)'); eq([e.scripts.length, e.ev('S.settings.apps.on')], [1, true], 'włączenie w ustawieniach wczytuje moduł od razu'); e.ev('appsSet(true)'); eq(e.scripts.length, 1, 'powtórne włączenie nie wczytuje drugi raz');
    e.ev('appsSet(false)'); eq(e.ev('S.settings.apps.on'), false, 'wyłączenie zapisuje ustawienie'); }
  // ---- błąd wczytywania ----
  { const e = env(null); e.run('js/bundle.js'); e.ev('toast=(m)=>{ globalThis.__msg=m; }'); e.scripts[0].onerror(); eq([e.ev('MOD.apps.state'), e.ev('typeof APP')], [-1, 'undefined'], 'błąd pliku: stan „błąd”, rdzeń działa dalej'); }
  // ---- wspólne funkcje w rdzeniu (używa ich rdzeń bez modułu) ----
  { const e = env({ folders: [{ id: 'f1', name: 'Praca', tabs: [], active: null }], cur: 'f1', settings: { apps: { on: false, bar: [] } } }); e.run('js/bundle.js'); eq(e.ev('[typeof toast, typeof capF, typeof trTranslate, typeof langPicker, capF("abc")]'), ['function', 'function', 'function', 'function', 'Abc'], 'toast, capF, trTranslate i langPicker są dostępne bez modułu aplikacji'); }
  // ---- przełączniki w ustawieniach ----
  const s9 = rd('src/js/09-settings.js'); ok(/id="appson"[^>]*>[^<]*<span class="tg"><\/span>Panel aplikacji i gry/.test(s9) && /<h5>MODUŁY<\/h5>/.test(s9), 'Ustawienia → System → Moduły: przełącznik panelu aplikacji i gier'); ok(/if\(e\.target\.id==='appson'\)\{[^}]*appsSet\(e\.target\.checked\)/.test(s9), 'przełącznik wywołuje appsSet (ładowanie i zamykanie okien)');
  ok(/appsBoot\(\);/.test(rd('src/js/26-start.js')) && !/openApp\(id\)\)/.test(rd('src/js/26-start.js')), 'start: appsBoot zamiast bezpośredniego otwierania okien');
};
