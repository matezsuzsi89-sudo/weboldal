import { NextRequest, NextResponse } from 'next/server';
import { closeProcess } from '@/lib/processes';
import { isAuthorized } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as 'kész' | 'sikertelen';

  if (status !== 'kész' && status !== 'sikertelen') {
    return NextResponse.json(
      { error: 'Érvénytelen státusz (kész vagy sikertelen)' },
      { status: 400 }
    );
  }

  const proc = await closeProcess(id, status);
  if (!proc) {
    return NextResponse.json({ error: 'Folyamat nem található' }, { status: 404 });
  }
  return NextResponse.json(proc);
}
