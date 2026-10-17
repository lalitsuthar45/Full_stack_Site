// =========================================================
// GOOGLE ANALYTICS HELPER
// GA sirf tab load hoti hai jab user "Accept" kare (cookie
// consent). Isse consent-first approach follow hoti hai.
// =========================================================

export const GA_MEASUREMENT_ID = "G-7PJLJVXCFC";

export const CONSENT_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function loadGoogleAnalytics() {
  // Agar pehle se load ho chuki hai to dobara load na karein
  if (document.getElementById("ga-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

export function hasAnalyticsConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

// =========================================================
// SPA PAGE VIEW TRACKING
// Ye SPA hai (React Router), isliye normal GA sirf pehli
// load pe track karegi. Route change hone par isko call
// karke manually page view bhejni hoti hai.
// =========================================================

export function trackPageView(path: string) {
  if (hasAnalyticsConsent() && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
}