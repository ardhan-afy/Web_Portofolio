// Navigasi, scroll reveal, dan validasi kontak.
document.getElementById('year').textContent = new Date().getFullYear();
const burgerBtn = document.getElementById('burgerBtn');
const navTabs = document.getElementById('navTabs');
const navbar = document.getElementById('navbar');
const tabs = [...navTabs.querySelectorAll('.tab')];
function setMenu(open) {
  navTabs.classList.toggle('open', open);
  burgerBtn.classList.toggle('open', open);
  navbar.classList.toggle('menu-open', open);
  burgerBtn.setAttribute('aria-expanded', String(open));
  burgerBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}
burgerBtn.addEventListener('click', () => setMenu(!navTabs.classList.contains('open')));
navbar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (!navbar.contains(e.target)) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && navTabs.classList.contains('open')) { setMenu(false); burgerBtn.focus(); } });
matchMedia('(min-width: 961px)').addEventListener('change', () => setMenu(false));
const sections = [...document.querySelectorAll('.hero, main .section')];
let scheduled = false;
function updateNav() {
  navbar.classList.toggle('is-scrolled', scrollY > 16);
  let active = sections[0]?.id;
  for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .36) active = section.id;
  if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = sections.at(-1)?.id;
  tabs.forEach(tab => {
    const selected = tab.dataset.tab === active;
    tab.classList.toggle('active', selected);
    if (selected) tab.setAttribute('aria-current', 'location'); else tab.removeAttribute('aria-current');
  });
  scheduled = false;
}
function onScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNav); } }
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
updateNav();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); } });
  }, { threshold: .08 });
  document.querySelectorAll('.about-grid, .skill-card, .timeline-item, .cert-card, .contact-grid').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
    el.addEventListener('focusin', () => { el.classList.add('in-view'); observer.unobserve(el); }, { once: true });
  });
}
// ============================================================
// VALIDASI FORM KONTAK (SISI KLIEN)
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  input.closest('.form-group').classList.toggle('error', Boolean(message));
  errorEl.textContent = message || '';
  input.setAttribute('aria-invalid', String(Boolean(message))); 
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;

  if (name.length < 3) {
    setError('name', 'nameError', 'Nama minimal 3 karakter.');
    valid = false;
  } else {
    setError('name', 'nameError', '');
  }

  if (!isValidEmail(email)) {
    setError('email', 'emailError', 'Format email tidak valid.');
    valid = false;
  } else {
    setError('email', 'emailError', '');
  }

  if (message.length < 10) {
    setError('message', 'messageError', 'Pesan minimal 10 karakter.');
    valid = false;
  } else {
    setError('message', 'messageError', '');
  }

  if (!valid) { contactForm.querySelector('[aria-invalid="true"]')?.focus(); return; }

  // Portofolio statis: buka draf email, bukan simulasi pesan terkirim.
  const recipient = document.querySelector('a[href^="mailto:"]').getAttribute('href');
  const subject = encodeURIComponent('Pesan portofolio dari ' + name);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
  formSuccess.textContent = 'Draf email disiapkan. Kirim melalui aplikasi email Anda; website ini tidak mengirim pesan secara otomatis.';
  window.location.href = `${recipient}?subject=${subject}&body=${body}`;
});
