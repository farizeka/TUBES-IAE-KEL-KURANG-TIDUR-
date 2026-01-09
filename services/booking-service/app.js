const express = require('express');
const cors = require('cors');

const bookingRoutes = require('./routes/booking');

const app = express();

app.use(cors());
app.use(express.json());

// ⬅️ INI PALING PENTING
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Booking service running');
});

app.listen(3000, () => {
  console.log('Booking service running on port 3000');
});