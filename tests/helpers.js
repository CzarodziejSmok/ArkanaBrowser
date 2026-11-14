'use strict';
let fails = 0, passes = 0;
const eq = (a, b, m) => { if (JSON.stringify(a) === JSON.stringify(b)) { passes++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m + '\n       jest:      ' + JSON.stringify(a).slice(0, 300) + '\n       oczekiwano: ' + JSON.stringify(b).slice(0, 300)); } };
const ok = (c, m) => eq(!!c, true, m);
const summary = () => ({ fails, passes });
module.exports = { eq, ok, summary };
