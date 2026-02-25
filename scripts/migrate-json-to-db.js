/**
 * Migrates existing JSON data to PostgreSQL.
 * Run: node scripts/migrate-json-to-db.js
 * Make sure DATABASE_URL is set and migrations are applied.
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const DATA_DIR = path.join(process.cwd(), 'data');

function readJson(file, defaultValue = []) {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return defaultValue;
    const data = fs.readFileSync(p, 'utf-8');
    return JSON.parse(data || JSON.stringify(defaultValue));
  } catch (e) {
    console.warn(`Could not read ${file}:`, e.message);
    return defaultValue;
  }
}

async function main() {
  console.log('Starting JSON to DB migration...');

  const clients = readJson('clients.json');
  const processes = readJson('processes.json');
  const projects = readJson('projects.json');
  const users = readJson('users.json');
  const settings = readJson('settings.json', {});
  const sessionsData = readJson('sessions.json', {});

  const clientCount = await prisma.client.count();
  if (clientCount > 0) {
    console.log('Database already has data. Skipping migration to avoid duplicates.');
    console.log('To re-run, truncate tables first.');
    return;
  }

  // Settings
  const defaultStatuses = ['érdeklődő', 'ajánlat kész', 'szerződés', 'lezárva'];
  const statuses = (settings.statuses && Array.isArray(settings.statuses) && settings.statuses.length > 0)
    ? settings.statuses
    : defaultStatuses;
  await prisma.setting.upsert({
    where: { key: 'statuses' },
    create: { key: 'statuses', value: JSON.stringify(statuses) },
    update: { value: JSON.stringify(statuses) },
  });
  console.log('Settings migrated.');

  // Users
  for (const u of users) {
    if (!u.id || !u.email) continue;
    try {
      await prisma.user.upsert({
        where: { id: u.id },
        create: {
          id: u.id,
          email: (u.email || '').trim().toLowerCase(),
          passwordHash: u.passwordHash || '',
          role: u.role || 'user',
          name: (u.name || u.email?.split('@')[0] || 'User').trim(),
        },
        update: {},
      });
    } catch (e) {
      console.warn('User skip:', u.email, e.message);
    }
  }
  console.log(`Users migrated: ${users.length}`);

  // Clients
  for (const c of clients) {
    if (!c.id) continue;
    try {
      await prisma.client.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          clientType: c.clientType === 'ceges' ? 'ceges' : 'maganszemely',
          name: String(c.name || ''),
          lastName: String(c.lastName ?? ''),
          firstName: String(c.firstName ?? ''),
          address: String(c.address ?? ''),
          postalCode: c.postalCode || null,
          settlement: c.settlement || null,
          streetAddress: c.streetAddress || null,
          phone: String(c.phone || ''),
          email: String(c.email || ''),
          status: String(c.status || 'érdeklődő'),
          source: c.source === 'callback' ? 'callback' : 'manual',
          taxNumber: c.taxNumber || null,
          contactLastName: c.contactLastName || null,
          contactFirstName: c.contactFirstName || null,
          contactName: c.contactName || null,
          contactPhone: c.contactPhone || null,
          contactEmail: c.contactEmail || null,
          subscribeConsent: c.subscribeConsent === true,
          billingSameAsAddress: c.billingSameAsAddress !== false,
          billingName: c.billingName || null,
          billingAddress: c.billingAddress || null,
          billingTaxNumber: c.billingTaxNumber || null,
        },
        update: {},
      });
    } catch (e) {
      console.warn('Client skip:', c.id, e.message);
    }
  }
  console.log(`Clients migrated: ${clients.length}`);

  // Processes
  for (const p of processes) {
    if (!p.id || !p.clientId) continue;
    try {
      await prisma.process.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          clientId: p.clientId,
          text: String(p.text || ''),
          status: p.status || 'open',
          closedAt: p.closedAt ? new Date(p.closedAt) : null,
          responsibleUserId: p.responsibleUserId || null,
        },
        update: {},
      });
    } catch (e) {
      console.warn('Process skip:', p.id, e.message);
    }
  }
  console.log(`Processes migrated: ${processes.length}`);

  // Projects
  for (const p of projects) {
    if (!p.id || !p.clientId) continue;
    try {
      await prisma.project.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          clientId: p.clientId,
          name: String(p.name || 'Projekt'),
          status: p.status || 'folyamatban',
        },
        update: {},
      });
    } catch (e) {
      console.warn('Project skip:', p.id, e.message);
    }
  }
  console.log(`Projects migrated: ${projects.length}`);

  // Sessions
  const sessionEntries = typeof sessionsData === 'object' && !Array.isArray(sessionsData)
    ? Object.entries(sessionsData)
    : [];
  for (const [token, sess] of sessionEntries) {
    if (!token || !sess?.userId) continue;
    try {
      await prisma.session.upsert({
        where: { token },
        create: {
          token,
          userId: sess.userId,
        },
        update: {},
      });
    } catch (e) {
      console.warn('Session skip:', e.message);
    }
  }
  console.log(`Sessions migrated: ${sessionEntries.length}`);

  console.log('Migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
