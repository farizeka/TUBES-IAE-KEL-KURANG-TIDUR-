const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// REST (opsional)
app.use('/api/auth', authRoutes);

// GRAPHQL
async function startApollo() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) {
        try {
          return { user: jwt.verify(auth.split(' ')[1], 'SECRET_KEY') };
        } catch {
          return {};
        }
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app });
}

startApollo();

app.listen(4000, () => {
  console.log('Auth service running on port 4000');
});
