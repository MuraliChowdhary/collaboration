// src/services/user.service.ts
import { prisma,User } from '@repo/database';

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export const userService = {
  getUserById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },

  getCurrentUser: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },

  updateUserProfile: async (id: string, data: Partial<User>): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  deleteUser: async (id: string): Promise<void> => {
    await prisma.user.delete({ where: { id } });
  },

  getUserSkills: async (userId: string) => {
    return prisma.userSkill.findMany({ where: { userId } });
  },

  addUserSkill: async (userId: string, data: { skillId: string; level: SkillLevel; yearsOfExp: number }) => {
    return prisma.userSkill.create({ data: { userId, ...data } });
  },

  removeUserSkill: async (userId: string, skillId: string) => {
    await prisma.userSkill.deleteMany({ where: { userId, skillId } });
  },

  getUserInterests: async (userId: string) => {
    return prisma.userInterest.findMany({ where: { userId } });
  },

  addUserInterest: async (userId: string, interestId: string) => {
    return prisma.userInterest.create({ data: { userId, interestId } });
  },

  searchUsers: async (query: any, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query.q, mode: 'insensitive' } },
          { lastName: { contains: query.q, mode: 'insensitive' } },
          { username: { contains: query.q, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
    });
    const total = await prisma.user.count({
      where: {
        OR: [
          { firstName: { contains: query.q, mode: 'insensitive' } },
          { lastName: { contains: query.q, mode: 'insensitive' } },
          { username: { contains: query.q, mode: 'insensitive' } },
        ],
      },
    });
    return { users, pagination: { page, limit, total } };
  },
};
