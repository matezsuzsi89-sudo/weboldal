import { prisma } from '@/lib/db';

export type ProjectStatus = 'folyamatban' | 'lezárt';

export type Project = {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt?: string;
};

function toProject(row: {
  id: string;
  clientId: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
}): Project {
  return {
    id: row.id,
    clientId: row.clientId,
    name: row.name,
    status: row.status as ProjectStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toProject);
}

export async function addProject(clientId: string, name: string): Promise<Project> {
  const row = await prisma.project.create({
    data: {
      clientId,
      name: name.trim() || 'Projekt',
      status: 'folyamatban',
    },
  });
  return toProject(row);
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<Project | null> {
  const row = await prisma.project.updateMany({
    where: { id },
    data: { status },
  });
  if (row.count === 0) return null;
  const updated = await prisma.project.findUniqueOrThrow({ where: { id } });
  return toProject(updated);
}
