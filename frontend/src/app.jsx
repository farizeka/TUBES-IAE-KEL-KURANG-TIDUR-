import { useEffect, useState } from 'react';
import { login, getDoctors, createBooking } from './api';
import './index.css';

export default function App() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    name: '',
    gender: '',
    complaint: '',
    doctor_id: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (token) {
      getDoctors().then(setDoctors);
    }
  }, [token]);

  const handleLogin = async () => {
    const res = await login(nik, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
  };

  const handleBooking = async () => {
    const res = await createBooking(form, token);
    alert(res.message);
  };

  if (!token) {
    return (
      <div className="container">
        <h2>Login Pasien</h2>
        <input placeholder="NIK / Username"
               onChange={e => setNik(e.target.value)} />
        <input type="password"
               placeholder="Password"
               onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Booking Dokter</h2>

      <input placeholder="Nama"
             onChange={e => setForm({ ...form, name: e.target.value })} />

      <select onChange={e => setForm({ ...form, gender: e.target.value })}>
        <option value="">Pilih Kelamin</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>

      <textarea placeholder="Keluhan"
                onChange={e => setForm({ ...form, complaint: e.target.value })} />

      <select onChange={e => setForm({ ...form, doctor_id: e.target.value })}>
        <option value="">Pilih Dokter</option>
        {doctors.map(d => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.poli})
          </option>
        ))}
      </select>

      <input type="date"
             onChange={e => setForm({ ...form, date: e.target.value })} />

      <input type="time"
             onChange={e => setForm({ ...form, time: e.target.value })} />

      <button onClick={handleBooking}>Booking</button>
    </div>
  );
}