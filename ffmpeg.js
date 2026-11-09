// Opcjonalna integracja z ffmpeg (jeśli jest zainstalowany): dodatkowe formaty audio/wideo/obrazów.
const { spawn, execFile } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const OUT = path.join(os.tmpdir(), 'claude-browser-conv');
let found = null;
const candidates = () => {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg', c = [];
  if (process.env.FFMPEG_PATH) c.push(process.env.FFMPEG_PATH);
  // po instalacji __dirname leży w pliku app.asar, więc szukamy też obok programu (folder instalacji) i w resources
  for (const d of [path.dirname(process.execPath), process.resourcesPath, __dirname]) if (d) c.push(path.join(d, exe), path.join(d, 'ffmpeg', 'bin', exe), path.join(d, 'ffmpeg', exe));
  c.push('ffmpeg');
  return c;
};
function probe() {
  if (found) return Promise.resolve(found);
  return new Promise(res => {
    const list = candidates();
    const next = i => {
      if (i >= list.length) return res({ ok: false });
      const b = list[i];
      if (b !== 'ffmpeg' && !fs.existsSync(b)) return next(i + 1);
      execFile(b, ['-version'], { timeout: 8000, windowsHide: true }, (err, out) => {
        if (err) return next(i + 1);
        found = { ok: true, bin: b, version: String(out).split('\n')[0].trim() }; res(found);
      });
    };
    next(0);
  });
}
const H264 = ['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k'];
const ARGS = {
  mp3: ['-vn', '-c:a', 'libmp3lame', '-q:a', '2'], m4a: ['-vn', '-c:a', 'aac', '-b:a', '192k'], aac: ['-vn', '-c:a', 'aac', '-b:a', '192k'],
  ogg: ['-vn', '-c:a', 'libvorbis', '-q:a', '5'], opus: ['-vn', '-c:a', 'libopus', '-b:a', '128k'], wma: ['-vn', '-c:a', 'wmav2', '-b:a', '192k'],
  ac3: ['-vn', '-c:a', 'ac3', '-b:a', '192k'], mp2: ['-vn', '-c:a', 'mp2', '-b:a', '192k'], au: ['-vn', '-c:a', 'pcm_s16be'], aiff: ['-vn', '-c:a', 'pcm_s16be'],
  wav: ['-vn', '-c:a', 'pcm_s16le'], flac: ['-vn', '-c:a', 'flac'], weba: ['-vn', '-c:a', 'libopus', '-b:a', '128k'],
  mp4: [...H264, '-movflags', '+faststart'], m4v: H264, mov: H264, ts: H264, mkv: ['-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac'],
  webm: ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', '-c:a', 'libopus'],
  avi: ['-c:v', 'mpeg4', '-q:v', '4', '-c:a', 'libmp3lame', '-q:a', '4'], flv: ['-c:v', 'flv', '-q:v', '4', '-c:a', 'libmp3lame', '-ar', '44100'],
  wmv: ['-c:v', 'wmv2', '-q:v', '4', '-c:a', 'wmav2'], ogv: ['-c:v', 'libtheora', '-q:v', '7', '-c:a', 'libvorbis'], mpg: ['-c:v', 'mpeg2video', '-q:v', '4', '-c:a', 'mp2'],
  gif: ['-vf', 'fps=12,scale=480:-1:flags=lanczos', '-loop', '0'],
  png: ['-frames:v', '1'], jpg: ['-frames:v', '1', '-q:v', '2'], webp: ['-frames:v', '1'], bmp: ['-frames:v', '1'], tiff: ['-frames:v', '1'],
  tga: ['-frames:v', '1'], jp2: ['-frames:v', '1'], pcx: ['-frames:v', '1'], avif: ['-frames:v', '1', '-c:v', 'libaom-av1', '-crf', '30', '-b:v', '0']
};
const tail = s => s.split(/\r?\n/).filter(Boolean).slice(-3).join(' ').slice(0, 300);
const secs = t => { const m = /(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(t); return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : 0; };
async function run(job, onP) {
  const f = await probe(); if (!f.ok) return { ok: false, err: 'ffmpeg' };
  const key = String(job.key || ''), ext = String(job.ext || '');
  if (!/^[a-z0-9]{1,5}$/.test(key) || !/^[a-z0-9]{2,5}$/.test(ext)) return { ok: false, err: 'args' };
  if (!job.inPath || !fs.existsSync(job.inPath)) return { ok: false, err: 'input' };
  fs.mkdirSync(OUT, { recursive: true });
  try { for (const n of fs.readdirSync(OUT)) { const p = path.join(OUT, n); if (Date.now() - fs.statSync(p).mtimeMs > 864e5) fs.unlinkSync(p); } } catch {}
  const out = path.join(OUT, Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + '.' + ext), o = job.opts || {};
  const a = ['-y', '-hide_banner', '-nostdin'];
  if (+o.ft > 0 && /^(png|jpg|webp|bmp|tiff)$/.test(key)) a.push('-ss', String(+o.ft));
  a.push('-i', job.inPath);
  const base = ARGS[key] || ARGS[ext] || []; a.push(...base);
  if (base[0] === '-vn') { if (+o.sr > 0) a.push('-ar', String(+o.sr)); if (o.ch === 'mono') a.push('-ac', '1'); else if (o.ch === 'stereo') a.push('-ac', '2'); }
  a.push(out);
  return new Promise(res => {
    const p = spawn(f.bin, a, { windowsHide: true }); let err = '', dur = 0;
    p.stderr.on('data', d => { const s = d.toString(); err += s; if (err.length > 20000) err = err.slice(-8000); const dm = /Duration:\s*(\d+:\d+:\d+(?:\.\d+)?)/.exec(err); if (dm) dur = secs(dm[1]); const tm = s.match(/time=(\d+:\d+:\d+(?:\.\d+)?)/g); if (tm && dur > 0 && onP) onP(Math.min(.99, secs(tm[tm.length - 1]) / dur)); });
    p.on('error', e => res({ ok: false, err: String(e.message) }));
    p.on('close', code => {
      if (code !== 0 || !fs.existsSync(out)) return res({ ok: false, err: tail(err) || 'ffmpeg ' + code });
      const size = fs.statSync(out).size, r = { ok: true, tmp: out, size, ext };
      if (job.read) { r.data = fs.readFileSync(out); } res(r);
    });
  });
}
module.exports = { probe, run, OUT };
