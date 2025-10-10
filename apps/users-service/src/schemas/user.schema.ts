// src/schemas/user.schema.ts
import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    timezone: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const updateUserSettingsSchema = z.object({
  body: z.object({
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    profileVisibility: z.enum(['PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY']).optional(),
  }),
});

export const addSkillSchema = z.object({
  body: z.object({
    skillId: z.string(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    yearsOfExp: z.number(),
  }),
});

export const addInterestSchema = z.object({
  body: z.object({
    interestId: z.string(),
  }),
});
