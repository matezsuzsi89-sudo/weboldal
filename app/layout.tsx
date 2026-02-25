import type { Metadata } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';
// import { GTM } from '@/components/GTM'; // GTM: állítsd be NEXT_PUBLIC_GTM_ID és vedd ki a kommentet

export const metadata: Metadata = {
  title: 'Precisolit Kft. | Lakásfelújítás Budapest',
  description:
    'Átlátható folyamat, reális ütemezés, korrekt ajánlat. Ingyenes 15 perces konzultáció a lakásfelújításhoz. Budapest, Sopron.',
  openGraph: {
    title: 'Precisolit Kft. | Lakásfelújítás Budapest',
    description:
      'Átlátható folyamat, reális ütemezés, korrekt ajánlat. Ingyenes 15 perces konzultáció.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="min-h-screen antialiased">
        {/* GTM: importáld a GTM komponenst és add hozzá itt: <GTM /> */}
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
