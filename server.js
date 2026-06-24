const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==========================================
// ROUTE DEBUG - Hapus setelah masalah solved
// ==========================================
app.get('/api/debug', (req, res) => {
    res.json({
        DB_HOST: process.env.DB_HOST || '❌ TIDAK ADA',
        DB_USER: process.env.DB_USER || '❌ TIDAK ADA',
        DB_NAME: process.env.DB_NAME || '❌ TIDAK ADA',
        DB_PASSWORD: process.env.DB_PASSWORD ? '✅ ADA' : '❌ TIDAK ADA',
        PORT: process.env.PORT || '5000 (default)'
    });
});

// ==========================================
// KONEKSI DATABASE
// ==========================================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DB Error:', err.code);
        console.error('❌ Detail:', err.message);
        return;
    }
    console.log('✅ Database terhubung!');
    connection.release();
});

// ==========================================
// ROUTE PRODUK
// ==========================================

app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('❌ Query error:', err.message);
            return res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
        }
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

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Semua field wajib diisi!' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('❌ Register error:', err.message);
            return res.status(500).json({ error: 'Terjadi kesalahan pada database' });
        }
        if (results.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar.' });

        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err2) => {
            if (err2) {
                console.error('❌ Insert error:', err2.message);
                return res.status(500).json({ error: 'Gagal menyimpan akun baru' });
            }
            res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi!' });
    }

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('❌ Login error:', err.message);
            return res.status(500).json({ error: 'Terjadi kesalahan pada database' });
        }
        if (results.length === 0) return res.status(401).json({ error: 'Email atau kata sandi salah!' });

        const { id, name, email: userEmail } = results[0];
        res.json({ message: 'Login sukses!', user: { id, name, email: userEmail } });
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
        if (err) {
            console.error('❌ Checkout error:', err.message);
            return res.status(500).json({ error: 'Gagal memproses transaksi' });
        }
        res.status(201).json({ message: 'Transaksi berhasil!', order_id: result.insertId });
    });
});

app.get('/api/downloads/:userId', (req, res) => {
    db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Gagal mengambil data unduhan' });
        res.json(results);
    });
});

// ==========================================
// JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
});