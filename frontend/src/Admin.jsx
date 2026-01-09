import { useEffect, useState } from 'react';
import { login, getDoctors } from './api';
import { getAllBookings, deleteBooking, updateBooking } from './api';
import './index.css';

export default function Admin() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    doctor_id: '',
    date: '',
    time: ''
  });

  const handleLogin = async () => {
    const res = await login(nik, password);
    if (res.role !== 'admin') {
      alert('Bukan admin');
      return;
    }
    localStorage.setItem('adminToken', res.token);
    setToken(res.token);
  };

  const loadData = async () => {
    const [b, d] = await Promise.all([
      getAllBookings(token),
      getDoctors()
    ]);
    setBookings(b);
    setDoctors(d);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus booking ini?')) return;
    await deleteBooking(id, token);
    loadData();
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setEditForm({
      doctor_id: doctors.find(d => d.name === b.doctor)?.id || '',
      date: b.date,
      time: b.time
    });
  };

  const saveEdit = async (id) => {
    await updateBooking(id, editForm, token);
    setEditingId(null);
    loadData();
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  if (!token) {
    return (
      <div className="container">
        <h2>Admin Login</h2>
        <input placeholder="Username" onChange={e => setNik(e.target.value)} />
        <input type="password" placeholder="Password"
               onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login Admin</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h2>Manajemen Booking</h2>

      <table width="100%" border="1" cellPadding="10"
             style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Keluhan</th>
            <th>Dokter</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.complaint}</td>

              <td>
                {editingId === b.id ? (
                  <select
                    value={editForm.doctor_id}
                    onChange={e =>
                      setEditForm({ ...editForm, doctor_id: e.target.value })
                    }>
                    <option value="">Pilih Dokter</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.poli})
                      </option>
                    ))}
                  </select>
                ) : b.doctor}
              </td>

              <td>
                {editingId === b.id ? (
                  <input type="date"
                         value={editForm.date}
                         onChange={e =>
                           setEditForm({ ...editForm, date: e.target.value })
                         } />
                ) : b.date}
              </td>

              <td>
                {editingId === b.id ? (
                  <input type="time"
                         value={editForm.time}
                         onChange={e =>
                           setEditForm({ ...editForm, time: e.target.value })
                         } />
                ) : b.time}
              </td>

              <td>
                {editingId === b.id ? (
                  <>
                    <button onClick={() => saveEdit(b.id)}>Simpan</button>
                    <button
                      style={{ background: '#6b7280', marginLeft: 6 }}
                      onClick={() => setEditingId(null)}>
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(b)}>Edit</button>
                    <button
                      style={{ background: '#dc2626', marginLeft: 6 }}
                      onClick={() => handleDelete(b.id)}>
                      Hapus
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}