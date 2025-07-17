export interface Team {
  id: string;
  name: string;
  groupId?: string;
  userIds: Set<string>; // 所属ユーザーのIDセット
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamInput {
  name: string;
  groupId?: string;
}

export interface UpdateTeamInput {
  name?: string;
  groupId?: string;
}
