import { prisma } from '@/lib/db';

export type ProcessStatus = 'open' | 'kész' | 'sikertelen';

export type Process = {
  id: string;
  clientId: string;
  text: string;
  status: ProcessStatus;
  createdAt: string;
  closedAt?: string;
  responsibleUserId?: string;
};

function toProcess(row: {
  id: string;
  clientId: string;
  text: string;
  status: string;
  createdAt: Date;
  closedAt: Date | null;
  responsibleUserId: string | null;
}): Process {
  return {
    id: row.id,
    clientId: row.clientId,
    text: row.text,
    status: row.status as ProcessStatus,
    createdAt: row.createdAt.toISOString(),
    closedAt: row.closedAt?.toISOString(),
    responsibleUserId: row.responsibleUserId ?? undefined,
  };
}

export async function getAllProcesses(): Promise<Process[]> {
  const rows = await prisma.process.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toProcess);
}

export async function getProcessesByClient(clientId: string): Promise<Process[]> {
  const rows = await prisma.process.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toProcess);
}

export async function getProcessesByResponsibleUser(userId: string): Promise<Process[]> {
  const rows = await prisma.process.findMany({
    where: { responsibleUserId: userId },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toProcess);
}

export async function addProcess(
  clientId: string,
  text: string,
  responsibleUserId?: string
): Promise<Process> {
  const row = await prisma.process.create({
    data: {
      clientId,
      text,
      status: 'open',
      responsibleUserId: responsibleUserId ?? null,
    },
  });
  return toProcess(row);
}

export async function closeProcess(
  id: string,
  status: 'kész' | 'sikertelen'
): Promise<Process | null> {
  const row = await prisma.process.updateMany({
    where: { id },
    data: { status, closedAt: new Date() },
  });
  if (row.count === 0) return null;
  const updated = await prisma.process.findUniqueOrThrow({ where: { id } });
  return toProcess(updated);
}
