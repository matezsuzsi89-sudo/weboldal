import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="border-t border-black/20 py-12"
      style={{
        background: 'linear-gradient(to right, #08080E 0%, #14161b 100%)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-10 text-center text-base leading-relaxed text-gray-400 md:text-lg">
          A felújítás lehet rendezett és nyugodt folyamat is. Mi ezért dolgozunk.
        </p>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="text-center md:text-left">
            <p className="font-medium text-white">Precisolit Kft.</p>
            <p className="mt-1 text-sm text-gray-300">Budapest és környéke</p>
            <p className="mt-3 text-sm text-gray-400">Nyitva tartás</p>
            <ul className="mt-1 space-y-0.5 text-sm text-gray-300">
              {[
                { day: 'Hétfő', hours: '8:00–17:00' },
                { day: 'Kedd', hours: '8:00–17:00' },
                { day: 'Szerda', hours: '8:00–17:00' },
                { day: 'Csütörtök', hours: '8:00–17:00' },
                { day: 'Péntek', hours: '8:00–17:00' },
                { day: 'Szombat', hours: '8:00–17:00' },
                { day: 'Vasárnap', hours: 'Zárva' },
              ].map(({ day, hours }) => (
                <li key={day} className="flex gap-8">
                  <span className="w-20 shrink-0">{day}</span>
                  <span className="text-gray-400">{hours}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="text-sm font-medium text-gray-300">Kérdésed van? Hívj bizalommal.</p>
            <a
              href="tel:+36301234567"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/60 bg-accent/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/20 hover:border-accent"
            >
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +36 30 123 4567
            </a>
            <a
              href="mailto:info@precisolit.hu"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/60 bg-accent/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/20 hover:border-accent"
            >
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@precisolit.hu
            </a>
          </div>
        </div>
        <div className="mt-10 space-y-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
            <Link href="/adatkezelesi" className="hover:text-accent hover:underline">
              Adatkezelési tájékoztató
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/impresszum" className="hover:text-accent hover:underline">
              Impresszum
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Precisolit Kft. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
