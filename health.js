// ============================================================
// PROJECT UNGGULAN — carousel 3D (coverflow) untuk tiap project
// Geser / klik ponsel samping / tombol panah / titik untuk ganti layar.
// ============================================================
document.querySelectorAll('.hp-feature').forEach(function (root) {
  const viewport = root.querySelector('.hp-viewport');
  if (!viewport) return;

  const track = viewport.querySelector('.hp-track');
  const phones = [...viewport.querySelectorAll('.hp-phone')];
  const dotsBox = root.querySelector('.hp-dots');
  const caption = root.querySelector('.hp-caption');
  const n = phones.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let timer = null;

  const dots = phones.map((p, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'hp-dot';
    d.setAttribute('aria-label', 'Lihat layar ' + p.dataset.title);
    d.addEventListener('click', () => { go(i); restart(); });
    dotsBox.appendChild(d);
    return d;
  });

  function layout() {
    const narrow = viewport.clientWidth < 420;
    const wide = root.classList.contains('is-wide');
    const gap = wide ? (narrow ? 120 : 205) : (narrow ? 118 : 168);
    phones.forEach((p, i) => {
      // selisih posisi terpendek secara melingkar: -2 ... 2
      const off = ((i - active + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
      const a = Math.abs(off);
      const x = off * gap;
      const z = -a * 140;
      const ry = -off * 32;
      const s = a === 0 ? 1 : (wide ? 0.74 : 0.8);
      p.style.transform =
        `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`;
      p.style.zIndex = String(10 - a);
      p.style.opacity = a > 1 ? '0' : '1';
      p.style.pointerEvents = a > 1 ? 'none' : 'auto';
      p.classList.toggle('is-active', a === 0);
      p.tabIndex = a === 0 ? -1 : 0;
      p.setAttribute('aria-hidden', a > 1 ? 'true' : 'false');
    });
    dots.forEach((d, i) => d.classList.toggle('is-on', i === active));
    caption.textContent = phones[active].dataset.title;
  }

  function go(i) { active = (i + n) % n; layout(); }
  function next() { go(active + 1); }
  function prev() { go(active - 1); }

  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(next, 4500);
  }

  phones.forEach((p, i) => p.addEventListener('click', () => { if (!moved) { go(i); restart(); } }));
  root.querySelector('.hp-next').addEventListener('click', () => { next(); restart(); });
  root.querySelector('.hp-prev').addEventListener('click', () => { prev(); restart(); });

  // geser dengan jari / mouse
  let startX = null, moved = false;
  viewport.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; clearInterval(timer); });
  viewport.addEventListener('pointermove', e => {
    if (startX !== null && Math.abs(e.clientX - startX) > 8) moved = true;
  });
  window.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
    setTimeout(() => { moved = false; }, 0);
    restart();
  });

  // keyboard
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft') { prev(); restart(); }
  });

  // sedikit miring mengikuti kursor (hanya perangkat dengan mouse)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    viewport.addEventListener('pointermove', e => {
      const r = viewport.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      track.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 6}deg)`;
    });
    viewport.addEventListener('pointerleave', () => { track.style.transform = ''; });
  }

  // jalan hanya saat terlihat di layar
  new IntersectionObserver(([en]) => { en.isIntersecting ? restart() : clearInterval(timer); }).observe(viewport);
  new ResizeObserver(layout).observe(viewport);

  if (n < 2) root.querySelector('.hp-nav').hidden = true;
  layout();
});
