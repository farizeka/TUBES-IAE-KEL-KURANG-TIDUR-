const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

/**
 * GET daftar dokter (seeder)
 * URL: GET /api/bookings/doctors
 */
router.get('/doctors', async (req, res) => {
  try {
    const [doctors] = await db.query('SELECT * FROM doctors');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data dokter' });
  }
});

/**
 * POST booking dokter
 * URL: POST /api/bookings
 */
router.post('/', auth, async (req, res) => {
  const { name, gender, complaint, doctor_id, date, time } = req.body;

  try {
    const [[doctor]] = await db.query(
      'SELECT id FROM doctors WHERE id = ?',
      [doctor_id]
    );

    if (!doctor) {
      return res.status(400).json({ message: 'Dokter tidak ditemukan' });
    }

    await db.query(
      `INSERT INTO bookings 
      (user_id, name, gender, complaint, doctor_id, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, gender, complaint, doctor_id, date, time]
    );

    res.json({ message: 'Booking berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking gagal' });
  }
});

/**
 * GET booking milik user login
 * URL: GET /api/bookings/my
 */
router.get('/my', auth, async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT 
         b.id,
         b.name,
         b.gender,
         b.complaint,
         d.name AS doctor,
         d.poli,
         b.date,
         b.time
       FROM bookings b
       JOIN doctors d ON b.doctor_id = d.id
       WHERE b.user_id = ?`,
      [req.user.id]
    );

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil booking' });
  }
});

const admin = require('../middleware/admin');

/**
 * ADMIN - GET semua booking
 * URL: GET /api/bookings/admin
 */
router.get('/admin', auth, admin, async (req, res) => {
  const [bookings] = await db.query(`
    SELECT 
      b.id,
      b.name,
      b.gender,
      b.complaint,
      d.name AS doctor,
      d.poli,
      b.date,
      b.time
    FROM bookings b
    JOIN doctors d ON b.doctor_id = d.id
    ORDER BY b.date DESC
  `);
  res.json(bookings);
});

/**
 * ADMIN - UPDATE booking
 * URL: PUT /api/bookings/admin/:id
 */
router.put('/admin/:id', auth, admin, async (req, res) => {
  const { date, time, doctor_id } = req.body;

  await db.query(
    `UPDATE bookings 
     SET date = ?, time = ?, doctor_id = ?
     WHERE id = ?`,
    [date, time, doctor_id, req.params.id]
  );

  res.json({ message: 'Booking diupdate' });
});

/**
 * ADMIN - DELETE booking
 * URL: DELETE /api/bookings/admin/:id
 */
router.delete('/admin/:id', auth, admin, async (req, res) => {
  await db.query(
    'DELETE FROM bookings WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Booking dihapus' });
});

module.exports = router;