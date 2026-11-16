'use strict';
const { eq, ok } = require('./helpers'), vm = require('vm'), AP = require('../adblock-page'), A = require('../adblock');
// uruchamia skrypt YouTube w sztucznym środowisku strony; zwraca kontekst i zegar (ręcznie wywoływane tick)
function run(host, dom) {
  const ticks = []; let clicked = 0;
  const win = {}; const ctx = { location: { hostname: host }, setInterval: f => ticks.push(f), Response: function () {}, console };
  ctx.Response.prototype.json = function () { return Promise.resolve(this.body); };
  ctx.document = Object.assign({ querySelector: () => null, querySelectorAll: () => [], documentElement: { style: {} }, body: { style: {} } }, dom || {});
  ctx.window = win; vm.createContext(ctx); vm.runInContext('globalThis.window=globalThis;', ctx); ctx.JSON = vm.runInContext('JSON', ctx);
  vm.runInContext(AP.YT_SCRIPT, ctx);
  return { ctx, tick: () => ticks.forEach(f => f()), count: () => ticks.length, clicked: () => clicked };
}
module.exports = async () => {
  ok(AP.pageCfg(true).ads.length > 500 && AP.pageCfg(true).adcss.yt && AP.pageCfg(true).adcss.gen, 'włączone: skrypt i style');
  eq(AP.pageCfg(false), { ads: '', adcss: null }, 'wyłączone: nic nie jest wstrzykiwane');
  ok(new vm.Script(AP.YT_SCRIPT), 'skrypt YouTube: składnia');
  ok(AP.isYouTube('www.youtube.com') && AP.isYouTube('music.youtube.com') && !AP.isYouTube('accounts.youtube.com') && !AP.isYouTube('notyoutube.com') && !AP.isYouTube('youtube.com.evil.example'), 'rozpoznawanie hosta YouTube');
  // poza YouTube skrypt nie robi nic
  { const r = run('example.com'); eq(r.count(), 0, 'inna strona: brak zegara'); }
  { const r = run('accounts.youtube.com'); eq(r.count(), 0, 'accounts.youtube.com (logowanie): brak ingerencji'); }
  // YouTube: wycinanie pól reklamowych
  const r = run('www.youtube.com'); eq(r.count(), 1, 'YouTube: uruchomiony zegar ratunkowy');
  const pr = r.ctx.JSON.parse(JSON.stringify({ videoDetails: { videoId: 'x' }, adPlacements: [1], playerAds: [2], adSlots: [3], streamingData: { a: 1 } }));
  eq(Object.keys(pr).sort(), ['streamingData', 'videoDetails'], 'JSON.parse: usunięte adPlacements, playerAds, adSlots');
  const w = r.ctx.JSON.parse(JSON.stringify({ playerResponse: { adPlacements: [1], videoDetails: {} }, x: 1 }));
  eq(Object.keys(w.playerResponse), ['videoDetails'], 'JSON.parse: pola w playerResponse');
  eq(r.ctx.JSON.parse('[1,2,{"a":3}]'), [1, 2, { a: 3 }], 'zwykły JSON bez zmian'); eq(r.ctx.JSON.parse('"x"'), 'x', 'prymitywy bez zmian');
  eq(r.ctx.JSON.parse('{"a":1}', (k, v) => v), { a: 1 }, 'reviver nadal działa');
  vm.runInContext("window.ytInitialPlayerResponse = { adPlacements: [1], playerAds: [2], videoDetails: { videoId: 'v' } };", r.ctx);
  eq(Object.keys(vm.runInContext('ytInitialPlayerResponse', r.ctx)), ['videoDetails'], 'ytInitialPlayerResponse oczyszczone przy przypisaniu');
  const R = r.ctx.Response, a = new R(); a.url = 'https://www.youtube.com/youtubei/v1/player?key=1'; a.body = { adPlacements: [1], ok: 1 };
  eq(Object.keys(await a.json()), ['ok'], 'fetch /youtubei/v1/player: odpowiedź oczyszczona');
  const b = new R(); b.url = 'https://example.com/api'; b.body = { adPlacements: [1] }; eq(Object.keys(await b.json()), ['adPlacements'], 'fetch spoza YouTube: bez zmian');
  // ratunek: reklama w odtwarzaczu
  const video = { muted: false, playbackRate: 1, duration: 15, currentTime: 0, paused: false, play: () => Promise.resolve() };
  let cls = ['ad-showing'], btn = 0; const player = { classList: { contains: c => cls.includes(c) } };
  const dom = { querySelector: s => /movie_player|html5-video-player/.test(s) ? player : /^video/.test(s) ? video : null, querySelectorAll: s => /ytp-ad-skip/.test(s) ? [{ click: () => btn++ }] : [] };
  const t = run('www.youtube.com', dom); t.tick();
  eq([video.muted, video.playbackRate, video.currentTime], [true, 16, 15], 'reklama: wyciszona, 16x i przewinięta do końca');
  eq(btn, 1, 'reklama: kliknięto „Pomiń”');
  cls = []; t.tick(); eq([video.muted, video.playbackRate], [false, 1], 'po reklamie: dźwięk i prędkość przywrócone');
  // okno „blokery reklam są niedozwolone”
  let removed = 0, played = 0; const dlg = { remove: () => removed++ }; const paused = Object.assign({}, video, { paused: true, play: () => { played++; return Promise.resolve(); } });
  const d2 = { querySelector: s => s === 'ytd-enforcement-message-view-model' ? { closest: () => dlg } : /^video/.test(s) ? paused : null };
  run('www.youtube.com', d2).tick(); eq([removed, played], [1, 1], 'okno z żądaniem wyłączenia blokera usunięte, film wznowiony');
  // style
  ok(/ytd-ad-slot-renderer/.test(AP.YT_CSS) && /display:none!important\}$/.test(AP.YT_CSS), 'style YouTube');
  ok(!/googletagmanager|body|html/.test(AP.GEN_CSS), 'style ogólne: wąska lista');
  // blokowanie po ścieżce w YouTube
  eq(A.shouldBlock('https://www.youtube.com/pagead/adview?ai=1', 'https://www.youtube.com/watch?v=1', 'image'), true, 'YouTube /pagead/ blokowane');
  eq(A.shouldBlock('https://www.youtube.com/api/stats/ads?x=1', 'https://www.youtube.com/watch?v=1', 'xhr'), true, 'YouTube /api/stats/ads blokowane');
  eq(A.shouldBlock('https://www.youtube.com/api/stats/playback?x=1', 'https://www.youtube.com/watch?v=1', 'xhr'), false, 'statystyki odtwarzania przechodzą');
  eq(A.shouldBlock('https://www.youtube.com/youtubei/v1/player', 'https://www.youtube.com/watch?v=1', 'xhr'), false, 'żądanie odtwarzacza przechodzi (czyścimy je w stronie)');
  eq(A.shouldBlock('https://www.youtube.com/watch?v=1', 'https://www.youtube.com/', 'mainFrame'), false, 'strona filmu przechodzi');
  eq(A.shouldBlock('https://example.com/pagead/x.js', 'https://example.com/', 'script'), false, '/pagead/ poza YouTube nie jest blokowane po ścieżce');
};
