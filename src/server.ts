import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema/schema";
import { resolvers } from "./graphql/resolvers";
import { connectRedis } from "./infra/cache/redisClient";

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`🚀 Servidor rodando na porta ${url}`);
    await connectRedis();
    console.log("✅ Se chegou até aqui, Redis está OK!");
}

start();
