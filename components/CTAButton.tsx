'use client';

import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

type CTAButtonProps = {
  location: string;
  size?: 'default' | 'lg';
  label?: string;
};

export function CTAButton({ location, size = 'default', label }: CTAButtonProps) {
  const handleClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, { location });
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a
      href="#form"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent/90 active:bg-accent/80 ${
        size === 'lg'
          ? 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg'
          : 'px-6 py-3 text-base'
      }`}
    >
      {label ?? 'Ingyenes konzultáció – jelentkezem'}
    </a>
  );
}
