import { gql } from "apollo-server";

export const typeDefs = gql`
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
