import { NextRequest, NextResponse } from 'next/server';
import { addClient, getStatuses } from '@/lib/clients';
import { addProcess } from '@/lib/processes';

export const dynamic = 'force-dynamic';

function buildCallbackProcessText(message: string): string {
  const msgLine = message.trim() || '(Nincs üzenet)';
  return `Az ügyfél visszahívást kért az alábbi üzenettel:

${msgLine}

Hívd vissza a lehető leghamarabb.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientType = body.clientType === 'ceges' ? 'ceges' : 'maganszemely';

    const statuses = await getStatuses();
    const defaultStatus = statuses[0] ?? 'érdeklődő';
    let client;

    if (clientType === 'maganszemely') {
      const { lastName, firstName, phone, email, message, subscribeConsent } = body;
      if (!lastName?.trim() || !firstName?.trim() || !phone?.trim() || !email?.trim()) {
        return NextResponse.json(
          { error: 'Vezetéknév, keresztnév, telefonszám és email megadása kötelező.' },
          { status: 400 }
        );
      }
      const name = `${lastName.trim()} ${firstName.trim()}`.trim();
      client = await addClient({
        clientType: 'maganszemely',
        name,
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        address: '',
        phone: phone.trim(),
        email: email.trim(),
        status: defaultStatus,
        source: 'callback',
        subscribeConsent: subscribeConsent !== false,
      });
      const processText = buildCallbackProcessText(message || '');
      await addProcess(client.id, processText);
    } else {
      const { companyName, contactLastName, contactFirstName, contactPhone, contactEmail, message, subscribeConsent } = body;
      if (!companyName?.trim()) {
        return NextResponse.json(
          { error: 'A cég neve kötelező.' },
          { status: 400 }
        );
      }
      if (!contactLastName?.trim() || !contactFirstName?.trim() || !contactPhone?.trim() || !contactEmail?.trim()) {
        return NextResponse.json(
          { error: 'Kapcsolattartó adatainak megadása kötelező.' },
          { status: 400 }
        );
      }
      const contactName = `${contactLastName.trim()} ${contactFirstName.trim()}`.trim();
      client = await addClient({
        clientType: 'ceges',
        name: companyName.trim(),
        lastName: '',
        firstName: '',
        address: '',
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
        status: defaultStatus,
        source: 'callback',
        contactLastName: contactLastName.trim(),
        contactFirstName: contactFirstName.trim(),
        contactName,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        subscribeConsent: subscribeConsent !== false,
      });
      const processText = buildCallbackProcessText(message || '');
      await addProcess(client.id, processText);
    }

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error saving callback request:', error);
    return NextResponse.json(
      { error: 'Sikertelen mentés' },
      { status: 500 }
    );
  }
}
