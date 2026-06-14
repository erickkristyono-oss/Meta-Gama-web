// Mengambil data keranjang dari memori browser, jika kosong maka buat array []
let keranjang = JSON.parse(localStorage.getItem('metagama_cart')) || [];

// Fungsi untuk memperbarui angka merah pada ikon keranjang
function updateBadgeKeranjang() {
    // Mencari elemen badge yang ada di sebelah ikon keranjang
    const badges = document.querySelectorAll('.fa-cart-shopping + .badge');
    badges.forEach(badge => {
        badge.innerText = keranjang.length;

        // Buat badge menjadi merah menyala jika ada isinya
        if (keranjang.length > 0) {
            badge.style.backgroundColor = '#ef4444'; // Merah notifikasi
        } else {
            badge.style.backgroundColor = '#839b4d'; // Hijau standar
        }
    });
}

// Fungsi utama untuk menambahkan produk ke keranjang
function tambahKeKeranjang(id, nama, harga, gambar) {
    // Cek apakah produk sudah pernah dimasukkan (karena produk digital biasanya hanya dibeli 1x)
    const sudahAda = keranjang.find(item => item.id === id);
    if (sudahAda) {
        alert('Produk ini sudah ada di keranjang Anda!');
        return;
    }

    // Masukkan data produk ke dalam keranjang
    keranjang.push({ id, nama, harga, gambar });

    // Simpan keranjang baru ke memori browser
    localStorage.setItem('cbb_cart', JSON.stringify(keranjang));

    // Perbarui angka di ikon keranjang
    updateBadgeKeranjang();

    alert(`Sukses! ${nama} ditambahkan ke keranjang.`);
}

// Menjalankan fungsi saat halaman web selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateBadgeKeranjang();

    // Membuat Ikon Keranjang di Header bisa diklik menuju halaman Checkout
    const ikonKeranjang = document.querySelectorAll('.fa-cart-shopping');
    ikonKeranjang.forEach(ikon => {
        // Mengambil elemen bungkusnya (.icon-badge-wrap)
        ikon.parentElement.onclick = () => {
            // LOGIKA OPSI 2: CEK LOGIN DULU SEBELUM BUKA KERANJANG
            const cekLogin = JSON.parse(localStorage.getItem('cbb_user'));

            if (!cekLogin) {
                // Jika belum login
                alert('Silakan login atau buat akun terlebih dahulu untuk melihat keranjang Anda.');
                window.location.href = '/login.html'; // Arahkan ke halaman login
            } else {
                // Jika sudah login
                window.location.href = '/checkout.html'; // Lolos ke keranjang
            }
        };
    });
});// --- LOGIKA MENYEMBUNYIKAN MENU ADMIN ---
document.addEventListener('DOMContentLoaded', () => {
    // Mencari tombol menu Admin di halaman
    const menuAdmin = document.querySelector('nav.main-menu a[href="/admin.html"]');

    if (menuAdmin) {
        const userLogon = JSON.parse(localStorage.getItem('cbb_user'));
        const emailAdmin = 'metagamapersada.pt@gmail.com'; // Email admin Anda

        // Cek apakah yang login adalah admin
        if (userLogon && userLogon.email === emailAdmin) {
            menuAdmin.style.display = 'inline-block'; // Tampilkan tombol
        } else {
            menuAdmin.style.display = 'none'; // Sembunyikan tombol secara gaib
        }
    }
});