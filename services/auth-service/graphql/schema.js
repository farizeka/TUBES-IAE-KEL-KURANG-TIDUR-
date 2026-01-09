const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    nik: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    role: String!
  }

  type Message {
    message: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    register(nik: String!, password: String!, role: String!): Message
  }
`;