import redisClient, { connectRedis } from "../../infra/cache/redisClient";
import { User } from "../../domain/entities/User";
import { Video } from "../../domain/entities/Video";

const users: User[] = [];
const videos: Video[] = [
  new Video("1", "Introdução ao GraphQL", "Vídeo de estudo", "http://meu-servidor/video1.mp4"),
  new Video("2", "Clean Code na prática", "Refatoração de código", "http://meu-servidor/video2.mp4"),
];

export const resolvers = {
  Query: {
    listVideos: async () => {
      const cacheKey = "videos:list";

      // tenta pegar do Redis
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("📦 Retornando vídeos do cache Redis");
        return JSON.parse(cached);
      }

      // se não existir no cache, pega da "base"
      console.log("🗄️ Retornando vídeos da base e salvando no Redis");
      await redisClient.setEx(cacheKey, 60, JSON.stringify(videos)); // cache por 60s
      return videos;
    },

    getVideoById: (_: any, { id }: { id: string }) => 
      videos.find(v => v.id === id),

    recommendVideos: async (_: any, { userId }: { userId: string }) => {
      const cacheKey = `recommendations:${userId}`;

      // tenta pegar do Redis
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`📦 Recomendações do cache Redis para user ${userId}`);
        return JSON.parse(cached);
      }

      // simulação: top 2 vídeos mais vistos
      const recommendations = videos
        .sort((a, b) => b.views - a.views)
        .slice(0, 2);

      console.log(`🗄️ Gerando recomendações e salvando no Redis para user ${userId}`);
      await redisClient.setEx(cacheKey, 120, JSON.stringify(recommendations)); // cache por 2 min
      return recommendations;
    },
  },

  Mutation: {
    registerUser: (_: any, { name, email, password }: any) => {
      const user = new User(String(users.length + 1), name, email, password);
      users.push(user);
      return user;
    },

    login: (_: any, { email, password }: any) => {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error("Credenciais inválidas");
      return "fake-jwt-token"; 
    },

    watchVideo: (_: any, { userId, videoId }: any) => {
      const video = videos.find(v => v.id === videoId);
      if (!video) return false;
      video.views++;
      return true;
    },
  }
};
