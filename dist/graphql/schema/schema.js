"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  type User {
    id: ID!
    name: String!
    email: String!
    history: [Video!]
  }

  type Video {
    id: ID!
    title: String!
    description: String
    url: String!
    views: Int!
  }

  type Query {
    listVideos(limit: Int, cursor: String): [Video!]
    getVideoById(id: ID!): Video
    recommendVideos(userId: ID!): [Video!]
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! 
    watchVideo(userId: ID!, videoId: ID!): Boolean!
  }
`;
