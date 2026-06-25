/**
 * Share & deep-link helpers for store apps.
 *
 * Two distinct URLs are at play for every app:
 *
 *  - The **share target** is our own OG-rich store detail page
 *    (`storeAppUrl`, `${siteUrl}/store/<id>`). This is what we hand to social
 *    intents, native share and "copy link" — it renders a per-app preview card
 *    and, on devices with the Universal Profiles app installed, auto-opens it
 *    via the universaleverything.io universal-link association.
 *
 *  - "Open in UP mobile app" instead uses the UP custom URI scheme on the app's
 *    LIVE dapp url (`upAppBrowserUrl`), so the mini-app opens directly inside
 *    the UP in-app browser. That scheme is a no-op on devices without the app,
 *    so it is never the primary share target.
 */
import type { App } from "@/data/appCatalog";
import { siteUrl } from "@/lib/site";

/** OG-rich store detail page for an app — the canonical share/social target. */
export function storeAppUrl(app: App): string {
  return `${siteUrl}/store/${encodeURIComponent(app.id ?? "")}`;
}

/**
 * UP mobile custom scheme that opens an https url inside the Universal Profiles
 * in-app browser. The https url must be percent-encoded exactly once. Only
 * resolves on a device with the UP app installed (no-op elsewhere).
 */
export function upAppBrowserUrl(httpsUrl: string): string {
  return `io.universaleverything.universalprofiles://browser?url=${encodeURIComponent(
    httpsUrl
  )}`;
}

/** Short, friendly blurb used as the message body for social/native shares. */
export function shareText(app: App): string {
  const name = app.app?.name ?? "this app";
  return `Check out ${name} on the LUKSO UP! Store`;
}

/** X / Twitter web intent pointed at the store detail page. */
export function tweetIntentUrl(app: App): string {
  const params = new URLSearchParams({
    text: shareText(app),
    url: storeAppUrl(app),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** Telegram share web intent pointed at the store detail page. */
export function telegramShareUrl(app: App): string {
  const params = new URLSearchParams({
    url: storeAppUrl(app),
    text: shareText(app),
  });
  return `https://t.me/share/url?${params.toString()}`;
}

/** WhatsApp share web intent (text + link in a single message). */
export function whatsappShareUrl(app: App): string {
  const params = new URLSearchParams({
    text: `${shareText(app)} ${storeAppUrl(app)}`,
  });
  return `https://wa.me/?${params.toString()}`;
}

/** Payload for the native Web Share sheet (mobile / supported browsers). */
export function webShareData(app: App): ShareData {
  return {
    title: app.app?.name ?? "LUKSO UP! Store",
    text: shareText(app),
    url: storeAppUrl(app),
  };
}

/** True when the current environment can present the native share sheet. */
export function canWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
