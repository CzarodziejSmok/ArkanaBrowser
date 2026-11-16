'use strict';
// Kolory otwartej strony przy jej krawędziach (góra, lewa, prawa) – do łagodnego przejścia kolorów między interfejsem a zawartością karty.
// Wejście: zrzut strony jako surowe piksele BGRA (NativeImage.toBitmap()). Wynik: dominujący kolor każdej krawędzi [r,g,b] albo null.
// „Dominujący” = najczęstszy kolor po kwantyzacji (4 bity na kanał), uśredniony z pikseli tego koloru – odporny na pojedynczy tekst i grafiki.
function dominant(buf, w, h, x0, y0, x1, y1) {
  const hist = new Map();
  for (let y = Math.max(0, y0); y < Math.min(h, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) {
      const i = (y * w + x) * 4, a = buf[i + 3]; if (a < 200) continue;   // przezroczyste piksele pomijamy
      const b = buf[i], g = buf[i + 1], r = buf[i + 2], key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const e = hist.get(key); if (e) { e[0]++; e[1] += r; e[2] += g; e[3] += b; } else hist.set(key, [1, r, g, b]);
    }
  }
  let best = null; for (const e of hist.values()) if (!best || e[0] > best[0]) best = e;
  return best ? [Math.round(best[1] / best[0]), Math.round(best[2] / best[0]), Math.round(best[3] / best[0])] : null;
}
// c = jeden kolor „tła strony” dla całego interfejsu: najczęstszy kolor na wszystkich trzech krawędziach razem (jeden kolor daje spójne pole bez szwów w narożnikach)
function edgeColors(buf, w, h) {
  if (!buf || !(w > 8) || !(h > 8) || buf.length < w * h * 4) return null;
  const sw = Math.max(3, Math.round(w * .03)), sh = Math.max(3, Math.round(h * .045)), zones = [[0, 0, w, sh], [0, 0, sw, h], [w - sw, 0, w, h]];
  const hist = new Map(), add = (x0, y0, x1, y1) => {
    for (let y = Math.max(0, y0); y < Math.min(h, y1); y++) for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) {
      const i = (y * w + x) * 4; if (buf[i + 3] < 200) continue;
      const b = buf[i], g = buf[i + 1], r = buf[i + 2], key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4), e = hist.get(key); if (e) { e[0]++; e[1] += r; e[2] += g; e[3] += b; } else hist.set(key, [1, r, g, b]);
    } };
  zones.forEach(z => add(...z)); let best = null; for (const e of hist.values()) if (!best || e[0] > best[0]) best = e;
  const c = best ? [Math.round(best[1] / best[0]), Math.round(best[2] / best[0]), Math.round(best[3] / best[0])] : null;
  return { c, t: dominant(buf, w, h, ...zones[0]), l: dominant(buf, w, h, ...zones[1]), r: dominant(buf, w, h, ...zones[2]) };
}
module.exports = { dominant, edgeColors };
