// ============================================================
// TAHUN OTOMATIS DI FOOTER
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// MENU MOBILE (BURGER)
// ============================================================
const burgerBtn = document.getElementById('burgerBtn');
const navTabs = document.getElementById('navTabs');

burgerBtn.addEventListener('click', () => {
  const isOpen = navTabs.classList.toggle('open');
  burgerBtn.classList.toggle('open', isOpen);
  burgerBtn.setAttribute('aria-expanded', isOpen);
});

// Tutup menu mobile setiap kali link diklik
document.querySelectorAll('.tab').forEach(link => {
  link.addEventListener('click', () => {
    navTabs.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// HIGHLIGHT TAB AKTIF SESUAI SECTION YANG SEDANG DILIHAT
// ============================================================
const sections = document.querySelectorAll('main .section, .hero');
const tabs = document.querySelectorAll('.tab');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(section => {
  if (section.id) navObserver.observe(section);
});

// ============================================================
// ANIMASI REVEAL SAAT SCROLL + ANIMASI SKILL BAR
// ============================================================
const revealTargets = document.querySelectorAll(
  '.about-grid, .skill-card, .project-card, .timeline-item, .cert-card, .contact-grid'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // Jika elemen yang muncul adalah skill-card, jalankan animasi bar
      if (entry.target.classList.contains('skill-card')) {
        entry.target.querySelectorAll('.bar span').forEach(bar => {
          bar.style.width = bar.getAttribute('style').match(/width:\s*([\d.]+%)/)[1];
        });
      }

      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// Simpan lebar asli tiap bar skill, lalu set ke 0 sebelum dianimasikan
document.querySelectorAll('.bar span').forEach(bar => {
  const targetWidth = bar.style.width;
  bar.setAttribute('data-target-width', targetWidth);
  bar.style.width = '0';
});

// Override observer callback agar pakai data-target-width (lebih aman)
const skillBarObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar span').forEach(bar => {
        bar.style.width = bar.getAttribute('data-target-width');
      });
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillBarObserver.observe(card);
});

// ============================================================
// NAVBAR: SEDIKIT BAYANGAN SAAT DI-SCROLL
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 12
    ? '0 8px 24px -16px rgba(18,20,28,0.35)'
    : 'none';
});

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

  if (!valid) return;

  // Di sini kamu bisa hubungkan ke backend / layanan form (mis. Formspree, EmailJS, dll)
  // Untuk sekarang, form hanya menampilkan pesan sukses secara lokal.
  formSuccess.textContent = `Terima kasih, ${name}! Pesanmu sudah tercatat. Saya akan segera membalas ke ${email}.`;
  contactForm.reset();
});
