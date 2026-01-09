const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) return null;
      return {
        id: context.user.id,
        role: context.user.role
      };
    }
  },

  Mutation: {
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
        { id: user.id, role: user.role },
        'SECRET_KEY',
        { expiresIn: '1h' }
      );

      return {
        token,
        role: user.role
      };
    }
  }
};
