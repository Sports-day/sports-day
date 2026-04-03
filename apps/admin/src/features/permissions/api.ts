import { gql } from '@apollo/client'

// permissions feature:
// 【未確定】 GraphQL には Role/Permission 管理の API が存在しない。
// 現在の admin ロール管理（CRUD）は後続タスクでバックエンド実装が必要。
// `me` クエリで現在のユーザー情報を取得し、UI 表示制御に使用する。

export const GET_ADMIN_ME = gql`
  query GetAdminMe {
    me {
      id
      name
      email
      groups { id name }
      teams { id name }
    }
  }
`
