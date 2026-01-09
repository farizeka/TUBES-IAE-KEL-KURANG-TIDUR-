const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

/* ================= GET ALL PATIENTS ================= */
router.get('/', auth, admin, async (req, res) => {
  try {
    const [patients] = await db.query(`
      SELECT 
        patients.id,
        users.nik,
        patients.name,
        patients.age
      FROM patients
      JOIN users ON users.id = patients.user_id
    `);

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET PATIENT BY ID ================= */
router.get('/:id', auth, admin, async (req, res) => {
  try {
    const [[patient]] = await db.query(`
      SELECT 
        patients.id,
        users.nik,
        patients.name,
        patients.age
      FROM patients
      JOIN users ON users.id = patients.user_id
      WHERE patients.id = ?
    `, [req.params.id]);

    if (!patient) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPDATE PATIENT ================= */
router.put('/:id', auth, admin, async (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    const [result] = await db.query(
      'UPDATE patients SET name = ?, age = ? WHERE id = ?',
      [name, age, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    res.json({ message: 'Data pasien berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE PATIENT ================= */
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM patients WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    res.json({ message: 'Pasien berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
