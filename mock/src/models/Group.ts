export interface Group {
  id: string;
  name: string;
  userIds: Set<string>; // 所属ユーザーのIDセット
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupInput {
  name: string;
}

export interface UpdateGroupInput {
  name?: string;
}
