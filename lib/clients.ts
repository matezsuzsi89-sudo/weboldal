import { prisma } from '@/lib/db';

export type ClientSource = 'callback' | 'manual';

export type ClientType = 'maganszemely' | 'ceges';

export type Client = {
  id: string;
  clientType: ClientType;
  name: string;
  lastName: string;
  firstName: string;
  address: string;
  postalCode?: string;
  settlement?: string;
  streetAddress?: string;
  phone: string;
  email: string;
  status: string;
  source: ClientSource;
  createdAt: string;
  updatedAt?: string;
  taxNumber?: string;
  contactLastName?: string;
  contactFirstName?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  subscribeConsent?: boolean;
  billingSameAsAddress?: boolean;
  billingName?: string;
  billingAddress?: string;
  billingTaxNumber?: string;
};

const DEFAULT_STATUSES = ['érdeklődő', 'ajánlat kész', 'szerződés', 'lezárva'];

function toClient(row: {
  id: string;
  clientType: string;
  name: string;
  lastName: string;
  firstName: string;
  address: string;
  postalCode: string | null;
  settlement: string | null;
  streetAddress: string | null;
  phone: string;
  email: string;
  status: string;
  source: string;
  createdAt: Date;
  updatedAt: Date | null;
  taxNumber: string | null;
  contactLastName: string | null;
  contactFirstName: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  subscribeConsent: boolean;
  billingSameAsAddress: boolean;
  billingName: string | null;
  billingAddress: string | null;
  billingTaxNumber: string | null;
}): Client {
  const clientType = (row.clientType === 'ceges' ? 'ceges' : 'maganszemely') as ClientType;
  const name = clientType === 'ceges' ? row.name : (row.name || `${row.lastName} ${row.firstName}`.trim());
  const contactName = row.contactName || `${row.contactLastName ?? ''} ${row.contactFirstName ?? ''}`.trim();
  const hasSplitAddress = row.postalCode || row.settlement || row.streetAddress;
  const address = hasSplitAddress
    ? [row.postalCode, row.settlement, row.streetAddress].filter(Boolean).join(', ')
    : row.address;
  return {
    id: row.id,
    clientType,
    name,
    lastName: row.lastName ?? '',
    firstName: row.firstName ?? '',
    address,
    postalCode: row.postalCode ?? undefined,
    settlement: row.settlement ?? undefined,
    streetAddress: row.streetAddress ?? undefined,
    phone: row.phone,
    email: row.email,
    status: row.status,
    source: row.source as ClientSource,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
    taxNumber: row.taxNumber ?? undefined,
    contactLastName: row.contactLastName ?? undefined,
    contactFirstName: row.contactFirstName ?? undefined,
    contactName: contactName || undefined,
    contactPhone: row.contactPhone ?? undefined,
    contactEmail: row.contactEmail ?? undefined,
    subscribeConsent: row.subscribeConsent,
    billingSameAsAddress: row.billingSameAsAddress,
    billingName: row.billingName ?? undefined,
    billingAddress: row.billingAddress ?? undefined,
    billingTaxNumber: row.billingTaxNumber ?? undefined,
  };
}

export async function getClients(): Promise<Client[]> {
  const rows = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toClient);
}

export async function addClient(
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Client> {
  const row = await prisma.client.create({
    data: {
      clientType: data.clientType,
      name: data.name,
      lastName: data.lastName ?? '',
      firstName: data.firstName ?? '',
      address: data.address ?? '',
      postalCode: data.postalCode ?? null,
      settlement: data.settlement ?? null,
      streetAddress: data.streetAddress ?? null,
      phone: data.phone,
      email: data.email,
      status: data.status,
      source: data.source,
      taxNumber: data.taxNumber ?? null,
      contactLastName: data.contactLastName ?? null,
      contactFirstName: data.contactFirstName ?? null,
      contactName: data.contactName ?? null,
      contactPhone: data.contactPhone ?? null,
      contactEmail: data.contactEmail ?? null,
      subscribeConsent: data.subscribeConsent ?? false,
      billingSameAsAddress: data.billingSameAsAddress !== false,
      billingName: data.billingName ?? null,
      billingAddress: data.billingAddress ?? null,
      billingTaxNumber: data.billingTaxNumber ?? null,
    },
  });
  return toClient(row);
}

export async function updateClient(
  id: string,
  updates: Partial<Pick<Client, 'name' | 'lastName' | 'firstName' | 'address' | 'postalCode' | 'settlement' | 'streetAddress' | 'phone' | 'email' | 'status' | 'clientType' | 'taxNumber' | 'contactLastName' | 'contactFirstName' | 'contactName' | 'contactPhone' | 'contactEmail' | 'billingSameAsAddress' | 'billingName' | 'billingAddress' | 'billingTaxNumber'>>
): Promise<Client | null> {
  const row = await prisma.client.updateMany({
    where: { id },
    data: {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.lastName !== undefined && { lastName: updates.lastName }),
      ...(updates.firstName !== undefined && { firstName: updates.firstName }),
      ...(updates.address !== undefined && { address: updates.address }),
      ...(updates.postalCode !== undefined && { postalCode: updates.postalCode }),
      ...(updates.settlement !== undefined && { settlement: updates.settlement }),
      ...(updates.streetAddress !== undefined && { streetAddress: updates.streetAddress }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.email !== undefined && { email: updates.email }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.clientType !== undefined && { clientType: updates.clientType }),
      ...(updates.taxNumber !== undefined && { taxNumber: updates.taxNumber }),
      ...(updates.contactLastName !== undefined && { contactLastName: updates.contactLastName }),
      ...(updates.contactFirstName !== undefined && { contactFirstName: updates.contactFirstName }),
      ...(updates.contactName !== undefined && { contactName: updates.contactName }),
      ...(updates.contactPhone !== undefined && { contactPhone: updates.contactPhone }),
      ...(updates.contactEmail !== undefined && { contactEmail: updates.contactEmail }),
      ...(updates.billingSameAsAddress !== undefined && { billingSameAsAddress: updates.billingSameAsAddress }),
      ...(updates.billingName !== undefined && { billingName: updates.billingName }),
      ...(updates.billingAddress !== undefined && { billingAddress: updates.billingAddress }),
      ...(updates.billingTaxNumber !== undefined && { billingTaxNumber: updates.billingTaxNumber }),
    },
  });
  if (row.count === 0) return null;
  const updated = await prisma.client.findUniqueOrThrow({ where: { id } });
  return toClient(updated);
}

export async function getClient(id: string): Promise<Client | null> {
  const row = await prisma.client.findUnique({ where: { id } });
  return row ? toClient(row) : null;
}

export async function deleteClient(id: string): Promise<boolean> {
  const result = await prisma.client.deleteMany({ where: { id } });
  return result.count > 0;
}

export async function getStatuses(): Promise<string[]> {
  const row = await prisma.setting.findUnique({ where: { key: 'statuses' } });
  if (!row) return DEFAULT_STATUSES;
  try {
    const arr = JSON.parse(row.value) as string[];
    return Array.isArray(arr) && arr.length > 0 ? arr : DEFAULT_STATUSES;
  } catch {
    return DEFAULT_STATUSES;
  }
}

export async function saveStatuses(statuses: string[]): Promise<string[]> {
  const filtered = statuses.filter((s) => s.trim());
  const toSave = filtered.length > 0 ? filtered : DEFAULT_STATUSES;
  await prisma.setting.upsert({
    where: { key: 'statuses' },
    create: { key: 'statuses', value: JSON.stringify(toSave) },
    update: { value: JSON.stringify(toSave) },
  });
  return toSave;
}
