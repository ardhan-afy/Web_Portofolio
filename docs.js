// ============================================================
// LIGHTBOX — klik sertifikat / CV untuk memperbesar
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const closeBtn = document.getElementById('lbClose');
  if (!box) return;
  let lastFocus = null;

  function open(src, caption) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = caption || '';
    cap.textContent = caption || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    img.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-zoom]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('a')) return;          // tautan di dalam kartu tetap jalan
      open(el.dataset.zoom, el.dataset.caption);
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el.dataset.zoom, el.dataset.caption); }
    });
  });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });
});
