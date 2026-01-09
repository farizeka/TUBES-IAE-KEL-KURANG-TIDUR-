const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return { id: user.id, role: user.role, nik: user.nik };
    }
  },

  Mutation: {
    register: async (_, { nik, password, role }) => {
      const hash = await bcrypt.hash(password, 10);

      await db.query(
        'INSERT INTO users (nik, password, role) VALUES (?, ?, ?)',
        [nik, hash, role]
      );

      return { message: 'Register berhasil' };
    },

    login: async (_, { username, password }) => {
      const [[user]] = await db.query(
        'SELECT * FROM users WHERE nik = ?',
        [username]
      );

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Password salah');
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, nik: user.nik },
        'SECRET_KEY'
      );

      return { token, role: user.role };
    }
  }
};