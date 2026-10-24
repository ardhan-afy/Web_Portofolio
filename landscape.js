// Avatar 3D: bergoyang pelan, ikut pointer
(function(){
  const card = document.querySelector('.av-card'); if (!card) return;
  let tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5) * 40; ty = (e.clientY / innerHeight - .5) * -30; });
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function f(t){ card.style.transform = `rotateY(${tx + (still ? 0 : Math.sin(t / 1100) * 12)}deg) rotateX(${ty}deg)`; requestAnimationFrame(f); })(0);
})();

// Efek "drum" 3D: judul, timeline, dan peta melengkung saat masuk/keluar layar
(function(){
  const els = [...document.querySelectorAll('.section-label, .section-title, .section-sub, .about-photo, .about-text, .timeline-item, .map-wrap')];
  els.forEach(e => e.classList.add('drum'));
  let tick = false;
  function run(){
    const vh = innerHeight;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
      el.style.transform = `perspective(1100px) rotateX(${-p * 14}deg) translateZ(${-Math.abs(p) * 60}px)`;
    });
    tick = false;
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', run); run();
})();
