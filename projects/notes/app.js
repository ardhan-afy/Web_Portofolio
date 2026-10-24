let catatan = JSON.parse(localStorage.getItem("catatan")) || [];
let isDarkMode = localStorage.getItem("theme") === "dark";

// Inisialisasi Tema
if (isDarkMode) {
    document.body.setAttribute("data-theme", "dark");
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
    }
}

// Render daftar catatan
function tampilkanCatatan(filteredData = null) {
    const daftar = document.getElementById("daftarCatatan");
    let dataToRender = filteredData || catatan;

    // Urutkan: Catatan terpilih/Pinned ada di paling atas
    if (!filteredData) {
        dataToRender = [...catatan].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }
    
    daftar.innerHTML = "";
    document.getElementById("noteCount").innerText = `${catatan.length} Catatan`;

    if (dataToRender.length === 0) {
        daftar.innerHTML = `<div class="empty-state">Tidak Ada Catatan</div>`;
        return;
    }

    dataToRender.forEach(function(item) {
        let tgl = new Date(item.id).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit'
        });

        let kategoriClass = (item.kategori || "Umum").replace(/[\s\/]/g, "-");
        let isPinned = item.pinned ? "active" : "";

        // Tentukan warna border kiri berdasarkan kategori
        let borderColor = "#8e8e93";
        if (item.kategori === "Pribadi") borderColor = "#007aff";
        if (item.kategori === "Penting") borderColor = "#ff3b30";
        if (item.kategori === "Resep / Tugas") borderColor = "#34c759";

        daftar.innerHTML += `
            <div class="note-item" style="border-left-color: ${borderColor}" onclick="editCatatan(${item.id})">
                <div class="note-header-row">
                    <div class="note-title">
                        ${escapeHtml(item.judul || 'Catatan Tanpa Judul')}
                        <span class="badge badge-${kategoriClass}">${escapeHtml(item.kategori || 'Umum')}</span>
                    </div>
                    <button class="pin-btn ${isPinned}" onclick="togglePin(${item.id}, event)" title="Sematkan">
                        <i data-lucide="pin" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
                <div class="note-meta">
                    <span class="note-date">${tgl}</span>
                    <span class="note-snippet">${escapeHtml(item.isi)}</span>
                </div>
            </div>
        `;
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Toggle Pin Catatan
function togglePin(id, event) {
    event.stopPropagation(); // Mencegah modal edit terbuka saat klik tombol pin
    catatan = catatan.map(item => {
        if (item.id === id) {
            return { ...item, pinned: !item.pinned };
        }
        return item;
    });
    localStorage.setItem("catatan", JSON.stringify(catatan));
    tampilkanCatatan();
}

// Buka modal untuk buat catatan baru
function bukaModalBaru() {
    document.getElementById("editId").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";
    document.getElementById("kategori").value = "Umum";
    document.getElementById("modalTitleText").innerText = "Catatan Baru";
    document.getElementById("btnHapusModal").style.display = "none";
    document.getElementById("modalOverlay").classList.add("active");
    document.getElementById("judul").focus();
}

// Buka modal untuk edit catatan
function editCatatan(id) {
    let target = catatan.find(item => item.id === id);
    if (target) {
        document.getElementById("editId").value = target.id;
        document.getElementById("judul").value = target.judul;
        document.getElementById("isi").value = target.isi;
        document.getElementById("kategori").value = target.kategori || "Umum";
        document.getElementById("modalTitleText").innerText = "Edit Catatan";
        document.getElementById("btnHapusModal").style.display = "block";
        document.getElementById("modalOverlay").classList.add("active");
    }
}

// Hapus Catatan dari Modal
function hapusCatatanModal() {
    let editId = document.getElementById("editId").value;
    if (!editId) return;

    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        catatan = catatan.filter(item => item.id !== Number(editId));
        localStorage.setItem("catatan", JSON.stringify(catatan));
        tutupModal();
        tampilkanCatatan();
    }
}

// Tutup modal
function tutupModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

// Simpan atau Perbarui Catatan
function simpanCatatan() {
    let editId = document.getElementById("editId").value;
    let judul = document.getElementById("judul").value.trim();
    let isi = document.getElementById("isi").value.trim();
    let kategori = document.getElementById("kategori").value;

    if (judul === "" && isi === "") {
        tutupModal();
        return;
    }

    if (editId) {
        catatan = catatan.map(function(item) {
            if (item.id === Number(editId)) {
                return { ...item, judul: judul, isi: isi, kategori: kategori };
            }
            return item;
        });
    } else {
        let dataBaru = {
            id: Date.now(),
            judul: judul,
            isi: isi,
            kategori: kategori,
            pinned: false
        };
        catatan.unshift(dataBaru);
    }

    localStorage.setItem("catatan", JSON.stringify(catatan));
    tutupModal();
    tampilkanCatatan();
}

// Fitur Pencarian Real-time
function cariCatatan() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let hasil = catatan.filter(function(item) {
        return item.judul.toLowerCase().includes(keyword) || 
               item.isi.toLowerCase().includes(keyword) ||
               (item.kategori && item.kategori.toLowerCase().includes(keyword));
    });
    tampilkanCatatan(hasil);
}

// Security Helper
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

tampilkanCatatan();

// Registrasi Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker aktif"))
        .catch(err => console.log("Service Worker gagal:", err));
}