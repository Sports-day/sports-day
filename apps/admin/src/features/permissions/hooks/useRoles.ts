import { useState } from 'react'
import type { Role } from '../types'

// 【未確定】Role CRUD の GraphQL API は未実装。ローカル状態のみ。
export function useRoles() {
  const [roles] = useState<Role[]>([])

  const toggleDefault = (_id: string) => {
    // 【未確定】Role API 未実装
  }

  return { data: roles, loading: false, error: null, toggleDefault }
}
