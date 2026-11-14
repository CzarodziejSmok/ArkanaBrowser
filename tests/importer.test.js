'use strict';
const { eq, ok } = require('./helpers'), fs = require('fs'), os = require('os'), path = require('path'), imp = require('../importer.js'), T = imp._t, F = n => path.join(__dirname, 'fixtures', n);
const meta = JSON.parse(fs.readFileSync(F('meta.json'), 'utf8')), mk = (p, t = 'x') => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t); };
module.exports = async () => {
  // historia Chromium: wielopoziomowe B-drzewo i duże adresy (strony przepełnienia)
  const h = T.chromiumHistory(F('History')); eq(h.length, 2998, 'historia: 3000 wierszy bez chrome:// i ukrytych'); ok(h[0].u.startsWith('https://example0.com/p/0?q=') && h[0].u.length > 6000, 'historia: adres 6000 znaków (przepełnienie)'); eq(h[1].ti, 'Tytuł żółć 1', 'historia: UTF-8');
  ok(Math.abs(h[0].t - meta.now_ms) < 120000, 'historia: czas WebKit -> epoch'); ok(h.every((x, i) => !i || h[i - 1].t >= x.t), 'historia: sortowanie od najnowszych');
  // ciasteczka Chromium (AES-GCM, prefiks SHA-256 z Chrome 130+)
  const key = fs.readFileSync(F('key.bin')), c = T.chromiumCookies(F('Cookies'), key), by = Object.fromEntries(c.list.map(x => [x.name, x]));
  eq([by.sid.value, by.old.value, by.sessionKey.value, by.pl.value], ['abc123', 'legacy', 'sk-secret', 'plainval'], 'ciasteczka: v10 z prefiksem, bez prefiksu, claude.ai, jawne'); eq([c.unsupported, c.expired, c.failed, by.chips], [1, 1, 0, undefined], 'ciasteczka: v20, wygasłe, partycjonowane pominięte');
  eq([by.sid.sameSite, by.old.sameSite, by.sessionKey.sameSite, by.s.exp], ['lax', 'unspecified', 'no_restriction', 0], 'ciasteczka: SameSite i sesyjne'); ok(T.chromiumCookies(F('Cookies'), Buffer.alloc(32)).failed >= 4, 'zły klucz: failed, bez wyjątku');
  // Firefox (baza praktycznie pusta, dane w pliku WAL)
  const fb = T.firefoxBookmarks(F('ffcopy.sqlite')); eq(fb.map(r => r.role), ['menu', 'bar', 'other'], 'Firefox: korzenie z pliku WAL'); eq(fb[1].children[0].children.map(x => x.url), ['https://pl.wikipedia.org/', 'https://github.com/'], 'Firefox: drzewo zakładek bez place:');
  eq(T.firefoxHistory(F('ffcopy.sqlite')).map(x => x.u), ['https://pl.wikipedia.org/', 'https://github.com/'], 'Firefox: historia'); eq(T.firefoxCookies(F('fcookies.sqlite')).list.map(x => x.name), ['a', 'b'], 'Firefox: ciasteczka bez kontenerów i wygasłych');
  // zakładki Chromium i HTML
  const cb = T.chromiumBookmarks(F('Bookmarks')); eq(cb.map(r => r.role), ['bar', 'other', 'mobile'], 'Chromium: korzenie'); eq(cb[0].children[1].children.map(x => x.url), ['https://developer.mozilla.org/'], 'Chromium: bez javascript:');
  const hb = T.netscapeBookmarks(fs.readFileSync(F('bm.html'), 'utf8')); eq(hb[1].children[0], { t: 'u', name: 'Strona "A"', url: 'https://a.com/?x=1&y=2' }, 'HTML: encje i atrybuty'); eq(hb[1].children[1].children[0].url, 'https://b.com/', 'HTML: zagnieżdżone foldery');
  // wyszukiwarka
  eq(T.firefoxEngine({ searchJson: F('ff_app.mozlz4') }).preset, 'duckduckgo', 'Firefox: wbudowana wyszukiwarka (LZ4)'); eq(T.firefoxEngine({ searchJson: F('ff_custom.mozlz4') }).url, 'https://szukaj.example.org/find?q=%s&lang=pl', 'Firefox: własna wyszukiwarka z parametrami');
  eq(T.chromiumEngine({ webData: F('WebData'), preferences: '' }).url, 'https://moja.pl/s?query=%s', 'Chromium: wyszukiwarka z Web Data'); eq(T.chromiumEngine({ webData: '', preferences: F('Preferences') }).preset, 'duckduckgo', 'Chromium: fallback Preferences');
  eq(T.normalizeEngine('https://post.example/{searchTerms}/{weird}', 'x'), null, 'nieznany placeholder: odrzucone'); eq(T.presetOf('https://evilgoogle.com/?q=%s'), '', 'preset nie myli podobnych domen');
  // wykrywanie przeglądarek na sztucznych katalogach (Opera GX w różnych układach)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arkana-det-')), R = path.join(tmp, 'A'), L = path.join(tmp, 'L');
  mk(R + '/Opera Software/Opera GX Stable/Default/History'); mk(R + '/Opera Software/Opera GX Stable/Local State', '{}');
  eq(T.detect({ APPDATA: R, LOCALAPPDATA: L }, true).map(p => p.browser + ':' + p.profile), ['Opera GX:Default'], 'Opera GX: podfolder Default'); mk(L + '/Opera Software/Opera GX Stable/Bookmarks', '{}');
  eq(T.detect({ APPDATA: R, LOCALAPPDATA: L }, true).length, 2, 'Opera GX: oba układy (Roaming i Local)');
  eq(T.profilesFromFolder(R).map(p => p.browser), ['Opera GX'], 'ręczny wybór folderu nadrzędnego'); eq(T.profilesFromFolder(path.join(tmp, 'puste')), [], 'pusty folder');
  eq(await imp.run('dir|' + path.join(tmp, 'puste'), { bookmarks: true }, {}), { ok: false, err: 'notfound' }, 'run: nieznany profil');
  fs.rmSync(tmp, { recursive: true, force: true });
};
