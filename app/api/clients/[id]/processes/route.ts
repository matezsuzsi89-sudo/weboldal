import { NextRequest, NextResponse } from 'next/server';
import { getProcessesByClient, addProcess } from '@/lib/processes';
import { isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const processes = await getProcessesByClient(id);
  return NextResponse.json(processes);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const text = body.text?.trim() || '';
  const responsibleUserId = body.responsibleUserId?.trim() || undefined;

  if (!text) {
    return NextResponse.json(
      { error: 'A folyamat szövege kötelező.' },
      { status: 400 }
    );
  }

  const process = await addProcess(id, text, responsibleUserId);
  return NextResponse.json(process, { status: 201 });
}
