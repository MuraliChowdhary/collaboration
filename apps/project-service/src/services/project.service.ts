import { MemberRole, MilestoneStatus, prisma } from '@repo/database';
import {
  ProjectType,
  ProjectVisibility,
  ProjectStatus,
  ProjectRole,
} from '../types/project.enum';

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export const projectService = {
  // CRUD
  createProject: async (input: {
    title: string;
    description: string;
    type: string; // you can change to your generated enum type if you import it from @prisma/client
    category: string;
    visibility: string;
    tags?: string[];
    skillIds?: string[]; // relation handled separately
    lookingForMembers?: boolean;
    maxMembers?: number;
    ownerId: string;
  }) => {
    // Build project data for Prisma: include required slug field
    const slug = makeSlug(input.title);
    const data: any = {
      title: input.title,
      description: input.description,
      type: input.type ?? undefined,
      category: input.category,
      visibility: input.visibility ?? undefined,
      tags: input.tags ?? [],
      lookingForMembers: input.lookingForMembers ?? false,
      maxMembers: input.maxMembers ?? null,
      ownerId: input.ownerId,
      slug,
    };

    // Create project
    const project = await prisma.project.create({ data });

    // If skillIds provided, create project_skill rows (ProjectSkill model)
    if (input.skillIds && input.skillIds.length > 0) {
      const rows = input.skillIds.map((skillId) => ({
        id: undefined, // Prisma will set default cuid(); omit id or let createMany generate
        projectId: project.id,
        skillId,
        required: true,
        priority: 0,
      }));

      // createMany can't accept `id: undefined`; remove it
      const createManyRows = rows.map(({ projectId, skillId, required, priority }) => ({
        projectId,
        skillId,
        required,
        priority,
      }));

      // Use createMany to insert multiple ProjectSkill rows
      await prisma.projectSkill.createMany({
        data: createManyRows,
        skipDuplicates: true,
      });
    }

    return project;
  },

  getProjectById: async (id: string) => {
    return prisma.project.findUnique({ where: { id } });
  },

  updateProject: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      type: ProjectType;
      category: string;
      visibility: ProjectVisibility;
      tags: string[];
      skillIds: string[];
      lookingForMembers: boolean;
      maxMembers: number;
    }>
  ) => {
    return prisma.project.update({ where: { id }, data });
  },

  deleteProject: async (id: string) => {
    return prisma.project.delete({ where: { id } });
  },

  // Status
  updateProjectStatus: async (id: string, status: ProjectStatus) => {
    return prisma.project.update({ where: { id }, data: { status } });
  },

  publishProject: async (id: string) => {
    return prisma.project.update({ where: { id }, data: { status: ProjectStatus.OPEN } });
  },

  // Members
  addProjectMember: async (projectId: string, userId: string, role: ProjectRole) => {
    return prisma.projectMember.create({ data: { projectId, userId, role } });
  },

  updateProjectMemberRole: async (
    projectId: string,
    userId: string,
    role: ProjectRole
  ) => {
    return prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
    });
  },

  removeProjectMember: async (projectId: string, userId: string) => {
    return prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  },

  leaveProject: async (projectId: string, userId: string) => {
    return prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  },

  // Invites
 createInvite: async (
    projectId: string,
    inviteeEmail: string,
    role: MemberRole, // use ProjectRole enum type from @prisma/client if available
    inviterId: string,
    message?: string,
    expiresInDays = 7 // default expiry
  ) => {
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    return prisma.collaborationInvite.create({
      data: {
        projectId,
        inviteeEmail,
        role,
        message,
        inviterId,
        expiresAt,
      },
    });
  },


    // Schema: CollaborationInvite has inviteeId and respondedAt — there is no acceptedById
  acceptInvite: async (inviteId: string, userId: string) => {
    return prisma.collaborationInvite.update({
      where: { id: inviteId },
      data: {
        status: 'ACCEPTED',
        inviteeId: userId, // mark who accepted
        respondedAt: new Date(),
      },
    });
  },

  rejectInvite: async (inviteId: string) => {
    return prisma.collaborationInvite.update({
      where: { id: inviteId },
      data: { status: 'REJECTED' },
    });
  },

  // Milestones
  createMilestone: async (projectId: string, data: { title: string; description: string; dueDate: Date }) => {
    return prisma.milestone.create({ data: { projectId, ...data } });
  },

 updateMilestone: async (
    milestoneId: string,
    data: Partial<{ title: string; description: string; status: string }>
  ) => {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;

    if (data.status !== undefined) {
      // Validate status against generated enum values
      const allowed = Object.values(MilestoneStatus) as string[];
      if (!allowed.includes(data.status)) {
        throw new Error(
          `Invalid milestone status "${data.status}". Allowed: ${allowed.join(', ')}`
        );
      }
      // Prisma expects the enum literal, so pass the same string
      updateData.status = data.status;
    }

    return prisma.milestone.update({
      where: { id: milestoneId },
      data: updateData,
    });
  },

  deleteMilestone: async (milestoneId: string) => {
    return prisma.milestone.delete({ where: { id: milestoneId } });
  },

  // Engagement
  likeProject: async (projectId: string) => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');
    return prisma.project.update({
      where: { id: projectId },
      data: { likeCount: (project.likeCount || 0) + 1 },
    });
  },

  viewProject: async (projectId: string) => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');
    return prisma.project.update({
      where: { id: projectId },
      data: { viewCount: (project.viewCount || 0) + 1 },
    });
  },
};
