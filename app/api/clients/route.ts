import { NextRequest, NextResponse } from 'next/server';
import { getClients, addClient, getStatuses } from '@/lib/clients';
import { isAuthorized } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const clientType = body.clientType === 'ceges' ? 'ceges' : 'maganszemely';

    const statuses = await getStatuses();
    const defaultStatus = statuses[0] ?? 'érdeklődő';

    if (clientType === 'maganszemely') {
      const { lastName, firstName, address, postalCode, settlement, streetAddress, phone, email } = body;
      if (!lastName?.trim() || !firstName?.trim() || !phone?.trim() || !email?.trim()) {
        return NextResponse.json(
          { error: 'Vezetéknév, keresztnév, telefonszám és email megadása kötelező.' },
          { status: 400 }
        );
      }
      const pc = (postalCode ?? '').trim();
      const st = (settlement ?? '').trim();
      const sa = (streetAddress ?? '').trim();
      const addr = pc || st || sa ? [pc, st, sa].filter(Boolean).join(', ') : (address || '').trim();
      const name = `${lastName.trim()} ${firstName.trim()}`.trim();
      const client = await addClient({
        clientType: 'maganszemely',
        name,
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        address: addr,
        postalCode: pc,
        settlement: st,
        streetAddress: sa,
        phone: phone.trim(),
        email: email.trim(),
        status: defaultStatus,
        source: 'manual',
      });
      return NextResponse.json(client, { status: 201 });
    }

    // Céges ügyfél
    const { name, address, postalCode, settlement, streetAddress, taxNumber, phone, email, contactLastName, contactFirstName, contactPhone, contactEmail } = body;
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Cég neve, telefonszáma és email címe kötelező.' },
        { status: 400 }
      );
    }
    if (!contactLastName?.trim() || !contactFirstName?.trim() || !contactPhone?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        { error: 'Kapcsolattartó vezetékneve, keresztneve, telefonszáma és email címe kötelező.' },
        { status: 400 }
      );
    }
    const pc = (postalCode ?? '').trim();
    const st = (settlement ?? '').trim();
    const sa = (streetAddress ?? '').trim();
    const addr = pc || st || sa
      ? [pc, st, sa].filter(Boolean).join(', ')
      : (address || '').trim();
    const contactName = `${contactLastName.trim()} ${contactFirstName.trim()}`.trim();
    const client = await addClient({
      clientType: 'ceges',
      name: name.trim(),
      lastName: '',
      firstName: '',
      address: addr,
      postalCode: pc,
      settlement: st,
      streetAddress: sa,
      phone: phone.trim(),
      email: email.trim(),
      status: defaultStatus,
      source: 'manual',
      taxNumber: (taxNumber || '').trim(),
      contactLastName: contactLastName.trim(),
      contactFirstName: contactFirstName.trim(),
      contactName,
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Sikertelen mentés' },
      { status: 500 }
    );
  }
}
