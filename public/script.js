// Mengambil ID produk dari URL
const urlParams = new URLSearchParams(window.location.search);
const idProduk = urlParams.get('id');

// Mengambil data dari Backend
fetch(`fetch('/api/products')/${idProduk}`)
    .then(response => response.json())
    .then(produk => {
        if (produk.error) {
            document.getElementById('product-content').innerHTML = `
                        <div style="text-align:center; padding: 100px;">
                            <h2>Produk tidak ditemukan</h2>
                            <a href="/home.html" style="color:var(--primary-green)">Kembali ke Beranda</a>
                        </div>`;
            return;
        }

        const hargaRupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(produk.price);

        // INI ADALAH BAGIAN YANG DIUBAH (Perhatikan bagian button class="btn-buy")
        document.getElementById('product-content').innerHTML = `
                    <div class="breadcrumb">
                        <a href="/home.html">Home</a> / <a href="#">${produk.category}</a> / ${produk.name}
                    </div>

                    <div class="product-wrapper">
                        <div class="image-section">
                            <img src="${produk.image_url || 'https://via.placeholder.com/600x600?text=No+Image'}" alt="${produk.name}" class="product-image">
                        </div>

                        <div class="info-section">
                            <span class="category-badge">${produk.category}</span>
                            <h1 class="product-title">${produk.name}</h1>
                            <div class="product-price">${hargaRupiah}</div>
                            
                            <div class="description-box">
                                <h3>Rincian Produk</h3>
                                <div class="description-text">${produk.description}</div>
                            </div>

                            <div class="action-area">
                                <button class="btn-buy" onclick="tambahKeKeranjang('${produk.id}', '${produk.name}', ${produk.price}, '${produk.image_url}')">TAMBAH KE KERANJANG</button>
                                <div class="secure-info">
                                    <span>🔒 Pembayaran Aman & Terenkripsi</span>
                                    <span>•</span>
                                    <span>🚀 Pengiriman File Instan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

        // Mengubah judul halaman browser sesuai nama produk
        document.title = produk.name + " - METAGAMA";
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('product-content').innerHTML = '<p>Gagal memuat data produk.</p>';
    });