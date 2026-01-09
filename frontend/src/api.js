const AUTH_URL = 'http://localhost:4000/graphql';
const BOOKING_URL = 'http://localhost:3000/api/bookings';

export async function login(nik, password) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          login(username: "${nik}", password: "${password}") {
            token
            role
          }
        }
      `
    })
  });
  const json = await res.json();
  return json.data.login;
}

export async function getDoctors() {
  const res = await fetch(`${BOOKING_URL}/doctors`);
  return res.json();
}

export async function createBooking(data, token) {
  const res = await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getAllBookings(token) {
  const res = await fetch('http://localhost:3000/api/bookings/admin', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function deleteBooking(id, token) {
  const res = await fetch(
    `http://localhost:3000/api/bookings/admin/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.json();
}

export async function updateBooking(id, data, token) {
  const res = await fetch(
    `http://localhost:3000/api/bookings/admin/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );
  return res.json();
}