// Musik hanya diputar atas pilihan pengunjung.
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bgm');
  const button = document.getElementById('musicToggle');
  if (!audio || !button) return;
  audio.volume = .35;
  function sync() {
    button.setAttribute('aria-pressed', String(!audio.paused));
    button.textContent = audio.paused ? 'Putar musik latar' : 'Jeda musik latar';
  }
  button.addEventListener('click', async () => {
    if (!audio.paused) audio.pause();
    else try { await audio.play(); } catch { button.textContent = 'Musik tidak dapat diputar — coba lagi'; }
  });
  audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
});
