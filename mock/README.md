# Mock GraphQL Server

TypeScript + Apollo Server で構築されたインメモリ GraphQL モックサーバーです。

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 📊 Available Endpoints

- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## 🏗️ Project Structure

```
src/
├── schema/               # GraphQL schema
│   ├── schema.graphqls   # All-in-one schema file
│   └── index.ts          # Schema loader
├── models/               # Data models and stores
│   └── User.ts           # User model and in-memory store
├── resolvers/            # GraphQL resolvers
│   ├── user.ts           # User resolvers
│   └── index.ts          # Resolver combiner
└── index.ts              # Main server file
```

## 📝 Current Features

### User Management

- ✅ Get all users
- ✅ Get user by ID
- ✅ Get user by email
- ✅ Create user
- ✅ Update user
- ✅ Delete user
- ✅ Email uniqueness validation
- ✅ ULID for user IDs

## 🔧 Adding New Features

### 1. Edit Schema

`src/schema/schema.graphqls` に新しい型や Query/Mutation を追記するだけ！

```graphql
# 例: Product型を追加

type Product {
  id: ID!
  name: String!
  price: Float!
}

extend type Query {
  products: [Product!]!
  product(id: ID!): Product
}

extend type Mutation {
  createProduct(input: CreateProductInput!): Product!
}

input CreateProductInput {
  name: String!
  price: Float!
}
```

### 2. モデル・リゾルバーを追加

- `src/models/` にモデル/ストアを追加
- `src/resolvers/` にリゾルバーを追加
- `src/resolvers/index.ts` で統合

## 🧪 Testing

GraphQL Playground で以下のクエリをテストできます：

### Get All Users

```graphql
query {
  users {
    id
    name
    email
  }
}
```

### Create User

```graphql
mutation {
  createUser(input: { name: "Alice Johnson", email: "alice@example.com" }) {
    id
    name
    email
  }
}
```

### Get User by ID

```graphql
query {
  user(id: "USER_ID_HERE") {
    id
    name
    email
  }
}
```

## 🔄 Development Workflow

1. **Schema First**: まず `schema.graphqls` を編集
2. **Model Second**: データモデルとストアを実装
3. **Resolver Last**: GraphQL リゾルバーを実装
4. **Test**: GraphQL Playground でテスト

## 📦 Dependencies

- **@apollo/server**: GraphQL server
- **express**: Web framework
- **graphql**: GraphQL implementation
- **ulid**: Unique ID generation
- **typescript**: Type safety
- **nodemon**: Development server
