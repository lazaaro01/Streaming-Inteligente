"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const redisClient_1 = __importDefault(require("../../infra/cache/redisClient"));
const User_1 = require("../../domain/entities/User");
const Video_1 = require("../../domain/entities/Video");
const users = [];
const videos = [
    new Video_1.Video("1", "Introdução ao GraphQL", "Vídeo de estudo", "http://meu-servidor/video1.mp4"),
    new Video_1.Video("2", "Clean Code na prática", "Refatoração de código", "http://meu-servidor/video2.mp4"),
];
exports.resolvers = {
    Query: {
        listVideos: async () => {
            const cacheKey = "videos:list";
            // tenta pegar do Redis
            const cached = await redisClient_1.default.get(cacheKey);
            if (cached) {
                console.log("📦 Retornando vídeos do cache Redis");
                return JSON.parse(cached);
            }
            // se não existir no cache, pega da "base"
            console.log("🗄️ Retornando vídeos da base e salvando no Redis");
            await redisClient_1.default.setEx(cacheKey, 60, JSON.stringify(videos)); // cache por 60s
            return videos;
        },
        getVideoById: (_, { id }) => videos.find(v => v.id === id),
        recommendVideos: async (_, { userId }) => {
            const cacheKey = `recommendations:${userId}`;
            // tenta pegar do Redis
            const cached = await redisClient_1.default.get(cacheKey);
            if (cached) {
                console.log(`📦 Recomendações do cache Redis para user ${userId}`);
                return JSON.parse(cached);
            }
            // simulação: top 2 vídeos mais vistos
            const recommendations = videos
                .sort((a, b) => b.views - a.views)
                .slice(0, 2);
            console.log(`🗄️ Gerando recomendações e salvando no Redis para user ${userId}`);
            await redisClient_1.default.setEx(cacheKey, 120, JSON.stringify(recommendations)); // cache por 2 min
            return recommendations;
        },
    },
    Mutation: {
        registerUser: (_, { name, email, password }) => {
            const user = new User_1.User(String(users.length + 1), name, email, password);
            users.push(user);
            return user;
        },
        login: (_, { email, password }) => {
            const user = users.find(u => u.email === email && u.password === password);
            if (!user)
                throw new Error("Credenciais inválidas");
            return "fake-jwt-token";
        },
        watchVideo: (_, { userId, videoId }) => {
            const video = videos.find(v => v.id === videoId);
            if (!video)
                return false;
            video.views++;
            return true;
        },
    }
};
