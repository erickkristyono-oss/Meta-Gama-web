const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Menghubungkan ke folder frontend

// Koneksi Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database MySQL:', err.message);
        return;
    }
    console.log('Berhasil terhubung ke database MySQL via DBeaver!');
});

// ==========================================
// DAFTAR API (ROUTE)
// ==========================================

// 1. AMBIL SEMUA PRODUK (Untuk Halaman Utama)
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data' });
        res.json(results);
    });
});

// 2. AMBIL SATU PRODUK (Untuk Halaman Detail)
app.get('/api/products/:id', (req, res) => {
    const idProduk = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [idProduk], (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data' });
        if (results.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
        res.json(results[0]);
    });
});

// 3. TAMBAH PRODUK BARU (Untuk Halaman Admin)
// EDIT PRODUK (UPDATE)
// EDIT PRODUK (UPDATE)
app.put('/api/products/:id', (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    const sql = 'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?';

    db.query(sql, [name, description, price, category, image_url, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Gagal mengupdate produk' });
        res.json({ message: 'Produk berhasil diupdate!' });
    });
});

// ==========================================
// API SISTEM TRANSAKSI & UNDUHAN
// ==========================================

// 6. SIMPAN TRANSAKSI BARU (CHECKOUT)
app.post('/api/checkout', (req, res) => {
    const { user_id, user_name, user_email, cart_items } = req.body;

    if (!cart_items || cart_items.length === 0) {
        return res.status(400).json({ error: 'Keranjang belanja kosong!' });
    }

    // Menyiapkan array data untuk dimasukkan massal ke database
    const values = cart_items.map(item => [
        user_id,
        user_name,
        user_email,
        item.id,
        item.nama,
        item.harga,
        item.gambar
    ]);

    const sql = 'INSERT INTO orders (user_id, user_name, user_email, product_id, product_name, product_price, image_url) VALUES ?';

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal memproses transaksi ke database' });
        }
        res.status(201).json({ message: 'Transaksi berhasil dicatat!', order_id: result.insertId });
    });
});

// 7. AMBIL RIWAYAT UNDUHAN BERDASARKAN USER ID
app.get('/api/downloads/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data unduhan' });
        res.json(results);
    });
});

// ==========================================
// JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
// ==========================================
// API SISTEM AKUN (LOGIN & REGISTER)
// ==========================================

// 4. REGISTER PENGGUNA BARU
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    // Cek apakah email sudah pernah didaftarkan
    const cekEmail = 'SELECT * FROM users WHERE email = ?';
    db.query(cekEmail, [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada database' });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Gagal! Email ini sudah terdaftar.' });
        }

        // Simpan akun baru ke database
        // (Catatan: Untuk tahap belajar ini password disimpan biasa. Untuk web live, nanti kita bisa enkripsi)
        const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sqlInsert, [name, email, password], (err2, result2) => {
            if (err2) return res.status(500).json({ error: 'Gagal menyimpan akun baru' });
            res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
        });
    });
});

// 5. LOGIN PENGGUNA
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email dan password yang cocok
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada database' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Email atau kata sandi Anda salah!' });
        }

        // Jika cocok, kirim kembali data nama dan ID pengguna (tanpa password)
        const user = {
            id: results[0].id,
            name: results[0].name,
            email: results[0].email
        };

        res.json({ message: 'Login sukses!', user: user });
    });
});