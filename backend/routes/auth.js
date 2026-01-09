const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

/* PING (TEST ROUTE) */
router.get('/ping', (req, res) => {
  res.send('auth route hidup');
});

/* ================= REGISTER ================= */
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, age } = req.body;

    if (!username || !password || !name || !age) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    if (!/^\d{5}$/.test(username)) {
      return res.status(400).json({ message: 'Username harus 5 digit angka' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      'INSERT INTO users (nik, password, role) VALUES (?, ?, ?)',
      [username, hash, 'patient']
    );

    await db.query(
      'INSERT INTO patients (user_id, name, age) VALUES (?, ?, ?)',
      [userResult.insertId, name, age]
    );

    res.json({ message: 'Register berhasil' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [[user]] = await db.query(
      'SELECT * FROM users WHERE nik = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
