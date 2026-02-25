import { NextRequest, NextResponse } from 'next/server';
import { updateProjectStatus } from '@/lib/projects';
import { isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as 'folyamatban' | 'lezárt';

  if (status !== 'folyamatban' && status !== 'lezárt') {
    return NextResponse.json(
      { error: 'Érvénytelen státusz (folyamatban vagy lezárt)' },
      { status: 400 }
    );
  }

  const project = await updateProjectStatus(id, status);
  if (!project) {
    return NextResponse.json({ error: 'Projekt nem található' }, { status: 404 });
  }
  return NextResponse.json(project);
}
