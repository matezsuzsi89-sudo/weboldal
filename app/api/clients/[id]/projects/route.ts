import { NextRequest, NextResponse } from 'next/server';
import { getProjectsByClient, addProject } from '@/lib/projects';
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
  const projects = await getProjectsByClient(id);
  return NextResponse.json(projects);
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
  const name = body.name?.trim() || 'Projekt';

  const project = await addProject(id, name);
  return NextResponse.json(project, { status: 201 });
}
