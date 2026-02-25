import { NextRequest, NextResponse } from 'next/server';
import { updateClient, getClient } from '@/lib/clients';
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
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: 'Ügyfél nem található' }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const existing = await getClient(id);
  const updates: Record<string, string | boolean> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.lastName !== undefined) updates.lastName = body.lastName;
  if (body.firstName !== undefined) updates.firstName = body.firstName;
  if (body.address !== undefined) updates.address = body.address;
  if (body.postalCode !== undefined) updates.postalCode = body.postalCode;
  if (body.settlement !== undefined) updates.settlement = body.settlement;
  if (body.streetAddress !== undefined) updates.streetAddress = body.streetAddress;
  if (
    body.postalCode !== undefined ||
    body.settlement !== undefined ||
    body.streetAddress !== undefined
  ) {
    const pc = body.postalCode ?? existing?.postalCode ?? '';
    const st = body.settlement ?? existing?.settlement ?? '';
    const sa = body.streetAddress ?? existing?.streetAddress ?? '';
    updates.address = [pc, st, sa].filter(Boolean).join(', ');
  }
  if (body.phone !== undefined) updates.phone = body.phone;
  if (body.email !== undefined) updates.email = body.email;
  if (body.status !== undefined) updates.status = body.status;
  if (body.clientType !== undefined) updates.clientType = body.clientType;
  if (body.taxNumber !== undefined) updates.taxNumber = body.taxNumber;
  if (body.contactLastName !== undefined) updates.contactLastName = body.contactLastName;
  if (body.contactFirstName !== undefined) updates.contactFirstName = body.contactFirstName;
  if (body.contactName !== undefined) updates.contactName = body.contactName;
  if (body.contactPhone !== undefined) updates.contactPhone = body.contactPhone;
  if (body.contactEmail !== undefined) updates.contactEmail = body.contactEmail;
  if (body.billingSameAsAddress !== undefined) updates.billingSameAsAddress = !!body.billingSameAsAddress;
  if (body.billingName !== undefined) updates.billingName = body.billingName;
  if (body.billingAddress !== undefined) updates.billingAddress = body.billingAddress;
  if (body.billingTaxNumber !== undefined) updates.billingTaxNumber = body.billingTaxNumber;
  if (body.lastName !== undefined || body.firstName !== undefined) {
    const ln = body.lastName ?? existing?.lastName ?? '';
    const fn = body.firstName ?? existing?.firstName ?? '';
    updates.name = `${ln} ${fn}`.trim();
  }
  if (body.contactLastName !== undefined || body.contactFirstName !== undefined) {
    const cln = body.contactLastName ?? existing?.contactLastName ?? '';
    const cfn = body.contactFirstName ?? existing?.contactFirstName ?? '';
    updates.contactName = `${cln} ${cfn}`.trim();
  }

  const client = await updateClient(id, updates);
  if (!client) {
    return NextResponse.json({ error: 'Ügyfél nem található' }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { deleteClient } = await import('@/lib/clients');
  const deleted = await deleteClient(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Ügyfél nem található' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
