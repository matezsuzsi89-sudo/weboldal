import { NextRequest, NextResponse } from 'next/server';
import { getStatuses, saveStatuses } from '@/lib/clients';
import { isAuthorized } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const statuses = await getStatuses();
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statuses' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const statuses = Array.isArray(body) ? body : body.statuses ?? [];
    const saved = await saveStatuses(statuses);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error saving statuses:', error);
    return NextResponse.json(
      { error: 'Sikertelen mentés' },
      { status: 500 }
    );
  }
}
