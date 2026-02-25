# Precisolit Kft. – Lakásfelújítás Landing

Konverzióra optimalizált egyoldalas landing a 15 perces ingyenes konzultációra történő jelentkezések gyűjtéséhez.

## Telepítés

```bash
npm install
npm run dev
```

## Form submit – valós API-ra cserélés

A form jelenleg **mock** submitot használ (client oldali delay). Valós API-ra cserélése:

1. Nyisd meg `components/ConsultationForm.tsx`
2. Keress rá a `handleSubmit` függvényre
3. Cseréld ki a mock részt valódi fetch hívásra:

```tsx
// Előtte (mock):
await new Promise((r) => setTimeout(r, 800));

// Utána (valós API):
const res = await fetch('/api/consultation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
if (!res.ok) throw new Error('Küldés sikertelen');
```

4. Hozz létre API route-ot: `app/api/consultation/route.ts`

```ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Ide: email küldés, CRM integráció, DB mentés stb.
  return NextResponse.json({ success: true });
}
```

## GTM (Google Tag Manager) bekötés

1. **Környezeti változó**: Adj hozzá egy `.env.local` fájlt:
   ```
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

2. **Layout**: Az `app/layout.tsx`-ben vedd ki a kommentet és importáld a GTM komponenst:
   ```tsx
   import { GTM } from '@/components/GTM';
   // ...
   <body>
     <GTM />
     <StickyHeader />
     ...
   ```

3. **dataLayer események** – már előkészítve a kódban:
   - `cta_click` – CTA gomb kattintás (location paraméterrel)
   - `form_start` – űrlap első fókusz (form megnyitás)
   - `form_submit` – űrlap sikeres elküldés

4. **GTM konfiguráció**: A GTM felületén hozz létre Custom Event triggereket ezekhez az eseményekhez.

## Képek cseréje

- **Hero Before/After**: `app/page.tsx` – keresd a "helyettesítsd saját fotókkal" kommentet
- **Referenciák**: `app/page.tsx` – a 6 referencia kártya placeholder div-jei
- Next.js Image komponenst használj: `import Image from 'next/image'`

## Színpaletta

| Változó | Hex | Használat |
|---------|-----|-----------|
| bg | #06080d | Háttér |
| card | #15171d | Kártya, szekció |
| accent | #df6d0e | CTA, kiemelések |
| muted | #98999b | Másodlagos szöveg |
| text | #f7f6f7 | Fő szöveg |
