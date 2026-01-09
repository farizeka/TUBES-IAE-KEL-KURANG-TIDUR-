const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// REST routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const bookingRoutes = require('./routes/booking');

const app = express();

app.use(cors());
app.use(express.json());

// REST API
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/bookings', bookingRoutes);

// 🔴 GRAPHQL SETUP (INI BAGIAN KRITIS)
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) {
        try {
          const token = auth.split(' ')[1];
          const user = jwt.verify(token, 'SECRET_KEY');
          return { user };
        } catch (err) {
          return {};
        }
      }
      return {};
    }
  });

  await server.start();               // ⬅️ WAJIB
  server.applyMiddleware({ app });    // ⬅️ DEFAULT PATH = /graphql
}

startApolloServer(); // ⬅️ WAJIB DIPANGGIL

// REST TEST (opsional)
app.get('/', (req, res) => {
  res.send('API running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
