'use strict';
// Konfiguracja motywu: eksport (cały S.settings) i import muszą przywracać wszystkie kolory, przejścia, ruch, czasy, podziały i akcent (v49.x).
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm');
module.exports = async () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', '01-state.js'), 'utf8');
  const ctx = { console, window: { api: {} }, document: { documentElement: { style: {} }, body: { classList: { toggle() {}, add() {} } }, getElementById: () => null, addEventListener() {} }, localStorage: { getItem: () => null, setItem() {} }, setTimeout, clearTimeout, navigator: {} };
  vm.createContext(ctx); vm.runInContext(src + '\n;globalThis.__x={DEF,merge,normalize,fixBgs};', ctx);
  const { DEF, merge, normalize, fixBgs } = ctx.__x, load = o => { ctx.__S = merge(DEF, normalize(JSON.parse(JSON.stringify(o)))); vm.runInContext('S.settings=__S;', ctx); fixBgs(); return ctx.__S; };
  const set = JSON.parse(JSON.stringify(DEF));
  Object.assign(set, { bgs: [{ r: 10, g: 20, b: 30, hold: 5, sat: 60, bri: 40 }, { r: 200, g: 100, b: 50, hold: 20, sat: 70, bri: 55 }, { r: 20, g: 120, b: 200, hold: 200, sat: 80, bri: 45 }], bgSel: 2, bgShape: 'dr', bgInt: 'long', bgRep: 3, bgCut: [.15, .6], bgSlide: 'br', bgFade: true, bgSpd: 12, bgAdj: { bri: -20, sat: 15, r: 30, g: -40, b: 5 }, accs: ['#112233', '#aabbcc', '#ff8800'], accSel: 1, accFade: true, accSpd: 33, accAdj: { bri: 5, sat: -10, r: -20, g: 10, b: 40 } });
  const o = load(JSON.parse(JSON.stringify({ app: 'arkana-browser', version: 2, settings: set })).settings);
  for (const k of ['bgs', 'bgSel', 'bgShape', 'bgInt', 'bgRep', 'bgCut', 'bgSlide', 'bgFade', 'bgSpd', 'bgAdj', 'accs', 'accSel', 'accFade', 'accSpd', 'accAdj']) eq(o[k], set[k], 'import przywraca: ' + k);
  const old = JSON.parse(JSON.stringify(DEF)); for (const k of ['bgs', 'bgSel', 'bgShape', 'bgCut', 'accs']) delete old[k]; old.bg = { r: 1, g: 2, b: 3, hold: 9, sat: 50, bri: 50 }; old.acc = '#123456';
  const o2 = load(old); eq(o2.bgs.length, 1, 'stary plik: jeden kolor motywu z pola bg'); eq(o2.accs, ['#123456'], 'stary plik: akcent z pola acc');
  eq(load(Object.assign(JSON.parse(JSON.stringify(set)), { bgCut: [.2] })).bgCut, [], 'podział o złej liczbie linii jest odrzucany');
  ok(/settings:\s*S\.settings/.test(fs.readFileSync(path.join(__dirname, '..', 'src', 'js', '09-settings.js'), 'utf8')), 'eksport zapisuje cały S.settings');
};
