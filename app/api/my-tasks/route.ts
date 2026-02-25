import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { getProcessesByResponsibleUser } from '@/lib/processes';
import { getClients } from '@/lib/clients';

export async function GET(request: NextRequest) {
  const auth = await getAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = 'user' in auth && auth.user ? auth.user.id : null;
  const isAdmin = auth.ok && auth.isAdmin;
  const responsibleParam = request.nextUrl.searchParams.get('responsibleUserId');

  let targetUserId: string | null = userId;
  if (responsibleParam) {
    if (isAdmin) {
      targetUserId = responsibleParam;
    } else if (userId && responsibleParam === userId) {
      targetUserId = userId;
    }
  }
  if (!targetUserId) {
    return NextResponse.json([]);
  }

  try {
    const [processes, clients] = await Promise.all([
      getProcessesByResponsibleUser(targetUserId),
      getClients(),
    ]);
    const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));
    const enriched = processes.map((p) => ({
      ...p,
      clientName: clientMap[p.clientId]?.name ?? '–',
    }));
    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching my tasks:', error);
    return NextResponse.json(
      { error: 'Feladatok betöltése sikertelen.' },
      { status: 500 }
    );
  }
}
