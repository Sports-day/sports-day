---
paths:
  - "apps/admin/*"
---

# Admin アプリ フロントエンドルール

## ディレクトリ構造

`apps/admin/src/` 配下は以下の構造に従うこと。

```
src/
├── assets/                  # 静的ファイル（画像、フォント等）
├── components/              # アプリ全体で使う共通コンポーネント
│   ├── ui/                  # 汎用UIパーツ（Button, Dialog, Table等）
│   └── layout/              # レイアウト（AppShell, Sidebar, Header等）
├── features/                # 機能ドメインごとのモジュール
│   ├── teams/               # チーム管理
│   ├── users/               # ユーザー管理
│   ├── events/              # 競技・イベント管理
│   ├── locations/           # 場所・会場管理
│   └── information/         # お知らせ・情報管理
├── hooks/                   # グローバルなカスタムフック
├── lib/                     # ユーティリティ・GraphQLクライアント等
├── pages/                   # ルート対応のページコンポーネント
├── stores/                  # グローバル状態管理
├── types/                   # 共通型定義
├── App.tsx
└── main.tsx
```

## features/ の内部構造

各featureディレクトリは以下の構造を持つ。

```
features/[feature]/
├── components/       # そのfeature専用のコンポーネント
├── hooks/            # そのfeature専用のカスタムフック
├── api.ts            # GraphQLクエリ・ミューテーション定義
├── types.ts          # そのfeature固有の型定義
└── index.ts          # 外部に公開するもののみre-export
```

## コンポーネント配置のルール

- **1箇所でしか使わない** → 使う側のfeature配下に置く
- **複数featureをまたぐ** → `components/` に昇格させる
- **レイアウト・ナビゲーション系** → `components/layout/` に置く
- **MUIの薄いラッパー等の汎用UI** → `components/ui/` に置く

## ファイル命名規則

- コンポーネント: PascalCase（`UserTable.tsx`）
- フック: camelCase、`use`プレフィックス（`useUserList.ts`）
- ユーティリティ: camelCase（`formatDate.ts`）
- 型定義: camelCase（`types.ts`）または PascalCase の型名

## コンポーネントのファイル構成

コンポーネントが複雑になった場合はディレクトリに切り出す。

```
components/ui/DataTable/
├── DataTable.tsx
├── DataTable.types.ts   # コンポーネント固有の型（任意）
└── index.ts             # export { DataTable } from './DataTable'
```

シンプルなコンポーネントは単一ファイルで構わない。

## パスエイリアス

`@/` を `src/` のエイリアスとして使うこと。相対パスの `../../../` は禁止。

```ts
// Good
import { UserTable } from '@/features/users/components/UserTable'

// Bad
import { UserTable } from '../../../features/users/components/UserTable'
```

`vite.config.ts` および `tsconfig.app.json` にエイリアス設定を追加すること。

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

## データ取得の方針

データ取得は必ずモックで実装すること。モックデータは各feature内の `mock.ts` に定義し、フックから参照する。

```
features/users/
├── components/
├── hooks/
│   └── useUserList.ts
├── mock.ts
└── types.ts
```

```ts
// features/users/mock.ts
import type { User } from '../types'

export const MOCK_USERS: User[] = [
  { id: '1', name: '山田太郎', teamId: 'team-1' },
  { id: '2', name: '鈴木花子', teamId: 'team-2' },
]
```

```ts
// features/users/hooks/useUserList.ts
import { MOCK_USERS } from '../mock'

export function useUserList() {
  return { data: MOCK_USERS, loading: false, error: null }
}

## index.ts（Barrel export）のルール

- `features/[feature]/index.ts` には外部から使うものだけをexportする
- feature内部の実装詳細は外部に漏らさない

```ts
// features/users/index.ts
export { UserListPage } from './pages/UserListPage'
export type { User } from './types'
```

## コンポーネントの設計ルール

- 1コンポーネント = 1責務。複数の役割を持たせない
- 1ファイルに定義するコンポーネントは1つだけ。同じファイルに複数のコンポーネントを書かない

```tsx
// Bad: 1ファイルに複数コンポーネント
function UserRow() { ... }
function UserList() { ... }  // 同じファイルに書かない
```

```tsx
// Good: ファイルを分ける
// components/UserRow.tsx
export function UserRow() { ... }

// components/UserList.tsx
export function UserList() { ... }
```

## ロジックとUIの分離

コンポーネントはJSXだけを書く。state・イベントハンドラ・データ加工はカスタムフックに切り出すこと。

```tsx
// Bad: コンポーネントにロジックが混在している
function UserList() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_USERS.filter(u => u.name.includes(search))
  const handleDelete = (id: string) => {
    // 削除処理...
  }
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(u => <UserRow key={u.id} onDelete={handleDelete} />)}
    </div>
  )
}
```

```tsx
// Good: ロジックをフックに切り出す
// features/users/hooks/useUserList.ts
export function useUserList() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_USERS.filter(u => u.name.includes(search))
  const handleDelete = (id: string) => {
    // 削除処理...
  }
  return { filtered, search, setSearch, handleDelete }
}

// features/users/components/UserList.tsx
function UserList() {
  const { filtered, search, setSearch, handleDelete } = useUserList()
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(u => <UserRow key={u.id} onDelete={handleDelete} />)}
    </div>
  )
}
```

## pages/ のルール

`pages/` はルーティングのエントリポイントのみ。ロジックやUIはfeature側に書き、pagesはそれを呼ぶだけにすること。

```tsx
// pages/UsersPage.tsx  ← これだけでよい
import { UserListPage } from '@/features/users'

export default function UsersPage() {
  return <UserListPage />
}
```

pagesにstateやuseEffectを書いてはいけない。

## state（状態）の置き場

以下の基準で判断する。

| 状態の種類 | 置き場 | 例 |
|---|---|---|
| 特定コンポーネント内だけで使う | コンポーネントローカル（useState） | モーダルの開閉、入力値 |
| 同じfeature内の複数コンポーネントで使う | featureのカスタムフック | 一覧の選択状態、フィルター条件 |
| 複数featureをまたいで使う | `stores/` のグローバルストア | ログインユーザー情報、通知 |

迷ったらまずコンポーネントローカルに置き、必要になってから上に引き上げる。最初からグローバルに置かない。

## 新しいfeatureを追加するとき

1. `features/` 配下にfeatureディレクトリを作成
2. `components/`, `hooks/`, `mock.ts`, `types.ts`, `index.ts` を必要に応じて作成
3. `pages/` にルート対応のページを追加（featureを呼ぶだけ）
4. `index.ts` で外部公開インターフェースを定義
