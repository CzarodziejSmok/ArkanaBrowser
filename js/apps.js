// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js (moduł aplikacji) - nie edytuj go ręcznie.
// ===== src/js/10-app-gejos.js =====
// ---------- aplikacja: Gejos.exe ----------
const GJ={S:56,PAD:16,FL:26,MAXIMG:10,G:1500,DT:1/120,IT:10,K:420,C:34};
const GJ_DIG=[   // własna, szeroka czcionka cyfr: łamane w kwadracie 0..1 (rysowane grubą kreską z zaokrągleniami)
 [[[0,0],[1,0],[1,1],[0,1],[0,0]]],
 [[[.1,.26],[.55,0],[.55,1]],[[.05,1],[1,1]]],
 [[[0,0],[1,0],[1,.5],[0,.5],[0,1],[1,1]]],
 [[[0,0],[1,0],[1,1],[0,1]],[[.25,.5],[1,.5]]],
 [[[0,0],[0,.55],[1,.55]],[[.75,0],[.75,1]]],
 [[[1,0],[0,0],[0,.5],[1,.5],[1,1],[0,1]]],
 [[[1,0],[0,0],[0,1],[1,1],[1,.5],[0,.5]]],
 [[[0,0],[1,0],[.4,1]]],
 [[[0,0],[1,0],[1,1],[0,1],[0,0]],[[0,.5],[1,.5]]],
 [[[1,.5],[0,.5],[0,0],[1,0],[1,1],[0,1]]]];
// --- silnik fizyki: sztywne kwadraty (port idei Box2D-Lite: SAT + obcinanie, impulsy sekwencyjne z ciepłym startem) ---
let GJ_ID=1;
function gjBox(x,y,hw,hh,st){ return {id:GJ_ID++,x,y,r:0,vx:0,vy:0,w:0,hw,hh,st:!!st,im:st?0:1,ii:st?0:3/(hw*hw+hh*hh),fr:st?.7:.5,e:st?.5:.35,ent:false,age:0,gate:false,img:null,sp:null,sk:'',sl:false}; }
const gjFlip=f=>((f&0xF)<<8)|((f&0xF00)>>8)|((f&0xF0)<<8)|((f&0xF000)>>8);
function gjIn(hx,hy,x,y,r,nx,ny){
  const c=Math.cos(r), s=Math.sin(r), lx=-(c*nx+s*ny), ly=-(-s*nx+c*ny), E=(a,b)=>(a<<8)|(b<<12); let v;
  if(Math.abs(lx)>Math.abs(ly)){ v=lx>0?[[hx,-hy,E(3,4)],[hx,hy,E(4,1)]]:[[-hx,hy,E(1,2)],[-hx,-hy,E(2,3)]]; }
  else { v=ly>0?[[hx,hy,E(4,1)],[-hx,hy,E(1,2)]]:[[-hx,-hy,E(2,3)],[hx,-hy,E(3,4)]]; }
  return v.map(p=>({x:x+c*p[0]-s*p[1],y:y+s*p[0]+c*p[1],fp:p[2]}));
}
function gjClip(vin,nx,ny,off,edge){
  const out=[], a=vin[0], b=vin[1], d0=nx*a.x+ny*a.y-off, d1=nx*b.x+ny*b.y-off;
  if(d0<=0) out.push(a); if(d1<=0) out.push(b);
  if(d0*d1<0){ const k=d0/(d0-d1), p={x:a.x+k*(b.x-a.x),y:a.y+k*(b.y-a.y),fp:0}; p.fp=d0>0?((a.fp&~0x0F0F)|edge):((b.fp&~0xF0F0)|(edge<<4)); out.push(p); }
  return out;
}
function gjCollide(A,B){
  const cA=Math.cos(A.r), sA=Math.sin(A.r), cB=Math.cos(B.r), sB=Math.sin(B.r), dx=B.x-A.x, dy=B.y-A.y;
  const dAx=cA*dx+sA*dy, dAy=-sA*dx+cA*dy, dBx=cB*dx+sB*dy, dBy=-sB*dx+cB*dy, cc=Math.abs(cA*cB+sA*sB), ss=Math.abs(cA*sB-sA*cB);
  const fAx=Math.abs(dAx)-A.hw-(cc*B.hw+ss*B.hh), fAy=Math.abs(dAy)-A.hh-(ss*B.hw+cc*B.hh); if(fAx>0||fAy>0) return null;
  const fBx=Math.abs(dBx)-(cc*A.hw+ss*A.hh)-B.hw, fBy=Math.abs(dBy)-(ss*A.hw+cc*A.hh)-B.hh; if(fBx>0||fBy>0) return null;
  let axis=0, sep=fAx, nx=dAx>0?cA:-cA, ny=dAx>0?sA:-sA; const RT=.95, AT=.01;
  if(fAy>RT*sep+AT*A.hh){ axis=1; sep=fAy; nx=dAy>0?-sA:sA; ny=dAy>0?cA:-cA; }
  if(fBx>RT*sep+AT*B.hw){ axis=2; sep=fBx; nx=dBx>0?cB:-cB; ny=dBx>0?sB:-sB; }
  if(fBy>RT*sep+AT*B.hh){ axis=3; sep=fBy; nx=dBy>0?-sB:sB; ny=dBy>0?cB:-cB; }
  let fnx,fny,front,snx,sny,side,negSide,posSide,negE,posE,inc;
  if(axis===0){ fnx=nx; fny=ny; front=A.x*fnx+A.y*fny+A.hw; snx=-sA; sny=cA; side=A.x*snx+A.y*sny; negSide=-side+A.hh; posSide=side+A.hh; negE=3; posE=1; inc=gjIn(B.hw,B.hh,B.x,B.y,B.r,fnx,fny); }
  else if(axis===1){ fnx=nx; fny=ny; front=A.x*fnx+A.y*fny+A.hh; snx=cA; sny=sA; side=A.x*snx+A.y*sny; negSide=-side+A.hw; posSide=side+A.hw; negE=2; posE=4; inc=gjIn(B.hw,B.hh,B.x,B.y,B.r,fnx,fny); }
  else if(axis===2){ fnx=-nx; fny=-ny; front=B.x*fnx+B.y*fny+B.hw; snx=-sB; sny=cB; side=B.x*snx+B.y*sny; negSide=-side+B.hh; posSide=side+B.hh; negE=3; posE=1; inc=gjIn(A.hw,A.hh,A.x,A.y,A.r,fnx,fny); }
  else { fnx=-nx; fny=-ny; front=B.x*fnx+B.y*fny+B.hh; snx=cB; sny=sB; side=B.x*snx+B.y*sny; negSide=-side+B.hw; posSide=side+B.hw; negE=2; posE=4; inc=gjIn(A.hw,A.hh,A.x,A.y,A.r,fnx,fny); }
  const p1=gjClip(inc,-snx,-sny,negSide,negE); if(p1.length<2) return null;
  const p2=gjClip(p1,snx,sny,posSide,posE); if(p2.length<2) return null;
  const out=[]; for(const p of p2){ const s=fnx*p.x+fny*p.y-front; if(s<=0) out.push({x:p.x-s*fnx,y:p.y-s*fny,sep:s,nx,ny,fp:axis>=2?gjFlip(p.fp):p.fp,Pn:0,Pt:0}); }
  return out.length?out:null;
}
function gjWorld(){
  const wd={bodies:[],walls:[],arbs:new Map()};
  wd.step=function(dt,force){
    const bs=this.bodies, ws=this.walls, live=new Set(), pair=(A,B)=>{
      if(A.id>B.id){ const q=A; A=B; B=q; } const key=A.id*100000+B.id, cs=gjCollide(A,B);
      if(cs){ let ar=this.arbs.get(key); if(!ar){ ar={A,B,c:cs,fr:0}; this.arbs.set(key,ar); } else { for(const n of cs){ const o=ar.c.find(c=>c.fp===n.fp); if(o){ n.Pn=o.Pn; n.Pt=o.Pt; } } ar.c=cs; } live.add(key); } };
    for(let i=0;i<bs.length;i++){ const A=bs[i];
      for(let j=i+1;j<bs.length;j++){ const B=bs[j], dx=A.x-B.x, dy=A.y-B.y, rr=(A.hw+B.hw)*1.43; if(dx*dx+dy*dy<=rr*rr) pair(A,B); }
      for(const wl of ws){ if(wl.gate&&!A.ent) continue; pair(A,wl); } }
    for(const k of [...this.arbs.keys()]) if(!live.has(k)) this.arbs.delete(k);
    for(const b of bs){ b.vy+=GJ.G*dt; if(force) force(b,dt); b.vx/=1+dt*.04; b.vy/=1+dt*.04; b.w/=1+dt*.9; }
    const inv=1/dt;
    for(const ar of this.arbs.values()){ const A=ar.A, B=ar.B, e=(A.e+B.e)/2; ar.fr=Math.sqrt(A.fr*B.fr);
      for(const c of ar.c){
        const r1x=c.x-A.x, r1y=c.y-A.y, r2x=c.x-B.x, r2y=c.y-B.y, rn1=r1x*c.nx+r1y*c.ny, rn2=r2x*c.nx+r2y*c.ny, tx=c.ny, ty=-c.nx, rt1=r1x*tx+r1y*ty, rt2=r2x*tx+r2y*ty;
        c.r1x=r1x; c.r1y=r1y; c.r2x=r2x; c.r2y=r2y;
        c.mN=1/(A.im+B.im+A.ii*(r1x*r1x+r1y*r1y-rn1*rn1)+B.ii*(r2x*r2x+r2y*r2y-rn2*rn2));
        c.mT=1/(A.im+B.im+A.ii*(r1x*r1x+r1y*r1y-rt1*rt1)+B.ii*(r2x*r2x+r2y*r2y-rt2*rt2));
        c.bias=Math.min(400,-.2*inv*Math.min(0,c.sep+.5));
        const dvx=B.vx-B.w*r2y-A.vx+A.w*r1y, dvy=B.vy+B.w*r2x-A.vy-A.w*r1x, vn=dvx*c.nx+dvy*c.ny; c.bounce=vn<-90?-e*vn:0;
        const Px=c.Pn*c.nx+c.Pt*tx, Py=c.Pn*c.ny+c.Pt*ty;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(r1x*Py-r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(r2x*Py-r2y*Px); } }
    for(let it=0;it<GJ.IT;it++) for(const ar of this.arbs.values()){ const A=ar.A, B=ar.B;
      for(const c of ar.c){
        let dvx=B.vx-B.w*c.r2y-A.vx+A.w*c.r1y, dvy=B.vy+B.w*c.r2x-A.vy-A.w*c.r1x;
        const vn=dvx*c.nx+dvy*c.ny; let dPn=c.mN*(-vn+Math.max(c.bias,c.bounce)); const P0=c.Pn; c.Pn=Math.max(P0+dPn,0); dPn=c.Pn-P0;
        let Px=dPn*c.nx, Py=dPn*c.ny;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(c.r1x*Py-c.r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(c.r2x*Py-c.r2y*Px);
        dvx=B.vx-B.w*c.r2y-A.vx+A.w*c.r1y; dvy=B.vy+B.w*c.r2x-A.vy-A.w*c.r1x;
        const tx=c.ny, ty=-c.nx, vt=dvx*tx+dvy*ty, mx=ar.fr*c.Pn, T0=c.Pt; c.Pt=Math.max(-mx,Math.min(mx,T0+c.mT*(-vt))); const dPt=c.Pt-T0; Px=dPt*tx; Py=dPt*ty;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(c.r1x*Py-c.r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(c.r2x*Py-c.r2y*Px); } }
    for(const b of bs){ const sp=Math.hypot(b.vx,b.vy); if(sp>2600){ b.vx*=2600/sp; b.vy*=2600/sp; } b.x+=dt*b.vx; b.y+=dt*b.vy; b.r+=dt*b.w; }
  };
  return wd;
}
function gjSprite(img,dpr,fit,tile){   // kostka: zdjęcie na całej ściance + delikatna poświata przy krawędziach; bez zdjęcia ciemny środek z poświatą
  const s=GJ.S, z=s+GJ.PAD*2, c=document.createElement('canvas'); c.width=c.height=Math.ceil(z*dpr); const g=c.getContext('2d'); g.scale(dpr,dpr); g.translate(z/2,z/2); g.imageSmoothingQuality='high';
  const rr=i=>{ g.beginPath(); g.roundRect(-s/2+i,-s/2+i,s-2*i,s-2*i,Math.max(2,s*.24-i)); }, A=accRgb, ok=img&&img.complete&&img.naturalWidth;
  rr(0); g.shadowColor=`rgba(${A},.4)`; g.shadowBlur=13; g.fillStyle=P.bg; g.fill(); g.shadowBlur=0;
  g.save(); rr(0); g.clip();
  if(ok){ const iw=img.naturalWidth, ih=img.naturalHeight, m=Math.min(iw,ih), sx=(iw-m)/2, sy=(ih-m)/2;
    if(fit==='stretch') g.drawImage(img,-s/2,-s/2,s,s);
    else if(fit==='tile'){ const n=Math.min(6,Math.max(2,tile|0||3)), cs=s/n; for(let a=0;a<n;a++) for(let b=0;b<n;b++) g.drawImage(img,sx,sy,m,m,-s/2+a*cs,-s/2+b*cs,cs+.5,cs+.5); }
    else g.drawImage(img,sx,sy,m,m,-s/2,-s/2,s,s);
    const gr=g.createRadialGradient(0,0,s*.25,0,0,s*.75); gr.addColorStop(0,`rgba(${A},0)`); gr.addColorStop(1,`rgba(${A},.30)`); g.fillStyle=gr; g.fillRect(-s,-s,2*s,2*s); }
  else { const gr=g.createRadialGradient(0,0,0,0,0,s*.75); gr.addColorStop(0,'rgba(0,0,0,.45)'); gr.addColorStop(.5,`rgba(${A},.10)`); gr.addColorStop(1,`rgba(${A},.36)`); g.fillStyle=gr; g.fillRect(-s,-s,2*s,2*s); }
  g.lineWidth=ok?7:9; g.strokeStyle=`rgba(${A},${ok?.38:.34})`; g.shadowColor=`rgba(${A},.7)`; g.shadowBlur=12; rr(0); g.stroke(); g.restore();
  g.shadowBlur=0; g.lineWidth=1.5; g.strokeStyle=`rgba(${A},.85)`; rr(.75); g.stroke();
  if(!ok){ g.lineCap='round'; g.lineWidth=3; g.strokeStyle=`rgba(${acc2Rgb},.85)`; for(let k=0;k<8;k++){ g.rotate(Math.PI/4); g.beginPath(); g.moveTo(0,-5); g.lineTo(0,k%2?-11:-16); g.stroke(); } }
  return c;
}
function gjNum(g,W,fy,n){   // wynik w tle: cyfry są tym mniejsze, im więcej ich jest
  const s=String(n), c=s.length, asp=.7, gp=.24; let h=Math.min(fy*.62*Math.pow(.8,c-1),(W*.9)/(c*asp+(c-1)*gp*asp)); h=Math.max(10,h);
  const dw=h*asp, tw=c*dw+(c-1)*dw*gp, lw=h*.15, x0=(W-tw)/2+lw/2, y0=(fy-h)/2+lw/2, ww=dw-lw, hh=h-lw;
  g.save(); g.strokeStyle=`rgba(${fgRgb},.075)`; g.lineWidth=lw; g.lineJoin='round'; g.lineCap='round';
  for(let i=0;i<c;i++){ const ox=x0+i*dw*(1+gp); g.beginPath(); for(const pl of GJ_DIG[+s[i]]) pl.forEach((p,k)=>{ const X=ox+p[0]*ww, Y=y0+p[1]*hh; k?g.lineTo(X,Y):g.moveTo(X,Y); }); g.stroke(); }
  g.restore();
}
async function gjToIcon(f){   // dowolny obraz czytelny dla przeglądarki; reszta (TIFF, HEIC…) przez ffmpeg, jeśli jest
  let src=null;
  try{ src=await createImageBitmap(f); }catch{}
  if(!src){ try{ const im=new Image(); im.src=URL.createObjectURL(f); await im.decode(); src=im; }catch{} }
  if(!src&&window.api&&window.api.filePath&&window.api.ffRun){ try{ const p=window.api.filePath(f); if(p){ const x=await window.api.ffRun({id:'gj'+uid(),inPath:p,key:'png',ext:'png',read:true,opts:{}}); if(x&&x.ok&&x.data) src=await createImageBitmap(new Blob([new Uint8Array(x.data)],{type:'image/png'})); } }catch{} }
  if(!src) throw new Error('img');
  const W=src.width||src.naturalWidth||256, H=src.height||src.naturalHeight||256, k=Math.min(1,256/Math.max(W,H)), c=document.createElement('canvas'); c.width=Math.max(1,Math.round(W*k)); c.height=Math.max(1,Math.round(H*k));
  c.getContext('2d').drawImage(src,0,0,c.width,c.height);
  let u=c.toDataURL('image/webp',.9); if(!u.startsWith('data:image/webp')) u=c.toDataURL('image/png'); return u;
}
function mountGej(el,w){
  const D=(S.aw.data.gej=S.aw.data.gej||{score:0,best:0,imgs:[]}); D.imgs=D.imgs||[]; D.score=D.score|0; D.best=Math.max(D.best|0,D.score); D.fit=['crop','stretch','tile'].includes(D.fit)?D.fit:'crop'; D.tile=Math.min(6,Math.max(2,D.tile|0||3)); D.size=Math.min(72,Math.max(44,D.size|0||56)); GJ.S=D.size;
  el.innerHTML=`<div class="gj"><canvas class="gjc"></canvas><button class="gjm" title="Ustawienia aplikacji"><i></i></button><div class="gjp">
    <div class="gjs"><span>Wynik</span><b class="gjsc"></b></div><div class="gjs"><span>Rekord</span><b class="gjbs"></b></div>
    <button class="gjbt" data-a="all">Zniszcz wszystkie</button><button class="gjbt" data-a="reset">Zeruj wynik</button>
    <div class="gjs"><span>Grafiki kostek</span><b class="gjn"></b></div><div class="gjth"></div>
    <button class="gjbt" data-a="add">Dodaj zdjęcia</button><div class="gjs"><span>Dopasowanie zdjęć</span></div><div class="gjseg"><button data-f="crop">Przytnij</button><button data-f="stretch">Rozciągnij</button><button data-f="tile">Kafelek</button></div>
    <div class="gjtl"><span class="gjtn"></span><input type="range" class="gjtr" min="2" max="6" step="1"></div>
    <div class="gjs"><span>Rozmiar kostek</span><b class="gjsz"></b></div><input type="range" class="gjzr" min="44" max="72" step="2">
    <p class="gjhint">Nowe kostki losują jedną z tych grafik.</p>
    <input type="file" accept="image/*,.tif,.tiff,.heic,.heif,.tga,.pcx,.jp2,.avif,.ico,.jfif" multiple hidden></div></div>`;
  const root=el.querySelector('.gj'), cv=root.querySelector('.gjc'), g=cv.getContext('2d'), pn=root.querySelector('.gjp'), fi=root.querySelector('input[type=file]'), q=s=>root.querySelector(s);
  const wd=gjWorld(), wl={L:gjBox(0,0,200,2000,1),R:gjBox(0,0,200,2000,1),T:gjBox(0,0,600,200,1),F:gjBox(0,0,600,200,1)}; wl.L.gate=wl.R.gate=wl.T.gate=true; wd.walls=[wl.L,wl.R,wl.T,wl.F];
  let stc=null,stk='',W=0,H=0,dpr=1,last=performance.now(),acc=0,spawnT=1100,lastImg=-1,grab=null,ims=[]; const dust=[];
  const rebuild=()=>{ ims=D.imgs.map(u=>{ const i=new Image(); i.src=u; return i; }); };
  function stats(){ q('.gjsc').textContent=D.score; q('.gjbs').textContent=D.best; q('.gjn').textContent=D.imgs.length+'/'+GJ.MAXIMG; q('[data-a=add]').disabled=D.imgs.length>=GJ.MAXIMG;
    root.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===D.fit)); q('.gjtl').style.display=D.fit==='tile'?'':'none'; q('.gjtr').value=D.tile; q('.gjtn').textContent=t('Kafelki: {n}×{n}').replace(/\{n\}/g,D.tile); q('.gjzr').value=D.size; q('.gjsz').textContent=D.size+' px';
    q('.gjth').innerHTML=D.imgs.map((u,i)=>`<div class="gjt"><img src="${u}" alt=""><button data-i="${i}" title="Usuń">×</button></div>`).join(''); }
  function fit(){ W=root.clientWidth; H=root.clientHeight; if(!W||!H) return; dpr=Math.min(2,devicePixelRatio||1); cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    const fy=H-GJ.FL; wl.F.x=W/2; wl.F.y=fy+200; wl.F.hw=W/2+600; wl.T.x=W/2; wl.T.y=-200; wl.T.hw=W/2+600; wl.L.x=-200; wl.L.y=H/2; wl.R.x=W+200; wl.R.y=H/2; }
  new ResizeObserver(fit).observe(root);
  const rm=b=>{ const i=wd.bodies.indexOf(b); if(i>=0) wd.bodies.splice(i,1); if(grab&&grab.b===b) grab=null; cv.classList.remove('dr'); };
  function burst(b){ const cols=[accRgb,acc2Rgb,fgRgb], c=Math.cos(b.r), s=Math.sin(b.r);
    for(let i=0;i<24;i++){ const lx=(Math.random()*2-1)*b.hw, ly=(Math.random()*2-1)*b.hh, a=Math.random()*6.283, sp=80+Math.random()*260;
      dust.push({x:b.x+c*lx-s*ly,y:b.y+s*lx+c*ly,vx:b.vx*.5+Math.cos(a)*sp,vy:b.vy*.5+Math.sin(a)*sp-60,age:0,life:.3+Math.random()*.3,sz:2+Math.random()*4,c:cols[i%3]}); } }
  function destroy(b,scored){ rm(b); burst(b); if(scored){ D.score++; if(D.score>D.best) D.best=D.score; saveSoon(); stats(); } }
  const maxN=()=>Math.max(1,Math.floor(1.5*W/GJ.S));   // łączna powierzchnia ≤ 1,5 × (bok kostki × długość podłogi)
  function spawn(){ if(W<GJ.S*2||H<GJ.S*3||wd.bodies.length>=maxN()) return;
    const b=gjBox(GJ.S+Math.random()*(W-GJ.S*2),-GJ.S*1.1-Math.random()*30,GJ.S/2,GJ.S/2,0); b.r=Math.random()*6.283; b.vx=(Math.random()*2-1)*60; b.vy=20+Math.random()*60; b.w=(Math.random()*2-1)*3;
    const n=D.imgs.length; let k=-1; if(n===1) k=0; else if(n>1){ do k=Math.floor(Math.random()*n); while(k===lastImg); } lastImg=k; b.img=k>=0?ims[k]:null; wd.bodies.push(b); }
  function force(b,dt){ if(!grab||grab.b!==b) return; const c=Math.cos(b.r), s=Math.sin(b.r), rx=c*grab.lx-s*grab.ly, ry=s*grab.lx+c*grab.ly;
    let fx=GJ.K*(grab.tx-(b.x+rx))-GJ.C*(b.vx-b.w*ry), fy=GJ.K*(grab.ty-(b.y+ry))-GJ.C*(b.vy+b.w*rx); const m=Math.hypot(fx,fy); if(m>22000){ fx*=22000/m; fy*=22000/m; }
    b.vx+=fx*dt*b.im; b.vy+=fy*dt*b.im; b.w+=(rx*fy-ry*fx)*dt*b.ii; b.w/=1+dt*8; }
  function post(dt){ for(const b of wd.bodies.slice()){ b.age+=dt; const e=b.hw*(Math.abs(Math.cos(b.r))+Math.abs(Math.sin(b.r)));
      if(!b.ent&&b.x-e>=0&&b.x+e<=W&&b.y-e>=0) b.ent=true;
      const out=b.x+e<0||b.x-e>W||b.y-e>H||(b.ent&&b.y+e<0)||(!b.ent&&b.age>12);   // wypadnięcie poza arenę po wpadnięciu = usunięcie bez punktu
      if(out||!isFinite(b.x+b.y)) rm(b); } }
  function draw(){
    g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,W,H); const fy=H-GJ.FL, key=accRgb+'|'+P.bg+'|'+D.fit+D.tile+'|'+GJ.S;
    const sk2=key+'|'+W+'|'+H+'|'+dpr+'|'+D.score+'|'+fgRgb;
    if(!stc||stk!==sk2){ stc=stc||document.createElement('canvas'); stc.width=cv.width; stc.height=cv.height; const q=stc.getContext('2d'); q.setTransform(dpr,0,0,dpr,0,0); q.clearRect(0,0,W,H); gjNum(q,W,fy,D.score);
      const gf=q.createLinearGradient(0,fy,0,H); gf.addColorStop(0,`rgba(${accRgb},.18)`); gf.addColorStop(.25,`rgba(${accRgb},.07)`); gf.addColorStop(1,'rgba(0,0,0,.38)'); q.fillStyle=gf; q.fillRect(0,fy,W,GJ.FL);
      q.save(); q.strokeStyle=`rgba(${accRgb},.6)`; q.lineWidth=1.5; q.shadowColor=`rgba(${accRgb},.8)`; q.shadowBlur=8; q.beginPath(); q.moveTo(0,fy+.75); q.lineTo(W,fy+.75); q.stroke(); q.restore(); stk=sk2; }
    g.setTransform(1,0,0,1,0,0); g.drawImage(stc,0,0); g.setTransform(dpr,0,0,dpr,0,0);
    const z=GJ.S+GJ.PAD*2;
    for(const b of wd.bodies){ const ok=b.img&&b.img.complete&&b.img.naturalWidth; if(!b.sp||b.sk!==key||(ok&&!b.sl)){ b.sp=gjSprite(b.img,dpr,D.fit,D.tile); b.sk=key; b.sl=!!ok; }
      g.save(); g.translate(b.x,b.y); g.rotate(b.r); g.drawImage(b.sp,-z/2,-z/2,z,z); g.restore(); }
    for(const p of dust){ g.fillStyle=`rgba(${p.c},${Math.max(0,1-p.age/p.life)})`; g.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz); }
  }
  function frame(now){
    if(!w.isConnected) return; requestAnimationFrame(frame);
    if(now-last<12) return;
    const dt=Math.min(.05,(now-last)/1000); last=now; if(!W) return;
    spawnT-=dt*1000; if(spawnT<=0){ spawnT=1700+Math.random()*1500; spawn(); }   // spokojne tempo: kostka co ~1,7–3,2 s
    acc+=dt; let n=0; while(acc>=GJ.DT&&n<5){ wd.step(GJ.DT,force); acc-=GJ.DT; n++; } if(n===5) acc=0;
    post(dt);
    for(let i=dust.length-1;i>=0;i--){ const p=dust[i]; p.age+=dt; p.vy+=500*dt; p.vx*=.985; p.x+=p.vx*dt; p.y+=p.vy*dt; if(p.age>=p.life) dust.splice(i,1); }
    draw();
  }
  const pt=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; };
  function pick(x,y){ for(let i=wd.bodies.length-1;i>=0;i--){ const b=wd.bodies[i], dx=x-b.x, dy=y-b.y, c=Math.cos(b.r), s=Math.sin(b.r), lx=c*dx+s*dy, ly=-s*dx+c*dy; if(Math.abs(lx)<=b.hw&&Math.abs(ly)<=b.hh) return {b,lx,ly}; } return null; }
  cv.addEventListener('pointerdown',e=>{ if(e.button!==0) return; const [x,y]=pt(e), h=pick(x,y); if(!h) return; e.preventDefault(); cv.setPointerCapture(e.pointerId);
    grab={b:h.b,lx:h.lx,ly:h.ly,tx:x,ty:y,x0:x,y0:y,t0:performance.now(),mv:false,id:e.pointerId}; cv.classList.add('dr'); const i=wd.bodies.indexOf(h.b); wd.bodies.push(...wd.bodies.splice(i,1)); });
  cv.addEventListener('pointermove',e=>{ const [x,y]=pt(e); if(grab&&e.pointerId===grab.id){ grab.tx=x; grab.ty=y; if(Math.hypot(x-grab.x0,y-grab.y0)>6) grab.mv=true; } else cv.style.cursor=pick(x,y)?'grab':''; });
  const up=e=>{ if(!grab||e.pointerId!==grab.id) return; const gb=grab; grab=null; cv.classList.remove('dr'); if(e.type==='pointerup'&&!gb.mv&&performance.now()-gb.t0<250&&wd.bodies.includes(gb.b)) destroy(gb.b,true); };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  q('.gjm').onclick=()=>pn.classList.toggle('open');
  pn.addEventListener('click',e=>{ const bt=e.target.closest('button'); if(!bt) return;
    if(bt.dataset.f){ D.fit=bt.dataset.f; saveSoon(); stats(); return; }
    if(bt.dataset.i!==undefined){ D.imgs.splice(+bt.dataset.i,1); rebuild(); saveSoon(); stats(); return; }
    const a=bt.dataset.a; if(a==='all'){ wd.bodies.slice().forEach(b=>destroy(b,false)); }
    else if(a==='reset'){ ask('Zresetować wynik?','Rekord zostanie zachowany.','Zeruj').then(ok=>{ if(ok){ D.score=0; saveSoon(); stats(); } }); }
    else if(a==='add') fi.click(); });
  fi.addEventListener('change',async()=>{ const list=[...fi.files]; fi.value=''; let full=0,bad=0,added=0;
    for(const f of list){ if(D.imgs.length>=GJ.MAXIMG){ full++; continue; } try{ D.imgs.push(await gjToIcon(f)); added++; }catch{ bad++; } }
    if(added){ rebuild(); saveSoon(); stats(); } if(full) toast(t('Limit: {n} grafik').replace('{n}',GJ.MAXIMG)); else if(bad) toast(t('Nie można odczytać obrazu.')); });
  q('.gjtr').addEventListener('input',e=>{ D.tile=+e.target.value; saveSoon(); stats(); });
  q('.gjzr').addEventListener('input',e=>{ D.size=+e.target.value; GJ.S=D.size; for(const b of wd.bodies){ b.hw=b.hh=GJ.S/2; b.ii=3/(b.hw*b.hw+b.hh*b.hh); } saveSoon(); stats(); });
  rebuild(); stats(); fit(); requestAnimationFrame(f=>{ last=f; frame(f); });
  el.__gj={wd,wl,D,destroy,spawn,fit};
}

// ===== src/js/11-app-windows.js =====
// ---------- aplikacje (prawy pasek i pływające okna) ----------
const APPS=[
  {id:'calc',ic:'🧮',n:'Kalkulator',d:'Kalkulator prosty i naukowy z historią obliczeń',w:320,h:480,mount:mountCalc},
  {id:'notes',ic:'📝',n:'Notatnik',d:'Wiele notatek z obsługą emoji',w:580,h:400,mount:mountNotes},
  {id:'clock',ic:'🕒',n:'Zegar',d:'Zegar, alarmy, minutnik, stoper i kalendarz',w:430,h:560,mount:mountClock},{id:'conv',ic:'🔁',n:'Konwerter',d:'Konwerter jednostek z rzadkimi jednostkami (np. lata świetlne)',w:430,h:640,mount:mountConv},{id:'files',ic:'🗃️',n:'Zmieniacz formatów',d:'Konwertuje pliki: obrazy, dźwięk, wideo, dokumenty, dane i archiwa',w:600,h:720,mount:mountFc},{id:'gej',ic:'🎲',n:'Gejos.exe',d:'Kostki z fizyką: łap, rzucaj i niszcz',w:520,h:420,mount:mountGej},{id:'dice',ic:'🔟',n:'Kości',d:'Rzuty kośćmi: od D3 do D100, wiele kości naraz',w:440,h:660,mount:mountDice},{id:'mine',ic:'💣',n:'Saper',d:'Klasyczny Saper: własna plansza, życia i zawinięte krawędzie',w:520,h:660,mount:mountMine},{id:'snake',ic:'🐍',n:'Snake',d:'Wąż z jabłkami: plansza, tempo, złote i trujące jabłka oraz przeszkody',w:540,h:640,mount:mountSnake},{id:'wx',ic:'⛅',n:'Pogoda',ph:1},{id:'tr',ic:'🌐',n:'Tłumacz',d:'Tłumacz tekstów (bez logowania i opłat, wymaga internetu)',w:640,h:420,mount:mountTr},{id:'mus',ic:'🎵',n:'Odtwarzacz',ph:1}
];
const AIC={calc:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="8" y="5.5" width="8" height="3.5" rx=".8"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',notes:'<path d="M18 12.5V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5"/><path d="M8.5 8.5h6M8.5 12h3"/><path d="m20.5 15.2-5.7 5.7-2.8.6.6-2.8 5.7-5.7a1.4 1.4 0 0 1 2.2 2.2z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',conv:'<path d="M4 8h14M14.5 4.5 18 8l-3.5 3.5M20 16H6M9.5 12.5 6 16l3.5 3.5"/>',files:'<path d="M12 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l5 5v3"/><path d="M13 3v5h5"/><path d="M14 17h7M18 13.8l3 3.2-3 3.2"/>',gej:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>',dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none"/>',mine:'<circle cx="10.5" cy="14" r="6.5"/><path d="M7.3 13a3.3 3.3 0 0 1 3.2-3"/><path d="m15.2 9.3 2.6-2.6"/><path d="M19.5 2.5v3M18 4h3"/>',snake:'<path d="M19 6H8.5a3.5 3.5 0 0 0 0 7h7a3.5 3.5 0 0 1 0 7H5"/><circle cx="19" cy="6" r="1" fill="currentColor" stroke="none"/>',wx:'<path d="M17.5 19H9a6 6 0 1 1 5.8-7.6h2.7a3.8 3.8 0 0 1 0 7.6z"/>',tr:'<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 6 7M12 6c-.5 3-3 6-7.5 7.5"/><path d="m12 20 4.5-10L21 20M13.5 17h6"/>',mus:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8"/>'};
APPS.forEach(a=>{ if(AIC[a.id]) a.ic=`<svg viewBox="0 0 24 24">${AIC[a.id]}</svg>`; });   // ikony aplikacji: liniowe SVG w stylu ikon ustawień i ChangeLog
const APP=Object.fromEntries(APPS.map(a=>[a.id,a]));
S.aw=S.aw||{}; S.aw.open=S.aw.open||[]; S.aw.pos=S.aw.pos||{}; S.aw.links=S.aw.links||[]; S.aw.data=S.aw.data||{};
S.aw.open=S.aw.open.filter(id=>APP[id]); S.settings.apps.bar=S.settings.apps.bar.filter(id=>APP[id]);   // usuń aplikacje, których już nie ma (np. okno testowe)
let zTop=1;
const GRID='<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
function renderBar(){
  const A=S.settings.apps; document.body.classList.toggle('noapps',!A.on);
  $('rl').innerHTML='<h6>APLIKACJE</h6>'+(A.bar.length
    ? A.bar.filter(id=>APP[id]).map(id=>{ const a=APP[id]; return `<div class="fd app${S.aw.open.includes(id)?' on':''}" data-app="${id}" title="${esc(a.n)}"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span></div>`; }).join('')
    : `<div class="rempty"><i class="ic re-i">${GRID}</i><p>Brak aplikacji na pasku.</p><p class="sm">Aplikacje możesz dodać w ustawieniach, w sekcji Aplikacje.</p><button id="rset">Otwórz ustawienia</button></div>`);
}
$('rl').addEventListener('click',e=>{
  if(e.target.id==='rset'){ setTab='apps'; toggleSet(true); return; }
  const it=e.target.closest('.app'); if(it) toggleApp(it.dataset.app);
});
const winOf=id=>document.querySelector(`.aw[data-app="${id}"]`);
const liveWins=()=>[...document.querySelectorAll('.aw:not(.out)')];
const rectOf=w=>({x:parseFloat(w.style.left),y:parseFloat(w.style.top),w:parseFloat(w.style.width),h:parseFloat(w.style.height)});
function toggleApp(id){ const w=winOf(id); if(w&&!w.classList.contains('out')) closeApp(id); else openApp(id); }
// --- okrągłe okna: stały kształt koła, zawinięty pasek tytułu, styki po łuku ---
const RMIN=330, RBAND=30, RANG=42*Math.PI/180;
const isRound=()=>document.body.classList.contains('round');
function roundSync(w){
  const h=w.querySelector('.awh'), b=w.querySelector('.awb'); if(!h||!b||!w.isConnected) return;
  let sv=h.querySelector('.awr'); const on=isRound();
  if(!on){ if(sv) sv.remove(); h.style.clipPath=''; ['left','right','top','bottom'].forEach(k=>b.style[k]=''); h.querySelectorAll('.ic,.awx').forEach(e=>{ e.style.left=e.style.top=e.style.transform=''; }); w.__rs=0; return; }
  const s=w.clientWidth; if(!s) return; if(w.__rs===s&&sv) return; w.__rs=s;
  const c=s/2, R=c, Ri=R-RBAND, A=RANG, rm=Ri+RBAND/2, f=n=>n.toFixed(1), P=(a,r)=>[c+r*Math.sin(a),c-r*Math.cos(a)];
  const [x1,y1]=P(-A,R-.5), [x2,y2]=P(A,R-.5), [x3,y3]=P(A,Ri), [x4,y4]=P(-A,Ri);
  const d=`M${f(x1)} ${f(y1)}A${R-.5} ${R-.5} 0 0 1 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${Ri} ${Ri} 0 0 0 ${f(x4)} ${f(y4)}Z`;
  const rb=Ri+RBAND/2-4.5, ta=A-34/rm, [tx1,ty1]=P(-ta,rb), [tx2,ty2]=P(ta,rb), pid='awp-'+w.dataset.app, L=rb*2*ta;
  const title=t(APP[w.dataset.app].n);
  if(!sv){ sv=document.createElementNS('http://www.w3.org/2000/svg','svg'); sv.setAttribute('class','awr'); h.prepend(sv); }
  sv.innerHTML=`<path class="bf" d="${d}"/><path class="bs" d="${d}"/><path id="${pid}" d="M${f(tx1)} ${f(ty1)}A${f(rb)} ${f(rb)} 0 0 1 ${f(tx2)} ${f(ty2)}" fill="none"/><text><textPath href="#${pid}" startOffset="50%" text-anchor="middle"></textPath></text>`;
  const tp=sv.querySelector('textPath'); tp.textContent=title;
  let n=title.length; while(n>1&&tp.getComputedTextLength()>L){ n--; tp.textContent=title.slice(0,n).trimEnd()+'…'; }
  h.style.clipPath=`path('${d}')`;
  const put=(e,a)=>{ if(!e) return; const [x,y]=P(a,rm); e.style.left=(x-e.offsetWidth/2)+'px'; e.style.top=(y-e.offsetHeight/2)+'px'; e.style.transform=''; };
  put(h.querySelector('.ic'),-(A-16/rm)); put(h.querySelector('.awx'),A-16/rm);
  // prostokąt zawartości: górne rogi pod wewnętrznym łukiem paska, dolne wewnątrz koła
  const u=Ri-3, v=R-5; let best=0, bw=0, bt=0, bb=0;
  for(let hw=40;hw<Math.min(u,v);hw++){ const ht=Math.sqrt(u*u-hw*hw), hb=Math.sqrt(v*v-hw*hw), ar=hw*(ht+hb); if(ar>best){ best=ar; bw=hw; bt=ht; bb=hb; } }
  b.style.left=(c-bw)+'px'; b.style.right=(c-bw)+'px'; b.style.top=(c-bt)+'px'; b.style.bottom=(c-bb)+'px';
}
function place(w,p){
  if(isRound()){ const s=Math.max(RMIN,p.w,p.h); p={...p,w:s,h:s}; }
  w.style.left=p.x+'px'; w.style.top=p.y+'px'; w.style.width=p.w+'px'; w.style.height=p.h+'px'; if(w.isConnected) roundSync(w);
}
// punkt styku dwóch kół: odcinek wspólnej prostej, na którym odstęp między okręgami ≤ G
function arcTouch(Lw,Rw,vert){
  const G=5, rad=o=>Math.min(o.w,o.h)/2, cx=o=>o.x+o.w/2, cy=o=>o.y+o.h/2, rl=rad(Lw), rr=rad(Rw); let lo=null, hi=null;
  const a0=vert?Math.max(Lw.y,Rw.y):Math.max(Lw.x,Rw.x), a1=vert?Math.min(Lw.y+Lw.h,Rw.y+Rw.h):Math.min(Lw.x+Lw.w,Rw.x+Rw.w);
  for(let q=Math.ceil(a0);q<=a1;q++){
    const dl=vert?q-cy(Lw):q-cx(Lw), dr=vert?q-cy(Rw):q-cx(Rw); if(Math.abs(dl)>=rl||Math.abs(dr)>=rr) continue;
    const gl=Math.sqrt(rl*rl-dl*dl), gr=Math.sqrt(rr*rr-dr*dr);
    const gap=vert?(cx(Rw)-gr)-(cx(Lw)+gl):(cy(Rw)-gr)-(cy(Lw)+gl);
    if(gap<=G){ if(lo===null) lo=q; hi=q; } }
  return lo===null?null:{s:lo,l:Math.max(6,hi-lo)};
}
function savePos(w){ S.aw.pos[w.dataset.app]=rectOf(w); save(); }
function focusWin(w){ document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));
  groupOf(w.dataset.app).forEach(i=>{ const m=winOf(i); if(m&&m!==w) m.style.zIndex=++zTop; }); w.style.zIndex=++zTop; try{ w.focus({preventScroll:true}); }catch{} updateContacts(); }
function openApp(id){
  const a=APP[id]; if(!a) return;
  if(a.ph){ toast(t(a.n)+' — '+t('wkrótce')); return; }
  let w=winOf(id); if(w&&!w.classList.contains('out')){ focusWin(w); return; }
  const k=Object.keys(S.aw.pos).length%5, aw=a.w||420, ah=a.h||300, p=S.aw.pos[id]||{x:Math.max(80,innerWidth/2-aw/2)+k*34,y:90+k*34,w:aw,h:ah};
  w=document.createElement('div'); w.className='aw'+(an('apps')?' ent':''); w.dataset.app=id; w.tabIndex=-1;
  w.innerHTML=`<div class="awh"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span><button class="awx" title="Zamknij aplikację">×</button></div><div class="awb"></div>`+['n','s','e','w','ne','nw','se','sw'].map(d=>`<i class="rz ${d}" data-d="${d}"></i>`).join('');
  place(w,p); $('aws').appendChild(w); roundSync(w); focusWin(w);
  if(a.mount) a.mount(w.querySelector('.awb'),w);
  w.querySelector('.awb').prepend(Object.assign(document.createElement('canvas'),{className:'afx'})); afxKick();   // tło z cząsteczkami (wspólne)
  if(!S.aw.open.includes(id)) S.aw.open.push(id); savePos(w); renderBar(); updateContacts();
}
function closeApp(id){
  const w=winOf(id); S.aw.open=S.aw.open.filter(x=>x!==id); S.aw.links=S.aw.links.filter(l=>!l.includes(id));
  if(w){ savePos(w); w.classList.add('out'); later('apps',180,()=>{ w.remove(); updateContacts(); }); }
  save(); renderBar(); updateContacts();
}
$('aws').addEventListener('click',e=>{ const x=e.target.closest('.awx'); if(x) closeApp(x.closest('.aw').dataset.app); });
// --- styki i scalanie okien ---
function contactList(){
  const ws=liveWins().map(w=>({id:w.dataset.app,...rectOf(w)})), out=[], T=1.5;
  for(let i=0;i<ws.length;i++) for(let j=i+1;j<ws.length;j++){ const a=ws[i], b=ws[j];
    const oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y), ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
    const rd=isRound(), add=(L,Rr,v,x,y,l)=>{ if(!rd){ out.push({a:a.id,b:b.id,v,x,y,l}); return; }
      const q=arcTouch(L,Rr,v); if(q) out.push({a:a.id,b:b.id,v,x,y,l:q.l,r:1,...(v?{y:q.s}:{x:q.s})}); };
    if(oy>6){ if(Math.abs(a.x+a.w-b.x)<=T) add(a,b,1,b.x,Math.max(a.y,b.y),oy); else if(Math.abs(b.x+b.w-a.x)<=T) add(b,a,1,a.x,Math.max(a.y,b.y),oy); }
    if(ox>6){ if(Math.abs(a.y+a.h-b.y)<=T) add(a,b,0,Math.max(a.x,b.x),b.y,ox); else if(Math.abs(b.y+b.h-a.y)<=T) add(b,a,0,Math.max(a.x,b.x),a.y,ox); } }
  return out;
}
const linked=(a,b)=>S.aw.links.some(l=>(l[0]===a&&l[1]===b)||(l[0]===b&&l[1]===a));
let collide=false;   // tryb kolizji (Shift podczas przesuwania)
function updateContacts(){
  const box=$('aws'); box.querySelectorAll('.cs').forEach(e=>e.remove());
  const cs=contactList(), T=3, R=14;      // R = promień zaokrąglenia rogów okna: linia obejmuje tylko prostą część krawędzi
  cs.forEach(c=>{ const lk=linked(c.a,c.b); if(!lk&&!collide) return;
    const st=(c.v?c.y:c.x)+(c.r?0:R), len=c.l-(c.r?0:2*R); if(len<4) return;
    const e=document.createElement('i'); e.className='cs'+(lk?' lk':'');
    if(c.v){ e.style.left=(c.x-T/2)+'px'; e.style.top=st+'px'; e.style.width=T+'px'; e.style.height=len+'px'; }
    else { e.style.top=(c.y-T/2)+'px'; e.style.left=st+'px'; e.style.height=T+'px'; e.style.width=len+'px'; }
    e.style.zIndex=Math.max(+(winOf(c.a)?.style.zIndex)||0,+(winOf(c.b)?.style.zIndex)||0);
    box.appendChild(e); });
  return cs;
}
function groupOf(id){ const seen=new Set([id]), q=[id];
  while(q.length){ const x=q.pop(); S.aw.links.forEach(([a,b])=>{ const o=a===x?b:b===x?a:null; if(o&&!seen.has(o)){ seen.add(o); q.push(o); } }); }
  return [...seen].filter(i=>winOf(i)); }
function sweepMove(rects,ddx,ddy,others){
  let ax=ddx;
  for(const r of rects) for(const o of others){ if(r.y<o.y+o.h&&r.y+r.h>o.y){
    if(ddx>0&&r.x+r.w<=o.x+.01) ax=Math.min(ax,o.x-(r.x+r.w)); else if(ddx<0&&r.x>=o.x+o.w-.01) ax=Math.max(ax,o.x+o.w-r.x); } }
  const mx=rects.map(r=>({...r,x:r.x+ax})); let ay=ddy;
  for(const r of mx) for(const o of others){ if(r.x<o.x+o.w&&r.x+r.w>o.x){
    if(ddy>0&&r.y+r.h<=o.y+.01) ay=Math.min(ay,o.y-(r.y+r.h)); else if(ddy<0&&r.y>=o.y+o.h-.01) ay=Math.max(ay,o.y+o.h-r.y); } }
  return [ax,ay];
}
// --- pasek podpowiedzi klawiszy ---
function showHint(mode){
  const chips=mode==='move'?[['Shift','Blokuj o okna i krawędzie ekranu','sh'],['M','Scal stykające się okna','mg hide'],['U','Oddziel okno od grupy','um hide'],['Esc','Anuluj przesuwanie','es']]:[['Esc','Anuluj zmianę rozmiaru','es']];
  $('kh').querySelector('.khi').innerHTML=chips.map(([k,l,c])=>`<span class="khc ${c}"><kbd>${k}</kbd>${l}</span>`).join(''); $('kh').classList.add('show');
}
const hideHint=()=>$('kh').classList.remove('show');
const hintChip=(c,on)=>{ const e=$('kh').querySelector('.'+c); if(!e) return; if(c==='sh'){ e.classList.toggle('on',on); return; }
  const was=!e.classList.contains('hide'); e.classList.toggle('hide',!on); if(on&&!was){ e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } };
// --- przytrzymanie okna: przesuwanie / zmiana rozmiaru ---
$('aws').addEventListener('mousedown',e=>{
  const w=e.target.closest('.aw'); if(!w||w.classList.contains('out')) return; focusWin(w);
  const rz=e.target.closest('.rz'), h=e.target.closest('.awh');
  if(!rz&&!(h&&!e.target.closest('.awx'))) return; e.preventDefault();
  startHold(w,rz?rz.dataset.d:'',e);
});
function startHold(w,d,e){
  const id=w.dataset.app, box=$('aws').getBoundingClientRect(), BW=box.width, BH=box.height;
  let grp,others,start,cur,sx=e.clientX,sy=e.clientY,lastX=sx,lastY=sy,done=false;
  const orig=new Map();
  const hl=()=>document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',grp.includes(x)||x===w));   // podświetl całą grupę scalonych okien
  const rebase=()=>{ grp=d?[w]:groupOf(id).map(winOf); others=liveWins().filter(o=>!grp.includes(o)).map(rectOf); start=grp.map(rectOf); cur={dx:0,dy:0}; sx=lastX; sy=lastY; grp.forEach(g=>{ if(!orig.has(g)) orig.set(g,rectOf(g)); }); hl(); };
  rebase();
  const refresh=()=>{ const cs=updateContacts(), ids=grp.map(g=>g.dataset.app);
    hintChip('mg',collide&&cs.some(c=>ids.includes(c.a)!==ids.includes(c.b))); hintChip('um',S.aw.links.some(l=>l.includes(id))); };
  document.body.classList.add('dragging'); showHint(d?'resize':'move'); hintChip('sh',e.shiftKey); collide=!d&&e.shiftKey; refresh();
  const mv=ev=>{ lastX=ev.clientX; lastY=ev.clientY; hintChip('sh',ev.shiftKey); collide=!d&&ev.shiftKey;
    if(d&&isRound()){ const st=start[0], dx=lastX-sx, dy=lastY-sy, hz=d==='e'||d==='w';   // koło: jeden wymiar zmienia drugi, środek drugiej osi zostaje
      const sz=Math.max(RMIN,d==='e'?st.w+dx:d==='w'?st.w-dx:d==='s'?st.h+dy:st.h-dy);
      let x=hz?(d==='w'?st.x+st.w-sz:st.x):st.x-(sz-st.w)/2, y=hz?st.y-(sz-st.h)/2:(d==='n'?st.y+st.h-sz:st.y);
      x=clamp(x,-sz+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:sz,h:sz}); }
    else if(d){ const st=start[0], dx=lastX-sx, dy=lastY-sy; let x=st.x,y=st.y,ww=st.w,hh=st.h;
      if(d.includes('e')) ww=st.w+dx; if(d.includes('s')) hh=st.h+dy; if(d.includes('w')) ww=st.w-dx; if(d.includes('n')) hh=st.h-dy;
      ww=Math.max(220,ww); hh=Math.max(140,hh); if(d.includes('w')) x=st.x+st.w-ww; if(d.includes('n')) y=st.y+st.h-hh;
      x=clamp(x,-ww+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:ww,h:hh}); }
    else { let lo=-1e9,hi=1e9,lo2=-1e9,hi2=1e9;
      const tight=ev.shiftKey;   // z Shiftem okno nie może wystawać poza ekran
      start.forEach(r=>{ lo=Math.max(lo,(tight?0:-r.w+90)-r.x); hi=Math.min(hi,(tight?BW-r.w:BW-90)-r.x); lo2=Math.max(lo2,-r.y); hi2=Math.min(hi2,(tight?BH-r.h:BH-40)-r.y); });
      const dx=clamp(lastX-sx,lo,hi), dy=clamp(lastY-sy,lo2,hi2); let ddx=dx-cur.dx, ddy=dy-cur.dy;
      if(ev.shiftKey&&others.length){ const rects=start.map(r=>({...r,x:r.x+cur.dx,y:r.y+cur.dy})); [ddx,ddy]=sweepMove(rects,ddx,ddy,others); }
      cur.dx+=ddx; cur.dy+=ddy; grp.forEach((g,i)=>place(g,{x:start[i].x+cur.dx,y:start[i].y+cur.dy,w:start[i].w,h:start[i].h})); }
    refresh(); };
  const end=()=>{ if(done) return; done=true; document.body.classList.remove('dragging'); removeEventListener('mousemove',mv); removeEventListener('mouseup',end);
    document.removeEventListener('keydown',kd,true); document.removeEventListener('keyup',ku,true); hideHint(); collide=false;
    document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));   // po puszczeniu zostaje tylko okno chwycone
    orig.forEach((r,g)=>{ if(g.isConnected) savePos(g); }); updateContacts(); };
  const merge=()=>{ if(!collide) return; const ids=grp.map(g=>g.dataset.app), cs=contactList().filter(c=>ids.includes(c.a)!==ids.includes(c.b));
    if(!cs.length) return;
    cs.forEach(c=>{ const mine=ids.includes(c.a)?c.a:c.b, other=mine===c.a?c.b:c.a; if(!linked(mine,other)) S.aw.links.push([mine,other]); });
    save(); rebase(); grp.forEach(g=>{ g.style.zIndex=++zTop; }); w.style.zIndex=++zTop; toast(t('Okna scalone')); refresh(); };
  const unmerge=()=>{ if(!S.aw.links.some(l=>l.includes(id))) return; S.aw.links=S.aw.links.filter(l=>!l.includes(id)); save(); rebase(); toast(t('Okno oddzielone')); refresh(); };
  const kd=ev=>{ const k=ev.key;
    if(k==='Escape'){ ev.stopPropagation(); orig.forEach((r,g)=>place(g,r)); end(); }
    else if(k==='Shift'){ hintChip('sh',true); collide=!d; refresh(); }
    else if(!d&&(k==='m'||k==='M')){ ev.preventDefault(); merge(); }
    else if(!d&&(k==='u'||k==='U')){ ev.preventDefault(); unmerge(); } };
  const ku=ev=>{ if(ev.key==='Shift'){ hintChip('sh',false); collide=false; refresh(); } };
  addEventListener('mousemove',mv); addEventListener('mouseup',end); document.addEventListener('keydown',kd,true); document.addEventListener('keyup',ku,true);
}
addEventListener('resize',()=>{ const box=$('aws').getBoundingClientRect(); document.querySelectorAll('.aw').forEach(w=>{ const x=clamp(parseFloat(w.style.left),-parseFloat(w.style.width)+90,Math.max(0,box.width-90)), y=clamp(parseFloat(w.style.top),0,Math.max(0,box.height-40)); w.style.left=x+'px'; w.style.top=y+'px'; }); updateContacts(); });
function setWinSize(w,nw,nh){ const r=rectOf(w), box=$('aws').getBoundingClientRect(); place(w,{x:clamp(r.x,0,Math.max(0,box.width-nw)),y:r.y,w:nw,h:nh}); savePos(w); updateContacts(); }
// sekcja w ustawieniach
function appCard(id,added){ const a=APP[id]; return `<div class="ap${added?' added':''}" data-ap="${id}" data-add="${added?0:1}"><i class="ic">${a.ic}</i><div class="apn"><b>${esc(a.n)}</b><small>${a.ph?'wkrótce':esc(a.d||'')}</small></div><em class="apact">${added?'− Usuń':'＋ Dodaj'}</em></div>`; }
function renderApps(){
  const A=S.settings.apps, bar=A.bar.filter(id=>APP[id]), avail=APPS.filter(a=>!bar.includes(a.id)), u=S.settings.ui;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PASEK APLIKACJI</h5>
  <label class="ck"><input type="checkbox" id="appson" ${A.on?'checked':''}><span class="tg"></span>Pokaż pasek aplikacji</label>
  <div class="ad ${A.on?'open':''}" id="appsad"><div class="adi" id="applists">${appLists(bar,avail)}</div></div>
  <h5>OKNA APLIKACJI</h5><label class="ck"><input type="checkbox" id="rnd" ${u.round?'checked':''}><span class="tg"></span>Okrągłe okna aplikacji 🙃</label><p class="hint">Żartobliwa opcja: okna stają się kołami, a pasek tytułu zajmuje górny łuk.</p>
  <label class="ck"><input type="checkbox" data-an="apps" ${u.anim.apps?'checked':''}><span class="tg"></span>Animacje aplikacji</label>
  <h5>TŁO APLIKACJI</h5><label class="ck"><input type="checkbox" id="afxon" ${S.settings.afx.on?'checked':''}><span class="tg"></span>Spokojne cząsteczki w tle aplikacji</label>
  ${[['calc','Kalkulator'],['notes','Notatnik'],['clock','Zegar'],['conv','Konwerter'],['files','Zmieniacz formatów'],['tr','Tłumacz'],['gej','Gejos.exe'],['dice','Kości'],['mine','Saper'],['snake','Snake']].map(([k,n])=>sl('afx.'+k,n,0,100,S.settings.afx[k],'afx')).join('')}<p class="hint">0% wyłącza efekt w danej aplikacji.</p>`;
  paintSliders();
}
const APPCATS=[['prog','Programy'],['game','Gry']], APPGAMES=new Set(['gej','dice','mine','snake']), appCat=id=>APPGAMES.has(id)?'game':'prog';
const appLists=(bar,avail)=>`<h5>DODANE DO PASKA</h5>${bar.length?bar.map(id=>appCard(id,true)).join(''):'<p class="hint">Kliknij aplikację poniżej, aby ją dodać.</p>'}
  <h5>DOSTĘPNE APLIKACJE</h5>${avail.length?APPCATS.map(([k,n])=>{ const l=avail.filter(a=>appCat(a.id)===k); return l.length?`<div class="apcat">${n}</div>`+l.map(a=>appCard(a.id,false)).join(''):''; }).join(''):'<p class="hint">Wszystkie aplikacje są już na pasku.</p>'}`;
function toggleAdd(id,add){
  const A=S.settings.apps; if(!APP[id]) return;
  if(add){ if(!A.bar.includes(id)) A.bar.push(id); } else { A.bar=A.bar.filter(x=>x!==id); if(winOf(id)) closeApp(id); }
  const bar=A.bar.filter(i=>APP[i]), avail=APPS.filter(a=>!bar.includes(a.id)), box=$('applists');
  if(box) box.innerHTML=appLists(bar,avail);
  renderBar(); save();
}
// Wołane po wczytaniu js/apps.js (zob. 25-modules.js): pasek aplikacji i okna otwarte w poprzedniej sesji.
function appsInit(){ renderBar(); S.aw.open.slice().forEach(id=>openApp(id)); applyUi(); }

// ===== src/js/12-app-calc.js =====
// ---------- aplikacja: kalkulator ----------
function calcEval(src,deg){
  const s=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'');
  let i=0; const bad=()=>{ throw new Error('x'); };
  const rad=x=>deg?x*Math.PI/180:x, back=x=>deg?x*180/Math.PI:x;
  const F={sin:x=>Math.sin(rad(x)),cos:x=>Math.cos(rad(x)),tan:x=>Math.tan(rad(x)),asin:x=>back(Math.asin(x)),acos:x=>back(Math.acos(x)),atan:x=>back(Math.atan(x)),ln:Math.log,log:Math.log10,sqrt:Math.sqrt,abs:Math.abs,exp:Math.exp};
  const FK=Object.keys(F).sort((a,b)=>b.length-a.length);
  const fact=n=>{ if(n<0||n!==Math.floor(n)||n>170) bad(); let r=1; for(let k=2;k<=n;k++) r*=k; return r; };
  function expr(){ let v=term(); while(s[i]==='+'||s[i]==='-'){ const o=s[i++], r=term(); v=o==='+'?v+r:v-r; } return v; }
  function term(){ let v=unary(); for(;;){ const c=s[i]||''; if(c==='*'||c==='/'){ i++; const r=unary(); v=c==='*'?v*r:v/r; } else if(c==='('||/[a-z\d.]/.test(c)) v*=unary(); else break; } return v; }
  function unary(){ if(s[i]==='-'){ i++; return -unary(); } if(s[i]==='+'){ i++; return unary(); } return pow(); }
  function pow(){ let b=post(); if(s[i]==='^'){ i++; b=Math.pow(b,unary()); } return b; }
  function post(){ let v=prim(); for(;;){ if(s[i]==='!'){ i++; v=fact(v); } else if(s[i]==='%'){ i++; v=v/100; } else break; } return v; }
  function prim(){
    if(s[i]==='('){ i++; const v=expr(); if(s[i]===')') i++; return v; }
    const m=/^(\d*\.?\d+(?:e[+-]?\d+)?|\d+\.)/i.exec(s.slice(i)); if(m){ i+=m[0].length; return parseFloat(m[0]); }
    const f=/^[a-z]+/.exec(s.slice(i));
    if(f){ const nm=f[0];
      for(const k of FK) if(nm.startsWith(k)){ i+=k.length; if(s[i]!=='(') bad(); i++; const v=expr(); if(s[i]===')') i++; return F[k](v); }
      if(nm.startsWith('pi')){ i+=2; return Math.PI; } if(nm[0]==='e'){ i++; return Math.E; } }
    return bad(); }
  const v=expr(); if(i<s.length) bad(); return v;
}
function mountCalc(el,w){
  const D=(S.aw.data.calc=S.aw.data.calc||{mode:'s',deg:true,hist:[]});
  let expr='', lastEx='', prev='0', just=false, err=false, second=false;
  el.innerHTML=`<div class="calc" tabindex="0"><div class="c-top"><div class="c-seg"><button data-m="s">Prosty</button><button data-m="x">Naukowy</button></div><button class="c-hb" title="Historia">🕘</button></div>
    <div class="c-disp"><div class="c-ex"></div><div class="c-res">0</div></div>
    <div class="c-main"><div class="c-fn"></div><div class="c-pad"></div></div>
    <div class="c-hist"><div class="c-hh"><b>Historia</b><button class="c-hc">Wyczyść historię</button></div><div class="c-hl"></div></div></div>`;
  const root=el.firstElementChild, ex=root.querySelector('.c-ex'), rs=root.querySelector('.c-res'), fn=root.querySelector('.c-fn'), pad=root.querySelector('.c-pad'), hl=root.querySelector('.c-hl');
  const PAD=[['C','C','fx'],['⌫','BS','fx'],['%','%','fx'],['÷','÷','op'],['7','7'],['8','8'],['9','9'],['×','×','op'],['4','4'],['5','5'],['6','6'],['−','−','op'],['1','1'],['2','2'],['3','3'],['+','+','op'],['±','NEG','fx'],['0','0'],['.','.'],['=','EQ','eq']];
  const FNK=()=>[['2nd','2ND','fx'+(second?' on':'')],[D.deg?'DEG':'RAD','DEG','fx'],['(','(','fx'],[')',')','fx'],
    second?['sin⁻¹','asin(','fn']:['sin','sin(','fn'],second?['cos⁻¹','acos(','fn']:['cos','cos(','fn'],second?['tan⁻¹','atan(','fn']:['tan','tan(','fn'],['π','π','fn'],
    ['ln','ln(','fn'],['log','log(','fn'],['e','e','fn'],['n!','!','fn'],['x²','^2','fn'],['√','√(','fn'],['xʸ','^','fn'],['1/x','INV','fn'],
    ['|x|','abs(','fn'],['Ans','ANS','fn'],['eˣ','exp(','fn'],['10ˣ','10^','fn']];
  const btns=l=>l.map(([lab,k,c])=>`<button data-k="${k}" class="${c||''}">${lab}</button>`).join('');
  const fmt=n=>{ if(!isFinite(n)) return null; let v=parseFloat(n.toPrecision(12)); if(v===0) v=0; const a=Math.abs(v);
    return (a!==0&&(a>=1e15||a<1e-9))?v.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e'):String(v); };
  const render=()=>{
    ex.textContent=just?lastEx:expr; let r;
    if(err) r=t('Błąd');
    else if(just) r=expr;
    else if(!expr) r='0';
    else if(/^−?[\d.]+(e[+-]?\d+)?$/i.test(expr)) r=expr;
    else { try{ const f=fmt(calcEval(expr,D.deg)); if(f!==null) prev=f; }catch{} r=prev; }
    rs.textContent=r; rs.classList.toggle('er',err); rs.style.fontSize=(r.length>11?Math.max(16,34-(r.length-11)*1.7):34)+'px';
    root.querySelectorAll('.c-seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===D.mode)); root.classList.toggle('sci',D.mode==='x');
    hl.innerHTML=D.hist.length?D.hist.map((h,i)=>`<div class="he" data-i="${i}"><small>${esc(h.e)} =</small><b>${esc(h.r)}</b></div>`).join(''):'<p class="hint">Brak historii obliczeń.</p>';
  };
  const buildFn=()=>{ fn.innerHTML=btns(FNK()); };
  const OPS=/[+−×÷^]/;
  const press=k=>{
    if(err){ expr=''; err=false; prev='0'; just=false; }
    if(/^[\d.]$/.test(k)){ if(just){ expr=''; just=false; } if(k==='.'&&(expr.split(/[^\d.]/).pop()||'').includes('.')) return render(); expr+=k; }
    else if(k==='C'){ expr=''; just=false; prev='0'; }
    else if(k==='BS'){ if(just){ just=false; } expr=expr.replace(/(?:asin|acos|atan|sin|cos|tan|ln|log|exp|abs|√)\($|[\s\S]$/,''); }
    else if(k==='EQ'){ if(!expr) return; let v; try{ v=calcEval(expr,D.deg); }catch{ v=NaN; } const r=fmt(v);
      if(r===null){ err=true; return render(); }
      D.hist.unshift({e:expr,r}); D.hist=D.hist.slice(0,60); saveSoon(); lastEx=expr+' ='; expr=r; just=true; prev=r; }
    else if(k==='NEG'){ just=false; const m=/^−\((.*)\)$/.exec(expr); expr=!expr?'−':m?m[1]:'−('+expr+')'; }
    else if(k==='INV'){ just=false; expr=expr?'1÷('+expr+')':'1÷('; }
    else if(k==='ANS'){ if(!D.hist[0]) return; if(just) expr=''; just=false; expr+=D.hist[0].r; }
    else if(k==='DEG'){ D.deg=!D.deg; saveSoon(); buildFn(); }
    else if(k==='2ND'){ second=!second; buildFn(); }
    else { const op=/^[+−×÷^!%]$/.test(k);
      if(just&&!op){ expr=''; } just=false;
      if(/^[+×÷^]$/.test(k)&&OPS.test(expr.slice(-1))) expr=expr.slice(0,-1)+k;
      else if(k==='−'&&/[+−]$/.test(expr)) expr=expr.slice(0,-1)+k;
      else expr+=k; }
    render();
  };
  const setMode=m=>{ D.mode=m; saveSoon();
    const r=rectOf(w); if(m==='x') setWinSize(w,Math.max(r.w,600),Math.max(r.h,480)); else if(r.w>380) setWinSize(w,320,r.h); render(); };
  pad.innerHTML=btns(PAD); buildFn();
  root.addEventListener('mousedown',e=>{ if(e.target.closest('button')){ e.preventDefault(); root.focus({preventScroll:true}); } });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button'), he=e.target.closest('.he'); if(!b&&!he) return;
    if(he){ const h=D.hist[+he.dataset.i]; if(!expr||just){ expr=h.r; just=false; } else expr+=h.r; root.classList.remove('h'); render(); return; }
    if(b.dataset.k) press(b.dataset.k); else if(b.dataset.m) setMode(b.dataset.m);
    else if(b.classList.contains('c-hb')) root.classList.toggle('h');
    else if(b.classList.contains('c-hc')){ D.hist=[]; saveSoon(); render(); } });
  root.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    const map={'*':'×','/':'÷','-':'−','Enter':'EQ','=':'EQ','Backspace':'BS','Escape':'C','Delete':'C',',':'.','p':'π','P':'π'}, x=map[e.key]??e.key;
    if(/^[0-9.+^()!%]$/.test(x)||['×','÷','−','EQ','BS','C','π'].includes(x)){ e.preventDefault(); press(x); } });
  render();
}

// ===== src/js/13-app-notes.js =====
// ---------- aplikacja: notatnik ----------
function mountNotes(el,w){
  const D=(S.aw.data.notes=S.aw.data.notes||{list:[],cur:null,sl:true});
  if(!D.list.length){ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); D.cur=n.id; }
  if(!D.list.find(n=>n.id===D.cur)) D.cur=D.list[0].id;
  let q='';
  el.innerHTML=`<div class="nt"><div class="nt-l"><div class="nt-lt"><input class="nt-s" placeholder="Szukaj w notatkach…"><button class="nt-n" title="Nowa notatka">＋</button></div><div class="nt-ls"></div></div>
    <div class="nt-e"><div class="nt-bar"><button class="nt-t" title="Lista notatek">☰</button><input class="nt-ti" maxlength="80" spellcheck="false"><button class="nt-lk" title="Lista zadań (pola do odznaczania)"><svg viewBox="0 0 24 24"><path d="m4 7 1.5 1.5L8 5.8M4 13l1.5 1.5L8 11.8M11 7h9M11 13h9M4 19h.01M11 19h9"/></svg></button><button class="nt-em" title="Emoji">😊</button><button class="nt-dp" title="Duplikuj notatkę">⧉</button><button class="nt-io-b" title="Importuj / eksportuj">⇅</button><button class="nt-d" title="Usuń notatkę">🗑</button></div>
    <textarea class="nt-ta" spellcheck="false" placeholder="Zacznij pisać…"></textarea><div class="nt-li"></div><div class="nt-f"><span class="nt-c"></span><button class="nt-cl">Usuń wykonane</button></div><div class="nt-pk"></div><div class="nt-io"></div><input type="file" class="nt-fi" multiple hidden accept=".txt,.md,.markdown,.csv,.tsv,.json,.log,.html,.htm,.xml,.rtf,.ini,.cfg,.yml,.yaml,.tex,.srt,.vtt,.bat,.js,.css,text/*"></div></div>`;
  const root=el.firstElementChild, io=root.querySelector('.nt-io'), fi=root.querySelector('.nt-fi'), ls=root.querySelector('.nt-ls'), ta=root.querySelector('.nt-ta'), ti=root.querySelector('.nt-ti'), cc=root.querySelector('.nt-c'), pk=root.querySelector('.nt-pk'), sr=root.querySelector('.nt-s'), li=root.querySelector('.nt-li'), lk=root.querySelector('.nt-lk'), lcl=root.querySelector('.nt-cl');
  const EM='😀 😂 😍 🥰 😎 🤔 😴 😭 😡 👍 👎 🙏 👏 🎉 🔥 ⭐ 💡 ✅ ❌ ❤️ 💔 📌 📎 📝 📅 ⏰ 💼 🏠 🛒 ✈️ 🍕 ☕ 🎵 📚 💻 📱 🔒 🔑 🌈 ☀️ 🌙 🌿 🐱 🐶 🚀 💬 🎯'.split(' ');
  pk.innerHTML=EM.map(e=>`<button>${e}</button>`).join('');
  const cur=()=>D.list.find(n=>n.id===D.cur);
  // tryb listy zadań: pozycje są zapisane w tekście notatki jako wiersze "[ ] tekst" i "[x] tekst" (bez osobnej struktury, więc wyszukiwanie, kopiowanie i eksport działają jak zawsze)
  const LRE=/^\s*(?:[-*]\s*)?\[([ xX])\]\s?/, clean=x=>x.replace(LRE,'');
  const parseL=c=>c.split('\n').filter(x=>x.trim()).map(x=>{ const m=LRE.exec(x); return m?{d:m[1]!==' ',t:x.slice(m[0].length)}:{d:false,t:x.trim()}; });
  const joinL=a=>a.map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'), toTxt=c=>parseL(c).map(i=>i.d?'[x] '+i.t:i.t).join('\n');
  const prog=n=>{ const a=parseL(n.c); return [a.filter(i=>i.d).length,a.length]; };
  let items=[], lastIn=null;
  const first=n=>{ const l=(n.c.split('\n').map(clean).find(x=>x.trim())||'').trim(); return l?l.slice(0,40):t('Bez tytułu'); };
  const title=n=>n.t||first(n);
  const sub=n=>{ const ln=n.c.split('\n').map(clean).filter(x=>x.trim()); return (ln[1]||'').trim(); };
  const when=n=>new Date(n.u).toLocaleString(IL(),{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const list=()=>{ const f=q.toLowerCase(); ls.innerHTML=[...D.list].sort((a,b)=>b.u-a.u).filter(n=>!f||(n.c+' '+(n.t||'')).toLowerCase().includes(f))
    .map(n=>`<div class="ni${n.id===D.cur?' on':''}" data-id="${n.id}"><b>${esc(title(n))}</b><small>${esc(when(n))}${n.l?' · ✓ '+prog(n).join('/'):''}${sub(n)?' · '+esc(sub(n).slice(0,24)):''}</small></div>`).join(''); };
  const meta=()=>{ const n=cur(); ti.value=n.t||''; ti.placeholder=first(n); cc.textContent=n.l?t('Wykonano {a} z {b}').replace('{a}',prog(n)[0]).replace('{b}',prog(n)[1]):[...n.c].length+' '+t('znaków'); };
  const show=()=>{ const n=cur(), L=!!n.l; ta.value=n.c; root.classList.toggle('lm',L); lk.classList.toggle('on',L); if(L){ items=parseL(n.c); rItems(); } meta(); list(); root.classList.toggle('sl',!!D.sl); };
  const select=id=>{ D.cur=id; saveSoon(); show(); if(root.classList.contains('narrow')){ D.sl=false; root.classList.remove('sl'); } if(!cur().l) ta.focus(); };
  ta.addEventListener('input',()=>{ const n=cur(); n.c=ta.value; n.u=Date.now(); meta(); list(); saveSoon(); });
  sr.addEventListener('input',()=>{ q=sr.value; list(); });
  ti.addEventListener('input',()=>{ const n=cur(), v=ti.value.trim(); if(v) n.t=v; else delete n.t; list(); saveSoon(); });
  ti.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); (cur().l?(li.querySelector('.nt-new')||ta):ta).focus(); } });
  root.querySelector('.nt-dp').onclick=()=>{ const n=cur(), c={id:uid(),c:n.c,l:n.l,t:title(n)+' ('+t('kopia')+')',u:Date.now()}; D.list.push(c); select(c.id); };
  ls.addEventListener('click',e=>{ const it=e.target.closest('.ni'); if(it) select(it.dataset.id); });
  root.querySelector('.nt-n').onclick=()=>{ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); q=''; sr.value=''; select(n.id); };
  root.querySelector('.nt-t').onclick=()=>{ D.sl=!D.sl; root.classList.toggle('sl',D.sl); saveSoon(); };
  root.querySelector('.nt-em').onclick=e=>{ e.stopPropagation(); pk.classList.toggle('open'); };
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('.nt-pk,.nt-em')) pk.classList.remove('open'); if(!e.target.closest('.nt-io,.nt-io-b')) io.classList.remove('open'); });
  pk.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
    const tg=root.classList.contains('lm')?((lastIn&&lastIn.isConnected)?lastIn:li.querySelector('.nt-new')):ta, a=tg.selectionStart, z=tg.selectionEnd;
    tg.setRangeText(b.textContent,a,z,'end'); tg.dispatchEvent(new Event('input',{bubbles:true})); tg.focus(); });
  root.querySelector('.nt-d').onclick=async()=>{ const n=cur();
    if(n.c.trim()&&!(await ask(t('Usunąć notatkę?'),t('Tej operacji nie można cofnąć.'),'Usuń'))) return;
    D.list=D.list.filter(x=>x.id!==n.id); if(!D.list.length) D.list.push({id:uid(),c:'',u:Date.now()}); D.cur=D.list[0].id; saveSoon(); show(); };
  new ResizeObserver(()=>{ const nar=el.clientWidth<420; if(nar!==root.classList.contains('narrow')){ root.classList.toggle('narrow',nar); if(nar){ D.sl=false; root.classList.remove('sl'); } } }).observe(el);
  const rItems=focus=>{
    li.innerHTML=items.map((it,i)=>`<div class="nt-it${it.d?' done':''}" data-i="${i}"><label class="nt-ck"><input type="checkbox" ${it.d?'checked':''}><i></i></label><input class="nt-tx" value="${esc(it.t)}" spellcheck="false"><button class="nt-x" title="Usuń pozycję">×</button></div>`).join('')
      +'<div class="nt-ad"><span>+</span><input class="nt-new" placeholder="Dodaj pozycję..."></div>';
    if(focus!==undefined&&focus!==null){ const e=focus<0?li.querySelector('.nt-new'):li.querySelectorAll('.nt-tx')[focus]; if(e){ e.focus(); const L=e.value.length; try{ e.setSelectionRange(L,L); }catch{} } }
  };
  const sync=()=>{ const n=cur(); n.c=joinL(items); n.u=Date.now(); meta(); list(); saveSoon(); };
  const addNew=inp=>{ const v=inp.value.trim(); if(!v) return false; items.push({d:false,t:v}); inp.value=''; sync(); return true; };
  lk.onclick=()=>{ const n=cur(); n.l=!n.l; n.c=n.l?joinL(parseL(n.c)):toTxt(n.c); n.u=Date.now(); saveSoon(); show(); if(n.l) (li.querySelector('.nt-new')).focus(); else ta.focus(); };
  lcl.onclick=()=>{ items=items.filter(i=>!i.d); sync(); rItems(); };
  li.addEventListener('focusin',e=>{ if(e.target.matches('.nt-tx,.nt-new')) lastIn=e.target; });
  li.addEventListener('change',e=>{ const row=e.target.closest('.nt-it');
    if(row&&e.target.type==='checkbox'){ const i=+row.dataset.i; items[i].d=e.target.checked; row.classList.toggle('done',items[i].d); sync(); }
    else if(e.target.classList.contains('nt-new')){ if(addNew(e.target)) rItems(); } });
  li.addEventListener('input',e=>{ const row=e.target.closest('.nt-it'); if(row&&e.target.classList.contains('nt-tx')){ items[+row.dataset.i].t=e.target.value; sync(); } });
  li.addEventListener('click',e=>{ const x=e.target.closest('.nt-x'); if(x){ const i=+x.closest('.nt-it').dataset.i; items.splice(i,1); sync(); rItems(Math.min(i,items.length-1)); } });
  li.addEventListener('keydown',e=>{
    if(e.isComposing) return; const inp=e.target;
    if(inp.classList.contains('nt-new')){
      if(e.key==='Enter'){ e.preventDefault(); if(addNew(inp)) rItems(-1); }
      else if((e.key==='Backspace'||e.key==='ArrowUp')&&!inp.value&&items.length){ e.preventDefault(); li.querySelectorAll('.nt-tx')[items.length-1].focus(); }
      return; }
    if(!inp.classList.contains('nt-tx')) return; const i=+inp.closest('.nt-it').dataset.i;
    if(e.key==='Enter'){ e.preventDefault(); items.splice(i+1,0,{d:false,t:''}); sync(); rItems(i+1); }
    else if(e.key==='Backspace'&&!inp.value){ e.preventDefault(); items.splice(i,1); sync(); rItems(i>0?i-1:(items.length?0:-1)); }
    else if(e.key==='ArrowUp'&&i>0){ e.preventDefault(); li.querySelectorAll('.nt-tx')[i-1].focus(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); const nx=li.querySelectorAll('.nt-tx')[i+1]; (nx||li.querySelector('.nt-new')).focus(); } });
  show();
  // import i eksport plików tekstowych (v48): .txt, .md, .csv, .json, .html i inne pliki tekstowe; kopia zapasowa wszystkich notatek w .json wraca przy imporcie
  const ioMenu=sub=>{ io.dataset.sub=sub?'1':''; io.innerHTML=(sub?[['back','← Wstecz'],['-'],['txt','Ta notatka jako .txt'],['md','Ta notatka jako .md'],['html','Ta notatka jako .html'],['-'],['all','Wszystkie jako jeden .txt'],['bak','Kopia wszystkich (.json)']]:[['imp','Importuj pliki…'],['sub','Eksportuj…']]).map(([k,l])=>k==='-'?'<hr>':`<button data-io="${k}">${l}</button>`).join(''); };   // menu główne: Importuj / Eksportuj…; „Eksportuj…” otwiera listę formatów
  ioMenu(false);
  const safe=x=>(x||'').replace(/[\\/:*?"<>|\r\n]+/g,' ').trim().slice(0,60)||t('Notatka');
  const dl=(name,txt,mime)=>{ const b=new Blob(['\ufeff'+txt],{type:mime+';charset=utf-8'}), u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),4000); toast(t('Zapisano')+': '+name); };
  const plain=n=>n.l?parseL(n.c).map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'):n.c;
  const htmlOf=n=>`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title(n))}</title></head><body><h1>${esc(title(n))}</h1>${n.l?'<ul style="list-style:none;padding:0">'+parseL(n.c).map(i=>`<li>${i.d?'☑':'☐'} ${esc(i.t)}</li>`).join('')+'</ul>':'<pre style="white-space:pre-wrap;font:inherit">'+esc(n.c)+'</pre>'}</body></html>`;
  const stripHtml=h=>{ try{ const d=new DOMParser().parseFromString(h,'text/html'); d.querySelectorAll('script,style,head').forEach(x=>x.remove()); return (d.body.innerText||d.body.textContent||'').replace(/\n{3,}/g,'\n\n').trim(); }catch{ return h; } };
  const addNote=(name,c,l)=>{ const n={id:uid(),c,u:Date.now()}; if(name) n.t=name; if(l) n.l=true; D.list.push(n); return n; };
  const imp=async files=>{ let k=0, last=null;
    for(const f of files){ let tx; try{ tx=await f.text(); }catch{ continue; } if(/[\u0000]/.test(tx.slice(0,2000))){ toast(t('Pominięto plik binarny')+': '+f.name); continue; }
      tx=tx.replace(/^\ufeff/,'').replace(/\r\n?/g,'\n'); const ext=(f.name.split('.').pop()||'').toLowerCase(), base=f.name.replace(/\.[^.]+$/,'');
      if(ext==='json'){ let j=null; try{ j=JSON.parse(tx); }catch{} const arr=j&&Array.isArray(j.notes)?j.notes:(Array.isArray(j)?j:null);
        if(arr&&arr.every(x=>x&&typeof x==='object'&&typeof x.c==='string')){ arr.forEach(x=>{ last=addNote(typeof x.t==='string'?x.t.slice(0,80):'',x.c,!!x.l); k++; }); continue; } }
      if(ext==='html'||ext==='htm') tx=stripHtml(tx);
      last=addNote(base.slice(0,80),tx,false); k++; }
    if(k){ q=''; sr.value=''; select(last.id); toast(t('Zaimportowano notatek')+': '+k); } else toast(t('Nic nie zaimportowano')); };
  const exp=k=>{ const n=cur();
    if(k==='txt') dl(safe(title(n))+'.txt',plain(n),'text/plain');
    else if(k==='md') dl(safe(title(n))+'.md','# '+title(n)+'\n\n'+(n.l?parseL(n.c).map(i=>'- ['+(i.d?'x':' ')+'] '+i.t).join('\n'):n.c)+'\n','text/markdown');
    else if(k==='html') dl(safe(title(n))+'.html',htmlOf(n),'text/html');
    else if(k==='all') dl('notatki.txt',[...D.list].sort((a,b)=>b.u-a.u).map(x=>title(x)+'\n'+'='.repeat(Math.min(40,Math.max(3,title(x).length)))+'\n'+plain(x)).join('\n\n\n')+'\n','text/plain');
    else if(k==='bak') dl('notatki-kopia.json',JSON.stringify({arkana:'notes',v:1,notes:D.list.map(x=>({t:x.t||'',c:x.c,l:!!x.l,u:x.u}))},null,1),'application/json'); };
  root.querySelector('.nt-io-b').onclick=e=>{ e.stopPropagation(); pk.classList.remove('open'); if(!io.classList.contains('open')) ioMenu(false); io.classList.toggle('open'); };
  io.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const k=b.dataset.io; if(k==='sub'){ ioMenu(true); return; } if(k==='back'){ ioMenu(false); return; } io.classList.remove('open'); if(k==='imp') fi.click(); else exp(k); });
  fi.addEventListener('change',()=>{ const fs=[...fi.files]; fi.value=''; if(fs.length) imp(fs); });
  root.addEventListener('dragover',e=>{ if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  root.addEventListener('drop',e=>{ const fs=e.dataTransfer&&[...e.dataTransfer.files]; if(fs&&fs.length){ e.preventDefault(); imp(fs); } });
}


// ===== src/js/14-app-clock.js =====
// ---------- aplikacja: zegar, alarmy, minutnik, stoper i kalendarz ----------
const pad2=n=>String(n).padStart(2,'0');
const dkey=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const CLD=()=>{ const D=(S.aw.data.clock=S.aw.data.clock||{});
  const d={tab:'clock',style:'a',h24:true,alarms:[],snooze:[],timer:{dur:300,end:0,left:300,run:false},tsnd:'beep',sw:{run:false,t0:0,acc:0,laps:[]},events:{},sel:'',cm:''};
  for(const k in d) if(D[k]===undefined) D[k]=d[k]; return D; };
// --- dźwięki (WebAudio, bez plików) ---
const SNDN=[['bell','Dzwonek'],['beep','Budzik'],['rise','Narastający'],['chime','Melodia'],['pulse','Cichy puls']];
let AUDX=null, sndT=null;
function audio(){ try{ AUDX=AUDX||new (window.AudioContext||window.webkitAudioContext)(); if(AUDX.state==='suspended') AUDX.resume(); }catch{} return AUDX; }
function tone(f,t0,dur,type,vol){ const o=AUDX.createOscillator(), g=AUDX.createGain(); o.type=type; o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(vol,t0+.015); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g); g.connect(AUDX.destination); o.start(t0); o.stop(t0+dur+.05); }
const SND={
  bell:t=>{ [880,1320,1760].forEach((f,i)=>tone(f,t,1.5/(i+1),'sine',.24/(i+1))); return 2; },
  beep:t=>{ for(let i=0;i<4;i++) tone(1000,t+i*.18,.1,'square',.1); return 1.4; },
  rise:t=>{ [523,659,784,1047].forEach((f,i)=>tone(f,t+i*.2,.4,'triangle',.22)); return 1.6; },
  chime:t=>{ [659,587,523,587,659,659,659].forEach((f,i)=>tone(f,t+i*.28,.32,'sine',.22)); return 2.4; },
  pulse:t=>{ tone(440,t,.5,'sine',.2); tone(440,t+.7,.5,'sine',.2); return 1.6; }
};
function stopSnd(){ clearInterval(sndT); sndT=null; }
function playSnd(id,loop){ stopSnd(); if(!audio()) return; const f=SND[id]||SND.bell;
  const once=()=>{ try{ return f(AUDX.currentTime+.03); }catch{ return 2; } }, per=once(); if(loop) sndT=setInterval(once,(per+.7)*1000); }
// --- dzwonienie alarmu: otwiera aplikację lub wynosi ją na wierzch ---
const RING=[]; let CLK=null;   // CLK = uchwyt otwartej aplikacji (ring/refresh)
function ringStart(r){
  RING.push(r); playSnd(r.snd,true); document.body.classList.remove('noapps');
  try{ window.api.attention(); }catch{}
  const w=winOf('clock'); if(w&&!w.classList.contains('out')) focusWin(w); else openApp('clock');
  CLK&&CLK.ring();
}
function clockTick(){
  if(SEC) return;
  const D=CLD(), now=new Date(), ms=+now, stamp=dkey(now)+' '+pad2(now.getHours())+':'+pad2(now.getMinutes()); let dirty=false;
  D.alarms.forEach(a=>{ if(!a.on) return; const lab=pad2(a.h)+':'+pad2(a.m);
    if(a.days&&a.days.length){
      if(a.h===now.getHours()&&a.m===now.getMinutes()&&a.days.includes(now.getDay())&&a.last!==stamp){ a.last=stamp; dirty=true; ringStart({t:lab,n:a.note||'',snd:a.snd}); } }
    else { const at=new Date(a.date+'T'+lab+':00').getTime();
      if(ms>=at){ a.on=false; a.last=stamp; dirty=true; if(ms-at<120000) ringStart({t:lab,n:a.note||'',snd:a.snd}); else a.missed=true; } } });
  const sn=D.snooze.length; D.snooze=D.snooze.filter(s=>{ if(ms<s.until) return true; ringStart({t:s.t,n:s.n,snd:s.snd}); return false; }); if(D.snooze.length!==sn) dirty=true;
  const T=D.timer; if(T.run&&ms>=T.end){ T.run=false; T.left=T.dur; dirty=true; ringStart({t:t('Minutnik'),n:t('Czas minął'),snd:D.tsnd,timer:1}); }
  if(RING.length&&!winOf('clock')){ RING.length=0; stopSnd(); renderBar(); }   // zamknięcie okna = wyciszenie
  if(dirty){ save(); CLK&&CLK.refresh(); }
}
setInterval(clockTick,1000);
// --- tarcze ---
function anSvg(st){ const a=st==='a'; let s='<svg viewBox="-100 -100 200 200" class="cl-an"><circle r="97" class="cl-rim"/>';
  for(let i=0;i<60;i++){ const big=i%5===0; if(!a&&!big) continue; const r1=big?(a?80:78):89, g=i*Math.PI/30, sn=Math.sin(g), cs=-Math.cos(g);
    s+=`<line class="cl-tk${big?' b':''}" x1="${(sn*r1).toFixed(2)}" y1="${(cs*r1).toFixed(2)}" x2="${(sn*92).toFixed(2)}" y2="${(cs*92).toFixed(2)}"/>`; }
  if(a) for(let n=1;n<=12;n++){ const g=n*Math.PI/6; s+=`<text class="cl-nm" x="${(Math.sin(g)*64).toFixed(2)}" y="${(-Math.cos(g)*64).toFixed(2)}">${n}</text>`; }
  return s+'<line class="cl-hh" x1="0" y1="8" x2="0" y2="-44"/><line class="cl-mh" x1="0" y1="10" x2="0" y2="-66"/><line class="cl-sh" x1="0" y1="16" x2="0" y2="-76"/><circle r="4" class="cl-pin"/></svg>'; }
const SEG7={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
const hseg=(x1,x2,y,t=3.2)=>`${x1},${y} ${x1+t},${y-t} ${x2-t},${y-t} ${x2},${y} ${x2-t},${y+t} ${x1+t},${y+t}`;
const vseg=(x,y1,y2,t=3.2)=>`${x},${y1} ${x+t},${y1+t} ${x+t},${y2-t} ${x},${y2} ${x-t},${y2-t} ${x-t},${y1+t}`;
const SEGP={a:hseg(5,31,4),g:hseg(5,31,35),d:hseg(5,31,66),b:vseg(34,6,33),c:vseg(34,37,64),f:vseg(2,6,33),e:vseg(2,37,64)};
const DIGX=[0,46,112,158,224,270];
function digSvg(){ let s='<svg viewBox="-4 -2 316 74" class="cl-dg">';
  DIGX.forEach((x,i)=>{ s+=`<g transform="translate(${x},0)" data-i="${i}">`+Object.keys(SEGP).map(k=>`<polygon class="sg" data-s="${k}" points="${SEGP[k]}"/>`).join('')+'</g>'; });
  [98,210].forEach(x=>{ s+=`<circle class="cl-col" cx="${x}" cy="22" r="3.6"/><circle class="cl-col" cx="${x}" cy="48" r="3.6"/>`; });
  return s+'</svg>'; }
function mountClock(el,w){
  const D=CLD(), L=IL();
  if(!D.cm) D.cm=dkey(new Date()).slice(0,7); if(!D.sel) D.sel=dkey(new Date());
  el.innerHTML='<div class="clk" tabindex="0"><div class="cl-tabs"><i class="cl-ind"></i></div><div class="cl-body"></div><div class="cl-rg"></div></div>';
  const root=el.firstElementChild, tabs=root.querySelector('.cl-tabs'), ind=tabs.querySelector('.cl-ind'), holder=root.querySelector('.cl-body'), rg=root.querySelector('.cl-rg');
  let body=document.createElement('div'); body.className='cl-pg'; holder.appendChild(body);
  const TABS=[['clock','Zegar'],['alarms','Alarmy'],['timer','Minutnik'],['sw','Stoper'],['cal','Kalendarz']];
  let edit=null, live=null, pickOpen=false, pickY=0;
  const wd=i=>new Date(2024,0,7+i).toLocaleDateString(L,{weekday:'short'}), WD=[1,2,3,4,5,6,0];
  const sndOpts=sel=>SNDN.map(([k,n])=>`<option value="${k}"${sel===k?' selected':''}>${n}</option>`).join('');
  const fmtT=s=>{ s=Math.max(0,Math.ceil(s-1e-6)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60); return (h?h+':'+pad2(m):m)+':'+pad2(s%60); };
  const fmtS=ms=>{ const cs=Math.floor(ms/10)%100, s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000)%60, h=Math.floor(ms/3600000); return (h?h+':'+pad2(m):m)+':'+pad2(s)+'.'+pad2(cs); };
  const dsum=a=>a.days&&a.days.length?(a.days.length===7?t('Codziennie'):WD.filter(d=>a.days.includes(d)).map(wd).join(' ')):new Date(a.date+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'});
  // ===== zegar =====
  function vClock(){
    const st=D.style;
    body.innerHTML=`<div class="cl-pc"><div class="cl-chips">${[['a','Tarcza'],['d','Cyfrowy'],['m','Bez numerów']].map(([k,n])=>`<button data-st="${k}" class="${st===k?'on':''}">${n}</button>`).join('')}</div>
      <div class="cl-face">${st==='d'?digSvg():anSvg(st)}</div><div class="cl-date"></div>${st==='d'?`<label class="ck"><input type="checkbox" class="cl-h24"${D.h24?' checked':''}><span class="tg"></span>Format 24-godzinny</label>`:''}</div>`;
    const dt=body.querySelector('.cl-date'); let dl='';
    const setDate=(n,ap)=>{ const k=dkey(n)+ap; if(k===dl) return; dl=k; dt.textContent=(ap?ap.trim()+' · ':'')+capF(n.toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long',year:'numeric'})); };
    if(st==='d'){ const gs=[...body.querySelectorAll('.cl-dg g')], cols=body.querySelectorAll('.cl-col'), last=[]; let lc=null;
      live=()=>{ const n=new Date(); let h=n.getHours(), ap=''; if(!D.h24){ ap=h<12?' AM':' PM'; h=h%12||12; }
        const ds=pad2(h)+pad2(n.getMinutes())+pad2(n.getSeconds());
        gs.forEach((g,i)=>{ if(last[i]===ds[i]) return; last[i]=ds[i]; const on=SEG7[ds[i]]; g.querySelectorAll('.sg').forEach(p=>p.classList.toggle('on',on.includes(p.dataset.s))); });
        const c=n.getSeconds()%2===0; if(c!==lc){ lc=c; cols.forEach(x=>x.classList.toggle('off',!c)); } setDate(n,ap); }; }
    else { const hh=body.querySelector('.cl-hh'), mh=body.querySelector('.cl-mh'), sh=body.querySelector('.cl-sh');
      live=()=>{ const n=new Date(), s=n.getSeconds()+n.getMilliseconds()/1000, m=n.getMinutes()+s/60, h=(n.getHours()%12)+m/60;
        hh.setAttribute('transform','rotate('+h*30+')'); mh.setAttribute('transform','rotate('+m*6+')'); sh.setAttribute('transform','rotate('+s*6+')'); setDate(n,''); }; }
    live();
  }
  // ===== alarmy =====
  function vAlarms(){
    if(edit) return vForm();
    const al=[...D.alarms].sort((x,y)=>x.h*60+x.m-(y.h*60+y.m));
    body.innerHTML=`<div class="cl-pc"><div class="cl-top"><button class="cl-new">＋ Nowy alarm</button></div><div class="cl-al">${al.length?al.map(a=>
      `<div class="cl-a${a.on?' on':''}"><div class="cl-at"><b>${pad2(a.h)}:${pad2(a.m)}</b><small>${esc(dsum(a))}${a.missed&&!a.on?' · '+esc(t('ominięty')):''}</small>${a.note?`<em>${esc(a.note)}</em>`:''}</div>
      <label class="ck"><input type="checkbox" data-tg="${a.id}"${a.on?' checked':''}><span class="tg"></span></label><button class="cl-ib" data-ed="${a.id}" title="Edytuj">✎</button><button class="cl-ib" data-rm="${a.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak alarmów.</p>'}</div></div>`;
  }
  function vForm(){
    const e=edit;
    body.innerHTML=`<div class="cl-pc"><label class="cl-f"><span>Godzina</span><input type="time" class="cl-tm" value="${pad2(e.h)}:${pad2(e.m)}"></label>
      <label class="cl-f"><span>Data</span><input type="date" class="cl-dt" value="${e.date}"></label>
      <div class="cl-f"><span>Powtarzaj</span><div class="cl-chips">${WD.map(d=>`<button data-wd="${d}" class="${e.days.includes(d)?'on':''}">${wd(d)}</button>`).join('')}</div></div>
      <p class="hint">Bez zaznaczonych dni alarm zadzwoni jednorazowo w wybranym dniu.</p>
      <label class="cl-f"><span>Notatka</span><input type="text" class="cl-nt" maxlength="120" placeholder="Notatka do alarmu…" value="${esc(e.note)}"></label>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-sn">${sndOpts(e.snd)}</select><button class="cl-ib cl-pv" title="Odsłuchaj">▶</button></div></div>
      <div class="cl-btns"><button class="cl-ok">Zapisz</button><button class="cl-cn">Anuluj</button></div></div>`;
  }
  function saveForm(){
    const e=edit, tm=body.querySelector('.cl-tm').value; if(!/^\d\d:\d\d$/.test(tm)) return toast(t('Podaj godzinę'));
    e.h=+tm.slice(0,2); e.m=+tm.slice(3); e.date=body.querySelector('.cl-dt').value||dkey(new Date()); e.note=body.querySelector('.cl-nt').value.trim(); e.snd=body.querySelector('.cl-sn').value;
    if(!e.days.length&&new Date(e.date+'T'+tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
    e.on=true; e.missed=false; e.last=''; const i=D.alarms.findIndex(a=>a.id===e.id); if(i>=0) D.alarms[i]=e; else D.alarms.push(e);
    edit=null; save(); draw();
  }
  // ===== minutnik =====
  function vTimer(){
    const T=D.timer, idle=!T.run&&T.left===T.dur, h=Math.floor(T.dur/3600), m=Math.floor(T.dur%3600/60), s=T.dur%60;
    body.innerHTML=`<div class="cl-pc"><div class="cl-rn"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="cl-r0"/><circle cx="60" cy="60" r="54" class="cl-r1" transform="rotate(-90 60 60)"/></svg>
      <div class="cl-big">${idle?`<div class="cl-ti"><input type="number" min="0" max="99" class="cl-n" data-u="h" value="${h}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="m" value="${pad2(m)}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="s" value="${pad2(s)}"></div>`:'<span class="cl-td"></span>'}</div></div>
      <div class="cl-chips cl-pr">${[[60,'1 min'],[300,'5 min'],[600,'10 min'],[900,'15 min'],[1800,'30 min'],[3600,'1 h']].map(([v,n])=>`<button data-pr="${v}"${T.dur===v?' class="on"':''}>${n}</button>`).join('')}</div>
      <div class="cl-btns"><button class="cl-go"${T.dur<=0?' disabled':''}>${T.run?'Pauza':T.left<T.dur?'Wznów':'Start'}</button><button class="cl-rs">Resetuj</button></div>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-tsn">${sndOpts(D.tsnd)}</select><button class="cl-ib cl-pv2" title="Odsłuchaj">▶</button></div></div></div>`;
    const td=body.querySelector('.cl-td'), r1=body.querySelector('.cl-r1'), C=2*Math.PI*54; r1.style.strokeDasharray=C;
    live=()=>{ const rem=T.run?Math.max(0,(T.end-Date.now())/1000):T.left; if(td){ const ts=fmtT(rem); if(td.textContent!==ts){ td.textContent=ts; td.classList.toggle('h',rem>=3600); } } r1.style.strokeDashoffset=T.dur>0?C*(1-rem/T.dur):C; };
    live();
  }
  // ===== stoper =====
  const swEl=()=>D.sw.acc+(D.sw.run?Date.now()-D.sw.t0:0);
  function vSw(){
    const W=D.sw, laps=W.laps, sp=laps.map(l=>l.s), mn=Math.min(...sp), mx=Math.max(...sp);
    body.innerHTML=`<div class="cl-pc"><div class="cl-sd">0:00.00</div><div class="cl-btns"><button class="cl-sg">${W.run?'Stop':W.acc>0?'Wznów':'Start'}</button><button class="cl-lp"${W.run?'':' disabled'}>Okrążenie</button><button class="cl-rs2"${!W.run&&W.acc>0?'':' disabled'}>Resetuj</button></div>
      <div class="cl-laps">${laps.map((l,i)=>`<div class="cl-l${laps.length>1&&l.s===mn?' best':laps.length>1&&l.s===mx?' worst':''}"><span>${laps.length-i}</span><b>${fmtS(l.s)}</b><small>${fmtS(l.tot)}</small></div>`).join('')}</div></div>`;
    const sd=body.querySelector('.cl-sd'); live=()=>{ const ms=swEl(); sd.textContent=fmtS(ms); sd.classList.toggle('sm',ms>=3600000); }; live();
  }
  // ===== kalendarz =====
  function pkHtml(Y,M){ const now=new Date(), ys=[]; for(let y=1900;y<=2200;y++) ys.push(y);
    return `<div class="cl-pk"><div class="cl-pkm">${Array.from({length:12},(_,i)=>`<button data-pm="${i}" class="${pickY===Y&&i===M-1?'on':''}${pickY===now.getFullYear()&&i===now.getMonth()?' now':''}">${esc(capF(new Date(2024,i,1).toLocaleDateString(L,{month:'long'})))}</button>`).join('')}</div>
      <div class="cl-pky">${ys.map(y=>`<button data-py="${y}" class="${y===pickY?'on':''}${y===now.getFullYear()?' now':''}">${y}</button>`).join('')}</div></div>`; }
  function vCal(){
    const [Y,M]=D.cm.split('-').map(Number), off=(new Date(Y,M-1,1).getDay()+6)%7, today=dkey(new Date()); let cells='';
    for(let i=0;i<42;i++){ const d=new Date(Y,M-1,1-off+i), k=dkey(d), has=(D.events[k]||[]).length;
      cells+=`<button class="cl-d${d.getMonth()!==M-1?' o':''}${k===today?' td':''}${k===D.sel?' sel':''}" data-d="${k}">${d.getDate()}${has?'<i></i>':''}</button>`; }
    body.innerHTML=`<div class="cl-pc"><div class="cl-ch"><button class="cl-ib" data-m="-1">‹</button><button class="cl-mt${pickOpen?' open':''}" title="Wybierz miesiąc i rok">${esc(capF(new Date(Y,M-1,1).toLocaleDateString(L,{month:'long',year:'numeric'})))}</button><button class="cl-ib" data-m="1">›</button><button class="cl-tdb">Dziś</button></div>
      ${pickOpen?pkHtml(Y,M):''}<div class="cl-wd">${WD.map(d=>`<span>${wd(d)}</span>`).join('')}</div><div class="cl-gr">${cells}</div><div class="cl-ev"></div></div>`;
    if(pickOpen){ const yl=body.querySelector('.cl-pky'), on=yl&&yl.querySelector('.on'); if(on) yl.scrollTop=on.offsetTop-yl.clientHeight/2+on.offsetHeight/2; }
    evList();
  }
  function evList(){
    const box=body.querySelector('.cl-ev'); if(!box) return; const list=(D.events[D.sel]||[]).slice().sort((a,b)=>(a.tm||'99').localeCompare(b.tm||'99'));
    box.innerHTML=`<div class="cl-evh">${esc(capF(new Date(D.sel+'T12:00').toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long'})))}</div>
      <div class="cl-evl">${list.length?list.map(e=>`<div class="cl-e"><span>${e.tm?esc(e.tm):'•'}</span><b>${esc(e.tt)}</b>${e.tm?`<button class="cl-ib" data-eal="${e.id}" title="Dodaj alarm">🔔</button>`:''}<button class="cl-ib" data-edl="${e.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak wydarzeń w tym dniu.</p>'}</div>
      <div class="cl-eva"><input type="time" class="cl-et"><input type="text" class="cl-etx" maxlength="80" placeholder="Nowe wydarzenie…"><button class="cl-ib cl-eab" title="Dodaj">＋</button></div>`;
  }
  // ===== wspólne =====
  const V={clock:vClock,alarms:vAlarms,timer:vTimer,sw:vSw,cal:vCal};
  const ORDER=TABS.map(x=>x[0]); let shown=null;
  tabs.insertAdjacentHTML('beforeend',TABS.map(([k,n])=>`<button data-t="${k}">${n}</button>`).join(''));
  function moveInd(anim){ const b=tabs.querySelector('button.on'); if(!b) return; ind.style.transition=anim?'':'none'; ind.style.left=b.offsetLeft+'px'; ind.style.width=b.offsetWidth+'px'; }
  new ResizeObserver(()=>moveInd(false)).observe(tabs);
  function draw(dir){   // dir: >0 nowa zakładka jest po prawej, <0 po lewej (animacja przejścia)
    live=null; tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===D.tab));
    const change=shown!==null&&shown!==D.tab;
    if(change&&dir&&!document.body.classList.contains('na-apps')){ const old=body; old.classList.add(dir>0?'o-l':'o-r'); setTimeout(()=>old.remove(),260); body=document.createElement('div'); body.className='cl-pg '+(dir>0?'i-r':'i-l'); holder.appendChild(body); }
    else if(change) body.innerHTML='';
    moveInd(shown!==null); shown=D.tab; (V[D.tab]||vClock)();
  }
  const newAlarm=()=>{ const n=new Date(Date.now()+3600000); return {id:uid(),h:n.getHours(),m:0,date:dkey(n),days:[],note:'',snd:'bell',on:true}; };
  const ring=()=>{ const r=RING[0]; rg.classList.toggle('on',!!r);
    rg.innerHTML=r?`<div class="cl-rb"><div class="cl-rk">${r.timer?'⏲️':'⏰'}</div><b class="cl-rt">${esc(r.t)}</b>${r.n?`<p class="cl-rnt">${esc(r.n)}</p>`:''}${RING.length>1?`<small>+${RING.length-1}</small>`:''}<div class="cl-btns"><button class="cl-off">Wyłącz</button><button class="cl-snz">Drzemka 5 min</button></div></div>`:''; };
  const dismiss=snz=>{ const r=RING.shift(); if(!r) return; if(snz) D.snooze.push({until:Date.now()+300000,t:r.t,n:r.n,snd:r.snd});
    save(); if(RING.length) playSnd(RING[0].snd,true); else { stopSnd(); renderBar(); } ring(); };
  const api={el,ring,refresh(){ if((D.tab==='alarms'&&!edit)||D.tab==='timer') draw(); }}; CLK=api;
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input,select,textarea')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    if(pickOpen&&!e.target.closest('.cl-pk,.cl-mt')){ pickOpen=false; if(D.tab==='cal') draw(); }
    const b=e.target.closest('button'); if(!b) return; const d=b.dataset;
    if(b.classList.contains('cl-off')) return dismiss(false); if(b.classList.contains('cl-snz')) return dismiss(true);
    if(d.t){ const dir=ORDER.indexOf(d.t)-ORDER.indexOf(D.tab); D.tab=d.t; edit=null; pickOpen=false; saveSoon(); return draw(dir); }
    if(d.st){ D.style=d.st; saveSoon(); return draw(); }
    if(b.classList.contains('cl-new')){ edit=newAlarm(); return draw(); }
    if(d.ed){ const a=D.alarms.find(x=>x.id===d.ed); if(a){ edit={...a,days:[...a.days]}; draw(); } return; }
    if(d.rm){ D.alarms=D.alarms.filter(x=>x.id!==d.rm); save(); return draw(); }
    if(d.wd){ const n=+d.wd, i=edit.days.indexOf(n); if(i<0) edit.days.push(n); else edit.days.splice(i,1); return b.classList.toggle('on',i<0); }
    if(b.classList.contains('cl-cn')){ edit=null; return draw(); } if(b.classList.contains('cl-ok')) return saveForm();
    if(b.classList.contains('cl-pv')) return playSnd(body.querySelector('.cl-sn').value,false);
    if(b.classList.contains('cl-pv2')) return playSnd(D.tsnd,false);
    const T=D.timer;
    if(d.pr){ T.dur=+d.pr; T.left=T.dur; T.run=false; saveSoon(); return draw(); }
    if(b.classList.contains('cl-go')){ audio();
      if(!T.run){ if(T.dur<=0) return; if(T.left<=0) T.left=T.dur; T.end=Date.now()+T.left*1000; T.run=true; } else { T.left=Math.max(0,(T.end-Date.now())/1000); T.run=false; }
      save(); return draw(); }
    if(b.classList.contains('cl-rs')){ T.run=false; T.left=T.dur; save(); return draw(); }
    const W=D.sw;
    if(b.classList.contains('cl-sg')){ if(W.run){ W.acc+=Date.now()-W.t0; W.run=false; } else { W.t0=Date.now(); W.run=true; } save(); return draw(); }
    if(b.classList.contains('cl-lp')){ if(!W.run) return; const tot=swEl(), prev=W.laps.length?W.laps[0].tot:0; W.laps.unshift({s:tot-prev,tot}); saveSoon(); return draw(); }
    if(b.classList.contains('cl-rs2')){ W.run=false; W.acc=0; W.laps=[]; save(); return draw(); }
    if(b.classList.contains('cl-mt')){ pickOpen=!pickOpen; pickY=+D.cm.slice(0,4); return draw(); }
    if(d.py){ pickY=+d.py; return draw(); }
    if(d.pm!==undefined){ D.cm=pickY+'-'+pad2(+d.pm+1); pickOpen=false; saveSoon(); return draw(); }
    if(d.m){ const [Y,M]=D.cm.split('-').map(Number), n=new Date(Y,M-1+(+d.m),1); D.cm=dkey(n).slice(0,7); saveSoon(); return draw(); }
    if(b.classList.contains('cl-tdb')){ const n=new Date(); D.sel=dkey(n); D.cm=D.sel.slice(0,7); saveSoon(); return draw(); }
    if(d.d){ D.sel=d.d; if(d.d.slice(0,7)!==D.cm){ D.cm=d.d.slice(0,7); saveSoon(); return draw(); }
      body.querySelectorAll('.cl-d').forEach(x=>x.classList.toggle('sel',x.dataset.d===D.sel)); saveSoon(); return evList(); }
    if(b.classList.contains('cl-eab')){ const tx=body.querySelector('.cl-etx').value.trim(); if(!tx) return body.querySelector('.cl-etx').focus();
      (D.events[D.sel]=D.events[D.sel]||[]).push({id:uid(),tt:tx,tm:body.querySelector('.cl-et').value}); saveSoon(); return draw(); }
    if(d.edl){ D.events[D.sel]=(D.events[D.sel]||[]).filter(x=>x.id!==d.edl); if(!D.events[D.sel].length) delete D.events[D.sel]; saveSoon(); return draw(); }
    if(d.eal){ const ev=(D.events[D.sel]||[]).find(x=>x.id===d.eal); if(!ev||!ev.tm) return;
      if(new Date(D.sel+'T'+ev.tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
      D.alarms.push({id:uid(),h:+ev.tm.slice(0,2),m:+ev.tm.slice(3),date:D.sel,days:[],note:ev.tt,snd:'bell',on:true}); save(); return toast(t('Alarm dodany')); }
  });
  root.addEventListener('change',e=>{ const i=e.target;
    if(i.dataset.tg){ const a=D.alarms.find(x=>x.id===i.dataset.tg); if(!a) return; a.on=i.checked; a.missed=false; a.last='';
      if(a.on&&!a.days.length){ const tm=pad2(a.h)+':'+pad2(a.m); let d=new Date(a.date+'T'+tm+':00'); if(d<=new Date()){ const n=new Date(); if(new Date(dkey(n)+'T'+tm+':00')<=n) n.setDate(n.getDate()+1); a.date=dkey(n); } }
      save(); return draw(); }
    if(i.classList.contains('cl-h24')){ D.h24=i.checked; saveSoon(); }
    else if(i.classList.contains('cl-tsn')){ D.tsnd=i.value; saveSoon(); } });
  root.addEventListener('input',e=>{ const i=e.target; if(!i.classList.contains('cl-n')) return;
    const n=[...body.querySelectorAll('.cl-n')].map(x=>Math.max(0,parseInt(x.value,10)||0)); D.timer.dur=Math.min(359999,n[0]*3600+n[1]*60+n[2]); D.timer.left=D.timer.dur; D.timer.run=false; saveSoon();
    const go=body.querySelector('.cl-go'); if(go) go.disabled=D.timer.dur<=0; body.querySelectorAll('[data-pr]').forEach(x=>x.classList.toggle('on',+x.dataset.pr===D.timer.dur)); });
  let lt=0; const loop=ts=>{ if(!el.isConnected){ if(CLK===api) CLK=null; return; } if(ts-lt>33){ lt=ts; if(live) live(); } requestAnimationFrame(loop); };
  draw(); ring(); requestAnimationFrame(loop);
}

// ===== src/js/15-app-conv.js =====
// ---------- aplikacja: konwerter jednostek ----------
// Jednostka: [symbol, 'pl|en|de|es|fr', współczynnik względem jednostki bazowej kategorii]
const CVN=['pl','en','de','es','fr','he','zh','szl'];
const CU=a=>a.map(([s,n,f])=>({s,n:n.split('|'),f}));
const C_LEN=CU([
 ['m','metr|metre|Meter|metro|mètre',1],['km','kilometr|kilometre|Kilometer|kilómetro|kilomètre',1000],['cm','centymetr|centimetre|Zentimeter|centímetro|centimètre',.01],['mm','milimetr|millimetre|Millimeter|milímetro|millimètre',.001],
 ['µm','mikrometr|micrometre|Mikrometer|micrómetro|micromètre',1e-6],['nm','nanometr|nanometre|Nanometer|nanómetro|nanomètre',1e-9],['pm','pikometr|picometre|Pikometer|picómetro|picomètre',1e-12],['fm','femtometr (fermi)|femtometre (fermi)|Femtometer (Fermi)|femtómetro (fermi)|femtomètre (fermi)',1e-15],
 ['Å','angstrem|ångström|Ångström|ångström|ångström',1e-10],['in','cal|inch|Zoll|pulgada|pouce',.0254],['ft','stopa|foot|Fuß|pie|pied',.3048],['yd','jard|yard|Yard|yarda|yard',.9144],
 ['mi','mila lądowa|mile|Meile|milla|mille',1609.344],['nmi','mila morska|nautical mile|Seemeile|milla náutica|mille marin',1852],['fur','furlong|furlong|Furlong|furlong|furlong',201.168],['ch','łańcuch (chain)|chain|Chain|cadena|chaîne',20.1168],
 ['rd','pręt (rod)|rod|Rute|vara|perche',5.0292],['ftm','sążeń morski (fathom)|fathom|Faden|braza|brasse',1.8288],['lea','liga (league)|league|League|legua|lieue',4828.032],['hand','dłoń (hand)|hand|Hand|palmo|paume',.1016],
 ['cbt','łokieć (cubit)|cubit|Elle|codo|coudée',.4572],['stad','stadion grecki|Greek stadion|Stadion|estadio|stade',185],['vrs','wiorsta|verst|Werst|versta|verste',1066.8],['pt','punkt typograficzny|typographic point|typografischer Punkt|punto tipográfico|point typographique',.000352778],
 ['ls','sekunda świetlna|light-second|Lichtsekunde|segundo luz|seconde-lumière',299792458],['lmin','minuta świetlna|light-minute|Lichtminute|minuto luz|minute-lumière',17987547480],['lh','godzina świetlna|light-hour|Lichtstunde|hora luz|heure-lumière',1079252848800],
 ['au','jednostka astronomiczna|astronomical unit|astronomische Einheit|unidad astronómica|unité astronomique',149597870700],['ly','rok świetlny|light-year|Lichtjahr|año luz|année-lumière',9460730472580800],
 ['pc','parsek|parsec|Parsec|pársec|parsec',30856775814913673],['kpc','kiloparsek|kiloparsec|Kiloparsec|kiloparsec|kiloparsec',3.0856775814913673e19],['Mpc','megaparsek|megaparsec|Megaparsec|megapársec|mégaparsec',3.0856775814913673e22],
 ['R⊕','promień Ziemi|Earth radius|Erdradius|radio terrestre|rayon terrestre',6371008.8],['R☉','promień Słońca|solar radius|Sonnenradius|radio solar|rayon solaire',695700000],['d☾','odległość Ziemia–Księżyc|Earth–Moon distance|Entfernung Erde–Mond|distancia Tierra–Luna|distance Terre–Lune',384400000],
 ['boisko','boisko piłkarskie (długość)|football pitch (length)|Fußballfeld (Länge)|campo de fútbol (largo)|terrain de football (longueur)',105],['ℓP','długość Plancka|Planck length|Planck-Länge|longitud de Planck|longueur de Planck',1.616255e-35]]);
const C_MASS=CU([
 ['kg','kilogram|kilogram|Kilogramm|kilogramo|kilogramme',1],['g','gram|gram|Gramm|gramo|gramme',.001],['mg','miligram|milligram|Milligramm|miligramo|milligramme',1e-6],['µg','mikrogram|microgram|Mikrogramm|microgramo|microgramme',1e-9],
 ['t','tona|tonne|Tonne|tonelada|tonne',1000],['q','kwintal|quintal|Doppelzentner|quintal|quintal',100],['lb','funt|pound|Pfund|libra|livre',.45359237],['oz','uncja|ounce|Unze|onza|once',.028349523125],
 ['st','stone|stone|Stone|stone|stone',6.35029318],['tn','tona amerykańska (short ton)|US short ton|US-Tonne|tonelada corta|tonne courte',907.18474],['ton','tona brytyjska (long ton)|long ton|britische Tonne|tonelada larga|tonne longue',1016.0469088],
 ['ct','karat|carat|Karat|quilate|carat',.0002],['gr','gran (grain)|grain|Grain|grano|grain',6.479891e-5],['dr','dram|dram|Dram|dracma|gros',.0017718451953125],['ozt','uncja trojańska|troy ounce|Feinunze|onza troy|once troy',.0311034768],
 ['lbt','funt trojański|troy pound|Troy-Pfund|libra troy|livre troy',.3732417216],['dwt','pennyweight|pennyweight|Pennyweight|pennyweight|pennyweight',.00155517384],['slug','slug|slug|Slug|slug|slug',14.5939029372],
 ['u','jednostka masy atomowej (dalton)|atomic mass unit (dalton)|atomare Masseneinheit (Dalton)|unidad de masa atómica (dalton)|unité de masse atomique (dalton)',1.66053906892e-27],['me','masa elektronu|electron mass|Elektronenmasse|masa del electrón|masse de l’électron',9.1093837139e-31],
 ['mp','masa protonu|proton mass|Protonenmasse|masa del protón|masse du proton',1.67262192595e-27],['mP','masa Plancka|Planck mass|Planck-Masse|masa de Planck|masse de Planck',2.176434e-8],
 ['M☾','masa Księżyca|lunar mass|Mondmasse|masa lunar|masse lunaire',7.342e22],['M⊕','masa Ziemi|Earth mass|Erdmasse|masa terrestre|masse terrestre',5.9722e24],['M♃','masa Jowisza|Jupiter mass|Jupitermasse|masa de Júpiter|masse de Jupiter',1.89813e27],['M☉','masa Słońca|solar mass|Sonnenmasse|masa solar|masse solaire',1.98841e30]]);
const C_VOL=CU([
 ['L','litr|litre|Liter|litro|litre',1],['mL','mililitr|millilitre|Milliliter|mililitro|millilitre',.001],['cL','centylitr|centilitre|Zentiliter|centilitro|centilitre',.01],['dL','decylitr|decilitre|Deziliter|decilitro|décilitre',.1],['hL','hektolitr|hectolitre|Hektoliter|hectolitro|hectolitre',100],
 ['m³','metr sześcienny|cubic metre|Kubikmeter|metro cúbico|mètre cube',1000],['cm³','centymetr sześcienny|cubic centimetre|Kubikzentimeter|centímetro cúbico|centimètre cube',.001],['mm³','milimetr sześcienny|cubic millimetre|Kubikmillimeter|milímetro cúbico|millimètre cube',1e-6],['km³','kilometr sześcienny|cubic kilometre|Kubikkilometer|kilómetro cúbico|kilomètre cube',1e12],
 ['in³','cal sześcienny|cubic inch|Kubikzoll|pulgada cúbica|pouce cube',.016387064],['ft³','stopa sześcienna|cubic foot|Kubikfuß|pie cúbico|pied cube',28.316846592],['yd³','jard sześcienny|cubic yard|Kubikyard|yarda cúbica|yard cube',764.554857984],
 ['gal','galon amerykański|US gallon|US-Gallone|galón estadounidense|gallon américain',3.785411784],['galUK','galon brytyjski|imperial gallon|britische Gallone|galón imperial|gallon impérial',4.54609],
 ['qt','kwarta amerykańska|US quart|US-Quart|cuarto de galón (EE. UU.)|quart américain',.946352946],['pt US','pinta amerykańska|US pint|US-Pint|pinta (EE. UU.)|pinte américaine',.473176473],['pt UK','pinta brytyjska|imperial pint|britische Pinte|pinta imperial|pinte impériale',.56826125],
 ['cup','szklanka amerykańska (cup)|US cup|US-Cup|taza (EE. UU.)|tasse américaine',.2365882365],['gill','gill amerykański|US gill|US-Gill|gill (EE. UU.)|gill américain',.1182941183],['fl oz US','uncja płynu (US)|US fluid ounce|US-Flüssigunze|onza líquida (EE. UU.)|once liquide américaine',.0295735295625],
 ['fl oz UK','uncja płynu (UK)|imperial fluid ounce|britische Flüssigunze|onza líquida imperial|once liquide impériale',.0284130625],['tbsp','łyżka stołowa (US)|US tablespoon|US-Esslöffel|cucharada (EE. UU.)|cuillère à soupe (US)',.01478676478125],['tsp','łyżeczka (US)|US teaspoon|US-Teelöffel|cucharadita (EE. UU.)|cuillère à café (US)',.00492892159375],
 ['łyż','łyżka (15 mL)|metric tablespoon (15 mL)|metrischer Esslöffel (15 ml)|cucharada métrica (15 ml)|cuillère à soupe métrique (15 ml)',.015],['szkl','szklanka (250 mL)|metric cup (250 mL)|metrische Tasse (250 ml)|taza métrica (250 ml)|tasse métrique (250 ml)',.25],
 ['kr','kropla (ok. 0,05 mL)|drop (approx. 0.05 mL)|Tropfen (ca. 0,05 ml)|gota (aprox. 0,05 ml)|goutte (env. 0,05 ml)',5e-5],['bbl','baryłka ropy|oil barrel|Ölfass|barril de petróleo|baril de pétrole',158.987294928],
 ['bu','buszel amerykański|US bushel|US-Bushel|bushel (EE. UU.)|boisseau américain',35.23907016688],['pk','peck amerykański|US peck|US-Peck|peck (EE. UU.)|peck américain',8.80976754172],['hhd','hogshead|hogshead|Hogshead|hogshead|hogshead',238.4809423],
 ['wine','butelka wina (0,75 L)|wine bottle (0.75 L)|Weinflasche (0,75 l)|botella de vino (0,75 l)|bouteille de vin (0,75 l)',.75],['mag','magnum (1,5 L)|magnum (1.5 L)|Magnum (1,5 l)|magnum (1,5 l)|magnum (1,5 l)',1.5],['neb','nabuchodonozor (15 L)|Nebuchadnezzar (15 L)|Nebukadnezar (15 l)|nabucodonosor (15 l)|Nabuchodonosor (15 l)',15],
 ['ac ft','akr-stopa|acre-foot|Acre-Foot|acre-pie|acre-pied',1233481.83754752],['pool','basen olimpijski|Olympic swimming pool|olympisches Schwimmbecken|piscina olímpica|piscine olympique',2500000]]);
const C_TIME=CU([
 ['s','sekunda|second|Sekunde|segundo|seconde',1],['ms','milisekunda|millisecond|Millisekunde|milisegundo|milliseconde',.001],['µs','mikrosekunda|microsecond|Mikrosekunde|microsegundo|microseconde',1e-6],['ns','nanosekunda|nanosecond|Nanosekunde|nanosegundo|nanoseconde',1e-9],['ps','pikosekunda|picosecond|Pikosekunde|picosegundo|picoseconde',1e-12],
 ['min','minuta|minute|Minute|minuto|minute',60],['h','godzina|hour|Stunde|hora|heure',3600],['d','doba|day|Tag|día|jour',86400],['wk','tydzień|week|Woche|semana|semaine',604800],['fn','dwa tygodnie (fortnight)|fortnight|vierzehn Tage|quincena|quinzaine',1209600],
 ['mo','miesiąc (średni)|month (average)|Monat (Durchschnitt)|mes (promedio)|mois (moyen)',2629746],['yr','rok (gregoriański)|year (Gregorian)|Jahr (gregorianisch)|año (gregoriano)|année (grégorienne)',31556952],['yrJ','rok juliański|Julian year|julianisches Jahr|año juliano|année julienne',31557600],
 ['yrS','rok gwiazdowy|sidereal year|Sternjahr|año sidéreo|année sidérale',31558149.76],['dec','dekada|decade|Jahrzehnt|década|décennie',315569520],['cen','wiek|century|Jahrhundert|siglo|siècle',3155695200],['mil','tysiąclecie|millennium|Jahrtausend|milenio|millénaire',31556952000],
 ['qh','kwadrans|quarter of an hour|Viertelstunde|cuarto de hora|quart d’heure',900],['sd','doba gwiazdowa|sidereal day|Sternentag|día sidéreo|jour sidéral',86164.0905],['sol','dzień marsjański (sol)|Martian day (sol)|Marstag (Sol)|día marciano (sol)|jour martien (sol)',88775.244],
 ['chk','chelek (hebrajski)|chelek (Hebrew)|Chelek (hebräisch)|jélek (hebreo)|héleq (hébreu)',10/3],['ke','ke (chiński)|ke (Chinese)|Ke (chinesisch)|ke (chino)|ke (chinois)',864],['shk','shake|shake|Shake|shake|shake',1e-8],['jif','jiffy (1/60 s)|jiffy (1/60 s)|Jiffy (1/60 s)|jiffy (1/60 s)|jiffy (1/60 s)',1/60],
 ['tP','czas Plancka|Planck time|Planck-Zeit|tiempo de Planck|temps de Planck',5.391247e-44],['Uni','wiek Wszechświata|age of the Universe|Alter des Universums|edad del Universo|âge de l’Univers',4.3508e17]]);
const C_AREA=CU([
 ['m²','metr kwadratowy|square metre|Quadratmeter|metro cuadrado|mètre carré',1],['km²','kilometr kwadratowy|square kilometre|Quadratkilometer|kilómetro cuadrado|kilomètre carré',1e6],['cm²','centymetr kwadratowy|square centimetre|Quadratzentimeter|centímetro cuadrado|centimètre carré',1e-4],['mm²','milimetr kwadratowy|square millimetre|Quadratmillimeter|milímetro cuadrado|millimètre carré',1e-6],
 ['ha','hektar|hectare|Hektar|hectárea|hectare',1e4],['a','ar|are|Ar|área|are',100],['dun','dunam|dunam|Dunam|dunam|dounam',1000],['ac','akr|acre|Acre|acre|acre',4046.8564224],['rood','rood|rood|Rood|rood|rood',1011.7141056],
 ['in²','cal kwadratowy|square inch|Quadratzoll|pulgada cuadrada|pouce carré',6.4516e-4],['ft²','stopa kwadratowa|square foot|Quadratfuß|pie cuadrado|pied carré',.09290304],['yd²','jard kwadratowy|square yard|Quadratyard|yarda cuadrada|yard carré',.83612736],
 ['mi²','mila kwadratowa|square mile|Quadratmeile|milla cuadrada|mille carré',2589988.110336],['twp','township (36 mi²)|township (36 mi²)|Township (36 mi²)|township (36 mi²)|township (36 mi²)',93239571.972],['morga','morga pruska|Prussian morgen|preußischer Morgen|morgen prusiano|morgen prussien',2553.22],
 ['tsubo','tsubo|tsubo|Tsubo|tsubo|tsubo',3.30578512],['cmil','circular mil|circular mil|Circular Mil|circular mil|circular mil',5.067075e-10],['barn','barn|barn|Barn|barn|barn',1e-28],['shed','shed|shed|Shed|shed|shed',1e-52],['pitch','boisko piłkarskie|football pitch|Fußballfeld|campo de fútbol|terrain de football',7140]]);
const KT={ // temperatura: przeliczenia przez kelwiny
 C:[v=>v+273.15,k=>k-273.15],K:[v=>v,k=>k],F:[v=>(v+459.67)*5/9,k=>k*9/5-459.67],R:[v=>v*5/9,k=>k*9/5],Re:[v=>v*1.25+273.15,k=>(k-273.15)*.8],
 De:[v=>373.15-v*2/3,k=>(373.15-k)*1.5],N:[v=>v*100/33+273.15,k=>(k-273.15)*.33],Ro:[v=>(v-7.5)*40/21+273.15,k=>(k-273.15)*21/40+7.5],TP:[v=>v*1.416784e32,k=>k/1.416784e32]};
const C_TEMP=[['C','stopień Celsjusza|degree Celsius|Grad Celsius|grado Celsius|degré Celsius','°C'],['K','kelwin|kelvin|Kelvin|kelvin|kelvin','K'],['F','stopień Fahrenheita|degree Fahrenheit|Grad Fahrenheit|grado Fahrenheit|degré Fahrenheit','°F'],
 ['R','stopień Rankine’a|degree Rankine|Grad Rankine|grado Rankine|degré Rankine','°R'],['Re','stopień Réaumura|degree Réaumur|Grad Réaumur|grado Réaumur|degré Réaumur','°Ré'],['De','stopień Delisle’a|degree Delisle|Grad Delisle|grado Delisle|degré Delisle','°De'],
 ['N','stopień Newtona|degree Newton|Grad Newton|grado Newton|degré Newton','°N'],['Ro','stopień Rømera|degree Rømer|Grad Rømer|grado Rømer|degré Rømer','°Rø'],['TP','temperatura Plancka|Planck temperature|Planck-Temperatur|temperatura de Planck|température de Planck','T_P']]
 .map(([k,n,s])=>({s,n:n.split('|'),to:KT[k][0],from:KT[k][1]}));
const C_SPEED=CU([
 ['m/s','metr na sekundę|metre per second|Meter pro Sekunde|metro por segundo|mètre par seconde',1],['km/h','kilometr na godzinę|kilometre per hour|Kilometer pro Stunde|kilómetro por hora|kilomètre par heure',1/3.6],['mph','mila na godzinę|mile per hour|Meile pro Stunde|milla por hora|mille par heure',.44704],
 ['kn','węzeł|knot|Knoten|nudo|nœud',1852/3600],['ft/s','stopa na sekundę|foot per second|Fuß pro Sekunde|pie por segundo|pied par seconde',.3048],['km/s','kilometr na sekundę|kilometre per second|Kilometer pro Sekunde|kilómetro por segundo|kilomètre par seconde',1000],
 ['cm/s','centymetr na sekundę|centimetre per second|Zentimeter pro Sekunde|centímetro por segundo|centimètre par seconde',.01],['Ma','Mach (poziom morza, 15 °C)|Mach (sea level, 15 °C)|Mach (Meereshöhe, 15 °C)|Mach (nivel del mar, 15 °C)|Mach (niveau de la mer, 15 °C)',340.29],
 ['c','prędkość światła|speed of light|Lichtgeschwindigkeit|velocidad de la luz|vitesse de la lumière',299792458],['v⊕','prędkość ucieczki z Ziemi|Earth escape velocity|Fluchtgeschwindigkeit der Erde|velocidad de escape de la Tierra|vitesse de libération terrestre',11186],
 ['vorb','prędkość orbitalna Ziemi|Earth orbital speed|Bahngeschwindigkeit der Erde|velocidad orbital de la Tierra|vitesse orbitale de la Terre',29780],['f/f','furlong na dwa tygodnie|furlong per fortnight|Furlong pro vierzehn Tage|furlong por quincena|furlong par quinzaine',201.168/1209600]]);
const C_DATA=(()=>{ const B=['bajt|byte|Byte|byte|octet'.split('|'),'bit|bit|Bit|bit|bit'.split('|')], out=[{s:'bit',n:B[1],f:1},{s:'nibble',n:'półbajt (nibble)|nibble|Nibble|nibble|quartet'.split('|'),f:4},{s:'B',n:B[0],f:8}];
  const P=[['k','kilo|kilo|Kilo|kilo|kilo'],['M','mega|mega|Mega|mega|méga'],['G','giga|giga|Giga|giga|giga'],['T','tera|tera|Tera|tera|téra'],['P','peta|peta|Peta|peta|péta'],['E','eksa|exa|Exa|exa|exa']].map(([s,n])=>[s,n.split('|')]);
  const I=['kibi','mebi','gibi','tebi','pebi','exbi'], nm=(p,b,i)=>i===2?p+b.toLowerCase():p+b;
  P.forEach(([s,pn],k)=>{ out.push({s:s+'B',n:B[0].map((b,i)=>nm(pn[i],b,i)),f:8*Math.pow(1000,k+1)}); out.push({s:(s==='k'?'K':s)+'iB',n:B[0].map((b,i)=>(i===2?capF(I[k])+b.toLowerCase():I[k]+b)),f:8*Math.pow(1024,k+1)}); });
  P.forEach(([s,pn],k)=>out.push({s:s+'b',n:B[1].map((b,i)=>nm(pn[i],b,i)),f:Math.pow(1000,k+1)}));
  return out; })();
const C_ENERGY=CU([
 ['J','dżul|joule|Joule|julio|joule',1],['kJ','kilodżul|kilojoule|Kilojoule|kilojulio|kilojoule',1000],['MJ','megadżul|megajoule|Megajoule|megajulio|mégajoule',1e6],['cal','kaloria (mała)|calorie|Kalorie|caloría|calorie',4.184],['kcal','kilokaloria|kilocalorie|Kilokalorie|kilocaloría|kilocalorie',4184],
 ['Wh','watogodzina|watt-hour|Wattstunde|vatio-hora|wattheure',3600],['kWh','kilowatogodzina|kilowatt-hour|Kilowattstunde|kilovatio-hora|kilowattheure',3.6e6],['MWh','megawatogodzina|megawatt-hour|Megawattstunde|megavatio-hora|mégawattheure',3.6e9],
 ['eV','elektronowolt|electronvolt|Elektronenvolt|electronvoltio|électronvolt',1.602176634e-19],['keV','kiloelektronowolt|kiloelectronvolt|Kiloelektronenvolt|kiloelectronvoltio|kiloélectronvolt',1.602176634e-16],['MeV','megaelektronowolt|megaelectronvolt|Megaelektronenvolt|megaelectronvoltio|mégaélectronvolt',1.602176634e-13],
 ['erg','erg|erg|Erg|ergio|erg',1e-7],['BTU','brytyjska jednostka cieplna (BTU)|British thermal unit (BTU)|British Thermal Unit (BTU)|unidad térmica británica (BTU)|British thermal unit (BTU)',1055.05585262],['therm','therm (US)|therm (US)|Therm (US)|therm (EE. UU.)|therm (US)',105480400],
 ['ft·lbf','stopofunt-siła|foot-pound force|Fuß-Pfund-Kraft|libra-pie|pied-livre-force',1.3558179483314004],['L·atm','litroatmosfera|litre-atmosphere|Literatmosphäre|litro-atmósfera|litre-atmosphère',101.325],['hp·h','koń mechaniczny na godzinę|horsepower-hour|Pferdestärkenstunde|caballo de vapor-hora|cheval-vapeur-heure',2684519.537696],
 ['toe','tona ekwiwalentu ropy|tonne of oil equivalent|Tonne Öläquivalent|tonelada equivalente de petróleo|tonne d’équivalent pétrole',4.1868e10],['tTNT','tona trotylu (TNT)|ton of TNT|Tonne TNT|tonelada de TNT|tonne de TNT',4.184e9],['MtTNT','megatona trotylu|megaton of TNT|Megatonne TNT|megatonelada de TNT|mégatonne de TNT',4.184e15],
 ['Eh','hartree|hartree|Hartree|hartree|hartree',4.3597447222e-18],['Ry','rydberg|rydberg|Rydberg|rydberg|rydberg',2.1798723611e-18],['EP','energia Plancka|Planck energy|Planck-Energie|energía de Planck|énergie de Planck',1.9561e9],['foe','foe (10^44 J)|foe (10^44 J)|Foe (10^44 J)|foe (10^44 J)|foe (10^44 J)',1e44]]);
const C_PRES=CU([
 ['Pa','paskal|pascal|Pascal|pascal|pascal',1],['hPa','hektopaskal|hectopascal|Hektopascal|hectopascal|hectopascal',100],['kPa','kilopaskal|kilopascal|Kilopascal|kilopascal|kilopascal',1000],['MPa','megapaskal|megapascal|Megapascal|megapascal|mégapascal',1e6],['GPa','gigapaskal|gigapascal|Gigapascal|gigapascal|gigapascal',1e9],
 ['bar','bar|bar|Bar|bar|bar',1e5],['mbar','milibar|millibar|Millibar|milibar|millibar',100],['atm','atmosfera fizyczna|standard atmosphere|physikalische Atmosphäre|atmósfera estándar|atmosphère normale',101325],['at','atmosfera techniczna|technical atmosphere|technische Atmosphäre|atmósfera técnica|atmosphère technique',98066.5],
 ['mmHg','milimetr słupa rtęci|millimetre of mercury|Millimeter Quecksilbersäule|milímetro de mercurio|millimètre de mercure',133.322387415],['Torr','tor|torr|Torr|torr|torr',101325/760],['inHg','cal słupa rtęci|inch of mercury|Zoll Quecksilbersäule|pulgada de mercurio|pouce de mercure',3386.389],
 ['psi','funt na cal kwadratowy (psi)|pound per square inch (psi)|Pfund pro Quadratzoll (psi)|libra por pulgada cuadrada (psi)|livre par pouce carré (psi)',6894.757293168],['ksi','kilofunt na cal kwadratowy (ksi)|kilopound per square inch (ksi)|Kilopfund pro Quadratzoll (ksi)|kilolibra por pulgada cuadrada (ksi)|kilolivre par pouce carré (ksi)',6894757.293168],
 ['inH₂O','cal słupa wody|inch of water|Zoll Wassersäule|pulgada de agua|pouce d’eau',249.08891],['mmH₂O','milimetr słupa wody|millimetre of water|Millimeter Wassersäule|milímetro de agua|millimètre d’eau',9.80665],['Ba','barie|barye|Barye|baria|barye',.1]]);
const CATS=[
 {id:'len',ic:'📏',n:'Długość',u:C_LEN,df:['km','mi']},{id:'mass',ic:'⚖️',n:'Waga i masa',u:C_MASS,df:['kg','lb']},{id:'vol',ic:'🧪',n:'Objętość',u:C_VOL,df:['L','gal']},
 {id:'time',ic:'⏳',n:'Czas',u:C_TIME,df:['h','min']},{id:'area',ic:'🗺️',n:'Powierzchnia',u:C_AREA,df:['m²','ft²']},{id:'temp',ic:'🌡️',n:'Temperatura',u:C_TEMP,df:['C','F'],tmp:1},
 {id:'speed',ic:'🚀',n:'Prędkość',u:C_SPEED,df:['km/h','mph']},{id:'data',ic:'💾',n:'Dane',u:C_DATA,df:['GB','MiB']},{id:'en',ic:'⚡',n:'Energia',u:C_ENERGY,df:['kcal','kJ']},{id:'pres',ic:'🎈',n:'Ciśnienie',u:C_PRES,df:['bar','psi']},{id:'fx',ic:'💱',n:'Waluty',u:[],df:['PLN','USD']}];
// temperatura ma symbole ze znakiem stopnia; df wskazuje klucze C/F, więc mapujemy je na symbole
CATS.find(c=>c.id==='temp').df=['°C','°F'];
const IUN={m:'meter',km:'kilometer',cm:'centimeter',mm:'millimeter','in':'inch',ft:'foot',yd:'yard',mi:'mile',kg:'kilogram',g:'gram',lb:'pound',oz:'ounce',st:'stone',L:'liter',mL:'milliliter',gal:'gallon','fl oz US':'fluid-ounce',
  s:'second',ms:'millisecond','µs':'microsecond',ns:'nanosecond',min:'minute',h:'hour',d:'day',wk:'week',mo:'month',yr:'year',ha:'hectare',ac:'acre','°C':'celsius','°F':'fahrenheit','km/h':'kilometer-per-hour',mph:'mile-per-hour','m/s':'meter-per-second',
  bit:'bit',B:'byte',kB:'kilobyte',MB:'megabyte',GB:'gigabyte',TB:'terabyte',PB:'petabyte',kb:'kilobit',Mb:'megabit',Gb:'gigabit',Tb:'terabit'};
const IUC={};
function unitIntl(sym,loc){ const id=IUN[sym]; if(!id) return null; const k=loc+'|'+id; if(k in IUC) return IUC[k]; let r=null;
  try{ const p=new Intl.NumberFormat(loc,{style:'unit',unit:id,unitDisplay:'long'}).formatToParts(1).find(x=>x.type==='unit'); r=(p&&p.value.trim())||null; }catch{} return IUC[k]=r; }
function cvFmt(n,L,sig){ sig=sig||12; if(!isFinite(n)) return '—'; if(n===0) return '0'; const a=Math.abs(n), dec=(1.1).toLocaleString(L).charAt(1);
  if(a>=1e15||a<1e-6) return n.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e').replace('.',dec);
  return n.toLocaleString(L,{maximumSignificantDigits:sig}); }
// ---------- waluty: kursy pobiera proces główny (bez CORS), wynik trafia do pamięci podręcznej w S ----------
// Waluty o kursie ustalonym prawnie: [waluta bazowa, ile jednostek bazowych to 1 taka jednostka]
const FIXED={PLZ:['PLN',1e-4],DEM:['EUR',1/1.95583],FRF:['EUR',1/6.55957],ITL:['EUR',1/1936.27],ESP:['EUR',1/166.386],NLG:['EUR',1/2.20371],ATS:['EUR',1/13.7603],BEF:['EUR',1/40.3399],FIM:['EUR',1/5.94573],
 IEP:['EUR',1/.787564],PTE:['EUR',1/200.482],GRD:['EUR',1/340.75],LUF:['EUR',1/40.3399],SIT:['EUR',1/239.64],CYP:['EUR',1/.585274],MTL:['EUR',1/.4293],SKK:['EUR',1/30.126],EEK:['EUR',1/15.6466],LVL:['EUR',1/.702804],
 LTL:['EUR',1/3.4528],HRK:['EUR',1/7.5345],RUR:['RUB',1e-3],TRL:['TRY',1e-6],ROL:['RON',1e-4],BYR:['BYN',1e-4],AZM:['AZN',1/5000],TMM:['TMT',1/5000],MZM:['MZN',1e-3],GHC:['GHS',1e-4],SRG:['SRD',1e-3],MGF:['MGA',1/5]};
const PLZN=['złoty przed denominacją (do 1994)','Polish złoty before redenomination (to 1994)','Złoty vor der Denominierung (bis 1994)','esloti antes de la desnominación (hasta 1994)','złoty avant la dénomination (jusqu’en 1994)','זלוטי פולני לפני הדנומינציה (עד 1994)','波蘭茲羅提（1994 年面額改革前）','złoty przed denominacyjōm (do 1994)'];
const FXPRI=['PLN','PLZ','USD','EUR','GBP','CHF','CZK','UAH','NOK','SEK','DKK','HUF','JPY','CNY','CAD','AUD','TRY','RUB'];
const FXR=[['1M',30],['3M',90],['1R',365],['5L',1825]];
const FXCH=new Map();
const CVORD=['len','area','vol','mass','time','speed','temp','pres','en','data','fx'];   // kolejność tematyczna w panelu   // wykresy w pamięci na czas sesji
function mountConv(el,w){
  const LC=S.settings.ui.lang, L=IL(), li=Math.max(0,CVN.indexOf(LC)), D=(S.aw.data.conv=S.aw.data.conv||{cat:'len',f:{},t:{},v:'1'});
  if(!CATS.find(c=>c.id===D.cat)) D.cat='len'; if(D.slot!=='f'&&D.slot!=='t') D.slot='f'; if(!D.rg) D.rg=30;
  el.innerHTML=`<div class="cvw"><div class="cv" tabindex="0"><div class="cv-top"><button class="cv-mn" title="Kategorie">☰</button><b class="cv-cn"></b></div><div class="cv-main">
    <div class="cv-row" data-slot="f"><input class="cv-in" inputmode="decimal" spellcheck="false" autocomplete="off"><button class="cv-u" data-slot="f"></button></div>
    <button class="cv-sw" title="Zamień jednostki">⇅</button>
    <div class="cv-row" data-slot="t"><div class="cv-out"></div><button class="cv-u" data-slot="t"></button><button class="cv-cp" title="Kopiuj wynik">⧉</button></div>
    <div class="cv-eq"></div></div><div class="cv-fx"></div>
    <div class="cv-all"><div class="cv-ah"><b class="cv-hd"></b><input class="cv-q" placeholder="Szukaj jednostki…" spellcheck="false"></div><div class="cv-al"></div></div></div><div class="cv-bk"></div><div class="cv-dr"><div class="cv-dh">Kategorie</div><div class="cv-di"></div></div></div>`;
  const wrap=el.firstElementChild, root=wrap.querySelector('.cv'), cats=wrap.querySelector('.cv-di'), cname=wrap.querySelector('.cv-cn'), inp=root.querySelector('.cv-in'), out=root.querySelector('.cv-out'), eq=root.querySelector('.cv-eq'), fxb=root.querySelector('.cv-fx'), al=root.querySelector('.cv-al'), q=root.querySelector('.cv-q'), hd=root.querySelector('.cv-hd');
  const cat=()=>CATS.find(c=>c.id===D.cat), nm=u=>u.n[li]||unitIntl(u.s,L)||(LC==='szl'?u.n[0]:(u.n[1]||u.n[0])), un=(c,s)=>c.u.find(x=>x.s===s)||c.u[0], cur=slot=>un(cat(),D[slot][D.cat]);
  const conv=(v,c,a,b)=>c.tmp?b.from(a.to(v)):v*a.f/b.f;
  const num=()=>{ const s=D.v.trim().replace(/\s/g,'').replace(',','.'); return s===''||s==='-'?NaN:Number(s); };
  const F=()=>D.fx||(D.fx={});
  let fxBusy=false, fxErr='', tok=0;
  // --- lista walut z kursów ---
  function fxBuild(){
    const C=CATS.find(c=>c.id==='fx'), R=F().rates; if(!R){ C.u=[]; return; }
    let dn=null; try{ dn=new Intl.DisplayNames([L],{type:'currency'}); }catch{}
    const name=c=>{ if(c==='PLZ') return PLZN[li]; let n=c; try{ n=(dn&&dn.of(c))||c; }catch{} return capF(n); }, u=[];
    Object.keys(R).forEach(c=>{ if(!FIXED[c]&&R[c]>0) u.push({s:c,n:[name(c)],f:1/R[c]}); });
    Object.keys(FIXED).forEach(c=>{ const [b,m]=FIXED[c]; if(R[b]>0) u.push({s:c,n:[name(c)],f:m/R[b]}); });
    u.sort((a,b)=>{ const x=FXPRI.indexOf(a.s), y=FXPRI.indexOf(b.s); if(x>=0||y>=0) return (x<0?99:x)-(y<0?99:y); return a.n[0].localeCompare(b.n[0],L); });
    C.u=u;
  }
  async function fxFetch(force){
    const f=F(); if(!force&&f.rates&&Date.now()-(f.ts||0)<6*3600e3) return;
    fxBusy=true; fxErr=''; fxPanel();
    try{ const r=await window.api.httpGet('https://open.er-api.com/v6/latest/USD'); if(!r||!r.ok) throw new Error(r&&r.err||'net');
      const j=JSON.parse(r.body); if(j.result!=='success'||!j.rates) throw new Error('bad'); f.rates=j.rates; f.ts=Date.now(); f.upd=j.time_last_update_utc||''; save(); }
    catch(e){ fxErr=String(e.message||e); }
    fxBusy=false; if(!el.isConnected) return; fxBuild(); if(D.cat==='fx'){ drawSel(); run(); renderList(false); fxPanel(); }
  }
  const mk=c=>FIXED[c]?{code:FIXED[c][0],m:FIXED[c][1]}:{code:c,m:1};
  async function fxSeries(a,b,days){
    const A=mk(a.s), B=mk(b.s); if(A.code===B.code) return {flat:1};
    const key=A.code+B.code+days; if(FXCH.has(key)) return FXCH.get(key);
    const f=F(); if(!f.ecb){ const r=await window.api.httpGet('https://api.frankfurter.dev/v1/currencies'); if(!r||!r.ok) throw new Error('net'); f.ecb=Object.keys(JSON.parse(r.body)); if(!f.ecb.includes('EUR')) f.ecb.push('EUR'); save(); }
    if(!f.ecb.includes(A.code)||!f.ecb.includes(B.code)) return {none:1};
    const r=await window.api.httpGet(`https://api.frankfurter.dev/v1/${dkey(new Date(Date.now()-days*864e5))}..${dkey(new Date())}?base=${A.code}&symbols=${B.code}`); if(!r||!r.ok) throw new Error('net');
    const j=JSON.parse(r.body), pts=Object.keys(j.rates||{}).sort().map(d=>[d,j.rates[d][B.code]*A.m/B.m]); const o=pts.length>1?{pts}:{none:1}; FXCH.set(key,o); return o;
  }
  function chartSvg(pts){
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1, n=pts.length, X=i=>i/(n-1)*300, Y=v=>6+(1-(v-mn)/sp)*88;
    const path=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
    return `<div class="cv-cw"><div class="cv-sv"><svg class="cv-svg" viewBox="0 0 300 100" preserveAspectRatio="none"><defs><linearGradient id="cvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--acc);stop-opacity:0"/></linearGradient></defs>
      <path d="${path}L300 100L0 100Z" fill="url(#cvg)"/><path d="${path}" class="cv-ln"/><line class="cv-xl" y1="0" y2="100" x1="-9" x2="-9"/></svg><i class="cv-dot"></i></div><div class="cv-ya"><span>${cvFmt(mx,L,5)}</span><span>${cvFmt(mn,L,5)}</span></div></div><div class="cv-tt"> </div>`;
  }
  function bindChart(host,pts){
    const sv=host.querySelector('.cv-sv'); if(!sv) return; const dot=host.querySelector('.cv-dot'), xl=host.querySelector('.cv-xl'), tt=host.querySelector('.cv-tt'), n=pts.length, b=cur('t');
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1;
    const show=i=>{ const p=pts[i], x=i/(n-1); dot.style.left=(x*100)+'%'; dot.style.top=(6+(1-(p[1]-mn)/sp)*88)+'%'; xl.setAttribute('x1',x*300); xl.setAttribute('x2',x*300);
      tt.textContent=new Date(p[0]+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'})+' · '+cvFmt(p[1],L,6)+' '+b.s; };
    show(n-1);
    sv.addEventListener('mousemove',e=>{ const r=sv.getBoundingClientRect(); show(Math.max(0,Math.min(n-1,Math.round((e.clientX-r.left)/r.width*(n-1))))); });
    sv.addEventListener('mouseleave',()=>show(n-1));
  }
  async function loadChart(){
    const host=fxb.querySelector('.cv-chart'); if(!host) return; const c=cat(), a=un(c,D.f.fx), b=un(c,D.t.fx), my=++tok; host.innerHTML='<p class="hint">…</p>';
    try{ const o=await fxSeries(a,b,D.rg); if(my!==tok||!el.isConnected) return;
      if(o.flat) host.innerHTML=`<p class="hint">${t('Kurs stały (wartość ustalona prawnie).')}</p>`; else if(o.none) host.innerHTML=`<p class="hint">${t('Wykres niedostępny dla tej pary walut.')}</p>`; else { host.innerHTML=chartSvg(o.pts); bindChart(host,o.pts); } }
    catch{ if(my===tok&&el.isConnected) host.innerHTML=`<p class="hint">${t('Nie udało się pobrać wykresu.')}</p>`; }
  }
  function fxPanel(){
    if(D.cat!=='fx'){ fxb.innerHTML=''; return; }
    const c=cat(), f=F();
    if(!c.u.length){ fxb.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):t('Brak kursów. Sprawdź połączenie z internetem.')}</p>${fxBusy?'':`<button class="cv-rt">${t('Spróbuj ponownie')}</button>`}`; return; }
    const a=un(c,D.f.fx), b=un(c,D.t.fx), when=f.ts?new Date(f.ts).toLocaleString(L,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
    fxb.innerHTML=`<div class="cv-fa">${esc(t('{a} to w przeliczeniu').replace('{a}','1 '+nm(a)))}</div><div class="cv-fb">${esc(cvFmt(a.f/b.f,L,6))} ${esc(nm(b))}</div>
      <div class="cv-fc">${esc(fxErr?t('Kursy z pamięci (brak połączenia)')+' · '+when:t('Aktualizacja: {d}').replace('{d}',when))} · Rates By Exchange Rate API</div>
      <div class="cv-rg">${FXR.map(([k,d])=>`<button data-r="${d}" class="${D.rg===d?'on':''}">${t(k)}</button>`).join('')}</div><div class="cv-chart"></div>`;
    loadChart();
  }
  // --- widok ---
  function drawCats(){ cats.innerHTML=CVORD.map(id=>CATS.find(c=>c.id===id)).map(c=>`<button data-c="${c.id}" class="${c.id===D.cat?'on':''}"><i>${c.ic}</i><span>${t(c.n)}</span></button>`).join(''); const c=cat(); cname.textContent=c.ic+' '+t(c.n); }
  function drawSel(){ const c=cat(); if(!c.u.length){ root.querySelectorAll('.cv-u').forEach(b=>{ b.textContent='—'; }); return; }
    D.f[c.id]=un(c,D.f[c.id]||c.df[0]).s; D.t[c.id]=un(c,D.t[c.id]||c.df[1]).s;
    root.querySelectorAll('.cv-u').forEach(b=>{ const u=cur(b.dataset.slot); b.textContent=`${nm(u)} (${u.s})`; }); }
  function setSlotUI(){ root.querySelectorAll('.cv-row').forEach(r=>r.classList.toggle('act',r.dataset.slot===D.slot)); hd.textContent=t(D.slot==='f'?'Przeliczasz z:':'Przeliczasz na:'); }
  function run(){ const c=cat(); if(!c.u.length){ out.textContent='—'; eq.textContent=''; return; }
    const a=cur('f'), b=cur('t'), v=num(), r=conv(v,c,a,b);
    out.textContent=isNaN(v)?'—':cvFmt(r,L); out.classList.toggle('big',out.textContent.length>11); eq.textContent=`1 ${a.s} = ${cvFmt(conv(1,c,a,b),L)} ${b.s}`; }
  function renderList(scroll){ const c=cat(), sel=c.u.length?D[D.slot][c.id]:'', f=q.value.trim().toLowerCase();
    if(!c.u.length){ al.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):'—'}</p>`; return; }
    al.innerHTML=c.u.filter(u=>!f||nm(u).toLowerCase().includes(f)||u.s.toLowerCase().includes(f)).map(u=>`<div class="cv-r${u.s===sel?' on':''}" data-s="${esc(u.s)}"><span>${esc(nm(u))}</span><small>${esc(u.s)}</small></div>`).join('')||'<p class="hint">—</p>';
    const on=al.querySelector('.on'); if(scroll&&on) al.scrollTop=Math.max(0,on.offsetTop-al.clientHeight/2+on.offsetHeight/2); }
  function setSlot(s){ if(D.slot===s) return; D.slot=s; saveSoon(); setSlotUI(); renderList(true); }
  function full(){ drawCats(); drawSel(); inp.value=D.v; run(); setSlotUI(); renderList(true); fxPanel(); if(D.cat==='fx') fxFetch(false); }
  inp.addEventListener('input',()=>{ D.v=inp.value; saveSoon(); run(); });
  inp.addEventListener('focus',()=>setSlot('f'));
  q.addEventListener('input',()=>renderList(false));
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    const r=e.target.closest('.cv-r');
    if(r){ D[D.slot][D.cat]=r.dataset.s; saveSoon(); drawSel(); run(); renderList(false); fxPanel(); return; }
    const b=e.target.closest('button');
    if(b){
      if(b.dataset.c){ D.cat=b.dataset.c; saveSoon(); q.value=''; return full(); }
      if(b.classList.contains('cv-sw')){ const c=D.cat, x=D.f[c]; D.f[c]=D.t[c]; D.t[c]=x; saveSoon(); drawSel(); run(); renderList(true); return fxPanel(); }
      if(b.classList.contains('cv-cp')){ const s=out.textContent; if(s==='—') return; try{ navigator.clipboard.writeText(s).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} return; }
      if(b.dataset.r){ D.rg=+b.dataset.r; saveSoon(); return fxPanel(); }
      if(b.classList.contains('cv-rt')) return fxFetch(true);
    }
    const row=e.target.closest('.cv-row'); if(row) setSlot(row.dataset.slot);
  });
  wrap.addEventListener('click',e=>{
    if(e.target.closest('.cv-mn')){ wrap.classList.toggle('dopen'); return; }
    if(e.target.closest('.cv-bk')){ wrap.classList.remove('dopen'); return; }
    const b=e.target.closest('.cv-di button'); if(b){ D.cat=b.dataset.c; saveSoon(); q.value=''; wrap.classList.remove('dopen'); full(); } });
  fxBuild(); full();
}


// ===== src/js/17-app-translate.js =====
// ---------- tło aplikacji: spokojne cząsteczki (wspólne dla wszystkich aplikacji) ----------
const AFXP=Array.from({length:40},(_,i)=>({x:Math.random(),y:Math.random(),r:(1+Math.random()*1.7)*2.4,s:.012+Math.random()*.02,a:.35+Math.random()*.55,k:i%2}));
let afxL=0; var afxIv=0;
// zegar cząsteczek działa tylko, gdy jest otwarte choć jedno okno aplikacji i okno przeglądarki jest widoczne (zatrzymuje się sam, wznawia go otwarcie okna aplikacji)
function afxKick(){ if(!afxIv&&!document.hidden) afxIv=setInterval(afxTick,50); }
document.addEventListener('visibilitychange',afxKick);
function afxTick(){ const cs=document.querySelectorAll('canvas.afx'); if(document.hidden||!cs.length){ clearInterval(afxIv); afxIv=0; return; } const now=performance.now(), dt=(afxL?Math.min(120,now-afxL):0)*(INC?INC_SLOW:1); afxL=now;
  const A=S.settings.afx, still=document.body.classList.contains('na-apps');
  if(!still) AFXP.forEach(p=>{ p.y-=p.s*dt/500; if(p.y<-.05){ p.y=1.05; p.x=Math.random(); } });
  const spF=glowSp(fgRgb,64), spA=glowSp(acc2Rgb,64);
  cs.forEach(cv=>{ const w=cv.closest('.aw'); if(!w) return; const W=cv.clientWidth, H=cv.clientHeight; if(!W||!H) return;
    const v=A.on?(A[w.dataset.app]??50):0, k=v/100, sig=still?W+'|'+H+'|'+k+'|'+fgRgb+'|'+acc2Rgb:null;
    if(still&&cv._sg===sig) return;   // bez ruchu nie ma czego przerysowywać
    cv._sg=sig; if(cv.width!==W) cv.width=W; if(cv.height!==H) cv.height=H;
    const g=cv.getContext('2d'); g.clearRect(0,0,W,H); if(k<=0) return;
    const n=Math.min(AFXP.length,Math.round(6+34*k)), al=.08+.4*k;
    for(let i=0;i<n;i++){ const p=AFXP[i], r=p.r*2.2; g.globalAlpha=p.a*al; g.drawImage(p.k?spA:spF,p.x*W-r,p.y*H-r,2*r,2*r); }
    g.globalAlpha=1; }); }
afxKick();
// ---------- aplikacja: tłumacz (bez logowania i opłat, wymaga internetu) ----------
// Główne źródło: publiczny punkt końcowy tłumacza Google (bez klucza); zapasowe: MyMemory. Zapytania wykonuje proces główny.
const TRL=['af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','ny','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tl','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu'];
// (v49.9) TRFIX, trChunks, trGtx, trMym i trTranslate są teraz w 25-shared.js (rdzeń): korzysta z nich też lista zmian (23-changelog.js), która działa bez modułu aplikacji.
function mountTr(el,w){
  const LC=S.settings.ui.lang, L=IL();
  const dflt={pl:'pl',szl:'pl',en:'en',de:'de',es:'es',fr:'fr',he:'iw',zh:'zh-TW'}[LC]||'en';
  const D=(S.aw.data.tr=S.aw.data.tr||{src:'auto',dst:dflt,text:''});
  if(D.src!=='auto'&&!TRL.includes(D.src)) D.src='auto'; if(!TRL.includes(D.dst)) D.dst=dflt; delete D.key;
  const nm=c=>{ try{ return capF(new Intl.DisplayNames([L],{type:'language'}).of(TRFIX[c]||c)); }catch{ return c; } };
  const opts=(sel,auto)=>(auto?`<option value="auto">${t('Wykryj język')}</option>`:'')+TRL.map(c=>[c,nm(c)]).sort((a,b)=>a[1].localeCompare(b[1],L)).map(([c,n])=>`<option value="${c}"${c===sel?' selected':''}>${esc(n)}</option>`).join('');
  el.innerHTML=`<div class="tr"><div class="tr-off">Brak połączenia z internetem. Tłumacz działa tylko online.</div><div class="tr-top"><select class="tr-sl"></select><button class="tr-sw" title="Zamień języki">⇄</button><select class="tr-dl"></select></div>
    <div class="tr-pn"><div class="tr-p"><textarea class="tr-in" placeholder="Wpisz tekst do przetłumaczenia…" spellcheck="false"></textarea><div class="tr-f"><span class="tr-cn"></span><button class="tr-x" title="Wyczyść">✕</button></div></div>
    <div class="tr-p tr-o"><textarea class="tr-ou" readonly placeholder="Tłumaczenie pojawi się tutaj"></textarea><div class="tr-f"><span class="tr-st"></span><button class="tr-cp" title="Kopiuj wynik">⧉</button></div></div></div></div>`;
  const root=el.firstElementChild, q=s=>root.querySelector(s), sl=q('.tr-sl'), dl=q('.tr-dl'), inn=q('.tr-in'), ou=q('.tr-ou'), cn=q('.tr-cn'), st=q('.tr-st'), off=q('.tr-off');
  let tok=0, tmr=0, det='';
  const fill=()=>{ sl.innerHTML=opts(D.src,true); dl.innerHTML=opts(D.dst,false); };
  const count=()=>{ cn.textContent=[...inn.value].length+' '+t('znaków'); };
  const net=()=>{ off.classList.toggle('on',!navigator.onLine); };
  async function run(){
    count(); D.text=inn.value; saveSoon(); clearTimeout(tmr); const txt=inn.value;
    if(!txt.trim()){ ou.value=''; st.textContent=''; ++tok; return; }
    if(!navigator.onLine){ ++tok; st.textContent=t('Brak połączenia z internetem. Tłumacz działa tylko online.'); return; }
    const my=++tok; st.textContent=t('Tłumaczenie…');
    try{ const r=await trTranslate(txt,D.src,D.dst); if(my!==tok||!el.isConnected) return;
      ou.value=r.text; det=r.det||''; st.textContent=D.src==='auto'&&det?t('Wykryto: {l}').replace('{l}',nm(det)):''; }
    catch(e){ if(my===tok&&el.isConnected) st.textContent=t(e.svc?'Usługa tłumaczenia jest chwilowo niedostępna. Spróbuj ponownie za chwilę.':'Brak połączenia z internetem. Tłumacz działa tylko online.'); } }
  sl.onchange=()=>{ D.src=sl.value; run(); }; dl.onchange=()=>{ D.dst=dl.value; run(); };
  inn.addEventListener('input',()=>{ count(); clearTimeout(tmr); tmr=setTimeout(run,650); });
  inn.addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){ e.preventDefault(); run(); } });
  q('.tr-x').onclick=()=>{ inn.value=''; ou.value=''; run(); inn.focus(); };
  q('.tr-cp').onclick=()=>{ if(!ou.value) return; try{ navigator.clipboard.writeText(ou.value).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} };
  q('.tr-sw').onclick=()=>{ const s=D.src==='auto'?(TRL.includes(det)?det:'en'):D.src; D.src=D.dst; D.dst=s; inn.value=ou.value; ou.value=''; fill(); run(); };
  const on=()=>{ if(!el.isConnected){ removeEventListener('online',on); removeEventListener('offline',on); return; } net(); if(navigator.onLine&&inn.value.trim()&&!ou.value) run(); };
  addEventListener('online',on); addEventListener('offline',on);
  new ResizeObserver(()=>root.classList.toggle('narrow',el.clientWidth<500)).observe(el);
  fill(); inn.value=D.text||''; count(); net(); if(inn.value.trim()) run();
}
$('set').addEventListener('change',e=>{ const i=e.target;
  if(i.id==='rnd'){ S.settings.ui.round=i.checked; applyUi(); save(); }
  else if(i.id==='asstbtn'){ S.settings.ui.asst=i.checked; applyUi(); if(!i.checked&&S.panel) setPanel(false); save(); }
  else if(i.id==='clbtnon'){ S.settings.ui.clb=i.checked; applyUi(); if(!i.checked) toggleCl(false); save(); }
  else if(i.id==='afxon'){ S.settings.afx.on=i.checked; save(); }
  else if(i.id==='hon'){ S.settings.hist.on=i.checked; save(); }
  else if(i.id==='upauto'){ S.settings.upd.auto=i.checked; save(); updPush(); }
  else if(i.id==='updl'){ S.settings.upd.dl=i.checked; save(); updPush(); }
  else if(i.id==='accadv'){ S.settings.accAdv=i.checked; $('accad').classList.toggle('open',i.checked); save(); }
  else if(i.id==='st5'){ S.settings.ui.step5=i.checked; save(); renderUi(); } });

// ===== src/js/18-app-dice.js =====
// ---------- aplikacja: kości do gry ----------
const DC_T=[3,4,5,6,8,10,12,16,20,24,30,100], DC_MAX=30, DC_FS={3:26,4:21,5:25,6:30,8:25,10:26,12:25,16:23,20:19,24:23,30:21,100:24};
const DC_PIPS={1:[[50,50]],2:[[34,34],[66,66]],3:[[34,34],[50,50],[66,66]],4:[[34,34],[66,34],[34,66],[66,66]],5:[[34,34],[66,34],[50,50],[34,66],[66,66]],6:[[34,31],[66,31],[34,50],[66,50],[34,69],[66,69]]};
function dcRand(n){ const a=new Uint32Array(1), lim=Math.floor(4294967296/n)*n; do{ crypto.getRandomValues(a); }while(a[0]>=lim); return a[0]%n+1; }   // równomiernie, bez przesunięcia modulo
const dcPts=(n,rot,r,cx=50,cy=50)=>Array.from({length:n},(_,i)=>{ const a=(rot+i*360/n)*Math.PI/180; return [cx+r*Math.sin(a),cy-r*Math.cos(a)]; });
const dcSc=(a,k,c)=>a.map(p=>[c[0]+(p[0]-c[0])*k,c[1]+(p[1]-c[1])*k]);
function dcShape(n){   // sylwetki jak na prawdziwych kościach widzianych od frontu
  switch(n){
    case 3: return {o:dcPts(3,180,48,50,43),c:[50,43],k:.58};
    case 4: return {o:dcPts(3,0,50,50,57),c:[50,57],k:.58};
    case 5: return {o:dcPts(5,180,46,50,47),c:[50,47],k:.6};
    case 6: return {o:[[10,10],[90,10],[90,90],[10,90]],c:[50,50],k:.72};
    case 8: return {o:[[50,4],[90,50],[50,96],[10,50]],c:[50,50],k:.6};
    case 10: case 100: return {o:[[50,4],[91,38],[50,96],[9,38]],c:[50,46],k:.6};
    case 12: return {o:dcPts(5,0,47,50,54),c:[50,54],k:.62};
    case 16: return {o:dcPts(8,22.5,47),c:[50,50],k:.62};
    case 20: return {o:dcPts(6,0,47),c:[50,50],k:.6,tri:1};
    case 24: return {o:dcPts(10,0,47),c:[50,50],k:.62};
    default: return {o:dcPts(12,15,47),c:[50,50],k:.64};
  }
}
function dcSvg(n,v,pips){
  const s=dcShape(n), P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  let g=`<polygon class="dco" points="${P(s.o)}"/>`, ins;
  if(s.tri){ const O=s.o; ins=dcPts(3,0,47*s.k);   // D20: środkowy trójkąt i trzy „skrzydła” ścianek
    for(let m=0;m<3;m++) g+=`<polygon class="dcf${m%2}" points="${P([ins[m],O[2*m],O[(2*m+1)%6],O[(2*m+2)%6],ins[(m+1)%3]])}"/>`; }
  else { ins=dcSc(s.o,s.k,s.c); const L=s.o.length; for(let i=0;i<L;i++){ const j=(i+1)%L; g+=`<polygon class="dcf${i%2}" points="${P([s.o[i],s.o[j],ins[j],ins[i]])}"/>`; } }
  g+=`<polygon class="dci" points="${P(ins)}"/>`;
  if(n===6&&pips) (DC_PIPS[v]||[]).forEach(p=>{ g+=`<circle class="dcq" cx="${p[0]}" cy="${p[1]}" r="6.4"/>`; });
  else { const d=String(v).length, fs=DC_FS[n]*(d===1?1:d===2?.84:.66); g+=`<text class="dct" x="${s.c[0]}" y="${s.c[1]}" font-size="${fs.toFixed(1)}">${v}</text>`; }
  return `<svg viewBox="0 0 100 100" class="dcs">${g}</svg>`;
}
function mountDice(el,w){
  const D=(S.aw.data.dice=S.aw.data.dice||{pool:{6:1},mod:0,hist:[]});
  D.pool=D.pool&&typeof D.pool==='object'?D.pool:{6:1}; D.mod=Math.max(-999,Math.min(999,D.mod|0)); D.hist=Array.isArray(D.hist)?D.hist.slice(0,15):[];
  DC_T.forEach(n=>{ D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]|0)); });
  el.innerHTML=`<div class="dcr"><div class="dcx"><div class="dcsum"><span>Suma</span><b class="dctot">–</b><small class="dcrng"></small></div>
    <div class="dcst"><p class="dch">Wybierz kości i rzuć</p></div><div class="dcfm"></div></div>
    <div class="dcbr"><button class="dcroll">Rzuć kośćmi</button><button class="dcbt dcclr">Wyczyść wybór</button></div>
    <div class="dcl"><span>Wybierz kości</span></div><div class="dcg">${DC_T.map(n=>`<div class="dcc" data-n="${n}"><button class="dcp" title="Dodaj">${dcSvg(n,n,false)}<em></em></button><span>D${n}</span><button class="dcm" title="Usuń">−</button></div>`).join('')}</div>
    <div class="dcmod"><span>Modyfikator</span><button class="dcbt" data-m="-1">−</button><b class="dcmv"></b><button class="dcbt" data-m="1">+</button></div>
    <div class="dcl"><span>Historia rzutów</span><button class="dchc">Wyczyść historię</button></div><ul class="dchs"></ul>
    <p class="hint">Kliknij kość w wyniku, aby rzucić nią ponownie.</p></div>`;
  const q=s=>el.querySelector(s), live=()=>el.isConnected, anim=()=>!document.body.classList.contains('na-apps');
  let cur=[], fm='', rmod=0, busy=0, iv=null;
  const cnt=()=>DC_T.reduce((a,n)=>a+D.pool[n],0), hl=d=>d.n>=6&&d.v===d.n?' mx':(d.n===20&&d.v===1?' mn':''), total=()=>cur.reduce((a,d)=>a+d.v,0)+rmod;
  const label=()=>DC_T.filter(n=>D.pool[n]).map(n=>(D.pool[n]>1?D.pool[n]:'')+'D'+n).join(' + ')+(D.mod?(D.mod>0?' + ':' − ')+Math.abs(D.mod):'');
  function paintPool(n){ const c=q(`.dcc[data-n="${n}"]`); c.classList.toggle('on',D.pool[n]>0); c.querySelector('em').textContent=D.pool[n]||''; }
  function range(){ const c=cnt(), mx=DC_T.reduce((a,n)=>a+D.pool[n]*n,0); q('.dcrng').textContent=c?t('Zakres: {a}–{b}').replace('{a}',c+D.mod).replace('{b}',mx+D.mod):''; q('.dcmv').textContent=D.mod>0?'+'+D.mod:String(D.mod); }
  function histR(){ q('.dchs').innerHTML=D.hist.length?D.hist.map(h=>`<li><b>${h.tot}</b><span>${esc(h.fm)}</span><i>${esc(h.v)}</i></li>`).join(''):'<li class="dce">Brak rzutów</li>'; }
  function stage(){ const st=q('.dcst'), n=cur.length;
    if(!n){ st.innerHTML='<p class="dch">Wybierz kości i rzuć</p>'; return; }
    st.style.setProperty('--ds',(n<=6?72:n<=12?58:n<=20?48:40)+'px'); st.classList.toggle('sh',n<=12);
    st.innerHTML=cur.map((d,i)=>`<button class="dcd" data-i="${i}" title="Rzuć ponownie tą kością">${dcSvg(d.n,d.v,true)}</button>`).join(''); }
  function settle(targets,full){
    const ds=q('.dcst').querySelectorAll('.dcd'); targets.forEach(i=>{ const b=ds[i], d=cur[i]; if(!b) return; b.className='dcd'+hl(d); b.style.animationDelay=''; b.innerHTML=dcSvg(d.n,d.v,true); });
    const tt=q('.dctot'); tt.textContent=total(); q('.dcfm').textContent=fm+' = '+total(); if(anim()){ tt.classList.remove('pop'); void tt.offsetWidth; tt.classList.add('pop'); }
    const rec={fm,tot:total(),v:cur.map(d=>d.v).join(', ')};
    if(full) D.hist.unshift(rec); else if(D.hist.length) D.hist[0]=rec;
    D.hist.length=Math.min(D.hist.length,15); histR(); save(); busy=0; }
  function roll(i){
    if(busy||!live()) return; const full=i===undefined;
    if(full){ const list=[]; DC_T.forEach(n=>{ for(let k=0;k<D.pool[n];k++) list.push(n); });
      if(!list.length) return toast(t('Wybierz co najmniej jedną kość'));
      cur=list.map(n=>({n,v:dcRand(n)})); fm=label(); rmod=D.mod; stage(); }
    else { const d=cur[i]; if(!d) return; d.v=dcRand(d.n); }
    const targets=full?cur.map((_,k)=>k):[i];
    if(!anim()){ settle(targets,full); return; }
    busy=1; const ds=q('.dcst').querySelectorAll('.dcd'), t0=performance.now(), end=targets.map((_,k)=>520+Math.min(k*35,420));
    q('.dctot').textContent='…';
    targets.forEach((i2,k)=>{ const b=ds[i2]; b.classList.add('rl'); b.style.animationDelay=Math.min(k*35,420)+"ms"; });
    clearInterval(iv); iv=setInterval(()=>{
      if(!live()){ clearInterval(iv); return; } const ms=performance.now()-t0; let done=true;
      targets.forEach((i2,k)=>{ const d=cur[i2], b=ds[i2]; if(!b) return; if(ms<end[k]){ done=false; if(d.n!==6||Math.random()<.5) b.innerHTML=dcSvg(d.n,dcRand(d.n),true); } else if(b.dataset.f!=='1'){ b.dataset.f='1'; b.innerHTML=dcSvg(d.n,d.v,true); } });
      if(done){ clearInterval(iv); settle(targets,full); targets.forEach(i2=>{ if(ds[i2]) ds[i2].dataset.f=''; }); }
    },75); }
  function add(n,dv){ if(dv>0&&cnt()>=DC_MAX) return toast(t('Maksymalnie {n} kości naraz').replace('{n}',DC_MAX)); D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]+dv)); paintPool(n); range(); saveSoon(); }
  el.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!el.contains(b)) return;
    if(b.classList.contains('dcroll')) return roll();
    if(b.classList.contains('dcd')) return roll(+b.dataset.i);
    const ch=b.closest('.dcc'); if(ch&&b.classList.contains('dcp')) return add(+ch.dataset.n,1); if(ch&&b.classList.contains('dcm')) return add(+ch.dataset.n,-1);
    if(b.dataset.m){ D.mod=Math.max(-999,Math.min(999,D.mod+ +b.dataset.m)); range(); saveSoon(); return; }
    if(b.classList.contains('dcclr')){ DC_T.forEach(n=>{ D.pool[n]=0; paintPool(n); }); range(); saveSoon(); return; }
    if(b.classList.contains('dchc')){ D.hist=[]; histR(); save(); } });
  el.addEventListener('contextmenu',e=>{ const ch=e.target.closest('.dcc'); if(ch){ e.preventDefault(); add(+ch.dataset.n,-1); } });
  DC_T.forEach(paintPool); range(); histR();
  el.__dc={roll,get cur(){ return cur; }};
}


// ===== src/js/19-games.js =====
// ---------- gry: wspólne elementy konfiguratora (Saper, Snake) ----------
const gmHsl=(rgb,d,s,l)=>{ const [r,g,b]=rgb.split(',').map(Number).map(v=>v/255), mx=Math.max(r,g,b), mn=Math.min(r,g,b), dd=mx-mn; let h=0; if(dd){ h=mx===r?((g-b)/dd)%6:mx===g?(b-r)/dd+2:(r-g)/dd+4; h*=60; if(h<0) h+=360; } return `hsl(${Math.round((h+d+360)%360)} ${s}% ${l}%)`; };   // kolory pochodne od akcentu motywu
const gmSl=(k,label,min,max,val,step=1)=>`<div class="gms"><span>${label}<b data-o="${k}"></b></span><div class="rg"><i class="tr"></i><i class="fl"></i><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${val}"></div></div>`;
const gmTg=(k,label,on)=>`<label class="ck"><input type="checkbox" data-k="${k}"${on?' checked':''}><span class="tg"></span>${label}</label>`;
const gmPaint=root=>root.querySelectorAll('.rg').forEach(g=>{ const i=g.querySelector('input'); g.style.setProperty('--v',(i.value-i.min)/(i.max-i.min)*100); });
const gmRingSvg='<svg viewBox="0 0 64 64" class="gmrs"><circle cx="32" cy="32" r="26" class="gmr0"/><circle cx="32" cy="32" r="26" class="gmr1"/><text x="32" y="33" class="gmrt"></text></svg>';
const gmRing=(root,p,txt,lab)=>{ root.querySelector('.gmr1').style.strokeDasharray=(Math.max(0,Math.min(1,p))*163.4).toFixed(1)+' 163.4'; root.querySelector('.gmrt').textContent=txt; root.querySelector('.gmd').textContent=t(lab); };
const gmDiff=d=>d<.3?'Łatwy':d<.5?'Średni':d<.7?'Trudny':'Ekstremalny';
function gmFrame(cls,inner,panel){ return `<div class="gj ${cls}">${inner}<button class="gjm" title="Ustawienia gry"><i></i></button><div class="gmp"><div class="gmt">Ustawienia gry</div>${panel}</div></div>`; }
const gmRR=(cx,x,y,w,h,r)=>{ cx.beginPath(); if(cx.roundRect) cx.roundRect(x,y,w,h,r); else cx.rect(x,y,w,h); };
const gmAnim=()=>!document.body.classList.contains('na-apps');

// ---------- aplikacja: Saper ----------
const MN_DEF={pre:'easy',w:9,h:9,m:10,cell:32,fit:true,safe:true,chord:true,ques:false,wrap:false,lives:1}, MN_PRE={easy:[9,9,10],mid:[16,16,40],hard:[30,16,99]};
const mnMax=(w,h)=>Math.max(1,Math.floor(w*h*.55));
const mnPerm=(()=>{ const c={}; return n=>c[n]||(c[n]=(()=>{ const a=Array.from({length:n},(_,i)=>i); let s=n*7919+13; for(let i=n-1;i>0;i--){ s=(s*1103515245+12345)&0x7fffffff; const j=s%(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; })()); })();
function mnNb(w,h,wrap){ const NB=[]; for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const a=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; let nx=x+dx, ny=y+dy; if(wrap){ nx=(nx+w)%w; ny=(ny+h)%h; } else if(nx<0||ny<0||nx>=w||ny>=h) continue; const j=ny*w+nx; if(j!==y*w+x&&!a.includes(j)) a.push(j); } NB.push(a); } return NB; }
function mountMine(el,wn){
  const D=(S.aw.data.mine=S.aw.data.mine||{cfg:{},best:{},st:{p:0,w:0}}); D.best=D.best||{}; D.st=D.st||{p:0,w:0};
  const C=D.cfg=Object.assign({},MN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(40,Math.max(5,C.w|0)); C.h=Math.min(30,Math.max(5,C.h|0)); C.m=Math.min(mnMax(C.w,C.h),Math.max(1,C.m|0)); C.cell=Math.min(56,Math.max(20,C.cell|0)); C.lives=Math.min(5,Math.max(1,C.lives|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('mn',`<div class="gmh"><div class="gmi" title="Pozostało min">💣<b class="mnm">0</b></div><button class="gmbt mnf" title="Nowa gra">🙂</button><div class="gmi">⏱<b class="mnt">0</b></div><div class="mnl"></div><button class="gmbt mnfl" title="Tryb flagi">🚩</button></div><div class="gmb"><canvas class="mnv"></canvas></div><div class="gmx"><span class="mnbs"></span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('easy','Łatwy')}${preBtn('mid','Średni')}${preBtn('hard','Trudny')}${preBtn('custom','Własny')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',5,40,C.w)}${gmSl('h','Wiersze',5,30,C.h)}${gmSl('m','Miny',1,mnMax(C.w,C.h),C.m)}${gmSl('cell','Rozmiar pola',20,56,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}
     <div class="gmg">Zasady</div>${gmSl('lives','Życia',1,5,C.lives)}${gmTg('safe','Bezpieczny pierwszy klik',C.safe)}${gmTg('chord','Akordy (klik na cyfrę)',C.chord)}${gmTg('ques','Znaki zapytania',C.ques)}${gmTg('wrap','Zawinięta plansza',C.wrap)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Prawy przycisk myszy: flaga. Zmiana rozmiaru planszy lub liczby min zaczyna nową grę po kliknięciu przycisku powyżej.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d');
  let G=null, cs=30, dpr=window.devicePixelRatio||1, hov=-1, down=-1, flagMode=false, raf=0, tmr=null, shake=0, pvRaf=0, ff=getComputedStyle(el).fontFamily;
  const now=()=>performance.now();
  // ----- logika gry -----
  function place(first){ const ban=new Set(); if(first>=0){ ban.add(first); if(C.safe) G.NB[first].forEach(j=>ban.add(j)); }
    let cand=[]; for(let i=0;i<G.n;i++) if(!ban.has(i)) cand.push(i); if(cand.length<G.m){ cand=[]; for(let i=0;i<G.n;i++) if(i!==first) cand.push(i); }
    for(let k=0;k<G.m;k++){ const r=k+Math.floor(Math.random()*(cand.length-k)); [cand[k],cand[r]]=[cand[r],cand[k]]; G.mine[cand[k]]=1; }
    for(let i=0;i<G.n;i++){ let c=0; for(const j of G.NB[i]) c+=G.mine[j]; G.near[i]=c; } G.placed=true; }
  function newGame(){ fix(); clearInterval(tmr); const n=C.w*C.h; G={w:C.w,h:C.h,n,m:C.m,NB:mnNb(C.w,C.h,C.wrap),mine:new Uint8Array(n),near:new Uint8Array(n),st:new Uint8Array(n),boom:new Uint8Array(n),rv:new Float64Array(n),placed:false,opened:0,flags:0,booms:0,lives:C.lives,over:0,t0:0,ms:0,wt:0};
    if(!C.safe) place(-1); layout(); head(); redraw(); }
  function flood(i){ const t=now(), a=gmAnim(), qu=[[i,0]]; G.st[i]=1; G.rv[i]=t; G.opened++;
    for(let k=0;k<qu.length;k++){ const [c,d]=qu[k]; if(G.near[c]) continue; for(const j of G.NB[c]) if(G.st[j]===0||G.st[j]===3){ G.st[j]=1; G.opened++; G.rv[j]=t+(a?(d+1)*22:0); qu.push([j,d+1]); } } }
  function hit(i){ G.st[i]=1; G.boom[i]=1; G.rv[i]=now(); G.booms++; G.lives--; shake=now();
    if(G.lives<=0){ G.over=2; clearInterval(tmr); G.ms=now()-G.t0; D.st.p++; const t=now(), x0=i%G.w, y0=(i/G.w)|0, a=gmAnim();
      for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]===0||G.mine[j]&&G.st[j]===3){ G.st[j]=4; G.rv[j]=t+(a?80+Math.hypot(j%G.w-x0,((j/G.w)|0)-y0)*38:0); } save(); }
    else toast(t('Życie utracone! Zostało: {n}').replace('{n}',G.lives)); }
  function check(){ if(G.over||G.opened!==G.n-G.m) return; G.over=1; clearInterval(tmr); G.ms=now()-G.t0; G.wt=now(); G.flags=G.m-G.booms;
    for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]!==1) G.st[j]=2; D.st.p++; D.st.w++; const k=bestKey(); toast(t('Wygrana! Czas: {t} s').replace('{t}',(G.ms/1000).toFixed(1)));
    if(!D.best[k]||G.ms<D.best[k]){ D.best[k]=Math.round(G.ms); setTimeout(()=>toast(t('Nowy rekord!')),1800); } save(); }
  function open(i){ if(G.over||G.st[i]===1||G.st[i]===2) return; if(!G.placed) place(i); if(!G.t0){ G.t0=now(); tmr=setInterval(tick,200); }
    if(G.mine[i]) hit(i); else flood(i); check(); head(); redraw(); }
  function chord(i){ if(G.over||G.st[i]!==1||!G.near[i]||G.mine[i]) return; let f=0; for(const j of G.NB[i]) if(G.st[j]===2||(G.st[j]===1&&G.boom[j])) f++; if(f!==G.near[i]) return;
    for(const j of G.NB[i]){ if(G.over) break; if(G.st[j]!==0&&G.st[j]!==3) continue; if(G.mine[j]) hit(j); else flood(j); } check(); head(); redraw(); }
  function flag(i){ if(G.over||G.st[i]===1) return; const s=G.st[i]; if(s===0){ G.st[i]=2; G.flags++; } else if(s===2){ G.flags--; G.st[i]=C.ques?3:0; } else G.st[i]=0; head(); redraw(); }
  const bestKey=()=>`${C.w}x${C.h}-${C.m}${C.wrap?'w':''}${C.lives>1?'l'+C.lives:''}`;
  function tick(){ if(!root.isConnected){ clearInterval(tmr); return; } q('.mnt').textContent=G.t0?Math.min(999,Math.floor((now()-G.t0)/1000)):0; }
  function head(){ q('.mnm').textContent=G.m-G.flags-G.booms; q('.mnf').textContent=G.over===1?'😎':G.over===2?'😵':(down>=0?'😮':'🙂');
    q('.mnt').textContent=G.t0?Math.min(999,Math.floor((G.over?G.ms:now()-G.t0)/1000)):0;
    q('.mnl').innerHTML=C.lives>1?Array.from({length:C.lives},(_,k)=>`<i class="${k<G.lives?'':'off'}">♥</i>`).join(''):'';
    const b=D.best[bestKey()]; q('.mnbs').textContent=b?t('Rekord')+': '+(b/1000).toFixed(1)+' s':''; }
  // ----- rysowanie -----
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(12,Math.min(64,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
  const NCK={k:'',v:[]};
  function ncol(n){ if(NCK.k!==accRgb){ NCK.k=accRgb; NCK.v=Array.from({length:9},(_,k)=>gmHsl(accRgb,k*47+20,72,68)); } return NCK.v[n]; }
  function flagIco(x,y,c){ const X=x+c*.5, T=y+c*.2, B=y+c*.8; cx.fillStyle=P.acc; cx.beginPath(); cx.moveTo(X,T); cx.lineTo(X+c*.28,T+c*.17); cx.lineTo(X,T+c*.34); cx.closePath(); cx.fill(); cx.fillStyle=P.fg; cx.fillRect(X-c*.03,T,c*.055,B-T); cx.fillRect(X-c*.2,B-c*.04,c*.4,c*.075); }
  function bomb(x,y,c,hot){ const X=x+c/2, Y=y+c/2, r=c*.2; if(hot){ cx.fillStyle=`rgba(${accRgb},.55)`; cx.beginPath(); cx.arc(X,Y,c*.46,0,6.283); cx.fill(); }
    cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.2,c*.06); for(let k=0;k<4;k++){ const a=k*Math.PI/4; cx.beginPath(); cx.moveTo(X-Math.cos(a)*r*1.75,Y-Math.sin(a)*r*1.75); cx.lineTo(X+Math.cos(a)*r*1.75,Y+Math.sin(a)*r*1.75); cx.stroke(); }
    cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r*1.2,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(X-r*.4,Y-r*.4,r*.35,0,6.283); cx.fill(); }
  function draw(){ const t=now(), w=G.w; let busy=false; cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,w*cs,G.h*cs);
    if(gmAnim()&&shake&&t-shake<380){ cx.translate(Math.sin((t-shake)*.07)*(1-(t-shake)/380)*cs*.22,0); busy=true; }
    cx.font=`700 ${Math.round(cs*.52)}px ${ff}`; cx.textAlign='center'; cx.textBaseline='middle'; const g=Math.max(1,cs*.05), r=cs*.2;
    for(let i=0;i<G.n;i++){ const x=(i%w)*cs, y=((i/w)|0)*cs; let s=G.st[i], a=1;
      if(s===1||s===4){ const dt=t-G.rv[i]; if(dt<0){ s=0; busy=true; } else if(dt<240){ a=dt/240; busy=true; } }
      if(s===1||s===4){ const k=a<1?.55+.45*(1+2.7*Math.pow(a-1,3)+1.7*Math.pow(a-1,2)):1; cx.save(); cx.translate(x+cs/2,y+cs/2); cx.scale(k,k); cx.translate(-x-cs/2,-y-cs/2); cx.globalAlpha=a;
        cx.fillStyle=G.boom[i]?`rgba(${accRgb},.3)`:'rgba(0,0,0,.27)'; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill();
        if(G.mine[i]) bomb(x,y,cs,G.boom[i]); else if(G.near[i]){ cx.fillStyle=ncol(G.near[i]); cx.fillText(G.near[i],x+cs/2,y+cs/2+cs*.03); } cx.restore(); }
      else { const hot=i===hov&&!G.over||i===down; cx.fillStyle=`rgba(${accRgb},${hot?.4:.22})`; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill(); cx.strokeStyle=`rgba(${fgRgb},.09)`; cx.lineWidth=1; cx.beginPath(); cx.moveTo(x+r+g,y+g+.5); cx.lineTo(x+cs-r-g,y+g+.5); cx.stroke();
        if(s===2){ flagIco(x,y,cs); if(G.over===2&&!G.mine[i]){ cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.5,cs*.07); cx.beginPath(); cx.moveTo(x+cs*.22,y+cs*.22); cx.lineTo(x+cs*.78,y+cs*.78); cx.moveTo(x+cs*.78,y+cs*.22); cx.lineTo(x+cs*.22,y+cs*.78); cx.stroke(); } }
        else if(s===3){ cx.fillStyle=P.mut; cx.fillText('?',x+cs/2,y+cs/2+cs*.03); } else if(s===4) bomb(x,y,cs,false); } }
    if(G.over===1&&gmAnim()&&t-G.wt<1500){ busy=true; const fr=(t-G.wt)/1500*(w+G.h+8)-4; for(let i=0;i<G.n;i++){ const al=Math.max(0,1-Math.abs((i%w)+((i/w)|0)-fr)/4.5)*.55; if(al>.02){ cx.fillStyle=`rgba(${acc2Rgb},${al})`; gmRR(cx,(i%w)*cs+g,((i/w)|0)*cs+g,cs-2*g,cs-2*g,r); cx.fill(); } } }
    return busy; }
  const loop=()=>{ raf=0; if(!root.isConnected||!G) return; if(draw()) raf=requestAnimationFrame(loop); };
  const redraw=()=>{ if(!raf) raf=requestAnimationFrame(loop); };
  // ----- mysz -----
  const cellAt=e=>{ const r=cv.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/cs), y=Math.floor((e.clientY-r.top)/cs); return x<0||y<0||x>=G.w||y>=G.h?-1:y*G.w+x; };
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('pointerdown',e=>{ const i=cellAt(e); if(i<0) return; if(e.button===2){ flag(i); return; } if(e.button===1){ e.preventDefault(); chord(i); return; } if(e.button===0){ down=i; head(); redraw(); } });
  cv.addEventListener('pointerup',e=>{ if(e.button!==0) return; const i=cellAt(e), d=down; down=-1; head(); redraw(); if(i<0||i!==d) return; if(flagMode) flag(i); else if(G.st[i]===1){ if(C.chord) chord(i); } else open(i); });
  cv.addEventListener('pointermove',e=>{ const i=cellAt(e); if(i!==hov){ hov=i; redraw(); } });
  cv.addEventListener('pointerleave',()=>{ hov=-1; down=-1; head(); redraw(); });
  q('.mnf').addEventListener('click',newGame);
  q('.mnfl').addEventListener('click',e=>{ flagMode=!flagMode; e.currentTarget.classList.toggle('on',flagMode); });
  new ResizeObserver(()=>{ if(G){ layout(); redraw(); } }).observe(q('.gmb'));
  // ----- konfigurator z podglądem na żywo -----
  function pvDraw(t=now()){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); const c=Math.max(2,Math.min((W-14*dpr)/C.w,(H-14*dpr)/C.h)), bw=c*C.w, bh=c*C.h, ox=(W-bw)/2, oy=(H-bh)/2, ord=mnPerm(C.w*C.h), mine=new Uint8Array(C.w*C.h);
    for(let k=0;k<C.m;k++) mine[ord[k]]=1; const gp=Math.max(.5,c*.08);
    for(let i=0;i<mine.length;i++){ const x=ox+(i%C.w)*c, y=oy+((i/C.w)|0)*c; px.fillStyle=`rgba(${accRgb},.17)`; px.fillRect(x+gp,y+gp,c-2*gp,c-2*gp);
      if(mine[i]){ const p=.5+.5*Math.sin(t*.004+i*1.7); px.fillStyle=`rgba(${acc2Rgb},${.55+.45*p})`; px.beginPath(); px.arc(x+c/2,y+c/2,c*(.2+.1*p),0,6.283); px.fill(); } }
    if(C.wrap){ px.save(); px.strokeStyle=P.acc; px.lineWidth=2*dpr; px.setLineDash([5*dpr,4*dpr]); px.lineDashOffset=-(t*.02)%(9*dpr); px.shadowColor=P.acc; px.shadowBlur=8*dpr; px.strokeRect(ox-3*dpr,oy-3*dpr,bw+6*dpr,bh+6*dpr); px.restore(); } }
  function pvLoop(t){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; pvDraw(t); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; }, d=C.m/(C.w*C.h);
    pn.querySelector('[data-k=m]').max=mnMax(C.w,C.h); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('m',C.m+' · '+Math.round(d*100)+'%'); o('cell',C.cell+' px'); o('lives',C.lives); pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>b.classList.toggle('on',b.dataset.p===C.pre)); gmPaint(pn);
    const d2=d*(C.wrap?1.12:1)*(1-(C.lives-1)*.06); gmRing(pn,d/.3,Math.round(d*100)+'%',['Łatwy','Średni','Trudny','Ekstremalny'][d2<.14?0:d2<.18?1:d2<.23?2:3]); if(!pvRaf) pvDraw(); }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; if(k==='w'||k==='h'||k==='m') C.pre='custom'; fix(); sync(); if(k==='cell'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; if(k==='wrap') C.pre='custom'; sync(); if(k==='fit'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ const p=b.dataset.p; C.pre=p; if(p!=='custom'){ [C.w,C.h,C.m]=MN_PRE[p]; } sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); } });
  newGame(); sync();
  el.__mn={ get G(){ return G; }, open, flag, chord, newGame, C };
}

// ---------- aplikacja: Snake ----------
const SN_DEF={w:20,h:16,speed:9,accel:3,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:6,obs:0,wrap:false,cell:28,fit:true};
const SN_PRE={cl:{w:20,h:16,speed:8,accel:0,len:3,grow:1,apples:1,every:1,life:0,gold:0,poison:0,obs:0,wrap:false},
  fast:{w:24,h:18,speed:16,accel:4,len:3,grow:1,apples:3,every:2,life:12,gold:10,poison:8,obs:0,wrap:false},
  maze:{w:26,h:18,speed:10,accel:2,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:5,obs:24,wrap:false},
  open:{w:22,h:22,speed:9,accel:2,len:3,grow:1,apples:3,every:2,life:0,gold:12,poison:0,obs:0,wrap:true}};
function snNew(C){ const w=C.w, h=C.h, cy=h>>1, x0=Math.max(C.len+1,w>>2), G={w,h,wrap:C.wrap,snake:[],dir:{x:1,y:0},q:[],apples:[],obs:new Uint8Array(w*h),score:0,grow:0,alive:true,speed:C.speed,sa:0,eaten:0,prev:null,t:0,poison:0};
  for(let i=0;i<C.len;i++) G.snake.push({x:x0-i,y:cy});
  for(let n=C.obs, k=0; n>0&&k<3000; k++){ const x=(Math.random()*w)|0, y=(Math.random()*h)|0; if(Math.abs(y-cy)<=1&&x<x0+9) continue; if(G.obs[y*w+x]) continue; G.obs[y*w+x]=1; n--; }
  snSpawn(G,C); return G; }
function snFree(G,x,y){ if(G.obs[y*G.w+x]) return false; for(const s of G.snake) if(s.x===x&&s.y===y) return false; for(const a of G.apples) if(a.x===x&&a.y===y) return false; return true; }
function snSpawn(G,C){ for(let k=0;k<300;k++){ const x=(Math.random()*G.w)|0, y=(Math.random()*G.h)|0; if(!snFree(G,x,y)) continue; const r=Math.random()*100; let kind=r<C.poison?2:r<C.poison+C.gold?1:0;
    if(kind===2&&!G.apples.some(a=>a.k!==2)) kind=0;   // zawsze musi być co najmniej jedno zdrowe jabłko
    G.apples.push({x,y,k:kind,exp:C.life?G.t+C.life*1000:0}); return true; } return false; }
function snTick(G,C,dt){ G.t+=dt; const n0=G.apples.length; G.apples=G.apples.filter(a=>!a.exp||G.t<a.exp); if(!G.apples.length) snSpawn(G,C);
  G.sa+=dt; if(G.sa>=C.every*1000){ G.sa=0; if(G.apples.length<C.apples) snSpawn(G,C); } return n0; }
function snStep(G,C){ G.prev=G.snake.map(s=>({x:s.x,y:s.y})); const d=G.q.length?G.q.shift():G.dir; G.dir=d; const h=G.snake[0]; let nx=h.x+d.x, ny=h.y+d.y;
  if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h){ G.alive=false; return 'wall'; }
  if(G.obs[ny*G.w+nx]){ G.alive=false; return 'obs'; }
  const L=G.snake.length-(G.grow>0?0:1); for(let i=0;i<L;i++){ const s=G.snake[i]; if(s.x===nx&&s.y===ny){ G.alive=false; return 'self'; } }
  G.snake.unshift({x:nx,y:ny}); let ate=-1, ai=G.apples.findIndex(a=>a.x===nx&&a.y===ny);
  if(ai>=0){ const a=G.apples.splice(ai,1)[0]; ate=a.k; G.eaten++; if(a.k===0){ G.score+=10; G.grow+=C.grow; } else if(a.k===1){ G.score+=30; G.grow+=C.grow+2; } else { G.score=Math.max(0,G.score-5); G.poison=2; } G.speed=Math.min(30,G.speed*(1+C.accel/100)); }
  if(G.grow>0) G.grow--; else G.snake.pop();
  if(G.poison){ for(let k=0;k<G.poison&&G.snake.length>2;k++) G.snake.pop(); G.poison=0; }
  if(!G.apples.length) snSpawn(G,C);
  return ate>=0?'ate'+ate:''; }
function snAI(G){ const h=G.snake[0], DD=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]; let best=null, bd=1e9;
  for(const d of DD){ if(d.x===-G.dir.x&&d.y===-G.dir.y) continue; let nx=h.x+d.x, ny=h.y+d.y; if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h) continue;
    if(G.obs[ny*G.w+nx]||G.snake.some((s,i)=>i<G.snake.length-1&&s.x===nx&&s.y===ny)) continue;
    let m=1e9; for(const a of G.apples){ if(a.k===2) continue; let dx=Math.abs(a.x-nx), dy=Math.abs(a.y-ny); if(G.wrap){ dx=Math.min(dx,G.w-dx); dy=Math.min(dy,G.h-dy); } m=Math.min(m,dx+dy); } m+=Math.random()*.4; if(m<bd){ bd=m; best=d; } }
  if(best) G.q=[best]; }
function snBg(G,C,cs,dpr){ const W=G.w*cs, H=G.h*cs, c=document.createElement('canvas'); c.width=Math.round(W*dpr); c.height=Math.round(H*dpr); const x=c.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0);
  x.fillStyle='rgba(0,0,0,.26)'; gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.fill();
  for(let j=0;j<G.h;j++) for(let i=0;i<G.w;i++){ if((i+j)&1){ x.fillStyle=`rgba(${accRgb},.05)`; x.fillRect(i*cs,j*cs,cs,cs); } if(G.obs[j*G.w+i]){ x.fillStyle=`rgba(${accRgb},.4)`; gmRR(x,i*cs+cs*.06,j*cs+cs*.06,cs*.88,cs*.88,cs*.2); x.fill(); x.strokeStyle=P.acc; x.lineWidth=Math.max(1,cs*.05); x.stroke(); } }
  x.save(); x.strokeStyle=G.wrap?P.acc2:P.acc; x.lineWidth=G.wrap?Math.max(1.5,cs*.08):Math.max(2,cs*.14); if(G.wrap){ x.setLineDash([cs*.4,cs*.3]); x.shadowColor=P.acc2; x.shadowBlur=cs*.4; } gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.stroke(); x.restore(); return c; }
function snDraw(cx,G,cs,t,f,dead){
  for(const a of G.apples){ if(a.exp&&a.exp-G.t<1600&&((G.t/140)|0)%2) continue; const X=(a.x+.5)*cs, Y=(a.y+.5)*cs, r=cs*.34*(1+.07*Math.sin(t*.006+a.x*2+a.y));
    if(a.k===0){ cx.fillStyle=P.acc2; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.fillStyle=`rgba(${fgRgb},.55)`; cx.beginPath(); cx.arc(X-r*.35,Y-r*.35,r*.28,0,6.283); cx.fill(); cx.fillStyle=P.acc; cx.beginPath(); cx.ellipse(X+r*.3,Y-r*1.02,r*.34,r*.17,-.6,0,6.283); cx.fill(); }
    else if(a.k===1){ cx.save(); cx.shadowColor=P.fg; cx.shadowBlur=cs*.45; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.restore(); cx.strokeStyle=P.acc; cx.lineWidth=Math.max(1.2,cs*.07); cx.beginPath(); cx.arc(X,Y,r*.62,0,6.283); cx.stroke(); }
    else { cx.fillStyle=gmHsl(accRgb,180,52,52); cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.strokeStyle=P.bg; cx.lineWidth=Math.max(1.4,cs*.08); cx.beginPath(); cx.moveTo(X-r*.42,Y-r*.42); cx.lineTo(X+r*.42,Y+r*.42); cx.moveTo(X+r*.42,Y-r*.42); cx.lineTo(X-r*.42,Y+r*.42); cx.stroke(); } }
  const L=G.snake.length, A=accRgb.split(',').map(Number), B=acc2Rgb.split(',').map(Number); cx.globalAlpha=dead?.5:1;
  for(let i=L-1;i>=0;i--){ const s=G.snake[i], p=G.prev&&G.prev[i], dx=p?s.x-p.x:0, dy=p?s.y-p.y:0; let x=s.x, y=s.y; if(p&&Math.abs(dx)<=1&&Math.abs(dy)<=1){ x=p.x+dx*f; y=p.y+dy*f; }
    const k=L>1?i/(L-1):0, sz=cs*(i===0?.98:.9-.2*k), X=(x+.5)*cs, Y=(y+.5)*cs; cx.fillStyle=`rgb(${Math.round(A[0]+(B[0]-A[0])*k)},${Math.round(A[1]+(B[1]-A[1])*k)},${Math.round(A[2]+(B[2]-A[2])*k)})`; gmRR(cx,X-sz/2,Y-sz/2,sz,sz,sz*.38); cx.fill(); }
  cx.globalAlpha=1; const h=G.snake[0], hp=G.prev&&G.prev[0]; let hx=h.x, hy=h.y; if(hp&&Math.abs(h.x-hp.x)<=1&&Math.abs(h.y-hp.y)<=1){ hx=hp.x+(h.x-hp.x)*f; hy=hp.y+(h.y-hp.y)*f; }
  const X=(hx+.5)*cs, Y=(hy+.5)*cs, d=G.dir, px=-d.y, py=d.x; for(const sg of [-1,1]){ const ex=X+d.x*cs*.17+px*sg*cs*.2, ey=Y+d.y*cs*.17+py*sg*cs*.2; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(ex,ey,cs*.115,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(ex+d.x*cs*.04,ey+d.y*cs*.04,cs*.055,0,6.283); cx.fill(); } }

function mountSnake(el,wn){
  const D=(S.aw.data.snake=S.aw.data.snake||{cfg:{},best:{}}); D.best=D.best||{}; const C=D.cfg=Object.assign({},SN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(50,Math.max(10,C.w|0)); C.h=Math.min(40,Math.max(10,C.h|0)); C.speed=Math.min(30,Math.max(3,C.speed|0)); C.accel=Math.min(10,Math.max(0,C.accel|0)); C.len=Math.min(10,Math.max(2,C.len|0)); C.grow=Math.min(5,Math.max(1,C.grow|0));
    C.apples=Math.min(10,Math.max(1,C.apples|0)); C.every=Math.min(10,Math.max(.5,+C.every||3)); C.life=Math.min(30,Math.max(0,C.life|0)); if(C.life>0&&C.life<3) C.life=3; C.gold=Math.min(40,Math.max(0,C.gold|0)); C.poison=Math.min(40,Math.max(0,C.poison|0));
    C.obs=Math.min(Math.floor(C.w*C.h*.12),Math.max(0,C.obs|0)); C.cell=Math.min(48,Math.max(14,C.cell|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('sn',`<div class="gmh"><div class="gmi">🍎<b class="snsc">0</b></div><div class="gmi">🏆<b class="snbs">0</b></div><div class="gmi"><span>Długość</span><b class="snln">0</b></div><button class="gmbt snpz" title="Pauza">⏸</button></div><div class="gmb"><canvas class="mnv"></canvas><div class="gmov"><b></b><span></span><button class="gjbt">Zagraj ponownie</button></div></div><div class="gmx"><span>Strzałki lub WASD: sterowanie, spacja: pauza.</span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('cl','Klasyczny')}${preBtn('fast','Szybki')}${preBtn('maze','Labirynt')}${preBtn('open','Bez ścian')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',10,50,C.w)}${gmSl('h','Wiersze',10,40,C.h)}${gmSl('obs','Przeszkody',0,Math.floor(C.w*C.h*.12),C.obs)}${gmSl('cell','Rozmiar pola',14,48,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}${gmTg('wrap','Przenikanie ścian',C.wrap)}
     <div class="gmg">Wąż</div>${gmSl('speed','Szybkość',3,30,C.speed)}${gmSl('accel','Przyspieszanie',0,10,C.accel)}${gmSl('len','Początkowa długość',2,10,C.len)}${gmSl('grow','Wzrost za jabłko',1,5,C.grow)}
     <div class="gmg">Jabłka</div>${gmSl('apples','Jabłka naraz',1,10,C.apples)}${gmSl('every','Nowe jabłko co',.5,10,C.every,.5)}${gmSl('life','Czas życia jabłka',0,30,C.life)}${gmSl('gold','Złote jabłka',0,40,C.gold)}${gmSl('poison','Trujące jabłka',0,40,C.poison)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Złote jabłko: +30 pkt i dłuższy wzrost. Trujące: -5 pkt i skrócenie węża. Zmiany planszy i węża obowiązują od nowej gry.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d'), ov=q('.gmov');
  let G=null, st='ready', cs=24, dpr=window.devicePixelRatio||1, bg=null, raf=0, last=0, acc=0, f=1, pvRaf=0, pvG=null, pvBg=null, pvKey='', pvAcc=0, pvLast=0;
  const now=()=>performance.now(), bestKey=()=>`${C.w}x${C.h}-s${C.speed}${C.wrap?'w':''}-o${C.obs}`;
  const show=(a,b,btn)=>{ ov.classList.toggle('show',!!a); if(a){ ov.querySelector('b').textContent=a; ov.querySelector('span').textContent=b||''; ov.querySelector('button').style.display=btn?'':'none'; } };
  function hud(){ q('.snsc').textContent=G.score; q('.snln').textContent=G.snake.length; const b=D.best[bestKey()]|0; q('.snbs').textContent=Math.max(b,G.score); }
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(10,Math.min(60,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); bg=snBg(G,C,cs,dpr); }
  function newGame(){ fix(); G=snNew(C); st='ready'; acc=0; f=1; layout(); hud(); show(t('Naciśnij strzałkę, aby zacząć'),'',false); q('.snpz').textContent='⏸'; render(now()); }
  function render(t0){ cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,G.w*cs,G.h*cs); cx.drawImage(bg,0,0,G.w*cs,G.h*cs); snDraw(cx,G,cs,t0,f,!G.alive); }
  function end(why){ st='over'; const k=bestKey(), nb=G.score>(D.best[k]|0); if(nb){ D.best[k]=G.score; save(); } hud(); show(t('Koniec gry'),t('Wynik: {n}').replace('{n}',G.score)+(nb&&G.score>0?' · '+t('Nowy rekord!'):''),true); }
  function frame(t0){ raf=0; if(!root.isConnected) return; const dt=Math.min(100,t0-(last||t0)); last=t0;
    if(st==='run'){ snTick(G,C,dt); acc+=dt; const sm=1000/G.speed; while(acc>=sm&&st==='run'){ acc-=sm; snStep(G,C); if(!G.alive){ end(); break; } hud(); } f=gmAnim()?Math.min(1,acc/sm):1; }
    render(t0); if(st==='run') raf=requestAnimationFrame(frame); }
  const kick=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(frame); } };
  function start(){ if(st==='ready'){ st='run'; show(''); acc=0; kick(); } }
  function pause(){ if(st==='run'){ st='pause'; q('.snpz').textContent='▶'; show(t('Pauza'),t('Naciśnij spację, aby wznowić'),false); render(now()); } else if(st==='pause'){ st='run'; q('.snpz').textContent='⏸'; show(''); kick(); } }
  function turn(d){ if(st==='over') return; if(st==='ready'){ if(d.x===-1) return; G.dir=d; start(); return; } if(st!=='run') return; const ref=G.q.length?G.q[G.q.length-1]:G.dir; if(d.x===-ref.x&&d.y===-ref.y||d.x===ref.x&&d.y===ref.y) return; if(G.q.length<2) G.q.push(d); }
  const KEYS={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0}};
  root.tabIndex=-1; root.style.outline='none';
  root.addEventListener('keydown',e=>{ if(e.ctrlKey||e.altKey||e.metaKey) return; const k=e.key.length===1?e.key.toLowerCase():e.key, d=KEYS[k]; if(d){ e.preventDefault(); turn(d); } else if(k===' '||k==='p'){ e.preventDefault(); pause(); } else if(k==='r'){ newGame(); } });
  root.addEventListener('pointerdown',e=>{ if(!e.target.closest('.gmp,.gjm,input,button')) root.focus({preventScroll:true}); });
  let sw=null; cv.addEventListener('pointerdown',e=>{ sw={x:e.clientX,y:e.clientY}; if(st==='pause') pause(); }); cv.addEventListener('pointerup',e=>{ if(!sw) return; const dx=e.clientX-sw.x, dy=e.clientY-sw.y; sw=null; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; turn(Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)}); });
  q('.snpz').addEventListener('click',()=>{ if(st==='ready') return; pause(); root.focus({preventScroll:true}); }); ov.querySelector('button').addEventListener('click',()=>{ newGame(); root.focus({preventScroll:true}); });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden&&st==='run') pause(); });
  new ResizeObserver(()=>{ if(G){ layout(); render(now()); } }).observe(q('.gmb'));
  // ----- konfigurator: podgląd na żywo (autopilot na planszy o wybranych ustawieniach) -----
  function pvReset(){ const key=[C.w,C.h,C.obs,C.wrap,C.len,C.apples,C.gold,C.poison,C.life].join(); if(key===pvKey&&pvG&&pvG.alive) return; pvKey=key; pvG=snNew(C); const W=pv.width, H=pv.height, c=Math.max(2,Math.min((W-10*dpr)/C.w,(H-10*dpr)/C.h)); pvBg=snBg(pvG,C,c,1); pvBg._c=c; }
  function pvDraw(t0){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); pvReset(); const c=pvBg._c; px.translate((W-c*C.w)/2,(H-c*C.h)/2); px.drawImage(pvBg,0,0,c*C.w,c*C.h); snDraw(px,pvG,c,t0,Math.min(1,pvAcc/(1000/Math.max(4,Math.min(20,pvG.speed)))),!pvG.alive); }
  function pvLoop(t0){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; const dt=Math.min(100,t0-(pvLast||t0)); pvLast=t0; pvReset(); const sp=Math.max(4,Math.min(20,C.speed)); pvAcc+=dt; snTick(pvG,C,dt);
    while(pvAcc>=1000/sp){ pvAcc-=1000/sp; snAI(pvG); snStep(pvG,C); if(!pvG.alive){ pvKey=''; pvReset(); break; } } pvDraw(t0); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; };
    pn.querySelector('[data-k=obs]').max=Math.floor(C.w*C.h*.12); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('obs',C.obs); o('cell',C.cell+' px'); o('speed',C.speed+'/s'); o('accel',C.accel+'%'); o('len',C.len); o('grow',C.grow); o('apples',C.apples); o('every',C.every+' s'); o('life',C.life?C.life+' s':t('bez limitu')); o('gold',C.gold+'%'); o('poison',C.poison+'%');
    pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>{ const p=SN_PRE[b.dataset.p]; b.classList.toggle('on',Object.keys(p).every(k=>C[k]===p[k])); }); gmPaint(pn);
    const sc=C.speed/30*.55+(C.wrap?0:.1)+Math.min(.25,C.obs/(C.w*C.h)*2.2)+C.poison/100*.5+C.accel/10*.15; gmRing(pn,C.speed/30,C.speed+'/s',gmDiff(sc)); pvKey=''; if(!pvRaf){ pvReset(); pvDraw(now()); } }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvLast=0; pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; fix(); sync(); if(k==='cell'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; sync(); if(k==='fit'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ Object.assign(C,SN_PRE[b.dataset.p]); sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); root.focus({preventScroll:true}); } });
  newGame(); sync(); root.focus({preventScroll:true});
  el.__sn={ get G(){ return G; }, get st(){ return st; }, turn, pause, newGame, step:()=>snStep(G,C), C };
}


// ===== src/js/20-app-files.js =====
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

