/* Optional motion layer. Existing functionality works if disabled or unavailable. */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('motionToggle');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  if (!toggle || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  let paused = false;
  try { paused = localStorage.getItem('ardhan-motion') === 'off'; } catch (_) {}
  let revealObserver, titleObserver;
  const typing = new Map();
  const running = new Set();
  const revealed = new WeakSet();
  const typed = new WeakSet();
  const ease = 'cubic-bezier(.22,.68,.2,1)';
  const enabled = () => !paused && !media.matches;
  const animate = (el, frames, options) => {
    if (!enabled()) return;
    const animation = el.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  };
  function finishTitle(el) {
    const state = typing.get(el);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    el.replaceChildren(state.text);
    el.removeAttribute('aria-label');
    el.classList.remove('motion-typing');
    typing.delete(el);
  }
  function typeTitle(el) {
    if (!enabled() || typed.has(el) || el.children.length) return;
    typed.add(el);
    const text = el.textContent.trim();
    if (!text) return;
    const original = document.createElement('span');
    original.className = 'motion-title-original'; original.textContent = text; original.setAttribute('aria-hidden','true');
    const live = document.createElement('span');
    live.className = 'motion-title-live'; live.setAttribute('aria-hidden','true');
    el.setAttribute('aria-label',text); el.classList.add('motion-typing'); el.replaceChildren(original,live);
    const chars = Array.from(text), duration = Math.min(900,Math.max(350,chars.length * 33));
    const state = {text,frame:0}; typing.set(el,state);
    let start;
    function step(now) {
      if (!enabled()) { finishTitle(el); return; }
      start ??= now;
      const progress = Math.min(1,(now-start)/duration);
      live.textContent = chars.slice(0,Math.max(1,Math.ceil(progress * chars.length))).join('');
      if (progress < 1) state.frame = requestAnimationFrame(step);
      else finishTitle(el);
    }
    state.frame = requestAnimationFrame(step);
  }
  const revealTargets = [...document.querySelectorAll('main .section-label, main .section-sub, .work-picker, .hp-stage, .hp-info, .technology-grid, .skill-card, .about-grid, .timeline-item, .cert-card, .cv-grid, .contact-info, .contact-lead .section-title')].filter(el => !el.closest('.hp-feature[hidden]'));
  const titles = [...document.querySelectorAll('main .section-title')].filter(el => !el.closest('.contact-lead') && !el.children.length);
  function setup() {
    revealObserver?.disconnect(); titleObserver?.disconnect();
    root.classList.toggle('motion-off', !enabled());
    toggle.setAttribute('aria-pressed', String(!enabled()));
    toggle.querySelector('.motion-label').textContent = enabled() ? 'Pause motion' : 'Play motion';
    toggle.disabled = media.matches; toggle.title = media.matches ? 'Animasi nonaktif sesuai pengaturan perangkat' : 'Hentikan atau aktifkan animasi';
    if (!enabled()) {
      for (const el of revealTargets) el.classList.remove('motion-pending');
      for (const el of [...typing.keys()]) finishTitle(el);
      for (const animation of running) animation.cancel();
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      for (const {target:el,isIntersecting} of entries) {
        if (!isIntersecting) continue;
        revealObserver.unobserve(el); revealed.add(el); el.classList.remove('motion-pending');
        animate(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:Number(el.dataset.motionDelay||0),easing:ease,fill:'backwards'});
      }
    }, {threshold:0,rootMargin:'0px 0px -24px 0px'});
    for (const el of revealTargets) {
      if (revealed.has(el)) continue;
      if (el.getBoundingClientRect().bottom <= 0 || el.closest('[hidden]')) { revealed.add(el); continue; }
      const i = Array.from(el.parentElement.children).indexOf(el);
      el.dataset.motionDelay = String(Math.min(i,3)*55);
      el.classList.add('motion-pending'); revealObserver.observe(el);
    }
    titleObserver = new IntersectionObserver(entries => {
      for (const {target:el,isIntersecting} of entries) if (isIntersecting) { titleObserver.unobserve(el); typeTitle(el); }
    },{threshold:0,rootMargin:'0px 0px -20px 0px'});
    for (const el of titles) if (!typed.has(el) && el.getBoundingClientRect().bottom>0) titleObserver.observe(el);
  }
  root.classList.add('motion-ready'); toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; try {localStorage.setItem('ardhan-motion',paused?'off':'on')} catch (_) {} setup(); });
  media.addEventListener('change',setup);
  const hero = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver(([entry])=>root.classList.toggle('motion-away',!entry.isIntersecting));
  heroObserver.observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) root.classList.add('motion-away');else root.classList.toggle('motion-away',hero.getBoundingClientRect().bottom<=0);});
  // Keep focusable content visible for keyboard users, even before its reveal.
  document.addEventListener('focusin',e=>{const el=e.target.closest('.motion-pending');if(el){el.classList.remove('motion-pending');revealed.add(el);revealObserver?.unobserve(el);}});
  document.querySelectorAll('[data-work]').forEach(button=>button.addEventListener('click',()=>{
    const project=document.getElementById(button.dataset.work);
    if (!project || project.hidden) return;
    project.querySelectorAll('.motion-pending').forEach(el=>{el.classList.remove('motion-pending');revealed.add(el);revealObserver?.unobserve(el);});
    animate(project,[{opacity:.35,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:ease});
  }));
  setup();
})();
