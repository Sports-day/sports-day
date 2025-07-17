import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateGroupInput = {
  name: Scalars['String']['input'];
};

export type CreateSceneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateSportEntryInput = {
  sportSceneId: Scalars['ID']['input'];
  teamId: Scalars['ID']['input'];
};

export type CreateSportInput = {
  name: Scalars['String']['input'];
};

export type CreateSportSceneInput = {
  sceneId: Scalars['ID']['input'];
  sportId: Scalars['ID']['input'];
};

export type CreateTeamInput = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTeamMember: Team;
  addUserToGroup: Group;
  createGroup: Group;
  createScene: Scene;
  createSport: Sport;
  createSportEntry: SportEntry;
  createSportScene: SportScene;
  createTeam: Team;
  createUser: User;
  deleteGroup: Scalars['Boolean']['output'];
  deleteScene: Scalars['Boolean']['output'];
  deleteSport: Scalars['Boolean']['output'];
  deleteSportEntry: Scalars['Boolean']['output'];
  deleteSportScene: Scalars['Boolean']['output'];
  deleteTeam: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  removeTeamMember: Team;
  removeUserFromGroup: Group;
  updateGroup: Group;
  updateScene: Scene;
  updateSport: Sport;
  updateSportEntry: SportEntry;
  updateSportScene: SportScene;
  updateTeam: Team;
  updateUser: User;
};


export type MutationAddTeamMemberArgs = {
  teamId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateSceneArgs = {
  input: CreateSceneInput;
};


export type MutationCreateSportArgs = {
  input: CreateSportInput;
};


export type MutationCreateSportEntryArgs = {
  input: CreateSportEntryInput;
};


export type MutationCreateSportSceneArgs = {
  input: CreateSportSceneInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSceneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportSceneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTeamMemberArgs = {
  teamId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationRemoveUserFromGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
};


export type MutationUpdateSceneArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSceneInput;
};


export type MutationUpdateSportArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSportInput;
};


export type MutationUpdateSportEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSportEntryInput;
};


export type MutationUpdateSportSceneArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSportSceneInput;
};


export type MutationUpdateTeamArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTeamInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  group?: Maybe<Group>;
  groups: Array<Group>;
  scene?: Maybe<Scene>;
  scenes: Array<Scene>;
  sport?: Maybe<Sport>;
  sportEntries: Array<SportEntry>;
  sportEntry?: Maybe<SportEntry>;
  sportScene?: Maybe<SportScene>;
  sportScenes: Array<SportScene>;
  sports: Array<Sport>;
  team?: Maybe<Team>;
  teams: Array<Team>;
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  users: Array<User>;
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySceneArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySportArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySportEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySportSceneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};

export type Scene = {
  __typename?: 'Scene';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sports: Array<Sport>;
  updatedAt: Scalars['String']['output'];
};

export type Sport = {
  __typename?: 'Sport';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  scenes: Array<Scene>;
  updatedAt: Scalars['String']['output'];
};

export type SportEntry = {
  __typename?: 'SportEntry';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  sportScene: SportScene;
  team: Team;
  updatedAt: Scalars['String']['output'];
};

export type SportScene = {
  __typename?: 'SportScene';
  createdAt: Scalars['String']['output'];
  entries: Array<SportEntry>;
  id: Scalars['ID']['output'];
  scene: Scene;
  sport: Sport;
  updatedAt: Scalars['String']['output'];
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['String']['output'];
  group?: Maybe<Group>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  users: Array<User>;
};

export type UpdateGroupInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSceneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSportEntryInput = {
  sportSceneId?: InputMaybe<Scalars['ID']['input']>;
  teamId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateSportInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSportSceneInput = {
  sceneId?: InputMaybe<Scalars['ID']['input']>;
  sportId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateTeamInput = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  teams: Array<Team>;
  updatedAt: Scalars['String']['output'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string }> };


export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    name
    email
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;