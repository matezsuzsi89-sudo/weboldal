import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wrench,
  MapPin,
  Calendar,
  ShieldCheck,
  FileCheck,
  Image,
  Wallet,
  UserCircle,
} from 'lucide-react';
import { ConsultationForm } from '@/components/ConsultationForm';
import { CTAButton } from '@/components/CTAButton';

export const metadata = {
  title: 'Lakásfelújítás Budapest | Precisolit Kft. – Ingyenes 15 perc konzultáció',
  description:
    'Átlátható folyamat, reális ütemezés, korrekt ajánlat. Ingyenes 15 perces konzultáció a lakásfelújításhoz. Budapest és környéke.',
};

export default function LakasfelujitasBudapestPage() {
  return (
    <main className="pb-24 md:pb-12">
      {/* Social proof mini bar */}
      <section className="border-b border-gray-200 bg-white py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            Pár órán belül visszahívunk
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Budapest és környéke
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            Reális határidőkkel
          </span>
        </div>
      </section>

      {/* Hero – háttérkép */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Háttérkép – csak a kép tükröződik desktopon */}
        <div
          className="absolute inset-0 bg-cover bg-left bg-no-repeat md:bg-center transform md:scale-x-[-1]"
          style={{ backgroundImage: "url('/weboldal-kepek/precisolit-hero-banner-1.png')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div
            className="max-w-2xl rounded-2xl border border-white/30 bg-black/60 px-6 py-8 shadow-xl md:-translate-x-[2cm] md:px-10 md:py-10"
          >
            <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Lakásfelújítás: ahol az árajánlat nem csak egy becslés, a határidő pedig szent.
            </h1>
            <p className="mt-6 text-lg text-gray-100 md:text-xl">
              Egy 15 perces ingyenes konzultációval segítünk átlátni a helyzetedet.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/30">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <span className="font-semibold text-white">Mi lesz, ha elszáll a költség?</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/30">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <span className="font-semibold text-white">Mi lesz, ha hetekig áll a munka?</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/30">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <span className="font-semibold text-white">Mi történik, amikor nem vagy ott?</span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-end">
              <CTAButton
                location="hero_primary"
                size="lg"
                label="Ingyenes konzultáció – jelentkezem"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Átlátható és nyugodt folyamat – dizájn szekció */}
      <section
        className="relative overflow-hidden border-t border-gray-200 px-4 py-20 md:py-24"
        style={{
          background: 'linear-gradient(165deg, rgba(223,109,14,0.06) 0%, rgba(245,245,245,0.4) 40%, #ffffff 100%)',
        }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
              Így lesz a felújítás átlátható és nyugodt folyamat
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" aria-hidden />
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-accent opacity-80" aria-hidden />
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 transition-colors group-hover:bg-accent/25">
                <Image className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">
                Minden nap pontosan látod, hol tart a munka
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Fotóval és rövid összefoglalóval jelentkezünk, hogy tudd, mi készült el és mi következik.
              </p>
            </div>
            <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-accent opacity-80" aria-hidden />
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 transition-colors group-hover:bg-accent/25">
                <Wallet className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">
                Előre tisztázott költségek
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                A változtatásokat mindig egyeztetjük, így végig kézben tarthatod a keretet.
              </p>
            </div>
            <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-accent opacity-80" aria-hidden />
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 transition-colors group-hover:bg-accent/25">
                <UserCircle className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">
                Egy ember felel a teljes folyamatért
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Nem kell több szakival egyeztetned – egy kapcsolattartó koordinál mindent.
              </p>
            </div>
            <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-accent opacity-80" aria-hidden />
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 transition-colors group-hover:bg-accent/25">
                <Calendar className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">
                Kiszámítható ütemezés
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                A munka elején meghatározzuk a főbb lépéseket, hogy végig átlásd a projekt menetét.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Miben tudunk segíteni – szolgáltatások */}
      <section className="relative overflow-hidden border-t border-gray-200 px-4 py-20 md:py-24">
        {/* Háttérkép a 3. szekcióhoz */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/weboldal-kepek/precisolit_banner_2.png')" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl">
          <h2
            className="text-center text-2xl font-bold md:text-3xl -translate-y-12 md:translate-y-0"
            style={{
              color: '#fdf1dd',
              textShadow: '0 2px 10px rgba(0,0,0,0.55)',
            }}
          >
            Miben tudunk valóban segíteni?
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <li className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text">
                  Teljes lakásfelújítás koordinálása
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Egy kézben tartjuk a teljes folyamatot a bontástól az utolsó simításig.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text">
                  Fürdőszoba átalakítás és modernizálás
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Új burkolatok, gépészet, szaniterek – átlátható ütemezéssel.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text">
                  Festés, mázolás, belső megújítás
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Gyors, tiszta munkavégzés, pontos határidővel.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text">
                  Kisebb átalakítások, javítások
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Falmozgatás, gipszkartonozás, hőszigetelés, tetőtér kialakítás.
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-10 text-center">
            <CTAButton location="15min_section" />
          </div>
        </div>
      </section>

      {/* Egyedi vizuális szekció – a „Miben tudunk segíteni” után */}
      <section
        className="relative overflow-hidden border-t border-gray-200 px-4 py-24 md:py-32"
        aria-label="Üzenet"
      >
        <div
          className="absolute inset-0 opacity-[0.97]"
          style={{
            background:
              'linear-gradient(145deg, #1a1a1a 0%, #2d2520 35%, #1f1c1a 70%, #1a1a1a 100%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(223,109,14,0.25) 0%, transparent 55%),
              radial-gradient(circle at 80% 80%, rgba(223,109,14,0.08) 0%, transparent 40%)
            `,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.15)_100%)]" aria-hidden />
        <div
          className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(223,109,14,0.8), transparent)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.6)] md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div
              className="pointer-events-none absolute -left-24 top-0 h-60 w-60 rounded-full bg-accent/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-[-6rem] bottom-[-4rem] h-64 w-64 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />
            <div className="md:flex md:items-start md:gap-10 lg:gap-14">
              <div className="md:basis-[40%] md:pt-10 lg:pt-12 md:pl-2 lg:pl-4">
                <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-[32px] lg:leading-snug">
                  Így indul el a felújítás
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 md:text-[15px]">
                  Csak azt mutatjuk meg, amiben biztosak vagyunk: a folyamatod végig átlátható,
                  biztonságos és követhető marad.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:flex-1">
                <div
                  className="pointer-events-none absolute left-[3.1rem] top-10 bottom-10 hidden md:block w-px bg-gradient-to-b from-accent/80 via-accent/35 to-transparent"
                  aria-hidden
                />
                <div className="space-y-6 md:space-y-7">
                  <div className="relative flex gap-4 md:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/20 text-base font-semibold text-accent shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
                      1.
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white md:text-lg">
                        Ingyenes 15 perces konzultáció
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300 md:text-[15px]">
                        Átbeszéljük, mit szeretnél, mire van szükséged, és milyen keretben gondolkodsz.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-4 md:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/20 text-base font-semibold text-accent shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
                      2.
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white md:text-lg">
                        Személyes felmérés és részletes ajánlat
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300 md:text-[15px]">
                        Megnézzük a helyszínt, pontosítjuk a részleteket, és átlátható, tételes ajánlatot kapsz.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-4 md:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/20 text-base font-semibold text-accent shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
                      3.
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white md:text-lg">
                        Ütemezés és indulás
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300 md:text-[15px]">
                        Rögzítjük a főbb lépéseket, és elindul a kivitelezés napi státuszjelentéssel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service focus */}
      <section className="border-t border-gray-200 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-text md:text-3xl">
            Teljes lakásfelújítás – egy kézben, tiszta felelősséggel
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-card p-6 shadow-lg">
              <Wrench className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-lg font-semibold text-text">
                Tervezés és ütemezés
              </h3>
              <p className="text-muted text-sm">
                Közösen áttekintjük a feladatot, elkészítjük a reális ütemtervet,
                tisztázzuk a kereteket.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-6 shadow-lg">
              <ClipboardList className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-lg font-semibold text-text">
                Kivitelezés és koordináció
              </h3>
              <p className="text-muted text-sm">
                Egy felelős koordinálja a munkát, heti egyeztetéssel naprakész
                vagy minden lépésről.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-6 shadow-lg">
              <FileCheck className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-lg font-semibold text-text">
                Átadás és garancia-alapok
              </h3>
              <p className="text-muted text-sm">
                Átadáskor áttekintjük az elvégzett munkákat, egyeztetjük az
                esetleges további teendőket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-text md:text-3xl">
            Így dolgozunk – röviden, érthetően
          </h2>
          <div className="mt-12 space-y-6">
            {[
              { step: 1, title: '15 perces konzultáció', desc: 'Telefonon vagy online tisztázzuk a feladatot és a kereteket.' },
              { step: 2, title: 'Helyszíni felmérés (ha releváns)', desc: 'Ha érdemes személyesen megnézni a lakást, időpontot egyeztetünk.' },
              { step: 3, title: 'Ajánlat és ütemezés', desc: 'Átlátható ajánlatot küldünk, amit közösen átbeszélünk.' },
              { step: 4, title: 'Kivitelezés – heti egyeztetéssel', desc: 'Folyamatos kapcsolattartás, naprakész információk a projektről.' },
              { step: 5, title: 'Átadás', desc: 'Közösen átnézzük az elvégzett munkákat, lezárjuk a projektet.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-2xl bg-card p-6 shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CTAButton location="process" />
          </div>
        </div>
      </section>

      {/* References */}
      <section id="references" className="border-t border-gray-200 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-text md:text-3xl">
            Munkák, amikért ki tudunk állni
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-card shadow-lg">
                <div className="aspect-[4/3] bg-bg">
                  <div className="flex h-full w-full items-center justify-center border border-dashed border-gray-300 text-muted">
                    <span className="text-sm">Referencia placeholder {i + 1}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-text">Rövid leírás a munkáról – helyettesítsd saját tartalommal.</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-muted">
            Kérsz több példát? A konzultáción mutatunk konkrét munkákat is.
          </p>
          <div className="mt-6 flex justify-center">
            <CTAButton location="references" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-text md:text-3xl">
            Gyakran ismételt kérdések
          </h2>
          <div className="mt-12 space-y-4">
            {[
              { q: 'Mennyibe kerül egy felújítás?', a: 'A költség a lakás méretétől, a munka típusától és a minőségigénytől függ. A konzultáción reális keretet adunk, amibe bele tudod kalkulálni magad.' },
              { q: 'Mennyi ideig tart?', a: 'A felújítás időtartama a lakás méretétől és a munka terjedelmétől függ. A konzultáción becslést adunk, hogy tudod tervezni.' },
              { q: 'Kell helyszíni felmérés?', a: 'Igen, ha komolyabb projekt – akkor személyesen megnézzük a helyszínt, mielőtt ajánlatot adnánk.' },
              { q: 'Dolgoztok szerződéssel?', a: 'Igen, projektfüggően minden fontos lépet szerződéssel rögzítünk.' },
              { q: 'Mikor tudtok kezdeni?', a: 'A kapacitás függvénye – a konzultáción tisztázzuk, mikorra tudnánk kezdeni.' },
              { q: 'Budapesten és Sopronban is vállaltok?', a: 'Igen, mindkét területen dolgozunk. A pontos lefedettséget konzultáción egyeztetjük.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl bg-card shadow-lg">
                <summary className="cursor-pointer list-none px-6 py-4 font-medium text-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="float-right transition group-open:rotate-180">▾</span>
                </summary>
                <div className="border-t border-gray-200 px-6 py-4">
                  <p className="text-muted text-sm">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA + Form */}
      <section id="form" className="border-t border-gray-200 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-text md:text-3xl">
            Kérd az ingyenes 15 perces konzultációt
          </h2>
          <p className="mt-4 text-center text-muted">
            Töltsd ki az űrlapot, és pár órán belül visszahívunk.
          </p>
          <div className="mt-10">
            <ConsultationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
