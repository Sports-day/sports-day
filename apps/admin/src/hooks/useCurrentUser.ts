import { createContext, useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Role } from '@/gql/__generated__/graphql'

export const GET_ME = gql`
  query GetMe {
    me {
      id
      role
      identify { microsoftUserId }
    }
  }
`

type CurrentUser = {
  id: string
  role: Role
}

type CurrentUserContextValue = {
  currentUser: CurrentUser | null
  loading: boolean
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  currentUser: null,
  loading: true,
})

export function useCurrentUserQuery() {
  const { data, loading } = useQuery(GET_ME)
  const me = data?.me as CurrentUser | undefined
  return {
    currentUser: me ?? null,
    loading,
  }
}

export function useCurrentUser() {
  return useContext(CurrentUserContext)
}
