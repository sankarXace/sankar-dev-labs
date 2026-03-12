import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin-seed-password', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Admin User',
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      plan: 'free',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: { userId: user.id, workspaceId: workspace.id },
    },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'OWNER',
    },
  });

  const issue1 = await prisma.issue.create({
    data: {
      workspaceId: workspace.id,
      title: 'Welcome to the platform',
      description: 'This is a sample issue to get you started.',
      status: 'OPEN',
      priority: 'HIGH',
      createdById: user.id,
    },
  });

  await prisma.issue.create({
    data: {
      workspaceId: workspace.id,
      title: 'Set up your first project',
      description: 'Create labels and milestones for your workflow.',
      status: 'OPEN',
      priority: 'MEDIUM',
      createdById: user.id,
    },
  });

  const docRoot = await prisma.document.create({
    data: {
      workspaceId: workspace.id,
      title: 'Getting Started',
      content: '# Getting Started\n\nWelcome to the developer workflow platform.',
      createdById: user.id,
    },
  });

  await prisma.document.create({
    data: {
      workspaceId: workspace.id,
      parentId: docRoot.id,
      title: 'Overview',
      content: 'This workspace contains sample issues and documents.',
      createdById: user.id,
    },
  });

  console.log('Seed completed: workspace', workspace.slug, 'user', user.email, 'issues', 2, 'documents', 2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
