import Link from 'next/link';
import { Construction } from 'lucide-react';

export const metadata = {
  title: 'Precisolit Kft. | Főoldal',
  description: 'Precisolit Kft. – építészeti és felújítási szolgáltatások.',
};

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 pb-24 md:pb-12">
      <div className="mx-auto max-w-xl text-center">
        <div
          className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(223, 109, 14, 0.15) 0%, rgba(223, 109, 14, 0.05) 100%)',
          }}
        >
          <Construction className="h-12 w-12 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Az oldal szerkesztés alatt
        </h1>
        <p className="mt-3 text-muted">
          Hamarosan friss tartalommal várunk.
        </p>
        <Link
          href="/lakasfelujitas-budapest"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Lakásfelújítás Budapest
          <span className="text-white/80">→</span>
        </Link>
      </div>
    </main>
  );
}
