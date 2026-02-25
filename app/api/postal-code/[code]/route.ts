import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const trimmed = String(code ?? '').trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return NextResponse.json(
      { error: 'Érvénytelen irányítószám (4 számjegy kell)' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.zippopotam.us/hu/${trimmed}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Irányítószám nem található' },
        { status: 404 }
      );
    }
    const data = await res.json();
    const place = data?.places?.[0];
    const settlement = place?.['place name'] ?? null;
    if (!settlement) {
      return NextResponse.json(
        { error: 'Település nem található' },
        { status: 404 }
      );
    }
    return NextResponse.json({ settlement, postalCode: trimmed });
  } catch {
    return NextResponse.json(
      { error: 'Sikertelen lekérdezés' },
      { status: 500 }
    );
  }
}
