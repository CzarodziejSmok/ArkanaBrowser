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
