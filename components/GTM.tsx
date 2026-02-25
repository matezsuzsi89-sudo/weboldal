'use client';

import Script from 'next/script';

/**
 * Google Tag Manager (GTM) bekötés
 *
 * HASZNÁLAT:
 * 1. Hozz létre GTM fiókot (tagmanager.google.com)
 * 2. .env.local: NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 * 3. app/layout.tsx: import { GTM } from '@/components/GTM'; ... <GTM />
 *
 * A dataLayer események (cta_click, form_start, form_submit) automatikusan
 * továbbítódnak. GTM-ben: Custom Event trigger → cta_click / form_start / form_submit
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export function GTM() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="GTM"
        />
      </noscript>
    </>
  );
}
