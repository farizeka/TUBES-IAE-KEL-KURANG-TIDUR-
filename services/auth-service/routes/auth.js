const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

/* REGISTER */
router.post('/register', async (req, res) => {
  const { username, password, role = 'patient' } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO users (nik, password, role) VALUES (?, ?, ?)',
    [username, hash, role]
  );

  res.json({ message: 'Register berhasil' });
});

/* LOGIN */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [[user]] = await db.query(
    'SELECT * FROM users WHERE nik = ?',
    [username]
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Login gagal' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    'SECRET_KEY',
    { expiresIn: '1h' }
  );

  res.json({ token, role: user.role });
});

module.exports = router;
