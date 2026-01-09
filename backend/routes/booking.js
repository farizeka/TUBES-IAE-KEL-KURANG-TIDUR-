const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

/* CREATE BOOKING */
router.post('/', auth, async (req, res) => {
  const { doctor, poli, complaint } = req.body;

  try {
    const [[patient]] = await db.query(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (!patient) {
      return res.status(400).json({ message: 'Patient not found' });
    }

    await db.query(
      'INSERT INTO bookings (patient_id, doctor, poli, complaint) VALUES (?, ?, ?, ?)',
      [patient.id, doctor, poli, complaint]
    );

    res.json({ message: 'Booking berhasil' });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET MY BOOKINGS */
router.get('/my', auth, async (req, res) => {
  try {
    const [[patient]] = await db.query(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (!patient) {
      return res.status(400).json({ message: 'Patient not found' });
    }

    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE patient_id = ?',
      [patient.id]
    );

    res.json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
