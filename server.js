const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ Gunakan createPool agar koneksi tidak putus di production
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// Cek koneksi saat startup
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Gagal terhubung ke database:', err.message);
        return;
    }
    console.log('✅ Berhasil terhubung ke database MySQL!');
    connection.release();
});

// ==========================================
// ROUTE PRODUK
// ==========================================

app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data' });
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data' });
        if (results.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
        res.json(results[0]);
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    const sql = 'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?';
    db.query(sql, [name, description, price, category, image_url, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Gagal mengupdate produk' });
        res.json({ message: 'Produk berhasil diupdate!' });
    });
});

// ==========================================
// ROUTE AKUN
// ==========================================

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada database' });
        if (results.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar.' });

        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err2) => {
            if (err2) return res.status(500).json({ error: 'Gagal menyimpan akun baru' });
            res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
        });
    });
});

app.post('/api/login', (req, res) => {
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada database' });
        if (results.length === 0) return res.status(401).json({ error: 'Email atau kata sandi salah!' });

        const { id, name, email } = results[0];
        res.json({ message: 'Login sukses!', user: { id, name, email } });
    });
});

// ==========================================
// ROUTE TRANSAKSI
// ==========================================

app.post('/api/checkout', (req, res) => {
    const { user_id, user_name, user_email, cart_items } = req.body;
    if (!cart_items || cart_items.length === 0) {
        return res.status(400).json({ error: 'Keranjang belanja kosong!' });
    }

    const values = cart_items.map(item => [user_id, user_name, user_email, item.id, item.nama, item.harga, item.gambar]);
    db.query('INSERT INTO orders (user_id, user_name, user_email, product_id, product_name, product_price, image_url) VALUES ?', [values], (err, result) => {
        if (err) return res.status(500).json({ error: 'Gagal memproses transaksi' });
        res.status(201).json({ message: 'Transaksi berhasil!', order_id: result.insertId });
    });
});

app.get('/api/downloads/:userId', (req, res) => {
    db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data unduhan' });
        res.json(results);
    });
});

// ✅ app.listen() selalu di PALING BAWAH
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
});