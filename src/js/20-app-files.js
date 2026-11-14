// ---------- aplikacja: zmieniacz formatów (silniki konwersji, bez zewnętrznych bibliotek) ----------
const FCT=new TextEncoder();
const fcU8=(...a)=>{ let n=0; a.forEach(x=>n+=x.length); const o=new Uint8Array(n); let p=0; a.forEach(x=>{ o.set(x,p); p+=x.length; }); return o; };
const fcCrcT=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; t[n]=c>>>0; } return t; })();
const fcCrc=b=>{ let c=-1; for(let i=0;i<b.length;i++) c=fcCrcT[(c^b[i])&255]^(c>>>8); return (~c)>>>0; };
const fcStream=async(b,s)=>new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(s)).arrayBuffer());
const fcDeflate=b=>fcStream(b,new CompressionStream('deflate-raw')), fcInflate=b=>fcStream(b,new DecompressionStream('deflate-raw'));
const fcGz=b=>fcStream(b,new CompressionStream('gzip')), fcGunzip=b=>fcStream(b,new DecompressionStream('gzip'));
const fcBlobBytes=async b=>new Uint8Array(await b.arrayBuffer());
// --- ZIP ---
async function fcZip(files){
  const parts=[], cen=[]; let off=0; const dt=new Date(), dosT=(dt.getHours()<<11)|(dt.getMinutes()<<5)|(dt.getSeconds()>>1), dosD=((dt.getFullYear()-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate();
  for(const f of files){ const nm=FCT.encode(f.name), crc=fcCrc(f.data); let data=f.data, m=0;
    if(!f.store&&data.length>64){ const d=await fcDeflate(data); if(d.length<data.length){ data=d; m=8; } }
    const h=new Uint8Array(30+nm.length), v=new DataView(h.buffer);
    v.setUint32(0,0x04034b50,true); v.setUint16(4,20,true); v.setUint16(6,0x0800,true); v.setUint16(8,m,true); v.setUint16(10,dosT,true); v.setUint16(12,dosD,true); v.setUint32(14,crc,true); v.setUint32(18,data.length,true); v.setUint32(22,f.data.length,true); v.setUint16(26,nm.length,true); h.set(nm,30);
    parts.push(h,data);
    const c=new Uint8Array(46+nm.length), w=new DataView(c.buffer);
    w.setUint32(0,0x02014b50,true); w.setUint16(4,20,true); w.setUint16(6,20,true); w.setUint16(8,0x0800,true); w.setUint16(10,m,true); w.setUint16(12,dosT,true); w.setUint16(14,dosD,true); w.setUint32(16,crc,true); w.setUint32(20,data.length,true); w.setUint32(24,f.data.length,true); w.setUint16(28,nm.length,true); w.setUint32(42,off,true); c.set(nm,46);
    cen.push(c); off+=h.length+data.length; }
  const cs=cen.reduce((a,x)=>a+x.length,0), e=new Uint8Array(22), ev=new DataView(e.buffer);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true); ev.setUint32(12,cs,true); ev.setUint32(16,off,true);
  return fcU8(...parts,...cen,e); }
async function fcUnzip(b){
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength); let e=-1; for(let i=b.length-22;i>=Math.max(0,b.length-66000);i--) if(dv.getUint32(i,true)===0x06054b50){ e=i; break; } if(e<0) throw new Error('zip');
  const n=dv.getUint16(e+10,true); let p=dv.getUint32(e+16,true); const out=[];
  for(let k=0;k<n;k++){ if(dv.getUint32(p,true)!==0x02014b50) throw new Error('zip');
    const m=dv.getUint16(p+10,true), cs=dv.getUint32(p+20,true), nl=dv.getUint16(p+28,true), el=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), lo=dv.getUint32(p+42,true), name=new TextDecoder().decode(b.subarray(p+46,p+46+nl));
    p+=46+nl+el+cl; if(name.endsWith('/')) continue;
    const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true), raw=b.subarray(ds,ds+cs); out.push({name,data:m===0?raw.slice():await fcInflate(raw)}); }
  return out; }
// --- TAR ---
function fcTar(files){
  const parts=[], oct=(v,l)=>FCT.encode(v.toString(8).padStart(l-1,'0')+'\0');
  files.forEach(f=>{ const h=new Uint8Array(512); h.set(FCT.encode(f.name).slice(0,100),0); h.set(oct(0o644,8),100); h.set(oct(0,8),108); h.set(oct(0,8),116); h.set(oct(f.data.length,12),124); h.set(oct(Math.floor(Date.now()/1000),12),136);
    h.fill(32,148,156); h[156]=48; h.set(FCT.encode('ustar\0'+'00'),257); let s=0; h.forEach(x=>s+=x); h.set(FCT.encode(s.toString(8).padStart(6,'0')+'\0 '),148);
    parts.push(h,f.data,new Uint8Array((512-f.data.length%512)%512)); });
  parts.push(new Uint8Array(1024)); return fcU8(...parts); }
function fcUntar(b){
  const out=[]; let p=0, ln='';
  while(p+512<=b.length){ const h=b.subarray(p,p+512); if(h.every(x=>x===0)) break;
    const str=(a,l)=>new TextDecoder().decode(h.subarray(a,a+l)).replace(/\0[\s\S]*$/,''); let name=str(0,100); const pre=str(345,155); if(pre) name=pre+'/'+name;
    const size=parseInt(str(124,12).trim()||'0',8), t=String.fromCharCode(h[156]||48); p+=512; const data=b.subarray(p,p+size);
    if(t==='L') ln=new TextDecoder().decode(data).replace(/\0[\s\S]*$/,''); else { if(t==='0'||t==='7') out.push({name:ln||name,data:data.slice()}); ln=''; }
    p+=Math.ceil(size/512)*512; }
  return out; }
// --- GIF (paleta RGB332 + dithering Bayer, przezroczystość) ---
function fcLzw(idx){
  const mb=8, clear=256, eoi=257; let bits=9, next=258, dict=new Map(), out=[], cur=0, cn=0;
  const emit=c=>{ cur|=c<<cn; cn+=bits; while(cn>=8){ out.push(cur&255); cur>>=8; cn-=8; } };
  emit(clear); let w=idx[0];
  for(let i=1;i<idx.length;i++){ const k=idx[i], key=(w<<8)|k, v=dict.get(key); if(v!==undefined){ w=v; continue; }
    emit(w); if(next===4096){ emit(clear); dict.clear(); next=258; bits=9; } else { if(next>=(1<<bits)) bits++; dict.set(key,next++); } w=k; }
  emit(w); emit(eoi); if(cn>0) out.push(cur&255); return out; }
const FCBAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function fcGif(frames,W,H,loop){
  const o=[], w16=v=>o.push(v&255,v>>8&255); [...'GIF89a'].forEach(c=>o.push(c.charCodeAt(0))); w16(W); w16(H); o.push(0xF7,0,0);
  for(let i=0;i<256;i++) o.push(Math.round(((i>>5)&7)*255/7),Math.round(((i>>2)&7)*255/7),Math.round((i&3)*255/3));
  if(frames.length>1){ o.push(0x21,0xFF,11); [...'NETSCAPE2.0'].forEach(c=>o.push(c.charCodeAt(0))); o.push(3,1); w16(loop|0); o.push(0); }
  frames.forEach(f=>{ const px=f.px, idx=new Uint8Array(W*H); let tr=false;
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=(y*W+x)*4, j=y*W+x; if(px[i+3]<128){ idx[j]=0; tr=true; continue; }
      const t=(FCBAY[(y&3)*4+(x&3)]/16-.47), r=Math.min(255,Math.max(0,px[i]+t*36)), g=Math.min(255,Math.max(0,px[i+1]+t*36)), b=Math.min(255,Math.max(0,px[i+2]+t*85));
      let q=((Math.round(r*7/255)<<5)|(Math.round(g*7/255)<<2)|Math.round(b*3/255)); if(q===0&&f.tr!==false) q=1; idx[j]=q; }
    o.push(0x21,0xF9,4,(tr?0x09:0x04)|(tr?8:0)); w16(Math.max(1,Math.round(f.delay||10))); o.push(0,0);
    o.push(0x2C); w16(0); w16(0); w16(W); w16(H); o.push(0,8);
    const d=fcLzw(idx); for(let i=0;i<d.length;i+=255){ const c=d.slice(i,i+255); o.push(c.length); c.forEach(v=>o.push(v)); } o.push(0); });
  o.push(0x3B); return Uint8Array.from(o); }
// --- TIFF / BMP / PPM / ICO / PDF / SVG ---
function fcTiff(px,W,H){
  const n=W*H*4, entries=10, ifd=8, bps=ifd+2+entries*12+4, data=bps+8, out=new Uint8Array(data+n), v=new DataView(out.buffer);
  out.set([0x49,0x49,42,0],0); v.setUint32(4,8,true); let p=ifd; v.setUint16(p,entries,true); p+=2;
  const E=(tag,type,cnt,val)=>{ v.setUint16(p,tag,true); v.setUint16(p+2,type,true); v.setUint32(p+4,cnt,true); if(type===3&&cnt===1) v.setUint16(p+8,val,true); else v.setUint32(p+8,val,true); p+=12; };
  E(256,4,1,W); E(257,4,1,H); E(258,3,4,bps); E(259,3,1,1); E(262,3,1,2); E(273,4,1,data); E(277,3,1,4); E(278,4,1,H); E(279,4,1,n); E(338,3,1,2);
  for(let i=0;i<4;i++) v.setUint16(bps+i*2,8,true); out.set(px,data); return out; }
function fcBmp(px,W,H){
  const rs=(W*3+3)&~3, size=54+rs*H, o=new Uint8Array(size), v=new DataView(o.buffer); o[0]=66; o[1]=77; v.setUint32(2,size,true); v.setUint32(10,54,true); v.setUint32(14,40,true); v.setInt32(18,W,true); v.setInt32(22,H,true); v.setUint16(26,1,true); v.setUint16(28,24,true); v.setUint32(34,rs*H,true); v.setInt32(38,2835,true); v.setInt32(42,2835,true);
  for(let y=0;y<H;y++){ let q=54+(H-1-y)*rs; for(let x=0;x<W;x++){ const i=(y*W+x)*4; o[q++]=px[i+2]; o[q++]=px[i+1]; o[q++]=px[i]; } } return o; }
function fcPpm(px,W,H){ const h=FCT.encode(`P6\n${W} ${H}\n255\n`), o=new Uint8Array(h.length+W*H*3); o.set(h,0); let q=h.length; for(let i=0;i<W*H;i++){ o[q++]=px[i*4]; o[q++]=px[i*4+1]; o[q++]=px[i*4+2]; } return o; }
function fcIco(pngs){   // pngs:[{s,bytes}]
  const n=pngs.length, hd=6+16*n, o=[new Uint8Array(hd)], v=new DataView(o[0].buffer); v.setUint16(2,1,true); v.setUint16(4,n,true); let off=hd;
  pngs.forEach((p,i)=>{ const e=6+16*i; o[0][e]=p.s>=256?0:p.s; o[0][e+1]=p.s>=256?0:p.s; v.setUint16(e+4,1,true); v.setUint16(e+6,32,true); v.setUint32(e+8,p.bytes.length,true); v.setUint32(e+12,off,true); off+=p.bytes.length; o.push(p.bytes); });
  return fcU8(...o); }
function fcPdfImg(jpg,W,H){
  const wp=(W*.75).toFixed(2), hp=(H*.75).toFixed(2), e=s=>FCT.encode(s), parts=[e('%PDF-1.4\n')], xref=[]; let off=9;
  const add=(...bs)=>{ xref.push(off); const b=fcU8(...bs.map(x=>typeof x==='string'?e(x):x)); parts.push(b); off+=b.length; };
  add('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'); add('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  add(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wp} ${hp}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,'\nendstream\nendobj\n');
  const c=`q ${wp} 0 0 ${hp} 0 0 cm /Im0 Do Q`; add(`5 0 obj\n<< /Length ${c.length} >>\nstream\n${c}\nendstream\nendobj\n`);
  let x='xref\n0 6\n0000000000 65535 f \n'; xref.forEach(o=>x+=String(o).padStart(10,'0')+' 00000 n \n'); x+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${off}\n%%EOF`; parts.push(e(x)); return fcU8(...parts); }
const fcB64=b=>{ let s=''; for(let i=0;i<b.length;i+=0x8000) s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000)); return btoa(s); };
const fcUnB64=s=>Uint8Array.from(atob(s.replace(/\s+/g,'')),c=>c.charCodeAt(0));
const FC_MIME={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',bmp:'image/bmp',ico:'image/x-icon',svg:'image/svg+xml',avif:'image/avif',tif:'image/tiff',tiff:'image/tiff',pdf:'application/pdf',wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',flac:'audio/flac',m4a:'audio/mp4',aac:'audio/aac',opus:'audio/ogg',webm:'video/webm',mp4:'video/mp4',mkv:'video/x-matroska',mov:'video/quicktime',ogv:'video/ogg',txt:'text/plain',html:'text/html',json:'application/json',csv:'text/csv',xml:'application/xml'};
// --- obrazy: dekodowanie i rysowanie ---
async function fcImgSrc(F){
  const blob=new Blob([F.data],{type:FC_MIME[F.ext]||''});
  if(F.ext==='svg'){ const im=new Image(); im.src=URL.createObjectURL(blob); await im.decode(); return {src:im,W:im.naturalWidth||1024,H:im.naturalHeight||1024}; }
  const bm=await createImageBitmap(blob); return {src:bm,W:bm.width,H:bm.height}; }
function fcCanvas(S,o,opaque){
  let {W,H}=S; const m=+o.maxSide||0; if(m>0&&Math.max(W,H)>m){ const k=m/Math.max(W,H); W=Math.max(1,Math.round(W*k)); H=Math.max(1,Math.round(H*k)); }
  const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d',{willReadFrequently:true});
  if(opaque){ g.fillStyle=o.bg||'#ffffff'; g.fillRect(0,0,W,H); } g.imageSmoothingQuality='high'; g.drawImage(S.src,0,0,W,H); return c; }
const fcToBlob=(c,mime,q)=>new Promise((res,rej)=>c.toBlob(b=>b&&b.type===mime?res(b):rej(new Error('enc')),mime,q));
// --- dźwięk ---
function fcSniffRate(b){   // częstotliwość próbkowania z nagłówka (żeby dekodowanie nie zmieniało jej na stałą częstotliwość kontekstu)
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength), tx=(o,l)=>String.fromCharCode(...b.subarray(o,Math.min(b.length,o+l)));
  if(tx(0,4)==='RIFF'&&tx(8,4)==='WAVE'){ let p=12; while(p+8<=b.length){ const id=tx(p,4), sz=dv.getUint32(p+4,true); if(id==='fmt ') return dv.getUint32(p+12,true); p+=8+sz+(sz&1); } }
  if(tx(0,4)==='fLaC') return (b[18]<<12)|(b[19]<<4)|(b[20]>>4);
  if(tx(0,4)==='OggS'){ const s=tx(0,200); if(s.includes('OpusHead')) return 48000; const j=s.indexOf('\x01vorbis'); if(j>=0) return dv.getUint32(j+12,true); }
  let o=0; if(tx(0,3)==='ID3') o=10+(((b[6]&127)<<21)|((b[7]&127)<<14)|((b[8]&127)<<7)|(b[9]&127));
  for(let i=o;i<Math.min(b.length-4,o+8192);i++) if(b[i]===0xFF&&(b[i+1]&0xE0)===0xE0){ const ver=(b[i+1]>>3)&3, sr=(b[i+2]>>2)&3; if(ver!==1&&sr!==3){ const base=[44100,48000,32000][sr]; return ver===3?base:ver===2?base/2:base/4; } }
  for(let i=0;i<b.length-32;i++) if(b[i]===0x6d&&b[i+1]===0x70&&b[i+2]===0x34&&b[i+3]===0x61){ const r=dv.getUint16(i+28); if(r>=8000&&r<=96000) return r; }
  return 0; }
function fcAiffDecode(b){
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength); let p=12, nc=0, n=0, bits=0, sr=0, data=-1;
  while(p+8<=b.length){ const id=String.fromCharCode(...b.subarray(p,p+4)), sz=dv.getUint32(p+4);
    if(id==='COMM'){ nc=dv.getUint16(p+8); n=dv.getUint32(p+10); bits=dv.getUint16(p+14); const e=dv.getUint16(p+16)&0x7FFF, m=Number(dv.getBigUint64(p+18)); sr=Math.round(m*2**(e-16383-63)); } else if(id==='SSND') data=p+16; p+=8+sz+(sz&1); }
  if(data<0||!nc) throw new Error('aiff'); const buf=new AudioBuffer({length:n,sampleRate:sr,numberOfChannels:nc}), by=bits/8;
  for(let c=0;c<nc;c++){ const ch=buf.getChannelData(c); for(let i=0;i<n;i++){ const o=data+(i*nc+c)*by; ch[i]=bits===16?dv.getInt16(o)/32768:bits===24?((dv.getInt8(o)<<16)|(dv.getUint8(o+1)<<8)|dv.getUint8(o+2))/8388608:bits===8?dv.getInt8(o)/128:dv.getInt32(o)/2147483648; } }
  return buf; }
async function fcDecodeAudio(bytes){
  if(String.fromCharCode(...bytes.subarray(0,4))==='FORM'&&String.fromCharCode(...bytes.subarray(8,12))==='AIFF') return fcAiffDecode(bytes);
  const AC=window.AudioContext||window.webkitAudioContext, sr=fcSniffRate(bytes), c=sr>=8000&&sr<=96000?new AC({sampleRate:sr}):new AC();
  try{ return await c.decodeAudioData(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)); } finally{ c.close(); } }
async function fcAudioOpts(buf,o){
  const sr=+o.sr||buf.sampleRate, ch=o.ch==='mono'?1:o.ch==='stereo'?2:Math.min(buf.numberOfChannels,2);
  if(sr!==buf.sampleRate||ch!==buf.numberOfChannels){ const oc=new OfflineAudioContext(ch,Math.max(1,Math.ceil(buf.length*sr/buf.sampleRate)),sr), s=oc.createBufferSource(); s.buffer=buf; s.connect(oc.destination); s.start(); buf=await oc.startRendering(); }
  return buf; }
const fcChans=buf=>Array.from({length:buf.numberOfChannels},(_,i)=>buf.getChannelData(i));
function fcWav(buf,bits){
  const ch=fcChans(buf), n=buf.length, nc=ch.length, bps=bits/8, size=44+n*nc*bps, o=new Uint8Array(size), v=new DataView(o.buffer), s=(p,t)=>[...t].forEach((c,i)=>o[p+i]=c.charCodeAt(0));
  s(0,'RIFF'); v.setUint32(4,size-8,true); s(8,'WAVEfmt '); v.setUint32(16,16,true); v.setUint16(20,bits===32?3:1,true); v.setUint16(22,nc,true); v.setUint32(24,buf.sampleRate,true); v.setUint32(28,buf.sampleRate*nc*bps,true); v.setUint16(32,nc*bps,true); v.setUint16(34,bits,true); s(36,'data'); v.setUint32(40,n*nc*bps,true);
  let p=44; for(let i=0;i<n;i++) for(let c=0;c<nc;c++){ const x=Math.max(-1,Math.min(1,ch[c][i]));
    if(bits===16){ v.setInt16(p,Math.round(x<0?x*32768:x*32767),true); p+=2; } else if(bits===24){ const q=Math.round(x<0?x*8388608:x*8388607); o[p]=q&255; o[p+1]=(q>>8)&255; o[p+2]=(q>>16)&255; p+=3; } else { v.setFloat32(p,ch[c][i],true); p+=4; } }
  return o; }
function fcAiff(buf){
  const ch=fcChans(buf), n=buf.length, nc=ch.length, dsz=n*nc*2, size=12+26+16+dsz, o=new Uint8Array(size), v=new DataView(o.buffer), s=(p,t)=>[...t].forEach((c,i)=>o[p+i]=c.charCodeAt(0));
  s(0,'FORM'); v.setUint32(4,size-8); s(8,'AIFF'); s(12,'COMM'); v.setUint32(16,18); v.setUint16(20,nc); v.setUint32(22,n); v.setUint16(26,16);
  const sr=buf.sampleRate, e=Math.floor(Math.log2(sr)), man=BigInt(sr)<<BigInt(63-e); v.setUint16(28,16383+e); v.setBigUint64(30,man);
  s(38,'SSND'); v.setUint32(42,dsz+8); let p=54; for(let i=0;i<n;i++) for(let c=0;c<nc;c++){ const x=Math.max(-1,Math.min(1,ch[c][i])); v.setInt16(p,Math.round(x<0?x*32768:x*32767)); p+=2; }
  return o; }
class FcBits{ constructor(){ this.b=[]; this.cur=0; this.n=0; }
  put(v,len){ while(len>0){ const take=Math.min(8-this.n,len), part=Math.floor(v/2**(len-take))&((1<<take)-1); this.cur=(this.cur<<take)|part; this.n+=take; len-=take; if(this.n===8){ this.b.push(this.cur); this.cur=0; this.n=0; } } }
  zeros(q){ while(q>0){ const take=Math.min(8-this.n,q); this.cur<<=take; this.n+=take; q-=take; if(this.n===8){ this.b.push(this.cur); this.cur=0; this.n=0; } } }
  align(){ if(this.n) this.put(0,8-this.n); } }
const fcCrc8=a=>{ let c=0; for(const x of a){ c^=x; for(let k=0;k<8;k++) c=c&128?((c<<1)^7)&255:(c<<1)&255; } return c; };
const fcCrc16=a=>{ let c=0; for(const x of a){ c^=x<<8; for(let k=0;k<8;k++) c=c&0x8000?((c<<1)^0x8005)&0xFFFF:(c<<1)&0xFFFF; } return c; };
function fcFlacSub(x,bw){
  const n=x.length; let best=0, cost=Infinity, res=null;
  for(let k=0;k<=Math.min(4,n-1);k++){ const r=new Int32Array(n-k); for(let i=k;i<n;i++) r[i-k]=k===0?x[i]:k===1?x[i]-x[i-1]:k===2?x[i]-2*x[i-1]+x[i-2]:k===3?x[i]-3*x[i-1]+3*x[i-2]-x[i-3]:x[i]-4*x[i-1]+6*x[i-2]-4*x[i-3]+x[i-4];
    let s=0; for(let i=0;i<r.length;i++) s+=Math.abs(r[i]); if(s<cost){ cost=s; best=k; res=r; } }
  const m=res.length?cost/res.length:0; let p=0; while(p<14&&2**(p+1)<=m) p++;
  bw.put(0,1); bw.put(8+best,6); bw.put(0,1); for(let i=0;i<best;i++) bw.put(x[i]&0xFFFF,16);
  bw.put(0,2); bw.put(0,4); bw.put(p,4);
  for(let i=0;i<res.length;i++){ const r=res[i], u=r>=0?r*2:-r*2-1; bw.zeros(Math.floor(u/2**p)); bw.put(1,1); if(p) bw.put(u%(2**p),p); } }
function fcFlac(buf){
  const ch=fcChans(buf).slice(0,2), nc=ch.length, n=buf.length, sr=buf.sampleRate, BS=4096;
  const pcm=ch.map(c=>{ const a=new Int32Array(n); for(let i=0;i<n;i++){ const x=Math.max(-1,Math.min(1,c[i])); a[i]=Math.round(x<0?x*32768:x*32767); } return a; });
  const si=new FcBits(); si.put(BS,16); si.put(BS,16); si.put(0,24); si.put(0,24); si.put(sr,20); si.put(nc-1,3); si.put(15,5); si.put(n,36); for(let i=0;i<16;i++) si.put(0,8);
  const parts=[FCT.encode('fLaC'),Uint8Array.from([0x80,0,0,34]),Uint8Array.from(si.b)];
  for(let off=0,fn=0;off<n||fn===0;off+=BS,fn++){ const bs=Math.min(BS,n-off), bw=new FcBits();
    bw.put(0xFFF8,16); bw.put(bs===BS?12:7,4); bw.put(0,4); bw.put(nc-1,4); bw.put(4,3); bw.put(0,1);
    if(fn<128) bw.put(fn,8); else if(fn<0x800){ bw.put(0xC0|(fn>>6),8); bw.put(0x80|(fn&63),8); } else if(fn<0x10000){ bw.put(0xE0|(fn>>12),8); bw.put(0x80|((fn>>6)&63),8); bw.put(0x80|(fn&63),8); } else { bw.put(0xF0|(fn>>18),8); bw.put(0x80|((fn>>12)&63),8); bw.put(0x80|((fn>>6)&63),8); bw.put(0x80|(fn&63),8); }
    if(bs!==BS) bw.put(bs-1,16); bw.put(fcCrc8(bw.b),8);
    pcm.forEach(c=>fcFlacSub(c.subarray(off,off+bs),bw)); bw.align(); const c16=fcCrc16(bw.b); bw.put(c16,16); parts.push(Uint8Array.from(bw.b)); if(n===0) break; }
  return fcU8(...parts); }
function fcRecorder(stream,mimes,onP,dur){
  const mt=mimes.find(m=>MediaRecorder.isTypeSupported(m)); if(!mt) throw new Error('rec'); const rec=new MediaRecorder(stream,{mimeType:mt}), ch=[]; rec.ondataavailable=e=>{ if(e.data.size) ch.push(e.data); };
  const done=new Promise(r=>rec.onstop=r), t0=performance.now(), iv=setInterval(()=>onP&&onP(Math.min(.99,(performance.now()-t0)/1000/dur)),300);
  rec.start(250); return {rec,mt,finish:async()=>{ rec.stop(); await done; clearInterval(iv); return {bytes:await fcBlobBytes(new Blob(ch)),mime:mt}; }}; }
async function fcRecAudio(buf,onP){
  const c=new (window.AudioContext||window.webkitAudioContext)(), d=c.createMediaStreamDestination(), s=c.createBufferSource(); s.buffer=buf; s.connect(d);
  const r=fcRecorder(d.stream,['audio/webm;codecs=opus','audio/webm'],onP,buf.duration), ended=new Promise(x=>s.onended=x); s.start(); await ended; await new Promise(x=>setTimeout(x,250)); const out=await r.finish(); c.close(); return out.bytes; }
// ---------- dokumenty: model bloków {k:'p|h1..h6|li|ol|q|pre|hr', runs:[{t,b,i,u,c,h}]} ----------
const fcX=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
const fcRt=b=>b.runs.map(r=>r.t).join('');
function fcMdBlocks(src){
  const L=src.replace(/\r\n?/g,'\n').split('\n'), out=[]; let i=0;
  const inl=s=>{ const runs=[], re=/(\*\*|__)(.+?)\1|(\*|_)(.+?)\3|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g; let p=0, m;
    while((m=re.exec(s))){ if(m.index>p) runs.push({t:s.slice(p,m.index)}); if(m[2]!==undefined) runs.push({t:m[2],b:1}); else if(m[4]!==undefined) runs.push({t:m[4],i:1}); else if(m[5]!==undefined) runs.push({t:m[5],c:1}); else runs.push({t:m[6],h:m[7]}); p=re.lastIndex; }
    if(p<s.length) runs.push({t:s.slice(p)}); return runs; };
  while(i<L.length){ const l=L[i]; let m;
    if(/^```/.test(l)){ const code=[]; i++; while(i<L.length&&!/^```/.test(L[i])) code.push(L[i++]); i++; out.push({k:'pre',runs:[{t:code.join('\n')}]}); continue; }
    if((m=l.match(/^(#{1,6})\s+(.*)$/))){ out.push({k:'h'+m[1].length,runs:inl(m[2])}); i++; continue; }
    if(/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)){ out.push({k:'hr',runs:[]}); i++; continue; }
    if((m=l.match(/^\s*([-*+]|\d+\.)\s+(.*)$/))){ out.push({k:/\d/.test(m[1])?'ol':'li',runs:inl(m[2])}); i++; continue; }
    if((m=l.match(/^>\s?(.*)$/))){ out.push({k:'q',runs:inl(m[1])}); i++; continue; }
    if(!l.trim()){ i++; continue; }
    const para=[l]; i++; while(i<L.length&&L[i].trim()&&!/^(#{1,6}\s|```|\s*([-*+]|\d+\.)\s|>)/.test(L[i])) para.push(L[i++]); out.push({k:'p',runs:inl(para.join(' '))}); }
  return out; }
const fcTxtBlocks=s=>s.replace(/\r\n?/g,'\n').split('\n').filter(l=>l.trim()).map(l=>({k:'p',runs:[{t:l}]}));
function fcHtmlBlocks(html){
  const d=new DOMParser().parseFromString(html,'text/html'), out=[]; d.querySelectorAll('script,style,head,noscript').forEach(x=>x.remove());
  const inl=(n,st,runs)=>{ n.childNodes.forEach(c=>{ if(c.nodeType===3){ const t=c.nodeValue.replace(/\s+/g,' '); if(t) runs.push({t,...st}); } else if(c.nodeType===1){ const tg=c.tagName.toLowerCase();
    if(tg==='br') runs.push({t:'\n'}); else if(/^(b|strong)$/.test(tg)) inl(c,{...st,b:1},runs); else if(/^(i|em)$/.test(tg)) inl(c,{...st,i:1},runs); else if(tg==='u') inl(c,{...st,u:1},runs);
    else if(/^(code|kbd|samp)$/.test(tg)) inl(c,{...st,c:1},runs); else if(tg==='a') inl(c,{...st,h:c.getAttribute('href')||undefined},runs); else inl(c,st,runs); } }); };
  const blk=n=>{ n.childNodes.forEach(c=>{ if(c.nodeType===3){ if(c.nodeValue.trim()) out.push({k:'p',runs:[{t:c.nodeValue.replace(/\s+/g,' ').trim()}]}); return; } if(c.nodeType!==1) return; const tg=c.tagName.toLowerCase();
    if(/^h[1-6]$/.test(tg)){ const r=[]; inl(c,{},r); out.push({k:tg,runs:r}); }
    else if(tg==='p'||tg==='li'||tg==='dt'||tg==='dd'){ const r=[]; inl(c,{},r); out.push({k:tg==='li'?(c.parentElement&&c.parentElement.tagName==='OL'?'ol':'li'):'p',runs:r}); }
    else if(tg==='pre') out.push({k:'pre',runs:[{t:c.textContent}]}); else if(tg==='hr') out.push({k:'hr',runs:[]});
    else if(tg==='blockquote'){ const r=[]; inl(c,{},r); out.push({k:'q',runs:r}); }
    else if(tg==='tr') out.push({k:'p',runs:[{t:[...c.children].map(x=>x.textContent.trim()).join(' | ')}]});
    else if(/^(ul|ol|div|section|article|main|body|table|tbody|thead|header|footer|nav|form|dl|figure)$/.test(tg)) blk(c);
    else { const r=[]; inl(c,{},r); if(r.some(x=>x.t.trim())) out.push({k:'p',runs:r}); } }); };
  blk(d.body); return out.filter(b=>b.k==='hr'||b.runs.some(r=>r.t.trim())); }
async function fcDocxBlocks(bytes){
  const z=await fcUnzip(bytes), f=z.find(x=>x.name==='word/document.xml'); if(!f) throw new Error('docx');
  const x=new DOMParser().parseFromString(new TextDecoder().decode(f.data),'application/xml'), out=[];
  [...x.getElementsByTagName('w:p')].forEach(p=>{ const ps=p.getElementsByTagName('w:pStyle')[0], st=ps?(ps.getAttribute('w:val')||''):'', num=p.getElementsByTagName('w:numPr').length>0, runs=[];
    [...p.getElementsByTagName('w:r')].forEach(r=>{ const rp=r.getElementsByTagName('w:rPr')[0], has=n=>{ const e=rp&&rp.getElementsByTagName(n)[0]; return !!e&&e.getAttribute('w:val')!=='0'&&e.getAttribute('w:val')!=='false'; }; let t='';
      [...r.childNodes].forEach(c=>{ if(c.nodeName==='w:t') t+=c.textContent; else if(c.nodeName==='w:tab') t+='\t'; else if(c.nodeName==='w:br'||c.nodeName==='w:cr') t+='\n'; }); if(t) runs.push({t,b:has('w:b')?1:0,i:has('w:i')?1:0,u:has('w:u')?1:0}); });
    const m=/^(?:Heading|Nagłówek)\s*(\d)$/i.exec(st), k=m?'h'+Math.min(6,+m[1]):/^Title$/i.test(st)?'h1':(num||/List/i.test(st))?'li':'p'; if(runs.length) out.push({k,runs}); });
  return out; }
async function fcOdtBlocks(bytes){
  const z=await fcUnzip(bytes), f=z.find(x=>x.name==='content.xml'); if(!f) throw new Error('odt');
  const x=new DOMParser().parseFromString(new TextDecoder().decode(f.data),'application/xml'), out=[];
  const gather=n=>{ let t=''; n.childNodes.forEach(c=>{ if(c.nodeType===3) t+=c.nodeValue; else if(c.nodeName==='text:tab') t+='\t'; else if(c.nodeName==='text:s') t+=' '.repeat(+c.getAttribute('text:c')||1); else if(c.nodeName==='text:line-break') t+='\n'; else t+=gather(c); }); return t; };
  const walk=(n,li)=>{ n.childNodes.forEach(c=>{ if(c.nodeName==='text:h') out.push({k:'h'+Math.min(6,+c.getAttribute('text:outline-level')||1),runs:[{t:gather(c)}]}); else if(c.nodeName==='text:p'){ const t=gather(c); if(t) out.push({k:li?'li':'p',runs:[{t}]}); } else if(c.nodeType===1) walk(c,li||c.nodeName==='text:list'); }); };
  walk(x.documentElement,false); return out; }
function fcRtfBlocks(s){
  let out='', i=0, depth=0, skip=-1, uc=1; const stack=[];
  while(i<s.length){ const ch=s[i];
    if(ch==='{'){ stack.push(skip); depth++; i++; if(s[i]==='\\'&&s[i+1]==='*') skip=depth; continue; }
    if(ch==='}'){ if(skip===depth) skip=stack[stack.length-1]; skip=stack.pop()===undefined?skip:(skip>=depth?-1:skip); depth--; i++; continue; }
    if(ch==='\\'){ const m=/^\\([a-zA-Z]+)(-?\d+)? ?/.exec(s.slice(i,i+40));
      if(m){ i+=m[0].length; const w=m[1], n=m[2]; if(/^(fonttbl|colortbl|stylesheet|info|pict|header|footer)$/.test(w)&&skip<0) skip=depth;
        else if(skip<0){ if(w==='par'||w==='line') out+='\n'; else if(w==='tab') out+='\t'; else if(w==='u'){ let c=+n; if(c<0) c+=65536; out+=String.fromCharCode(c); i+=uc>0&&s[i]==='?'?1:0; } else if(w==='uc') uc=+n; } continue; }
      const m2=/^\\'([0-9a-fA-F]{2})/.exec(s.slice(i,i+4)); if(m2){ i+=4; if(skip<0) out+=new TextDecoder('windows-1250').decode(Uint8Array.of(parseInt(m2[1],16))); continue; }
      if(s[i+1]==='\n'||s[i+1]==='\r'){ i+=2; if(skip<0) out+='\n'; continue; } if(skip<0) out+=s[i+1]; i+=2; continue; }
    if(ch!=='\n'&&ch!=='\r'&&skip<0) out+=ch; i++; }
  return fcTxtBlocks(out); }
function fcRuns(b,f){ return b.runs.map(r=>f(r)).join(''); }
function fcToTxt(bl){ let n=0, o=''; bl.forEach((b,i)=>{ let t=fcRt(b); if(b.k==='ol') t=(++n)+'. '+t; else { n=0; if(b.k==='li') t='• '+t; else if(b.k==='hr') t='----------'; }
  o+=(i?(/^(li|ol)$/.test(b.k)&&/^(li|ol)$/.test(bl[i-1].k)?'\n':'\n\n'):'')+t; }); return o+'\n'; }
function fcToMd(bl){ let n=0, o=''; bl.forEach((b,i)=>{ const t=fcRuns(b,r=>{ let s=r.t; if(r.c) s='`'+s+'`'; if(r.b) s='**'+s+'**'; if(r.i) s='*'+s+'*'; if(r.h) s='['+s+']('+r.h+')'; return s; }); let l;
  if(/^h[1-6]$/.test(b.k)) l='#'.repeat(+b.k[1])+' '+t; else if(b.k==='li') l='- '+t; else if(b.k==='ol') l=(++n)+'. '+t; else if(b.k==='q') l='> '+t; else if(b.k==='pre') l='```\n'+fcRt(b)+'\n```'; else if(b.k==='hr') l='---'; else l=t; if(b.k!=='ol') n=0;
  o+=(i?(/^(li|ol)$/.test(b.k)&&/^(li|ol)$/.test(bl[i-1].k)?'\n':'\n\n'):'')+l; }); return o+'\n'; }
function fcBody(bl){ let o='', open=''; const close=()=>{ if(open){ o+='</'+open+'>\n'; open=''; } };
  bl.forEach(b=>{ const t=fcRuns(b,r=>{ let s=fcX(r.t).replace(/\n/g,'<br>'); if(r.c) s='<code>'+s+'</code>'; if(r.b) s='<b>'+s+'</b>'; if(r.i) s='<i>'+s+'</i>'; if(r.u) s='<u>'+s+'</u>'; if(r.h) s='<a href="'+fcX(r.h)+'">'+s+'</a>'; return s; });
    if(b.k==='li'||b.k==='ol'){ const tg=b.k==='li'?'ul':'ol'; if(open!==tg){ close(); o+='<'+tg+'>\n'; open=tg; } o+='<li>'+t+'</li>\n'; return; } close();
    if(/^h[1-6]$/.test(b.k)) o+='<'+b.k+'>'+t+'</'+b.k+'>\n'; else if(b.k==='q') o+='<blockquote>'+t+'</blockquote>\n'; else if(b.k==='pre') o+='<pre>'+fcX(fcRt(b))+'</pre>\n'; else if(b.k==='hr') o+='<hr>\n'; else o+='<p>'+t+'</p>\n'; });
  close(); return o; }
const fcHtmlDoc=(bl,title,csp)=>`<!DOCTYPE html>\n<html><head><meta charset="utf-8">${csp?'<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:">':''}<title>${fcX(title||'')}</title><style>body{font-family:"Segoe UI",Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 16px;line-height:1.6;color:#222}pre{background:#f4f4f4;padding:10px;overflow:auto}code{background:#f4f4f4;padding:0 3px}blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:12px;color:#555}</style></head><body>\n${fcBody(bl)}</body></html>\n`;
async function fcToDocx(bl){
  const nums=[]; let curNum=0; const ps=bl.map(b=>{ let ppr='', rp='';
    if(b.k!=='ol') curNum=0;
    if(/^h[1-6]$/.test(b.k)) ppr='<w:pPr><w:pStyle w:val="Heading'+b.k[1]+'"/></w:pPr>';
    else if(b.k==='li') ppr='<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:ind w:left="720" w:hanging="360"/></w:pPr>';
    else if(b.k==='ol'){ if(!curNum){ nums.push(1); curNum=nums.length+1; } ppr='<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="'+curNum+'"/></w:numPr><w:ind w:left="720" w:hanging="360"/></w:pPr>'; }
    else if(b.k==='q') ppr='<w:pPr><w:ind w:left="720"/></w:pPr>'; else if(b.k==='hr') ppr='<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr></w:pPr>'; else if(b.k==='pre') rp='<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>';
    const runs=b.runs.map(r=>{ const props=rp+(r.c?'<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>':'')+(r.b?'<w:b/>':'')+(r.i?'<w:i/>':'')+(r.u?'<w:u w:val="single"/>':''), parts=r.t.split(/(\n|\t)/).map(x=>x==='\n'?'<w:br/>':x==='\t'?'<w:tab/>':x?'<w:t xml:space="preserve">'+fcX(x)+'</w:t>':'').join('');
      return '<w:r>'+(props?'<w:rPr>'+props+'</w:rPr>':'')+parts+'</w:r>'; }).join('');
    return '<w:p>'+ppr+runs+'</w:p>'; }).join('');
  const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"', H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const lvl=(fmt,txt)=>`<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>`;
  const numbering=H+`<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>${lvl('bullet','•')}</w:abstractNum><w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="hybridMultilevel"/>${lvl('decimal','%1.')}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>`+nums.map((_,i)=>`<w:num w:numId="${i+2}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`).join('')+'</w:numbering>';
  const sizes=[32,28,26,24,22,22], st=[1,2,3,4,5,6].map(i=>`<w:style w:type="paragraph" w:styleId="Heading${i}"><w:name w:val="heading ${i}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="${i-1}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${sizes[i-1]}"/></w:rPr></w:style>`).join('');
  return fcZip([{name:'[Content_Types].xml',data:FCT.encode(H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>')},
    {name:'_rels/.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')},
    {name:'word/_rels/document.xml.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>')},
    {name:'word/styles.xml',data:FCT.encode(H+`<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>${st}</w:styles>`)},
    {name:'word/numbering.xml',data:FCT.encode(numbering)},
    {name:'word/document.xml',data:FCT.encode(H+`<w:document ${NS}><w:body>${ps}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`)}]); }
async function fcToOdt(bl){
  let n=0; const st=new Set(), sp=b=>{ const k=(b.b?1:0)|(b.i?2:0)|(b.u?4:0)|(b.c?8:0); if(k) st.add(k); return k; };
  const body=bl.map(b=>{ if(b.k!=='ol') n=0; const pre=b.k==='li'?'• ':b.k==='ol'?(++n)+'. ':'', t=(pre?[{t:pre}]:[]).concat(b.runs).map(r=>{ const k=sp(r), x=fcX(r.t).replace(/\n/g,'<text:line-break/>').replace(/\t/g,'<text:tab/>'); return k?`<text:span text:style-name="F${k}">${x}</text:span>`:x; }).join('');
    if(/^h[1-6]$/.test(b.k)) return `<text:h text:style-name="H${b.k[1]}" text:outline-level="${b.k[1]}">${t}</text:h>`; if(b.k==='hr') return '<text:p>────────────</text:p>'; if(b.k==='q') return `<text:p text:style-name="Q">${t}</text:p>`; return `<text:p>${t}</text:p>`; }).join('');
  const fs=[...st].map(k=>`<style:style style:name="F${k}" style:family="text"><style:text-properties${k&1?' fo:font-weight="bold"':''}${k&2?' fo:font-style="italic"':''}${k&4?' style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color"':''}${k&8?' style:font-name="Courier New"':''}/></style:style>`).join('');
  const hs=[1,2,3,4,5,6].map(i=>`<style:style style:name="H${i}" style:family="paragraph"><style:text-properties fo:font-size="${[20,17,15,13,12,12][i-1]}pt" fo:font-weight="bold"/></style:style>`).join('');
  const content='<?xml version="1.0" encoding="UTF-8"?>\n<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.2"><office:automatic-styles>'+fs+hs+'<style:style style:name="Q" style:family="paragraph"><style:paragraph-properties fo:margin-left="1cm"/></style:style></office:automatic-styles><office:body><office:text>'+body+'</office:text></office:body></office:document-content>';
  return fcZip([{name:'mimetype',data:FCT.encode('application/vnd.oasis.opendocument.text'),store:true},{name:'META-INF/manifest.xml',data:FCT.encode('<?xml version="1.0" encoding="UTF-8"?>\n<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2"><manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>')},{name:'content.xml',data:FCT.encode(content)}]); }
function fcToRtf(bl){
  const esc=s=>{ let o=''; for(const ch of s){ const c=ch.codePointAt(0); if(ch==='\\'||ch==='{'||ch==='}') o+='\\'+ch; else if(ch==='\n') o+='\\line '; else if(ch==='\t') o+='\\tab '; else if(c>126){ if(c>65535){ const h=c-65536; o+='\\u'+(0xD800+(h>>10)-65536)+'?\\u'+(0xDC00+(h&1023)-65536)+'?'; } else o+='\\u'+(c>32767?c-65536:c)+'?'; } else o+=ch; } return o; };
  let n=0; const ps=bl.map(b=>{ if(b.k!=='ol') n=0; const pre=b.k==='li'?'• ':b.k==='ol'?(++n)+'. ':'', hz=/^h[1-6]$/.test(b.k)?[44,36,32,28,24,24][+b.k[1]-1]:0;
    const t=(pre?[{t:pre}]:[]).concat(b.runs).map(r=>(r.c?'\\f1 ':'')+(r.b||hz?'\\b ':'')+(r.i?'\\i ':'')+(r.u?'\\ul ':'')+esc(r.t)+(r.u?'\\ulnone ':'')+(r.i?'\\i0 ':'')+(r.b||hz?'\\b0 ':'')+(r.c?'\\f0 ':'')).join('');
    return '{\\pard'+(b.k==='q'?'\\li720':'')+(hz?'\\fs'+hz:'')+' '+(b.k==='hr'?'──────────':t)+'\\par}'; }).join('\n');
  return FCT.encode('{\\rtf1\\ansi\\ansicpg1250\\deff0\\uc1{\\fonttbl{\\f0 Calibri;}{\\f1 Courier New;}}\\fs22\n'+ps+'\n}'); }
// ---------- dane: tabela {cols,rows} ----------
const fcCell=v=>v!==null&&typeof v==='object'?JSON.stringify(v):v;
function fcTyp(v){ if(typeof v!=='string') return v; if(/^-?(0|[1-9]\d{0,14})(\.\d+)?$/.test(v)) return +v; if(v==='true') return true; if(v==='false') return false; return v; }
function fcJsonTable(j){
  if(!Array.isArray(j)) j=(j&&typeof j==='object')?[j]:[{value:j}];
  if(j.length&&j.every(r=>Array.isArray(r))){ const w=Math.max(...j.map(r=>r.length)), cols=Array.from({length:w},(_,i)=>'col'+(i+1)); return {cols,rows:j.map(r=>cols.map((_,i)=>fcCell(r[i])))}; }
  const cols=[]; j.forEach(r=>{ if(r&&typeof r==='object'&&!Array.isArray(r)) Object.keys(r).forEach(k=>{ if(!cols.includes(k)) cols.push(k); }); else if(!cols.includes('value')) cols.push('value'); });
  return {cols,rows:j.map(r=>cols.map(k=>(r&&typeof r==='object'&&!Array.isArray(r))?fcCell(r[k]):(k==='value'?r:undefined)))}; }
function fcCsvRows(s,d){ const rows=[]; let row=[], f='', q=false; s=s.replace(/^\uFEFF/,'');
  for(let i=0;i<s.length;i++){ const c=s[i]; if(q){ if(c==='"'){ if(s[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=c; } else if(c==='"'&&f==='') q=true; else if(c===d){ row.push(f); f=''; } else if(c==='\n'||c==='\r'){ if(c==='\r'&&s[i+1]==='\n') i++; row.push(f); f=''; rows.push(row); row=[]; } else f+=c; }
  if(f!==''||row.length){ row.push(f); rows.push(row); } return rows.filter(r=>r.length>1||r[0]!==''); }
function fcCsvTable(s,ext,sep){ const l=s.split(/\r?\n/)[0]||'', d=ext==='tsv'?'\t':(sep&&sep!=='auto'?sep:([',',';','\t','|'].map(c=>[c,l.split(c).length]).sort((a,b)=>b[1]-a[1])[0][0])); const r=fcCsvRows(s,d); if(!r.length) return {cols:[],rows:[]}; return {cols:r[0],rows:r.slice(1)}; }
function fcXmlTable(s){ const x=new DOMParser().parseFromString(s,'application/xml'); if(x.getElementsByTagName('parsererror').length) throw new Error('xml');
  let host=x.documentElement; const kids=n=>[...n.children]; while(kids(host).length===1&&kids(kids(host)[0]).length) host=kids(host)[0];
  const rowsEl=kids(host); const cols=[], rows=rowsEl.map(r=>{ const o={}; [...r.attributes].forEach(a=>o['@'+a.name]=a.value); if(kids(r).length) kids(r).forEach(c=>{ o[c.tagName]=kids(c).length?c.textContent.trim():c.textContent; }); else o[r.tagName]=r.textContent; return o; });
  rows.forEach(o=>Object.keys(o).forEach(k=>{ if(!cols.includes(k)) cols.push(k); })); return {cols,rows:rows.map(o=>cols.map(k=>o[k]))}; }
function fcYamlVal(v){ v=v.trim(); if(v===''||v==='null'||v==='~') return null; if(/^".*"$/.test(v)){ try{ return JSON.parse(v); }catch{ return v.slice(1,-1); } } if(/^'.*'$/.test(v)) return v.slice(1,-1).replace(/''/g,"'"); if(v==='true') return true; if(v==='false') return false; if(/^-?\d+(\.\d+)?$/.test(v)) return +v; return v; }
function fcYamlTable(s){ const items=[]; let cur=null; s.replace(/\r\n?/g,'\n').split('\n').forEach(l=>{ if(!l.trim()||/^\s*#/.test(l)||/^---/.test(l)) return; let m;
  const ky=k=>{ k=k.trim(); if(/^".*"$/.test(k)){ try{ return JSON.parse(k); }catch{} } return k; };
  if((m=l.match(/^-\s+("[^"]*"|[^:]+?):\s*(.*)$/))){ cur={}; items.push(cur); cur[ky(m[1])]=fcYamlVal(m[2]); } else if((m=l.match(/^\s+("[^"]*"|[^:]+?):\s*(.*)$/))&&cur) cur[ky(m[1])]=fcYamlVal(m[2]); else if((m=l.match(/^-\s*(.+)$/))){ items.push({value:fcYamlVal(m[1])}); cur=null; } });
  if(!items.length) throw new Error('yaml'); return fcJsonTable(items); }
function fcHtmlTable(s){ const d=new DOMParser().parseFromString(s,'text/html'), t=d.querySelector('table'); if(!t) throw new Error('table'); const rs=[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>c.textContent.trim())); return {cols:rs[0]||[],rows:rs.slice(1)}; }
function fcMdTable(s){ const ls=s.split(/\r?\n/).filter(l=>/\|/.test(l)); if(ls.length<2) throw new Error('md'); const sp=l=>l.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim()); const rows=ls.filter(l=>!/^\s*\|?\s*:?-{2,}/.test(l)).map(sp); return {cols:rows[0],rows:rows.slice(1)}; }
const fcColName=i=>{ let s=''; i++; while(i>0){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; };
async function fcXlsxTable(bytes){
  const z=await fcUnzip(bytes), get=n=>{ const f=z.find(x=>x.name===n); return f?new TextDecoder().decode(f.data):null; }; const sh=get('xl/worksheets/sheet1.xml')||get((z.find(x=>/^xl\/worksheets\/sheet\d+\.xml$/.test(x.name))||{}).name); if(!sh) throw new Error('xlsx');
  const ss=get('xl/sharedStrings.xml'), strs=ss?[...new DOMParser().parseFromString(ss,'application/xml').getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join('')):[];
  const x=new DOMParser().parseFromString(sh,'application/xml'), rows=[];
  [...x.getElementsByTagName('row')].forEach(r=>{ const row=[]; [...r.getElementsByTagName('c')].forEach(c=>{ const ref=c.getAttribute('r')||'', col=ref.replace(/\d+/g,''); let ci=0; for(const ch of col) ci=ci*26+ch.charCodeAt(0)-64; ci=ci?ci-1:row.length; const t=c.getAttribute('t'), vEl=c.getElementsByTagName('v')[0], v=vEl?vEl.textContent:''; let val;
    if(t==='s') val=strs[+v]; else if(t==='inlineStr') val=[...c.getElementsByTagName('t')].map(q=>q.textContent).join(''); else if(t==='b') val=v==='1'; else if(t==='str') val=v; else val=v===''?undefined:(isNaN(+v)?v:+v); row[ci]=val; }); rows.push(row); });
  const w=Math.max(0,...rows.map(r=>r.length)); const full=rows.map(r=>Array.from({length:w},(_,i)=>r[i])); return {cols:(full[0]||[]).map((c,i)=>c==null?'col'+(i+1):String(c)),rows:full.slice(1)}; }
const fcObjs=(T,typ)=>T.rows.map(r=>{ const o={}; T.cols.forEach((c,i)=>{ const v=r[i]; o[c]=v===undefined?null:(typ?fcTyp(v):v); }); return o; });
const fcTag=s=>{ s=String(s).replace(/[^\p{L}\p{N}_.\-]/gu,'_'); return /^[\p{L}_]/u.test(s)?s:'_'+s; };
function fcDataOut(T,ext,o){
  const typ=!!o.typ, nul=v=>v===undefined||v===null?'':v;
  if(ext==='json') return JSON.stringify(fcObjs(T,typ),null,2)+'\n';
  if(ext==='ndjson') return fcObjs(T,typ).map(x=>JSON.stringify(x)).join('\n')+'\n';
  if(ext==='csv'||ext==='tsv'){ const d=ext==='tsv'?'\t':(o.sep&&o.sep!=='auto'?o.sep:','), q=v=>{ v=String(nul(v)); return (v.includes(d)||/["\r\n]/.test(v))?'"'+v.replace(/"/g,'""')+'"':v; }; return [T.cols,...T.rows].map(r=>T.cols.map((_,i)=>q(r[i])).join(d)).join('\r\n')+'\r\n'; }
  if(ext==='xml') return '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n'+T.rows.map(r=>'  <row>\n'+T.cols.map((c,i)=>'    <'+fcTag(c)+'>'+fcX(nul(r[i]))+'</'+fcTag(c)+'>\n').join('')+'  </row>\n').join('')+'</rows>\n';
  if(ext==='yaml'){ const y=v=>{ v=typ?fcTyp(v):v; if(v===null||v===undefined||v==='') return 'null'; if(typeof v==='number'||typeof v==='boolean') return String(v); return /^[\w][\w .\-@/]*$/.test(v)&&!/^(true|false|null|~|-?\d.*)$/i.test(v)&&!/\s$/.test(v)?v:JSON.stringify(v); }; return T.rows.map(r=>T.cols.map((c,i)=>(i?'  ':'- ')+(/^[\p{L}\p{N}_\-]+$/u.test(c)?c:JSON.stringify(c))+': '+y(r[i])).join('\n')).join('\n')+'\n'; }
  if(ext==='html') return '<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>Dane</title><style>table{border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif}td,th{border:1px solid #bbb;padding:4px 10px}th{background:#eee}</style></head><body>\n<table>\n<tr>'+T.cols.map(c=>'<th>'+fcX(c)+'</th>').join('')+'</tr>\n'+T.rows.map(r=>'<tr>'+T.cols.map((_,i)=>'<td>'+fcX(nul(r[i]))+'</td>').join('')+'</tr>\n').join('')+'</table>\n</body></html>\n';
  if(ext==='md'){ const e=v=>String(nul(v)).replace(/\|/g,'\\|').replace(/\n/g,' '); return '| '+T.cols.map(e).join(' | ')+' |\n|'+T.cols.map(()=>' --- |').join('')+'\n'+T.rows.map(r=>'| '+T.cols.map((_,i)=>e(r[i])).join(' | ')+' |').join('\n')+'\n'; }
  if(ext==='sql'){ const q=v=>{ v=typ?fcTyp(v):v; return v===undefined||v===null||v===''?'NULL':typeof v==='number'?String(v):typeof v==='boolean'?(v?'1':'0'):"'"+String(v).replace(/'/g,"''")+"'"; }; return T.rows.map(r=>'INSERT INTO "dane" ('+T.cols.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(', ')+') VALUES ('+T.cols.map((_,i)=>q(r[i])).join(', ')+');').join('\n')+'\n'; }
  throw new Error('fmt'); }
async function fcToXlsx(T,typ){
  const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', cell=(v,r,c)=>{ v=typ?fcTyp(v):v; const ref=fcColName(c)+(r+1); if(v===undefined||v===null||v==='') return ''; if(typeof v==='number') return `<c r="${ref}"><v>${v}</v></c>`; if(typeof v==='boolean') return `<c r="${ref}" t="b"><v>${v?1:0}</v></c>`; return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${fcX(v)}</t></is></c>`; };
  const all=[T.cols,...T.rows], sheet=H+'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+all.map((r,i)=>'<row r="'+(i+1)+'">'+T.cols.map((_,c)=>i===0?`<c r="${fcColName(c)}1" t="inlineStr"><is><t xml:space="preserve">${fcX(r[c]===undefined?'':r[c])}</t></is></c>`:cell(r[c],i,c)).join('')+'</row>').join('')+'</sheetData></worksheet>';
  return fcZip([{name:'[Content_Types].xml',data:FCT.encode(H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>')},
    {name:'_rels/.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')},
    {name:'xl/workbook.xml',data:FCT.encode(H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Dane" sheetId="1" r:id="rId1"/></sheets></workbook>')},
    {name:'xl/_rels/workbook.xml.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')},
    {name:'xl/worksheets/sheet1.xml',data:FCT.encode(sheet)}]); }
// ---------- kodowanie tekstu ----------
const FC_SB={cp1250:'windows-1250',iso2:'iso-8859-2',cp1252:'windows-1252',iso15:'iso-8859-15',cp1251:'windows-1251',koi8r:'koi8-r'};
function fcSbEnc(name,s){ const map=new Map(); const d=new TextDecoder(name); for(let i=255;i>=0;i--){ const ch=d.decode(Uint8Array.of(i)); if(ch!=='\uFFFD') map.set(ch,i); } const o=new Uint8Array(s.length*2); let p=0; for(const ch of s){ const v=map.get(ch); o[p++]=v===undefined?63:v; } return o.slice(0,p); }
function fcDecodeText(b,enc){
  if(enc&&enc!=='auto') return new TextDecoder(enc).decode(b);
  if(b[0]===0xEF&&b[1]===0xBB&&b[2]===0xBF) return new TextDecoder('utf-8').decode(b.subarray(3)); if(b[0]===0xFF&&b[1]===0xFE) return new TextDecoder('utf-16le').decode(b.subarray(2)); if(b[0]===0xFE&&b[1]===0xFF) return new TextDecoder('utf-16be').decode(b.subarray(2));
  try{ return new TextDecoder('utf-8',{fatal:true}).decode(b); }catch{ return new TextDecoder(/^(pl|szl)$/.test(S.settings.ui.lang)?'windows-1250':'windows-1252').decode(b); } }
function fcEncodeText(s,t){
  if(t==='utf8') return FCT.encode(s); if(t==='utf8bom') return fcU8(Uint8Array.of(0xEF,0xBB,0xBF),FCT.encode(s));
  if(t==='utf16le'||t==='utf16be'){ const o=new Uint8Array(2+s.length*2), v=new DataView(o.buffer), le=t==='utf16le'; v.setUint16(0,0xFEFF,le); for(let i=0;i<s.length;i++) v.setUint16(2+i*2,s.charCodeAt(i),le); return o; }
  if(t==='ascii'){ const o=[]; for(const ch of s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/Ł/g,'L')){ o.push(ch.charCodeAt(0)<128?ch.charCodeAt(0):63); } return Uint8Array.from(o); }
  return fcSbEnc(FC_SB[t],s); }
// ---------- zmieniacz formatów: kategorie, formaty, interfejs ----------
const fcData=async F=>F.data||(F.data=new Uint8Array(await F.file.arrayBuffer()));
const fcBase=n=>n.replace(/\.[^.]+$/,'');
const fcSize=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' kB':(n/1048576).toFixed(n<1e8?2:1)+' MB';
const fcPx=c=>c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,c.width,c.height).data;
const fcSeek=(v,t)=>new Promise(r=>{ v.onseeked=()=>r(); v.currentTime=Math.max(0,Math.min(t,(v.duration||t)-.001)); });
function fcVideoEl(F){ return new Promise((res,rej)=>{ const v=document.createElement('video'); v.preload='auto'; v.muted=false; v.src=URL.createObjectURL(new Blob([F.data],{type:FC_MIME[F.ext]||'video/mp4'})); v.onloadedmetadata=()=>res(v); v.onerror=()=>rej(new Error('video')); }); }
// --- obrazy ---
async function fcImgRun(F,o,tg){
  const S=await fcImgSrc({ext:F.ext,data:await fcData(F)}), q=(+o.q||90)/100, png=async c=>fcBlobBytes(await fcToBlob(c,'image/png'));
  switch(tg.id){
    case 'png': return {bytes:await png(fcCanvas(S,o,false)),ext:'png'};
    case 'jpg': return {bytes:await fcBlobBytes(await fcToBlob(fcCanvas(S,o,true),'image/jpeg',q)),ext:'jpg'};
    case 'webp': return {bytes:await fcBlobBytes(await fcToBlob(fcCanvas(S,o,false),'image/webp',q)),ext:'webp'};
    case 'gif': { const c=fcCanvas(S,o,false); return {bytes:fcGif([{px:fcPx(c),delay:0}],c.width,c.height,0),ext:'gif'}; }
    case 'bmp': { const c=fcCanvas(S,o,true); return {bytes:fcBmp(fcPx(c),c.width,c.height),ext:'bmp'}; }
    case 'tiff': { const c=fcCanvas(S,o,false); return {bytes:fcTiff(fcPx(c),c.width,c.height),ext:'tiff'}; }
    case 'ppm': { const c=fcCanvas(S,o,true); return {bytes:fcPpm(fcPx(c),c.width,c.height),ext:'ppm'}; }
    case 'svg': { const c=fcCanvas(S,o,false), b=await png(c); return {bytes:FCT.encode(`<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><image width="${c.width}" height="${c.height}" href="data:image/png;base64,${fcB64(b)}"/></svg>\n`),ext:'svg'}; }
    case 'pdf': { const c=fcCanvas(S,o,true), j=await fcBlobBytes(await fcToBlob(c,'image/jpeg',q)); return {bytes:fcPdfImg(j,c.width,c.height),ext:'pdf'}; }
    case 'ico': { const pngs=[]; for(const s of [16,32,48,64,128,256]){ const c=document.createElement('canvas'); c.width=c.height=s; const g=c.getContext('2d'), k=Math.min(s/S.W,s/S.H), w=S.W*k, h=S.H*k; g.imageSmoothingQuality='high'; g.drawImage(S.src,(s-w)/2,(s-h)/2,w,h); pngs.push({s,bytes:await png(c)}); } return {bytes:fcIco(pngs),ext:'ico'}; }
  } throw new Error('fmt'); }
// --- dźwięk ---
async function fcAudioEnc(buf,id,P){
  if(id==='wav') return {bytes:fcWav(buf,16),ext:'wav'}; if(id==='wav24') return {bytes:fcWav(buf,24),ext:'wav'}; if(id==='wav32') return {bytes:fcWav(buf,32),ext:'wav'};
  if(id==='aiff') return {bytes:fcAiff(buf),ext:'aiff'}; if(id==='flac') return {bytes:fcFlac(buf),ext:'flac'}; return {bytes:await fcRecAudio(buf,P),ext:'webm'}; }
async function fcAudioRun(F,o,tg,P){ const buf=await fcAudioOpts(await fcDecodeAudio(await fcData(F)),o); return fcAudioEnc(buf,tg.id==='weba'?'webm':tg.id,P); }
// --- wideo ---
async function fcVideoRun(F,o,tg,P){
  await fcData(F);
  if(/^(wav|flac|weba)$/.test(tg.id)){ const buf=await fcAudioOpts(await fcDecodeAudio(F.data),o); return fcAudioEnc(buf,tg.id==='weba'?'webm':tg.id,P); }
  const v=await fcVideoEl(F);
  if(tg.id==='png'||tg.id==='jpg'){ await fcSeek(v,+o.ft||0); const c=document.createElement('canvas'); c.width=v.videoWidth; c.height=v.videoHeight; const g=c.getContext('2d'); if(tg.id==='jpg'){ g.fillStyle='#fff'; g.fillRect(0,0,c.width,c.height); } g.drawImage(v,0,0);
    return {bytes:await fcBlobBytes(await fcToBlob(c,tg.id==='png'?'image/png':'image/jpeg',(+o.q||90)/100)),ext:tg.id}; }
  if(tg.id==='gif'){ const fps=Math.max(1,Math.min(25,+o.fps||10)), W=Math.max(16,Math.min(1280,+o.gw||480)), H=Math.max(1,Math.round(W*v.videoHeight/v.videoWidth)), n=Math.max(1,Math.min(300,Math.floor((v.duration||1)*fps))), c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d',{willReadFrequently:true}), fr=[];
    for(let i=0;i<n;i++){ await fcSeek(v,i/fps); g.drawImage(v,0,0,W,H); fr.push({px:g.getImageData(0,0,W,H).data.slice(),delay:100/fps,tr:false}); P(i/n); } return {bytes:fcGif(fr,W,H,0),ext:'gif'}; }
  const ctx=new (window.AudioContext||window.webkitAudioContext)(), src=ctx.createMediaElementSource(v), dest=ctx.createMediaStreamDestination(); src.connect(dest);
  const stream=new MediaStream([...v.captureStream().getVideoTracks(),...dest.stream.getAudioTracks()]), mp4=tg.id==='mp4';
  const r=fcRecorder(stream,mp4?['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4']:['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'],P,v.duration||1), ended=new Promise(x=>v.onended=x);
  await v.play(); await ended; await new Promise(x=>setTimeout(x,300)); const out=await r.finish(); ctx.close(); return {bytes:out.bytes,ext:mp4?'mp4':'webm'}; }
// --- dokumenty ---
async function fcDocBlocks(F){ const d=await fcData(F), e=F.ext; if(e==='docx') return fcDocxBlocks(d); if(e==='odt') return fcOdtBlocks(d); const s=fcDecodeText(d,'auto');
  return (e==='md'||e==='markdown')?fcMdBlocks(s):(e==='html'||e==='htm')?fcHtmlBlocks(s):e==='rtf'?fcRtfBlocks(s):fcTxtBlocks(s); }
async function fcDocRun(F,o,tg){
  const bl=await fcDocBlocks(F); if(!bl.length) throw new Error('empty'); const ti=fcBase(F.name);
  switch(tg.id){ case 'txt': return {bytes:FCT.encode(fcToTxt(bl)),ext:'txt'}; case 'md': return {bytes:FCT.encode(fcToMd(bl)),ext:'md'}; case 'html': return {bytes:FCT.encode(fcHtmlDoc(bl,ti)),ext:'html'};
    case 'docx': return {bytes:await fcToDocx(bl),ext:'docx'}; case 'odt': return {bytes:await fcToOdt(bl),ext:'odt'}; case 'rtf': return {bytes:fcToRtf(bl),ext:'rtf'};
    case 'pdf': { if(!window.api||!window.api.htmlToPdf) throw new Error('pdf'); return {bytes:new Uint8Array(await window.api.htmlToPdf(fcHtmlDoc(bl,ti,true))),ext:'pdf'}; } }
  throw new Error('fmt'); }
// --- dane ---
async function fcDataRun(F,o,tg){
  const d=await fcData(F), e=F.ext; let T;
  if(e==='xlsx') T=await fcXlsxTable(d); else { const s=fcDecodeText(d,'auto');
    if(e==='json') T=fcJsonTable(JSON.parse(s)); else if(e==='ndjson'||e==='jsonl') T=fcJsonTable(s.split(/\r?\n/).filter(l=>l.trim()).map(l=>JSON.parse(l)));
    else if(e==='csv'||e==='tsv') T=fcCsvTable(s,e,o.sep); else if(e==='xml') T=fcXmlTable(s); else if(e==='yaml'||e==='yml') T=fcYamlTable(s); else if(e==='html'||e==='htm') T=fcHtmlTable(s); else if(e==='md') T=fcMdTable(s); else throw new Error('fmt'); }
  if(tg.id==='xlsx') return {bytes:await fcToXlsx(T,!!o.typ),ext:'xlsx'}; return {bytes:FCT.encode(fcDataOut(T,tg.id,o)),ext:tg.id}; }
// --- archiwa ---
async function fcArchRun(F,o,tg,P,files){
  let ent=[];
  if(files.length===1){ const f=files[0], d=await fcData(f), nm=f.name.toLowerCase();
    if(f.ext==='zip') ent=await fcUnzip(d); else if(f.ext==='tar') ent=fcUntar(d); else if(f.ext==='tgz'||nm.endsWith('.tar.gz')) ent=fcUntar(await fcGunzip(d));
    else if(f.ext==='gz'){ const raw=await fcGunzip(d); ent=[{name:f.name.replace(/\.gz$/i,''),data:raw}]; } else ent=[{name:f.name,data:d}]; }
  else for(const f of files) ent.push({name:f.name,data:await fcData(f)});
  if(!ent.length) throw new Error('empty'); const base=files.length===1?fcBase(files[0].name).replace(/\.tar$/i,''):'archiwum';
  if(tg.id==='zip') return {bytes:await fcZip(ent),ext:'zip',name:base+'.zip'}; if(tg.id==='tar') return {bytes:fcTar(ent),ext:'tar',name:base+'.tar'};
  if(tg.id==='tgz') return {bytes:await fcGz(fcTar(ent)),ext:'tar.gz',name:base+'.tar.gz'};
  if(ent.length!==1) throw new Error('gz'); return {bytes:await fcGz(ent[0].data),ext:'gz',name:ent[0].name+'.gz'}; }
// --- kodowanie ---
async function fcEncRun(F,o,tg){
  const d=await fcData(F), b=fcBase(F.name), hex=a=>[...a].map(x=>x.toString(16).padStart(2,'0')).join('');
  if(tg.id==='b64') return {bytes:FCT.encode(fcB64(d)+'\n'),ext:'txt',name:F.name+'.base64.txt'}; if(tg.id==='hex') return {bytes:FCT.encode(hex(d)+'\n'),ext:'txt',name:F.name+'.hex.txt'};
  if(tg.id==='datauri') return {bytes:FCT.encode('data:'+(FC_MIME[F.ext]||'application/octet-stream')+';base64,'+fcB64(d)+'\n'),ext:'txt',name:F.name+'.datauri.txt'};
  if(tg.id==='unb64'){ const s=new TextDecoder().decode(d).trim().replace(/^data:[^,]*,/,''); return {bytes:fcUnB64(s),ext:'bin',name:b.replace(/\.(base64|b64|hex)$/i,'')+'.bin'}; }
  if(tg.id==='unhex'){ const s=new TextDecoder().decode(d).replace(/[^0-9a-fA-F]/g,''); if(s.length%2) throw new Error('hex'); return {bytes:Uint8Array.from(s.match(/../g)||[],x=>parseInt(x,16)),ext:'bin',name:b.replace(/\.(base64|b64|hex)$/i,'')+'.bin'}; }
  let s=fcDecodeText(d,o.senc); if(o.eol==='lf') s=s.replace(/\r\n?/g,'\n'); else if(o.eol==='crlf') s=s.replace(/\r\n?|\n/g,'\r\n'); return {bytes:fcEncodeText(s,tg.id),ext:'txt',name:b+'.'+(F.ext||'txt')}; }
const FC_OPT={
  q:{l:'Jakość',t:'range',min:10,max:100,def:90}, maxSide:{l:'Maks. rozmiar (px)',t:'num',def:''}, bg:{l:'Tło',t:'color',def:'#ffffff'},
  sr:{l:'Częstotliwość',t:'sel',def:'',c:[['','Jak w oryginale'],['48000','48000 Hz'],['44100','44100 Hz'],['32000','32000 Hz'],['22050','22050 Hz'],['16000','16000 Hz'],['8000','8000 Hz']]},
  ch:{l:'Kanały',t:'sel',def:'keep',c:[['keep','Jak w oryginale'],['mono','Mono'],['stereo','Stereo']]},
  fps:{l:'Klatki/s',t:'range',min:1,max:25,def:10}, gw:{l:'Szerokość (px)',t:'num',def:480}, ft:{l:'Czas klatki (s)',t:'num',def:0},
  sep:{l:'Separator',t:'sel',def:'auto',c:[['auto','Automatycznie'],[',',','],[';',';'],['\t','Tab'],['|','|']]}, typ:{l:'Wykrywaj liczby i wartości logiczne',t:'check',def:true},
  eol:{l:'Końce wierszy',t:'sel',def:'keep',c:[['keep','Jak w oryginale'],['lf','LF'],['crlf','CRLF']]},
  senc:{l:'Kodowanie źródła',t:'sel',def:'auto',c:[['auto','Automatycznie'],['utf-8','UTF-8'],['utf-16le','UTF-16 LE'],['utf-16be','UTF-16 BE'],['windows-1250','Windows-1250'],['iso-8859-2','ISO-8859-2'],['windows-1252','Windows-1252'],['iso-8859-15','ISO-8859-15'],['windows-1251','Windows-1251'],['koi8-r','KOI8-R'],['shift_jis','Shift_JIS'],['gbk','GBK'],['big5','Big5'],['euc-kr','EUC-KR']]}};
const fcT=(id,n,o,x)=>Object.assign({id,n:n||id.toUpperCase(),o:o||[]},x||{});
const FC_CATS=[
 {id:'img',ic:'🖼️',n:'Obrazy',ff:1,in:['png','jpg','jpeg','webp','gif','bmp','ico','svg','avif'],ffin:['tif','tiff','tga','jp2','psd','heic','heif','jxl','pcx','dds','exr','hdr','ppm','pgm','pbm','xbm','xpm'],run:fcImgRun,
   tg:[fcT('png','PNG',['maxSide']),fcT('jpg','JPG',['q','maxSide','bg']),fcT('webp','WEBP',['q','maxSide']),fcT('gif','GIF',['maxSide']),fcT('bmp','BMP',['maxSide','bg']),fcT('ico','ICO'),fcT('tiff','TIFF',['maxSide']),fcT('pdf','PDF',['q','maxSide','bg']),fcT('svg','SVG',['maxSide']),fcT('ppm','PPM',['maxSide','bg']),
     fcT('avif','AVIF',[],{ff:1}),fcT('tga','TGA',[],{ff:1}),fcT('jp2','JP2',[],{ff:1}),fcT('pcx','PCX',[],{ff:1})]},
 {id:'audio',ic:'🎵',n:'Audio',ff:1,in:['mp3','wav','ogg','oga','flac','m4a','aac','opus','webm','weba','aiff','aif'],ffin:['wma','amr','ac3','mka','au','caf','mp2','wv','ape','dts','3gp','ra','mid'],run:fcAudioRun,
   tg:[fcT('wav','WAV 16',['sr','ch']),fcT('wav24','WAV 24',['sr','ch']),fcT('wav32','WAV 32f',['sr','ch']),fcT('aiff','AIFF',['sr','ch']),fcT('flac','FLAC',['sr','ch']),fcT('weba','WEBM',['sr','ch']),
     ...['mp3','m4a','aac','ogg','opus','wma','ac3','mp2','au'].map(e=>fcT(e,e.toUpperCase(),['sr','ch'],{ff:1}))]},
 {id:'video',ic:'🎬',n:'Wideo',ff:1,note:1,in:['mp4','webm','mkv','mov','ogv','m4v'],ffin:['avi','wmv','flv','3gp','ts','mpg','mpeg','vob','m2ts','mts','rm','asf','f4v','divx'],run:fcVideoRun,
   tg:[fcT('webm','WEBM'),fcT('mp4','MP4',[],{ff:1,alt:1}),fcT('gif','GIF',['fps','gw']),fcT('png','PNG ▣',['ft']),fcT('jpg','JPG ▣',['ft','q']),fcT('wav','WAV ♪',['sr','ch']),fcT('flac','FLAC ♪',['sr','ch']),fcT('weba','WEBM ♪',['sr','ch']),
     ...['mkv','avi','mov','flv','wmv','ogv','ts','m4v','mpg'].map(e=>fcT(e,e.toUpperCase(),[],{ff:1})),...['mp3','m4a','aac','ogg','opus'].map(e=>fcT(e,e.toUpperCase()+' ♪',[],{ff:1,ext:e}))]},
 {id:'doc',ic:'📄',n:'Dokumenty',in:['txt','md','markdown','html','htm','docx','odt','rtf'],run:fcDocRun,tg:['txt','md','html','docx','odt','rtf','pdf'].map(e=>fcT(e,e.toUpperCase()))},
 {id:'data',ic:'📊',n:'Dane',in:['json','csv','tsv','ndjson','jsonl','xml','yaml','yml','html','htm','md','xlsx'],run:fcDataRun,tg:[fcT('json','JSON',['typ']),fcT('csv','CSV',['sep','typ']),fcT('tsv','TSV'),fcT('ndjson','NDJSON',['typ']),fcT('xml','XML'),fcT('yaml','YAML',['typ']),fcT('html','HTML'),fcT('md','MD'),fcT('sql','SQL',['typ']),fcT('xlsx','XLSX',['typ'])]},
 {id:'arch',ic:'🗜️',n:'Archiwa',any:1,multi:1,in:['zip','tar','gz','tgz'],run:fcArchRun,tg:[fcT('zip','ZIP'),fcT('tar','TAR'),fcT('tgz','TAR.GZ'),fcT('gz','GZ')]},
 {id:'enc',ic:'🔤',n:'Kodowanie',any:1,in:[],run:fcEncRun,tg:[fcT('b64','Base64'),fcT('hex','Hex'),fcT('datauri','Data URI'),fcT('unb64','Base64 → bin'),fcT('unhex','Hex → bin'),
   ...[['utf8','UTF-8'],['utf8bom','UTF-8 BOM'],['utf16le','UTF-16 LE'],['utf16be','UTF-16 BE'],['cp1250','Windows-1250'],['iso2','ISO-8859-2'],['cp1252','Windows-1252'],['iso15','ISO-8859-15'],['cp1251','Windows-1251'],['koi8r','KOI8-R'],['ascii','ASCII']].map(([i,n])=>fcT(i,n,['senc','eol']))]}];
let FC_FF=null; const FC_PROG={};
function mountFc(el,w){
  const D=(S.aw.data.fc=S.aw.data.fc||{cat:'img',t:{},o:{}}); if(!FC_CATS.find(c=>c.id===D.cat)) D.cat='img'; D.o=D.o||{}; D.t=D.t||{};
  el.innerHTML=`<div class="cvw"><div class="cv fc" tabindex="0"><div class="cv-top"><button class="cv-mn" title="Kategorie">☰</button><b class="cv-cn"></b></div>
    <div class="fc-drop" tabindex="0"><div class="fc-dz"><i>📥</i><span>Upuść plik tutaj lub kliknij, aby wybrać</span></div><div class="fc-fi"><i class="fc-ic"></i><div><b class="fc-fn"></b><small class="fc-fm"></small></div><button class="fc-x" title="Wyczyść">✕</button></div><input type="file" class="fc-in" multiple></div>
    <div class="fc-ffs"></div><div class="fc-h">Konwertuj na:</div><div class="fc-tg"></div><div class="fc-op"></div>
    <div class="fc-nt"></div><button class="fc-go">Konwertuj</button><div class="fc-pb"><i></i></div><div class="fc-st"></div>
    <div class="fc-out"><div class="fc-h">Gotowy plik</div><div class="fc-pv"></div><div class="fc-on"><b class="fc-on1"></b><small class="fc-on2"></small></div><button class="fc-sv">Zapisz plik…</button></div></div>
    <div class="cv-bk"></div><div class="cv-dr"><div class="cv-dh">Kategorie</div><div class="cv-di"></div></div></div>`;
  const wrap=el.firstElementChild, root=wrap.querySelector('.fc'), q=s=>root.querySelector(s), cname=wrap.querySelector('.cv-cn'), cats=wrap.querySelector('.cv-di'), drop=q('.fc-drop'), fin=q('.fc-in'), tgEl=q('.fc-tg'), opEl=q('.fc-op'), st=q('.fc-st'), pb=q('.fc-pb i'), outEl=q('.fc-out'), ffs=q('.fc-ffs'), nt=q('.fc-nt');
  let files=[], res=null, busy=false, myId='fc'+Math.random().toString(36).slice(2);
  const cat=()=>FC_CATS.find(c=>c.id===D.cat), tgt=()=>{ const c=cat(); return c.tg.find(x=>x.id===D.t[c.id])||c.tg[0]; }, ffOK=()=>!!(FC_FF&&FC_FF.ok);
  const say=m=>{ st.textContent=m; }, bar=p=>{ pb.style.width=Math.round(Math.max(0,Math.min(1,p))*100)+'%'; pb.parentElement.classList.toggle('on',p>0&&p<1); };
  const optVal=k=>D.o[k]!==undefined?D.o[k]:FC_OPT[k].def, opts=()=>Object.fromEntries(Object.keys(FC_OPT).map(k=>[k,optVal(k)]));
  function drawCats(){ cats.innerHTML=FC_CATS.map(c=>`<button data-c="${c.id}" class="${c.id===D.cat?'on':''}"><i>${c.ic}</i><span>${t(c.n)}</span></button>`).join(''); cname.textContent=cat().ic+' '+t(cat().n); }
  function drawTg(){ const c=cat(), sel=tgt().id; tgEl.innerHTML=c.tg.map(x=>{ const lock=x.ff&&!ffOK()&&!(x.alt&&window.MediaRecorder&&MediaRecorder.isTypeSupported('video/mp4')); return `<button data-t="${x.id}" class="${x.id===sel?'on':''}${lock?' lock':''}"${lock?' title="Ten format wymaga programu ffmpeg."':''}>${esc(x.n)}${lock?' 🔒':''}</button>`; }).join(''); drawOp(); }
  function drawOp(){ const tg=tgt(); opEl.innerHTML=tg.o.map(k=>{ const d=FC_OPT[k], v=optVal(k);
    if(d.t==='range') return `<label class="fc-o"><span>${t(d.l)}<b>${v}${k==='q'?'%':''}</b></span><input type="range" data-o="${k}" min="${d.min}" max="${d.max}" value="${v}"></label>`;
    if(d.t==='color') return `<label class="fc-o"><span>${t(d.l)}</span><input type="color" data-o="${k}" value="${v}"></label>`;
    if(d.t==='check') return `<label class="ck"><input type="checkbox" data-o="${k}"${v?' checked':''}><span class="tg"></span>${t(d.l)}</label>`;
    if(d.t==='sel') return `<label class="fc-o"><span>${t(d.l)}</span><select data-o="${k}">${d.c.map(([a,b])=>`<option value="${esc(a)}"${a===v?' selected':''}>${t(b)}</option>`).join('')}</select></label>`;
    return `<label class="fc-o"><span>${t(d.l)}</span><input type="number" data-o="${k}" value="${esc(v)}" min="0" placeholder="—"></label>`; }).join('');
    const c=cat(); nt.textContent=c.note?t('Konwersja wideo w przeglądarce trwa tyle, ile samo wideo.'):''; ffs.textContent=c.ff?t(ffOK()?'Wykryto ffmpeg: dostępne są dodatkowe formaty.':'Zainstaluj ffmpeg, aby odblokować więcej formatów (MP3, MP4, MKV…).'):''; ffs.classList.toggle('ok',ffOK()); }
  function drawFile(){ drop.classList.toggle('has',files.length>0); if(!files.length) return; const f=files[0], c=cat();
    q('.fc-ic').textContent=c.ic; q('.fc-fn').textContent=files.length>1?t('Wybrane plików: {n}').replace('{n}',files.length):f.name;
    q('.fc-fm').textContent=fcSize(files.reduce((a,x)=>a+x.size,0))+' · '+t('Wykryty format: {f}').replace('{f}',(f.ext||'?').toUpperCase()); }
  function showRes(){ outEl.classList.toggle('on',!!res); if(!res) return; q('.fc-on1').textContent=res.name; q('.fc-on2').textContent=fcSize(res.size); const pv=q('.fc-pv'); pv.innerHTML='';
    const ext=res.ext.split('.').pop(), url=res.url; if(!url) return; const mk=(tag,at)=>{ const e=document.createElement(tag); Object.assign(e,at); pv.appendChild(e); };
    if(/^(png|jpe?g|webp|gif|bmp|svg|ico)$/.test(ext)) mk('img',{src:url}); else if(/^(wav|webm|mp3|ogg|flac|m4a|aac|opus)$/.test(ext)&&!(res.video)) mk('audio',{src:url,controls:true}); else if(/^(webm|mp4|ogv|mkv|mov)$/.test(ext)) mk('video',{src:url,controls:true}); }
  function reset(){ res=null; showRes(); bar(0); say(''); }
  async function setFiles(list){
    list=[...list]; if(!list.length) return; const c0=cat(); const F=list.map(f=>({name:f.name,ext:(f.name.includes('.')?f.name.split('.').pop():'').toLowerCase(),size:f.size,file:f,path:(window.api&&window.api.filePath)?window.api.filePath(f):''})); const ext=F[0].ext;
    const accepts=c=>c.any||c.in.includes(ext)||(ffOK()&&c.ffin&&c.ffin.includes(ext));
    const prim={md:'doc',markdown:'doc',html:'doc',htm:'doc'}[ext]; if(prim&&!c0.any&&c0.id!==prim){ D.cat=prim; saveSoon(); }   // md/html domyślnie jako dokumenty (jako tabele — po ręcznym wyborze kategorii Dane)
    if(!accepts(cat())){ const o=FC_CATS.find(c=>!c.any&&accepts(c)); if(!o){ say(t('Ten format wejściowy nie jest obsługiwany.')); return; } D.cat=o.id; saveSoon(); }
    files=cat().multi?F:[F[0]]; reset(); drawCats(); drawTg(); drawFile(); }
  function clearFiles(){ files=[]; drop.classList.remove('has'); fin.value=''; reset(); }
  async function go(){
    if(busy) return; if(!files.length){ say(t('Wybierz plik do konwersji.')); return; } const c=cat(), tg=tgt(), F=files[0]; busy=true; res=null; showRes(); bar(.001); say(t('Konwertowanie…')); q('.fc-go').disabled=true;
    try{ const native=c.any||c.in.includes(F.ext), alt=tg.alt&&window.MediaRecorder&&MediaRecorder.isTypeSupported('video/mp4'), canFF=ffOK()&&c.ff&&F.path; let r;
      const ff=async(key,ext,read)=>{ const id=myId; FC_PROG[id]=bar; try{ const x=await window.api.ffRun({id,inPath:F.path,key,ext,read,opts:opts()}); if(!x||!x.ok) throw new Error((x&&x.err)||'ff'); return x; } finally{ delete FC_PROG[id]; } };
      if(tg.ff){ if(canFF){ const x=await ff(tg.id,tg.ext||tg.id); r={tmp:x.tmp,size:x.size,ext:tg.ext||tg.id}; } else if(alt&&native) r=await c.run(F,opts(),tg,bar,files); else throw Object.assign(new Error('ffmpeg'),{ff:1}); }
      else if(native) r=await c.run(F,opts(),tg,bar,files);
      else if(!canFF) throw Object.assign(new Error('ffmpeg'),{ff:1});
      else if(c.id==='img'||c.id==='audio'){ const k=c.id==='img'?'png':'wav', x=await ff(k,k,true); r=await c.run({name:F.name,ext:k,size:x.size,data:new Uint8Array(x.data)},opts(),tg,bar,files); }
      else { const ext=tg.id==='weba'?'webm':tg.id, x=await ff(tg.id,ext); r={tmp:x.tmp,size:x.size,ext}; }
      const name=r.name||fcBase(F.name)+'.'+r.ext; if(r.bytes){ const blob=new Blob([r.bytes],{type:FC_MIME[r.ext]||'application/octet-stream'}); res={name,ext:r.ext,size:r.bytes.length,bytes:r.bytes,url:URL.createObjectURL(blob)}; }
      else res={name,ext:r.ext,size:r.size,tmp:r.tmp,url:'file:///'+String(r.tmp).replace(/\\/g,'/')};
      res.video=c.id==='video'&&!/^(wav|flac|weba|mp3|m4a|aac|ogg|opus)$/.test(tg.id);
      bar(1); say(t('Gotowe.')); showRes(); }
    catch(e){ bar(0); say(e.ff?t('Ten format wymaga programu ffmpeg.'):t('Nie udało się przekonwertować pliku.')+(e&&e.message&&!/^(fmt|enc|rec)$/.test(e.message)?' ('+String(e.message).slice(0,90)+')':'')); }
    busy=false; q('.fc-go').disabled=false; }
  async function save(){ if(!res) return; try{ const p=await window.api.saveOut(res.tmp?{name:res.name,tmp:res.tmp}:{name:res.name,data:res.bytes}); if(p) toast(t('Zapisano:')+' '+String(p).split(/[\\/]/).pop()); }catch{ toast(t('Nie udało się przekonwertować pliku.')); } }
  // zdarzenia
  drop.addEventListener('click',e=>{ if(e.target===fin) return; if(e.target.closest('.fc-x')){ clearFiles(); return; } fin.click(); });
  fin.addEventListener('change',()=>{ if(fin.files.length) setFiles(fin.files); fin.value=''; });
  ['dragenter','dragover'].forEach(ev=>root.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev=>root.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); if(ev==='dragleave'&&root.contains(e.relatedTarget)) return; drop.classList.remove('over'); if(ev==='drop'&&e.dataTransfer&&e.dataTransfer.files.length) setFiles(e.dataTransfer.files); }));
  tgEl.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; D.t[D.cat]=b.dataset.t; saveSoon(); reset(); drawTg(); });
  opEl.addEventListener('input',e=>{ const i=e.target, k=i.dataset.o; if(!k) return; D.o[k]=i.type==='checkbox'?i.checked:i.value; saveSoon(); if(i.type==='range'){ const b=i.closest('label').querySelector('b'); if(b) b.textContent=i.value+(k==='q'?'%':''); } });
  q('.fc-go').onclick=go; q('.fc-sv').onclick=save;
  wrap.addEventListener('click',e=>{
    if(e.target.closest('.cv-mn')){ wrap.classList.toggle('dopen'); return; } if(e.target.closest('.cv-bk')){ wrap.classList.remove('dopen'); return; }
    const b=e.target.closest('.cv-di button'); if(b){ D.cat=b.dataset.c; saveSoon(); wrap.classList.remove('dopen'); if(files.length&&!(cat().any||cat().in.includes(files[0].ext)||(ffOK()&&cat().ffin&&cat().ffin.includes(files[0].ext)))) clearFiles(); else if(!cat().multi) files=files.slice(0,1); reset(); drawCats(); drawTg(); if(files.length) drawFile(); } });
  if(window.api&&window.api.onFfProgress&&!window.__fcProg){ window.__fcProg=1; window.api.onFfProgress(m=>{ const f=FC_PROG[m.id]; if(f) f(m.p); }); }
  drawCats(); drawTg();
  if(FC_FF===null&&window.api&&window.api.ffProbe) window.api.ffProbe().then(r=>{ FC_FF=r||{ok:false}; if(el.isConnected){ drawTg(); } }).catch(()=>{ FC_FF={ok:false}; }); else if(FC_FF===null) FC_FF={ok:false};
}

