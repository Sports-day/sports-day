# Mock GraphQL Server

TypeScript + Apollo Server + SQLite で構築されたインメモリ GraphQL モックサーバーです。

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
├── database/             # Database layer
│   ├── schema.ts         # SQLite schema definition
│   ├── index.ts          # Database connection manager
│   └── seeder.ts         # Database seeder
├── models/               # Data models (interfaces only)
│   ├── User.ts           # User model interfaces
│   └── Group.ts          # Group model interfaces
├── repositories/         # Data access layer
│   ├── UserRepository.ts # User data access
│   └── GroupRepository.ts # Group data access
├── services/             # Business logic layer
│   ├── UserService.ts    # User business logic
│   └── GroupService.ts   # Group business logic
├── seed/                 # Seed data management
│   └── index.ts          # Centralized seed data with factory pattern
├── schema/               # GraphQL schema
│   ├── schema.graphqls   # All-in-one schema file
│   └── index.ts          # Schema loader
├── resolvers/            # GraphQL resolvers
│   ├── user.ts           # User resolvers
│   ├── group.ts          # Group resolvers
│   └── index.ts          # Resolver combiner
├── dataloaders/          # DataLoader implementations
│   └── index.ts          # DataLoader factories
└── index.ts              # Main server file
```

## 🏛️ Architecture

### 3-Layer Architecture

1. **Repository Layer** (`repositories/`)

   - データベースアクセスを担当
   - SQL クエリの実行
   - データの永続化

2. **Service Layer** (`services/`)

   - ビジネスロジックを担当
   - バリデーション
   - データの整合性チェック

3. **Resolver Layer** (`resolvers/`)
   - GraphQL リクエストの処理
   - サービス層の呼び出し
   - レスポンスの整形

### Seed Data Management

**Factory Pattern** によるシードデータ管理：

```typescript
// シンプルなシードデータ
const simpleData = createSimpleSeedData();

// 複雑なシードデータ（メタデータ付き）
const complexData = createComplexSeedData();

// カスタムシードデータ
const factory = new SeedDataFactory();
factory.registerEntity(user);
factory.registerEntity(group);
factory.addRelation("user_group", "田中太郎", "サクラ", { role: "leader" });
const customData = factory.generate();
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

### Group Management

- ✅ Get all groups
- ✅ Get group by ID
- ✅ Create group
- ✅ Update group
- ✅ Delete group
- ✅ Add user to group
- ✅ Remove user from group
- ✅ Get users by group
- ✅ Get groups by user

### Database Features

- ✅ SQLite in-memory database
- ✅ Foreign key constraints
- ✅ Indexed queries
- ✅ Transaction support
- ✅ Centralized seed data with factory pattern

### Seed Data Features

- ✅ Factory pattern for complex relations
- ✅ Metadata support for relations
- ✅ Type-safe seed data generation
- ✅ Backward compatibility
- ✅ Error handling for missing entities

## 🔧 Adding New Features

### 1. Edit Schema

`src/schema/schema.graphqls` に新しい型や Query/Mutation を追記：

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

### 2. Add Model Interface

`src/models/Product.ts` を作成：

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
}
```

### 3. Add Database Schema

`src/database/schema.ts` にテーブル定義を追加：

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 4. Add Repository

`src/repositories/ProductRepository.ts` を作成：

```typescript
import Database from "better-sqlite3";
import { ulid } from "ulid";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../models/Product";

export class ProductRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // CRUD operations...
}
```

### 5. Add Service

`src/services/ProductService.ts` を作成：

```typescript
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../models/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class ProductService {
  private productRepo: ProductRepository;

  constructor(productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  // Business logic...
}
```

### 6. Add Resolver

`src/resolvers/product.ts` を作成：

```typescript
import { ProductService } from "../services/ProductService";

export const productResolvers = {
  Query: {
    products: (
      _: any,
      __: any,
      context: { productService: ProductService }
    ) => {
      return context.productService.getAllProducts();
    },
    // ...
  },
  // ...
};
```

### 7. Update Main File

`src/index.ts` で新しいサービスを登録：

```typescript
// Initialize repositories
const productRepo = new ProductRepository(db);

// Initialize services
const productService = new ProductService(productRepo);

// Add to context
context: async () => ({
  userService,
  groupService,
  productService, // 追加
}),
```

### 8. Add Seed Data (Optional)

`src/seed/index.ts` にシードデータを追加：

```typescript
// シンプルなシードデータ
export const createProductSeedData = (): SeedData => {
  const factory = new SeedDataFactory();

  // ユーザー登録
  factory.registerEntity({
    id: ulid(),
    name: "田中太郎",
    email: "tanaka@example.com",
    role: "admin",
    department: "開発部",
  } as SeedUser);

  // グループ登録
  factory.registerEntity({
    id: ulid(),
    name: "サクラ",
    type: "team",
    description: "開発チームA",
  } as SeedGroup);

  // リレーション追加
  factory.addRelation("user_group", "田中太郎", "サクラ", {
    role: "leader",
    joinedAt: "2024-01-01",
  });

  return factory.generate();
};
```

## 🧪 Testing

GraphQL Playground で以下のクエリをテストできます：

### Get All Users

```graphql
query {
  users {
    id
    name
    email
    groups {
      id
      name
    }
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

### Get Groups with Users

```graphql
query {
  groups {
    id
    name
    users {
      id
      name
      email
    }
  }
}
```

### Add User to Group

```graphql
mutation {
  addUserToGroup(userId: "USER_ID", groupId: "GROUP_ID")
}
```

## 🔄 Development Workflow

1. **Schema First**: まず `schema.graphqls` を編集
2. **Model Second**: データモデルインターフェースを定義
3. **Database Third**: データベーススキーマを追加
4. **Repository Fourth**: データアクセス層を実装
5. **Service Fifth**: ビジネスロジック層を実装
6. **Resolver Last**: GraphQL リゾルバーを実装
7. **Seed Data** (Optional): シードデータを追加
8. **Test**: GraphQL Playground でテスト

## 📦 Dependencies

- **@apollo/server**: GraphQL server
- **better-sqlite3**: SQLite database driver
- **express**: Web framework
- **graphql**: GraphQL implementation
- **dataloader**: N+1 query prevention
- **ulid**: Unique ID generation
- **typescript**: Type safety
- **nodemon**: Development server

## 🗄️ Database

- **SQLite in-memory**: 高速なインメモリデータベース
- **Foreign Keys**: データ整合性の保証
- **Indexes**: クエリパフォーマンスの最適化
- **Transactions**: データの一貫性

## 🌱 Seed Data Management

### Factory Pattern

```typescript
// 基本的な使用方法
const factory = new SeedDataFactory();

// エンティティを登録
factory.registerEntity({
  id: ulid(),
  name: "田中太郎",
  email: "tanaka@example.com",
  role: "admin",
  department: "開発部",
} as SeedUser);

// リレーションを追加（メタデータ付き）
factory.addRelation("user_group", "田中太郎", "サクラ", {
  role: "leader",
  joinedAt: "2024-01-01",
});

// シードデータを生成
const seedData = factory.generate();
```

### 複雑なリレーション

```typescript
// メタデータ付きリレーション
factory.addRelation("user_group", "田中太郎", "サクラ", {
  role: "leader",
  joinedAt: "2024-01-01",
  permissions: ["read", "write", "admin"],
});

// 階層リレーション
factory.addRelation("group_parent", "サクラ", "開発部");
factory.addRelation("group_parent", "アサヒ", "開発部");
```

### エラーハンドリング

```typescript
try {
  factory.addRelation("user_group", "存在しないユーザー", "サクラ");
} catch (error) {
  console.error("Entity not found: 存在しないユーザー or サクラ");
}
```

## 🔧 Troubleshooting

### TypeScript Errors

```bash
# ビルドしてキャッシュをクリア
yarn build

# TypeScriptサーバーを再起動（VS Code/Cursor）
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Database Issues

```bash
# サーバーを再起動してデータベースをリセット
yarn dev
```

### Seed Data Issues

```bash
# シーダーのログを確認
# エンティティが正しく登録されているかチェック
# リレーションの名前が一致しているか確認
```
