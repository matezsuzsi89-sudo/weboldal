# Adatbázis beállítása (PostgreSQL)

## 1. PostgreSQL adatbázis

Szükséged lesz egy PostgreSQL adatbázisra. Lehetőségek:

- **Neon** (ingyenes, felhő): https://neon.tech
- **Supabase** (ingyenes): https://supabase.com
- **Lokális**: PostgreSQL telepítése a gépedre

## 2. Környezeti változók

Másold a `.env.example` fájlt `.env` névre:

```bash
cp .env.example .env
```

Szerkeszd a `.env` fájlt, és állítsd be a `DATABASE_URL` értékét:

```
DATABASE_URL="postgresql://FELHASZNÁLÓ:JELSZÓ@HOSZT:5432/ADATBÁZIS?sslmode=require"
```

Példák:
- Lokális: `postgresql://postgres:password@localhost:5432/precisolit`
- Neon: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

## 3. Táblák létrehozása

```bash
npm install
npx prisma generate
npx prisma db push
```

Vagy migrációval (verziókezeléshez):

```bash
npx prisma migrate dev --name init
```

Ha már van JSON adatod a `data/` mappában, migrálás:

```bash
npm run db:migrate:json
```

## 4. Ellenőrzés

Adatbázis tartalom megtekintése:

```bash
npx prisma studio
```

Ez egy böngészőben megnyitja a Prisma Studio-t.
