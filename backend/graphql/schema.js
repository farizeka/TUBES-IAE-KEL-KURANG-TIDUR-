const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    role: String!
  }

  type AuthPayload {
    token: String!
    role: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
  }
`;
