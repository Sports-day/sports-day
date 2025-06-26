import { ulid } from "ulid";

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

// In-memory data store
class GroupStore {
  private groups: Map<string, Group> = new Map();

  // Initialize with some sample data
  constructor() {
    this.seedData();
  }

  private seedData(): void {
    const sampleGroups: CreateGroupInput[] = [
      { name: "サクラ" },
      { name: "アサヒ" },
    ];

    sampleGroups.forEach((group) => {
      this.createGroup(group);
    });
  }

  // Get all groups
  getAllGroups(): Group[] {
    return Array.from(this.groups.values());
  }

  // Get group by ID
  getGroupById(id: string): Group | undefined {
    return this.groups.get(id);
  }

  // Create new group
  createGroup(input: CreateGroupInput): Group {
    const now = new Date().toISOString();
    const group: Group = {
      id: ulid(),
      name: input.name,
      userIds: new Set(),
      createdAt: now,
      updatedAt: now,
    };

    this.groups.set(group.id, group);
    return group;
  }

  // Update group
  updateGroup(id: string, input: UpdateGroupInput): Group {
    const group = this.groups.get(id);
    if (!group) {
      throw new Error(`Group with id ${id} not found`);
    }

    const updatedGroup: Group = {
      ...group,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  // Delete group
  deleteGroup(id: string): boolean {
    return this.groups.delete(id);
  }

  // Add user to group
  addUserToGroup(userId: string, groupId: string): Group {
    const group = this.groups.get(groupId);
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    const updatedGroup: Group = {
      ...group,
      userIds: new Set([...group.userIds, userId]),
      updatedAt: new Date().toISOString(),
    };

    this.groups.set(groupId, updatedGroup);
    return updatedGroup;
  }

  // Remove user from group
  removeUserFromGroup(userId: string, groupId: string): Group {
    const group = this.groups.get(groupId);
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    const updatedUserIds = new Set(group.userIds);
    updatedUserIds.delete(userId);

    const updatedGroup: Group = {
      ...group,
      userIds: updatedUserIds,
      updatedAt: new Date().toISOString(),
    };

    this.groups.set(groupId, updatedGroup);
    return updatedGroup;
  }

  // Get groups by user ID
  getGroupsByUserId(userId: string): Group[] {
    return Array.from(this.groups.values()).filter((group) =>
      group.userIds.has(userId)
    );
  }

  // Get users by group ID
  getUserIdsByGroupId(groupId: string): string[] {
    const group = this.groups.get(groupId);
    return group ? Array.from(group.userIds) : [];
  }
}

// Export singleton instance
export const groupStore = new GroupStore();
