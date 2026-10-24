// Musik latar otomatis saat halaman dibuka.
// Catatan: browser dapat memblokir autoplay dengan suara sampai pengunjung berinteraksi.
document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('bgm');
  if (!audio) return;
  audio.volume = 0.35;
  const startMusic = () => audio.play().catch(() => {
    // Coba lagi setelah interaksi pertama jika browser memblokir autoplay.
    const retry = () => {
      audio.play().catch(() => {});
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
    };
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });
  });
  startMusic();
});
