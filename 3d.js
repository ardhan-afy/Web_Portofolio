// ============ LOKASI SEKOLAH — EDIT DI SINI ============
// q = nama untuk dicari otomatis di peta. lng/lat = koordinat cadangan (perkiraan, ganti bila perlu).
const PLACES = [
  { id: 'sekolah', name: 'SMK Krian 1',             note: 'Rekayasa Perangkat Lunak, 2023–sekarang', q: 'SMK Krian 1 Sidoarjo',                  lng: 112.5890, lat: -7.4190 },
  { id: 'smp',     name: 'SMPN 1 Balongbendo',      note: 'Sekolah menengah pertama, 2020–2023',     q: 'SMPN 1 Balongbendo Sidoarjo',           lng: 112.5500, lat: -7.4750 },
  { id: 'mi',      name: 'MI Miftahul Ulum Kraton', note: 'Pendidikan dasar, 2014–2020',             q: 'MI Miftahul Ulum Kraton Krian Sidoarjo', lng: 112.5740, lat: -7.4060 },
];

// ============ BACKGROUND 3D (three.js) ============
(function(){
  const canvas = document.getElementById('bg3d');
  if (!canvas || typeof THREE === 'undefined') return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 14;
  scene.add(new THREE.AmbientLight(0x8fc4ff, .6));
  const light = new THREE.PointLight(0x3d8bff, 2, 60); light.position.set(6, 6, 10); scene.add(light);

  const group = new THREE.Group(); scene.add(group);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x3d8bff, wireframe: true, transparent: true, opacity: .55 }));
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, .38, 120, 16),
    new THREE.MeshStandardMaterial({ color: 0x8fc4ff, metalness: .6, roughness: .25 }));
  group.add(core, knot);
  group.position.x = innerWidth > 900 ? 5 : 0;

  const cubes = [];
  for (let i = 0; i < 46; i++){
    const s = .12 + Math.random() * .3;
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s),
      new THREE.MeshStandardMaterial({ color: i % 5 ? 0x8fc4ff : 0x7cffb2, transparent: true, opacity: .8 }));
    const r = 5 + Math.random() * 7, a = Math.random() * 6.28, h = (Math.random() - .5) * 14;
    m.userData = { r, a, h, v: .1 + Math.random() * .25 };
    cubes.push(m); scene.add(m);
  }

  let mx = 0, my = 0, sy = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sy = scrollY; }, { passive: true });
  function resize(){ renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  const clock = new THREE.Clock();
  function frame(){
    const t = clock.getElapsedTime();
    core.rotation.set(t * .12 + sy * .0008, t * .17, 0);
    knot.rotation.set(t * .3, t * .2 + sy * .001, 0);
    group.position.y = Math.sin(t * .6) * .4 - sy * .0016;
    cubes.forEach(c => { const d = c.userData; d.a += d.v * .004; c.position.set(Math.cos(d.a) * d.r, d.h - sy * .002, Math.sin(d.a) * d.r - 4); c.rotation.x += .01; c.rotation.y += .013; });
    camera.position.x += (mx * 2.5 - camera.position.x) * .04;
    camera.position.y += (-my * 2 - camera.position.y) * .04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (!still) requestAnimationFrame(frame);
  }
  frame();
})();

// ============ KARTU MIRING 3D ============
document.querySelectorAll('.project-card, .skill-card, .cert-card, .contact-info, .contact-form').forEach(el => {
  el.classList.add('tilt');
  el.addEventListener('mousemove', e => {
    const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    el.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(6px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ============ PETA 3D (MapLibre + gedung 3D), terhubung ke daftar pendidikan ============
(function(){
  const box = document.getElementById('map'), fb = document.getElementById('mapFallback'), cap = document.getElementById('mapPlaces');
  if (!box) return;
  const fail = () => fb && fb.classList.add('show');
  if (typeof maplibregl === 'undefined') return fail();

  let map;
  try {
    map = new maplibregl.Map({ container: box, style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [PLACES[0].lng, PLACES[0].lat], zoom: 15.5, pitch: 60, bearing: -25, antialias: true });
  } catch (e) { return fail(); }
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.on('error', e => { if (e && e.error && /style|Failed to fetch/i.test(e.error.message || '')) fail(); });

  let spin = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  ['mousedown', 'touchstart', 'wheel'].forEach(ev => box.addEventListener(ev, () => { spin = false; }, { passive: true }));
  (function orbit(){ if (spin) map.setBearing(map.getBearing() + .05); requestAnimationFrame(orbit); })();

  const markers = {}, geo = {};
  PLACES.forEach(p => {
    const el = document.createElement('div'); el.className = 'pin';
    const m = new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat])
      .setPopup(new maplibregl.Popup({ offset: 22 }).setHTML(`<strong>${p.name}</strong><p>${p.note}</p>`)).addTo(map);
    markers[p.id] = m;
    el.addEventListener('click', () => go(p.id));
  });

  async function resolve(p){            // cari lokasi asli lewat OpenStreetMap; kalau gagal pakai koordinat cadangan
    if (geo[p.id]) return; geo[p.id] = true;
    try {
      const c = new AbortController(), t = setTimeout(() => c.abort(), 3500);
      const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=' + encodeURIComponent(p.q), { signal: c.signal });
      clearTimeout(t);
      const j = await r.json();
      if (j[0]) { p.lng = +j[0].lon; p.lat = +j[0].lat; markers[p.id].setLngLat([p.lng, p.lat]); }
    } catch (e) {}
  }
  function caption(p){
    cap.innerHTML = `<strong>${p.name}</strong><small>${p.note}</small><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q)}" target="_blank" rel="noopener">Buka di Google Maps</a>`;
  }
  async function go(id){
    const p = PLACES.find(x => x.id === id); spin = false; caption(p);
    document.querySelectorAll('.place-link').forEach(e => e.classList.toggle('active', e.dataset.place === id));
    box.closest('.map-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    await resolve(p);
    map.flyTo({ center: [p.lng, p.lat], zoom: 17, pitch: 65, bearing: map.getBearing() + 40, duration: 2600, essential: true });
    const pop = markers[id].getPopup(); if (!pop.isOpen()) markers[id].togglePopup();
  }
  document.querySelectorAll('.place-link').forEach(el => {
    el.addEventListener('click', () => go(el.dataset.place));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(el.dataset.place); } });
  });
  caption(PLACES[0]);
})();
