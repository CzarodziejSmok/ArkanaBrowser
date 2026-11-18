'use strict';
// Czcionki (v49.9): odczyt nazw rodzin z plików czcionek, lista czcionek systemu, czcionki dodane do przeglądarki, mostek IPC i lista w ustawieniach.
const { eq, ok } = require('./helpers'), fs = require('fs'), os = require('os'), path = require('path'), vm = require('vm'), F = require('../fonts');
const rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/\r\n/g, '\n');
// minimalny plik sfnt: nagłówek + katalog z jedną tabelą „name” (rekordy: [platforma, kodowanie, język, id, tekst])
function nameTable(recs) {
  let str = Buffer.alloc(0); const rr = recs.map(r => { const b = r[0] === 1 ? Buffer.from(r[4], 'latin1') : Buffer.from(r[4], 'utf16le').swap16(); const o = { r, off: str.length, len: b.length }; str = Buffer.concat([str, b]); return o; });
  const nt = Buffer.alloc(6 + rr.length * 12); nt.writeUInt16BE(rr.length, 2); nt.writeUInt16BE(6 + rr.length * 12, 4);
  rr.forEach((x, i) => { const o = 6 + i * 12; [x.r[0], x.r[1], x.r[2], x.r[3], x.len, x.off].forEach((v, k) => nt.writeUInt16BE(v, o + k * 2)); }); return Buffer.concat([nt, str]);
}
function sfnt(recs, base = 0) { const nt = nameTable(recs), h = Buffer.alloc(28); h.writeUInt32BE(0x00010000, 0); h.writeUInt16BE(1, 4); h.write('name', 12, 'latin1'); h.writeUInt32BE(base + 28, 20); h.writeUInt32BE(nt.length, 24); return Buffer.concat([h, nt]); }
const W = (id, s, lang = 0x409) => [3, 1, lang, id, s];
module.exports = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ark-fonts-')), sysd = path.join(dir, 'sys'), data = path.join(dir, 'data'); fs.mkdirSync(sysd);
  // ---- tabela name ----
  eq(F.parseNameTable(nameTable([W(1, 'Segoe UI Semibold'), W(16, 'Segoe UI'), W(2, 'Regular')])), ['Segoe UI', 'Segoe UI Semibold'], 'name: rodzina typograficzna (16) i rodzina (1)');
  eq(F.parseNameTable(nameTable([W(1, 'Zażółć gęślą', 0x415), W(1, 'English Name')])), ['English Name'], 'name: angielska nazwa ma pierwszeństwo przed inną');
  eq(F.parseNameTable(nameTable([W(1, 'Zażółć Gęślą', 0x415)])), ['Zażółć Gęślą'], 'name: polskie znaki (UTF-16)');
  eq(F.parseNameTable(nameTable([[1, 0, 0, 1, 'Mac Roman Font']])), ['Mac Roman Font'], 'name: platforma Macintosh');
  eq([F.parseNameTable(Buffer.alloc(3)), F.parseNameTable(null), F.parseNameTable(Buffer.from([0, 0, 0, 9, 0, 6, 1, 2, 3]))], [[], [], []], 'name: uszkodzone dane nie rzucają wyjątku');
  // ---- pliki ----
  fs.writeFileSync(path.join(sysd, 'a.ttf'), sfnt([W(1, 'Alfa Sans')]));
  fs.writeFileSync(path.join(sysd, 'b.otf'), Buffer.concat([sfnt([W(1, 'Beta Serif')]).subarray(0, 4).fill(0), Buffer.alloc(40)]));   // zły nagłówek: pomijany
  { const f0 = sfnt([W(1, 'Gamma One')], 20), f1 = sfnt([W(1, 'Gamma Two')], 20 + f0.length), h = Buffer.alloc(20); h.write('ttcf', 0, 'latin1'); h.writeUInt32BE(0x00010000, 4); h.writeUInt32BE(2, 8); h.writeUInt32BE(20, 12); h.writeUInt32BE(20 + f0.length, 16);
    // tabela name w TTC ma pozycje bezwzględne od początku pliku – dla f1 baza = 20 + f0.length (patrz sfnt(…, base))
    fs.writeFileSync(path.join(sysd, 'c.ttc'), Buffer.concat([h, f0, f1])); }
  fs.mkdirSync(path.join(sysd, 'sub')); fs.writeFileSync(path.join(sysd, 'sub', 'd.TTF'), sfnt([W(1, 'Delta Mono')])); fs.writeFileSync(path.join(sysd, 'tekst.txt'), 'nie czcionka');
  eq(F.fileFamilies(path.join(sysd, 'a.ttf')), ['Alfa Sans'], 'TTF: nazwa rodziny z pliku'); eq(F.fileFamilies(path.join(sysd, 'b.otf')), [], 'plik bez poprawnego nagłówka: brak nazw'); eq(F.fileFamilies(path.join(sysd, 'c.ttc')).sort(), ['Gamma One', 'Gamma Two'], 'TTC: wszystkie czcionki kolekcji'); eq(F.fileFamilies(path.join(dir, 'brak.ttf')), [], 'brak pliku: puste');
  eq(await F.listSystem([sysd, path.join(dir, 'nie-ma')]), ['Alfa Sans', 'Delta Mono', 'Gamma One', 'Gamma Two'], 'lista systemu: wszystkie rodziny z folderu i podfolderów, posortowane, bez powtórzeń i bez plików nie-czcionek');
  eq(F.systemDirs({ WINDIR: 'C:\\Windows', LOCALAPPDATA: 'C:\\Users\\x\\AppData\\Local' }, 'win32', 'C:\\Users\\x').map(p => p.replace(/\\/g, '/')), ['C:/Windows/Fonts', 'C:/Users/x/AppData/Local/Microsoft/Windows/Fonts'], 'Windows: czcionki systemowe i zainstalowane tylko dla użytkownika');
  // ---- czcionki dodane do przeglądarki ----
  const st = F.store(data); eq(st.list(), [], 'start: brak dodanych czcionek');
  const r = st.add([path.join(sysd, 'a.ttf'), path.join(sysd, 'tekst.txt'), path.join(dir, 'brak.ttf'), path.join(sysd, 'a.ttf')]);
  eq([r.added.map(x => x.family), r.skipped.map(x => x.why)], [['Alfa Sans'], ['format', 'błąd', 'jest']], 'dodawanie: złe rozszerzenie, brak pliku i duplikat są pomijane');
  const id = r.added[0].id; ok(/^[0-9a-f]{16}\.ttf$/.test(id), 'plik dostaje własny identyfikator (bez nazwy z dysku): ' + id); ok(fs.existsSync(path.join(data, 'fonts', id)), 'kopia w folderze danych Arkany');
  eq(st.read(id).length, fs.statSync(path.join(sysd, 'a.ttf')).size, 'odczyt dodanej czcionki'); eq([st.read('../a.ttf'), st.read('..\\..\\x.ttf'), st.read('0000000000000000.ttf'), st.read(null)], [null, null, null, null], 'odczyt: tylko własne identyfikatory z listy (bez ścieżek)');
  fs.writeFileSync(path.join(sysd, 'w.woff2'), Buffer.alloc(64)); const w = st.add([path.join(sysd, 'w.woff2')]); eq(w.added.map(x => x.family), ['w'], 'WOFF2: nazwą jest nazwa pliku');
  eq(F.store(data).list().length, 2, 'lista przetrwa ponowne otwarcie magazynu'); eq([st.remove('../x'), st.remove(id), st.list().map(x => x.family), fs.existsSync(path.join(data, 'fonts', id))], [false, true, ['w'], false], 'usuwanie: znika z listy i z dysku; obce id odrzucone');
  fs.writeFileSync(path.join(data, 'fonts', 'fonts.json'), '{"zly":1}'); eq(F.store(data).list(), [], 'uszkodzony plik listy: pusta lista, bez wyjątku');
  // ---- most IPC i ustawienia ----
  const main = rd('main.js'), pre = rd('preload.js');
  for (const ch of ['fonts-list', 'fonts-add', 'fonts-remove', 'fonts-read']) ok(main.includes("ipcMain.handle('" + ch + "'") && pre.includes("'" + ch + "'"), 'IPC ' + ch + ': preload i proces główny');
  ok(/showOpenDialog\(winOf\(e\)[^)]*fonts|Dodaj czcionkę do Arkany/.test(main) && !/fonts-add'[^)]*\(_e, p/.test(main), 'fonts-add: ścieżki wybiera użytkownik w oknie dialogowym, nie strona');
  ok(JSON.parse(rd('package.json')).build.files.includes('fonts.js'), 'fonts.js jest na liście pakowania');
  // lista w ustawieniach: system z plików + czcionki dodane, bez powtórzeń; zapas (wbudowana lista) gdy odczyt zawiedzie
  const src = rd('src/js/34-fonts.js'), slice = (a, b) => src.slice(src.indexOf(a), src.indexOf(b, src.indexOf(a) + 1));
  const ctx = { S: { settings: { ui: { font: '' } } }, esc: s => String(s), t: s => s, window: { api: {} }, document: { documentElement: { style: {} } }, $: () => null, console, Set, Array, String };
  vm.createContext(ctx); vm.runInContext(slice('function fontNames', 'var FNT_GEN').replace(/return \[[\s\S]*\]; \}/, 'return ["Arial","Verdana"]; }') + slice('var FNT_GEN', 'function fontUserLoad') + slice('function fontsInstalled', 'function fontCss') + slice('function fontCss', 'function applyFont') + 'globalThis.api={fontsInstalled,fontItems:typeof fontItems===\'function\'?fontItems:null};', ctx);
  ctx.FNT_SYS = ['Zeta', 'alfa', 'Alfa', 'Beta']; ctx.FNT_OK = null; eq(ctx.api.fontsInstalled(), ['alfa', 'Beta', 'Zeta'], 'lista systemu z plików: bez powtórzeń (wielkość liter) i posortowana');
  ok(/data-fid=/.test(src) && /class="fnt-x"/.test(src) && /FNT_USER\.map\(f=>\[f\.family,f\.family,'dodana',f\.id\]\)/.test(src), 'lista w ustawieniach: czcionki dodane mają przycisk usuwania');
  ok(/fontsLoad\('user'\)/.test(src.slice(src.lastIndexOf('try{'))), 'start: rejestrowane są tylko czcionki dodane (tanio), system dopiero po otwarciu sekcji');
  fs.rmSync(dir, { recursive: true, force: true });
};
