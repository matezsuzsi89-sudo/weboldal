import {
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
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
        <div className="relative mx-auto mt-10 flex max-w-5xl justify-center px-4 pb-4">
          <CTAButton location="process" />
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
              { q: 'Mi történik, ha menet közben plusz munka merül fel?', a: 'Minden változtatást előre átbeszélünk. Csak az kerül elvégzésre, amiben közösen megállapodtunk.' },
              { q: 'Mennyi ideig tart egy felújítás?', a: 'A pontos időtartam a munka jellegétől függ, de a felmérés után reális ütemezést adunk, amit végig követni lehet.' },
              { q: 'Ott kell lennem a munkálatok alatt?', a: 'Nem szükséges. Napi státuszjelentéssel tájékoztatunk, így akkor is pontosan látod a haladást, ha nem vagy jelen.' },
              { q: 'Mikor tud indulni a munka?', a: 'Kapacitástól függően egyeztetjük, de a felmérés után konkrét kezdési időpontot rögzítünk.' },
              { q: 'Hogyan tudok jelentkezni?', a: 'Az oldalon található űrlap kitöltésével. Rövid egyeztetés után időpontot adunk a felmérésre.' },
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

      {/* Rólunk */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/weboldal-kepek/precisolit-banner-3.png')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(223,109,14,0.45) 0%, rgba(196,93,12,0.5) 50%, rgba(168,77,9,0.55) 100%)',
          }}
          aria-hidden
        />
        {/* Dekoratív elemek */}
        <div className="absolute inset-0 opacity-15" aria-hidden>
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white"
            style={{ filter: 'blur(80px)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200"
            style={{ filter: 'blur(70px)' }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 45%)`,
          }}
          aria-hidden
        />
        {/* Szegélyek */}
        <div
          className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/20 bg-white/5 px-8 py-12 shadow-2xl backdrop-blur-sm md:px-14 md:py-16">
            <div className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-12 md:text-left">
              <div className="mb-8 shrink-0 md:mb-0 md:w-48">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Rólunk
                </h2>
                <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-white/70 md:mx-0" aria-hidden />
                <div
                  className="mt-6 hidden text-7xl font-extralight leading-none text-white/30 md:block"
                  aria-hidden
                >
                  „
                </div>
              </div>
              <div className="flex-1 space-y-5 text-lg leading-relaxed text-white/95 md:text-xl">
                <p>
                  A Precisolit azért jött létre, hogy a felújítás ne bizonytalanságot, hanem kiszámítható folyamatot jelentsen.
                </p>
                <p>
                  Számunkra a kivitelezés nem csak munka, hanem felelősség. Egy otthon átalakítása bizalmi döntés – ezért dolgozunk átlátható rendszerben, előre egyeztetett lépésekkel és folyamatos kommunikációval.
                </p>
                <p>
                  Hiszünk abban, hogy a rendezett működés és az őszinte egyeztetés többet ér, mint a hangzatos ígéretek.
                </p>
                <p className="border-l-4 border-white/60 py-2 pl-5 text-xl font-semibold text-white md:text-2xl">
                  Ha velünk dolgozol, pontosan tudni fogod, mi történik – és miért.
                </p>
              </div>
            </div>
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
