'use client';

import Link from 'next/link';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function MobileStickyCTA() {
  const handleCTAClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, { location: 'mobile_sticky' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden">
      <div
        className="flex justify-center border-t border-black/20 px-4 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]"
        style={{
          background: 'linear-gradient(to right, #08080E 0%, #14161b 100%)',
        }}
      >
        <Link
          href="/lakasfelujitas-budapest#form"
          onClick={handleCTAClick}
          className="whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90 active:bg-accent/80"
        >
          Ingyenes konzultációt kérek
        </Link>
      </div>
    </div>
  );
}
