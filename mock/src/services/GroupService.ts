import { Group, CreateGroupInput, UpdateGroupInput } from "../models/Group";
import { GroupRepository } from "../repositories/GroupRepository";

export class GroupService {
  private groupRepo: GroupRepository;

  constructor(groupRepo: GroupRepository) {
    this.groupRepo = groupRepo;
  }

  getAllGroups(): Group[] {
    return this.groupRepo.findAll();
  }

  getGroupById(id: string): Group | undefined {
    return this.groupRepo.findById(id);
  }

  getGroupWithUsers(id: string): Group | undefined {
    return this.groupRepo.getGroupWithUsers(id);
  }

  createGroup(input: CreateGroupInput): Group {
    return this.groupRepo.create(input);
  }

  updateGroup(id: string, input: UpdateGroupInput): Group {
    // Check if group exists
    const existingGroup = this.groupRepo.findById(id);
    if (!existingGroup) {
      throw new Error(`Group with id ${id} not found`);
    }

    const updatedGroup = this.groupRepo.update(id, input);
    if (!updatedGroup) {
      throw new Error(`Failed to update group with id ${id}`);
    }

    return updatedGroup;
  }

  deleteGroup(id: string): boolean {
    // Check if group exists
    const existingGroup = this.groupRepo.findById(id);
    if (!existingGroup) {
      throw new Error(`Group with id ${id} not found`);
    }

    return this.groupRepo.delete(id);
  }

  addUserToGroup(userId: string, groupId: string): boolean {
    // Check if group exists
    const group = this.groupRepo.findById(groupId);
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    return this.groupRepo.addUserToGroup(userId, groupId);
  }

  removeUserFromGroup(userId: string, groupId: string): boolean {
    // Check if group exists
    const group = this.groupRepo.findById(groupId);
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    return this.groupRepo.removeUserFromGroup(userId, groupId);
  }

  getGroupsByUserId(userId: string): Group[] {
    return this.groupRepo.getGroupsByUserId(userId);
  }

  getUserIdsByGroupId(groupId: string): string[] {
    return this.groupRepo.getUserIdsByGroupId(groupId);
  }

  getGeneratedCount(): number {
    return this.groupRepo.count();
  }
}
