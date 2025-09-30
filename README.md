# 🎬 Plataforma de Streaming com Recomendação

## 1. Descrição do Projeto

A **Plataforma de Streaming** é uma API **GraphQL** construída com **Node.js** e **TypeScript**, que permite:

* Listar vídeos e ver detalhes individuais.
* Registrar histórico de visualizações dos usuários.
* Gerar recomendações de vídeos personalizadas.
* Otimizar performance com **cache inteligente via Redis**.
* Seguir **Clean Code / Clean Architecture** com separação de camadas.

> Atualmente, o projeto utiliza dados mockados, mas está preparado para integração com **PostgreSQL**.

---

## 2. Tecnologias e Stack

| Componente     | Tecnologia              |
| -------------- | ----------------------- |
| Backend        | Node.js + TypeScript    |
| API            | Apollo Server (GraphQL) |
| Banco de Dados | PostgreSQL (futuro)     |
| Cache          | Redis                   |
| Autenticação   | JWT (planejado)         |
| Arquitetura    | Clean Architecture      |

---

## 3. Estrutura do Projeto

```
src/
  domain/
    entities/        # Entidades do domínio (User, Video)
    repositories/    # Interfaces de repositórios
  usecases/
    user/            # Casos de uso de usuários
    video/           # Casos de uso de vídeos
  infra/
    db/              # Implementação PostgreSQL (futuro)
    cache/           # Redis Client
  graphql/
    schema/          # Definição de tipos GraphQL
    resolvers/       # Resolvers GraphQL
  shared/
    config/          # Variáveis de ambiente
    utils/           # Helpers e funções utilitárias
  server.ts          # Entry point da aplicação
```

---

## 4. Setup do Projeto

### 4.1 Clonar e instalar dependências

```bash
git clone <repo-url>
cd streaming-platform
npm install
```

### 4.2 Configurar TypeScript

Arquivo `tsconfig.json` recomendado:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 4.3 Subir Redis (Docker)

```bash
docker run --name redis -p 6379:6379 -d redis
```

### 4.4 Rodar o servidor

```bash
npx ts-node src/server.ts
```

> Esperado no console:

```
✅ Redis conectado!
🚀 Servidor rodando na porta  http://localhost:4000/
```

---

## 5. Schema GraphQL

### Tipos

```graphql
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
```

### Queries

```graphql
listVideos(limit: Int, cursor: String): [Video!]
getVideoById(id: ID!): Video
recommendVideos(userId: ID!): [Video!]
```

### Mutations

```graphql
registerUser(name: String!, email: String!, password: String!): User!
login(email: String!, password: String!): String!
watchVideo(userId: ID!, videoId: ID!): Boolean!
```

---

## 6. Fluxo de Cache (Redis)

| Funcionalidade  | Cache Key                | TTL  | Observação                            |
| --------------- | ------------------------ | ---- | ------------------------------------- |
| listVideos      | `videos:list`            | 60s  | Cache de lista de vídeos              |
| recommendVideos | `recommendations:userId` | 120s | Cache de recomendações personalizadas |

* Primeira chamada → dados do "banco" (mock) → salvo no Redis.
* Chamadas seguintes → retornam do Redis até expirar TTL.

---

## 7. Exemplos de Uso

### Listar vídeos

```graphql
query {
  listVideos {
    id
    title
    views
  }
}
```

### Assistir vídeo

```graphql
mutation {
  watchVideo(userId: "1", videoId: "1")
}
```

### Ver recomendações

```graphql
query {
  recommendVideos(userId: "1") {
    id
    title
  }
}
```

---

## 8. Próximos Passos

1. Implementar **JWT real** para autenticação.
2. Integrar **PostgreSQL** para persistência de dados.
3. Aprimorar recomendação baseada em histórico e popularidade.
4. Implementar **DataLoader** para resolver problema N+1.
5. Criar **testes unitários e de integração** com Jest.

---

## 9. Contato / Referência

* Desenvolvedor: Lázaro Vasconcelos
* Projeto de referência: **Plataforma de Streaming com Node.js + GraphQL + Redis**
