'use strict';
// Uruchamia wszystkie testy (npm test). Bez zewnętrznych pakietów.
const fs = require('fs'), path = require('path'), { summary } = require('./helpers');
(async () => {
  for (const f of fs.readdirSync(__dirname).filter(x => x.endsWith('.test.js')).sort()) { console.log('\n' + f); await require('./' + f)(); }
  const s = summary(); console.log('\n' + (s.fails ? 'BŁĘDY: ' + s.fails : 'Wszystko w porządku') + ' (' + s.passes + ' sprawdzeń zaliczonych)');
  process.exit(s.fails ? 1 : 0);
})();
