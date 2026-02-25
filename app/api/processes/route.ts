import { NextRequest, NextResponse } from 'next/server';
import { getAllProcesses } from '@/lib/processes';
import { getClients } from '@/lib/clients';
import { isAuthorized } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [processes, clients] = await Promise.all([
      getAllProcesses(),
      getClients(),
    ]);
    const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));
    const enriched = processes.map((p) => ({
      ...p,
      clientName: clientMap[p.clientId]?.name ?? '–',
    }));
    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch processes' },
      { status: 500 }
    );
  }
}
