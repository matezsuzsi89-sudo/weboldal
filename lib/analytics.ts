/**
 * Analytics események - GTM dataLayer kompatibilis
 * Ha GTM nincs betöltve, a window.dataLayer.push biztonságosan elnyeli a hívást
 * GTM bekötés: _app vagy layout.tsx-ben importáld a GTM scriptet
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
      });
    } else {
      window.dataLayer = [];
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
      });
    }
    // Fallback: console (dev környezetben)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, eventParams);
    }
  } catch {
    // Csendes fallback ha dataLayer nem elérhető
  }
}

export const ANALYTICS_EVENTS = {
  CTA_CLICK: 'cta_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
} as const;
