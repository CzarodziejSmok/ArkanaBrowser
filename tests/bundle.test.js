'use strict';
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), root = path.join(__dirname, '..'), B = require('../tools/bundle.js');
module.exports = async () => {
  B.build(); const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  eq([...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]), ['js/preboot.js', 'js/bundle.js'], 'index.html ładuje tylko preboot i bundle');
  ok(!/<script>/.test(html), 'brak skryptów wbudowanych'); ok(/script-src 'self'/.test(html), 'CSP z script-src self');
  ok(fs.readFileSync(path.join(root, 'js', 'bundle.js'), 'utf8') === B.text(), 'bundle zgodny ze źródłami src/js');
  const names = B.sources(); ok(names.length >= 20 && names.every(n => /^\d\d-[\w-]+\.js$/.test(n)), 'pliki źródłowe mają numerowane nazwy (kolejność ładowania)');
  const all = names.map(n => fs.readFileSync(path.join(B.srcDir, n), 'utf8')).join('\n'); ok(!/\beval\s*\(|new Function\s*\(/.test(all), 'kod nie używa eval ani new Function');
};
