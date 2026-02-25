'use client';

import { usePathname } from 'next/navigation';
import { StickyHeader } from './StickyHeader';
import { Footer } from './Footer';
import { MobileStickyCTA } from './MobileStickyCTA';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <StickyHeader />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileStickyCTA />}
    </>
  );
}
