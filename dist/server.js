"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const schema_1 = require("./graphql/schema/schema");
const resolvers_1 = require("./graphql/resolvers");
async function start() {
    const server = new apollo_server_1.ApolloServer({ typeDefs: schema_1.typeDefs, resolvers: resolvers_1.resolvers });
    const { url } = await server.listen();
    console.log(`🚀 Servidor rodando na porta ${url}`);
}
start();
