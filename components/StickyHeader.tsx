'use client';

import Link from 'next/link';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function StickyHeader() {
  const handleCTAClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, { location: 'header' });
  };

  return (
    <header
      className="sticky top-0 z-40 w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to right, #08080E 0%, #14161b 100%)',
      }}
    >
      <div className="relative mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:h-20">
        <Link
          href="/"
          className="flex items-center justify-self-start"
        >
          <img
            src="/logo/precisolit-logo-3.png"
            alt="Precisolit Kft."
            className="h-12 w-auto max-w-[200px] object-contain md:h-14 md:max-w-[280px]"
          />
        </Link>
        <span className="text-center text-sm font-medium text-accent md:text-base">
          Ingyenes felmérés akár hétvégén is!
        </span>
        <Link
          href="/lakasfelujitas-budapest#form"
          onClick={handleCTAClick}
          className="hidden justify-self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 active:bg-accent/80 md:inline-flex"
        >
          Ingyenes konzultáció
        </Link>
      </div>
    </header>
  );
}
