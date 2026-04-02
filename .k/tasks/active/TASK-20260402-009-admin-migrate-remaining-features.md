---
id: TASK-20260402-009
title: "admin: 残 feature hooks を GraphQL に移行（locations, information, images, tags, permissions）"
status: done
priority: P1
owner: implementer
created: "2026-04-02"
updated: "2026-04-02"
---

# admin: 残 feature hooks を GraphQL に移行（locations, information, images, tags, permissions）

## Required Reading

- `.k/decisions/ADR-20260402-001-graphql-client-strategy.md` — GraphQL クライアント方針
- `.claude/rules/frontend_admin.md` — admin のフロントエンドルール
- `/api/graph/schema.graphqls` — Query / Mutation 定義
- `/api/graph/model.graphqls` — 型定義
- `/apps/admin/src/features/locations/mock.ts` — 移行元モック
- `/apps/admin/src/features/locations/hooks/` — 移行元 hooks
- `/apps/admin/src/features/information/mock.ts` — 移行元モック
- `/apps/admin/src/features/information/hooks/` — 移行元 hooks
- `/apps/admin/src/features/images/mock.ts` — 移行元モック
- `/apps/admin/src/features/images/hooks/` — 移行元 hooks
- `/apps/admin/src/features/tags/mock.ts` — 移行元モック
- `/apps/admin/src/features/tags/hooks/` — 移行元 hooks
- `/apps/admin/src/features/permissions/mock.ts` — 移行元モック
- `/apps/admin/src/features/permissions/hooks/` — 移行元 hooks

---

## Role Contract

`.k/docs/ops.md` > role 定義 を参照。

---

## Why

- TASK-20260402-008 でコア features を移行した後、残りの features もモックから GraphQL に移行する必要がある
- permissions feature は `authorization.md` に記載の認可方針に関連し、`me` クエリからのロール取得を実装する重要な feature

---

## Outcome

- locations, information, images, tags, permissions の各 feature が GraphQL API 経由でデータ取得・操作を行っている
- permissions feature が `me` クエリを使用してロール情報を取得し、UI 表示制御を行っている

---

## Scope

### 対象

- locations, information, images の各 feature に `api.ts` を作成し hooks を移行
- tags feature: バックエンドに Tag 型がない場合の対応を決める（Scene の name をタグとして扱うか、feature 自体を無効化するか）
- permissions feature: `me` クエリからロール・パーミッションを取得し、UI 表示制御に使用
- graphql-codegen の再実行

### 対象外

- モックファイルの削除（TASK-20260402-010）
- UI コンポーネントの変更
- バックエンドの認可実装（既に存在する前提）

---

## Acceptance Criteria

- [ ] locations feature が GraphQL の `locations` / `location` / `createLocation` / `updateLocation` / `deleteLocation` を使用している
- [ ] information feature が GraphQL の `Informations` / `Information` / `createInformation` / `updateInformation` / `deleteInformation` を使用している
- [ ] images feature が GraphQL の `images` / `image` / `createImageUploadURL` / `deleteImage` を使用している
- [ ] tags feature について: ���ックエンドに対応する API がある場合はマッピング済み。ない場合は対応方針がコメントに記載されている
- [ ] permissions feature が `me` クエリを使用してロール情報を取得している
- [ ] 各 feature の hooks がモックを参照していない
- [ ] `tsc --noEmit` がエラーなく通る

---

## Plan

### 方針

1. locations → information → images の順で移行（比較的単純な CRUD）
2. tags feature: バックエンドスキーマで Tag 相当のエンティティを確認
   - Scene や SportScene が Tag 的な役割を果たしている場合はそちらにマッピング
   - 該当なしの場合は feature を「バックエンド未実装」として空実装
3. permissions feature:
   - `me` クエリを呼ぶ hooks を作成
   - ロール（admin/organizer/participant）に基づく表示制御ロジックを実装
   - `useRoles` / `useRoleDetail` 等をリファクタ
4. graphql-codegen 再実行

### 依存

- TASK-20260402-008（コア features 移行）が完了していること

### リスク

- images feature は画像アップロード（presigned URL）を含むため、モックとの差異が大きい
- permissions feature の「ロール管理」がバックエンドの `updateUserRole` Mutation に対応しているか確認が必要
- tags のバックエンド対応が不明

---

## Verification

- [ ] `tsc --noEmit` がエラーなく通る
- [ ] 各 feature の hooks から `mock.ts` への import がない
- [ ] `localStorage` への read/write 呼び出しがない（対象 feature 内）
- [ ] `yarn build` が成功する

---

## Knowledge Updates

- [ ] docs を更新した または 不要理由を記載した
- [ ] ADR を追加した または 不要理由を記載した
- [ ] runbook を更新した または 不要理由を記載した
- [ ] notes を片付けた（昇格 または 破棄）

---

## Definition of Done

正式定義は `.k/docs/ops.md` を参照。以下は主要項目の確認用:

- [ ] AC を満たした
- [ ] 動作確認方法が書かれている
- [ ] Knowledge Updates を満たした または 不要理由がある
- [ ] notes が片付いている
- [ ] reviewer が承認した

---

## Implementation Notes

- 作業ブランチ: `refactor/api-integration`
- **images feature の特殊性**: 画像アップロードは `createImageUploadURL` で presigned URL を取得し、その URL に直接 PUT する 2 ステップ。モックにはない実際の HTTP 通信が必要
- **permissions の認可方針**: `authorization.md` に記載の通り、`me` クエリでロールを取得し State に保持、UI 出し分けを行う

---

## Review Log

| # | 日付 | 判定 | 差し戻し先 | 指摘概要 |
|---|------|------|-----------|---------|
| 1 | | | | |

※ 差し戻しは最大 3 回。3 回超はユーザーにエスカレーション。

---

## Result

- （未実施）
