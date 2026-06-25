// ==========================================
// CART.JS - Versi Revisi (Key konsisten)
// User  -> metagama_user
// Cart  -> metagama_cart
// ==========================================

// Mengambil data keranjang dari memori browser
let keranjang = JSON.parse(localStorage.getItem('metagama_cart')) || [];

// Memperbarui angka pada ikon keranjang (selalu baca ulang dari storage)
function updateBadgeKeranjang() {
    keranjang = JSON.parse(localStorage.getItem('metagama_cart')) || [];
    const badges = document.querySelectorAll('.fa-cart-shopping + .badge');
    badges.forEach(badge => {
        badge.innerText = keranjang.length;
        badge.style.backgroundColor = keranjang.length > 0 ? '#ef4444' : '#839b4d';
    });
}

// Menambahkan produk ke keranjang
function tambahKeKeranjang(id, nama, harga, gambar) {
    keranjang = JSON.parse(localStorage.getItem('metagama_cart')) || [];

    // Produk digital hanya bisa 1x
    const sudahAda = keranjang.find(item => String(item.id) === String(id));
    if (sudahAda) {
        alert('Produk ini sudah ada di keranjang Anda!');
        return;
    }

    keranjang.push({ id, nama, harga, gambar });
    localStorage.setItem('metagama_cart', JSON.stringify(keranjang));
    updateBadgeKeranjang();
    alert(`Sukses! ${nama} ditambahkan ke keranjang.`);
}

document.addEventListener('DOMContentLoaded', () => {
    updateBadgeKeranjang();

    // Ikon keranjang: cek login dulu sebelum buka checkout
    const ikonKeranjang = document.querySelectorAll('.fa-cart-shopping');
    ikonKeranjang.forEach(ikon => {
        ikon.parentElement.onclick = () => {
            const cekLogin = JSON.parse(localStorage.getItem('metagama_user'));
            if (!cekLogin) {
                alert('Silakan login atau buat akun terlebih dahulu untuk melihat keranjang Anda.');
                window.location.href = '/login.html';
            } else {
                window.location.href = '/checkout.html';
            }
        };
    });

    // Sembunyikan menu Admin jika bukan admin
    const menuAdmin = document.querySelector('nav.main-menu a[href="/admin.html"]');
    if (menuAdmin) {
        const userLogon = JSON.parse(localStorage.getItem('metagama_user'));
        const emailAdmin = 'metagamapersada.pt@gmail.com';
        menuAdmin.style.display = (userLogon && userLogon.email === emailAdmin) ? 'inline-block' : 'none';
    }
});