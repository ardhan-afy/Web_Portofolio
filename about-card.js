/* Small, dependency-free spring simulation. CSS perspective + two printable card faces.
   Positions are in CSS pixels. Only active animation frames are scheduled. */
(() => {
  'use strict';
  const stage = document.getElementById('idStage'), rig = document.getElementById('idRig'), card = document.getElementById('idCard'), flip = document.getElementById('idFlip');
  if (!stage || !rig || !card || !flip) return;
  const strap = stage.querySelector('.id-strap'), shadow = stage.querySelector('.id-strap-shadow'), seam = stage.querySelector('.id-seam'), lettering = stage.querySelector('#idStrapText'), svg = stage.querySelector('svg');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reduced.matches || document.documentElement.classList.contains('motion-off');
  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  let pitch=0,yaw=9,vp=0,vq=0;
  let w=0,h=0,cw=0,ch=0,restY=0,x=0,y=0,a=-5,vx=0,vy=0,va=0,targetX=0,targetY=0,drag=null,raf=0,last=0,back=false,ignoreClick=false;
  function draw(){
    rig.style.transform=`translate3d(${x+w/2-cw/2}px,${y}px,0) rotateZ(${a}deg) rotateY(${yaw}deg) rotateX(${pitch}deg)`;
    const rad=a*Math.PI/180;
    const endX=w/2+x+28*Math.sin(rad), endY=y-28*Math.cos(rad), bend=clamp(x*.22,-35,35);
    rig.style.setProperty('--shine-pos',`${clamp(35+yaw*.65,12,59)}%`);
    rig.style.setProperty('--card-glint',String(clamp(.38+Math.abs(yaw)*.007,.38,.68)));
    const d=`M ${w/2} -4 C ${w/2+bend} ${endY*.32}, ${endX-bend} ${endY*.7}, ${endX} ${endY+2}`;
    [strap,shadow,seam,lettering].forEach(p=>p.setAttribute('d',d));
  }
  function measure(){
    w=stage.clientWidth;h=stage.clientHeight;cw=rig.offsetWidth;ch=rig.offsetHeight;restY=Math.min(110,h-ch-23);targetY=restY;targetX=0;
    x=0;y=restY;a=still()?0:-5;pitch=0;yaw=still()?0:9;vp=vq=0;vx=vy=va=0;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);draw();
  }
  function reset(){drag=null;stage.classList.remove('is-dragging');targetX=0;targetY=restY;}
  function tick(time){
    raf=0;if(document.hidden){reset();return;}
    const dt=last?Math.min((time-last)/1000,.032):1/60;last=time;
    if(still()){x=0;y=restY;a=0;pitch=yaw=vp=vq=0;vx=vy=va=0;draw();last=0;return;}
    const stiffness=drag?150:39,damping=drag?24:10;
    vx+=(stiffness*(targetX-x)-damping*vx)*dt;vy+=(stiffness*(targetY-y)-damping*vy)*dt;
    x+=vx*dt;y+=vy*dt;
    const ta=clamp(-5+x*.19+vx*.021,-23,23);va+=(60*(ta-a)-10*va)*dt;a+=va*dt;
    // A swinging rigid badge turns in depth as well as in the screen plane.
    const tp=clamp((restY-y)*.48-vy*.035,-26,24);
    const tq=clamp(9+x*.57+vx*.044,-48,48);
    vp+=(66*(tp-pitch)-10*vp)*dt;vq+=(57*(tq-yaw)-9*vq)*dt;
    pitch+=vp*dt;yaw+=vq*dt;
    draw();
    if(drag||Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(vx)+Math.abs(vy)+Math.abs(ta-a)+Math.abs(va)+Math.abs(tp-pitch)+Math.abs(tq-yaw)+Math.abs(vp)+Math.abs(vq)>.18)raf=requestAnimationFrame(tick);
    else{x=targetX;y=targetY;a=ta;pitch=tp;yaw=tq;draw();last=0;}
  }
  function wake(){if(!raf){last=0;raf=requestAnimationFrame(tick);}}
  function toggle(){back=!back;card.classList.toggle('is-back',back);flip.setAttribute('aria-pressed',String(back));flip.innerHTML=back?'Lihat depan <span aria-hidden="true">↻</span>':'Balik kartu <span aria-hidden="true">↻</span>';card.setAttribute('aria-label',back?'Sisi belakang, QR GitHub Ardhan. Klik untuk kembali.':'Kartu Ardhan, Web Developer. Klik untuk membalik, atau gunakan panah untuk menggerakkan.');}
  card.addEventListener('pointerdown',e=>{if(e.button!==0||still())return;drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,x,y,moved:false};ignoreClick=false;card.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');wake();});
  card.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||still())return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.hypot(dx,dy)>6)drag.moved=true;const limit=Math.max(8,Math.min(68,(w-cw)/2-12));targetX=clamp(drag.x+dx,-limit,limit);targetY=clamp(drag.y+dy,Math.max(44,restY-48),Math.min(h-ch-8,restY+50));wake();});
  function release(e){if(!drag||drag.id!==e.pointerId)return;ignoreClick=drag.moved;reset();if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);wake();}
  card.addEventListener('pointerup',release);card.addEventListener('pointercancel',release);card.addEventListener('lostpointercapture',release);
  card.addEventListener('click',e=>{if(ignoreClick&&e.detail!==0){ignoreClick=false;return;}ignoreClick=false;toggle();});flip.addEventListener('click',toggle);
  card.addEventListener('keydown',e=>{if(still())return;const d={ArrowLeft:[-25,0],ArrowRight:[25,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[e.key];if(!d)return;e.preventDefault();targetX=d[0];targetY=restY+d[1];wake();setTimeout(()=>{if(!drag){targetX=0;targetY=restY;wake();}},160);});
  new ResizeObserver(()=>{reset();measure();}).observe(stage);
  new MutationObserver(()=>{if(still()){reset();wake();}else{a=-5;yaw=9;draw();}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',()=>{reset();measure();});document.addEventListener('visibilitychange',()=>{if(document.hidden){reset();if(raf)cancelAnimationFrame(raf);raf=0;last=0;}else{measure();}});
  measure();
})();
