export const SITE_NAME = "Pahad Se";
export const SITE_TAGLINE = "Pahadon ka asli swaad";
export const SITE_DESCRIPTION =
  "Pahad Se brings authentic, 100% natural Uttarakhand flavours - Garlic with Red Chilli and Hari Mirch with Jeera. No preservatives, just the real taste of the mountains.";
export const SITE_INSTAGRAM_HANDLE = "@pahadse.store";

function normalizeSiteUrl(value) {
  if (!value) return undefined;
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}
export function getConfiguredSiteUrl() {
  return normalizeSiteUrl(import.meta.env.VITE_SITE_URL);
}

export function getGoogleSiteVerificationToken() {
  return import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

export function getAbsoluteSiteUrl(path = "/", requestUrl) {
  const configuredSiteUrl = getConfiguredSiteUrl();
  if (configuredSiteUrl) {
    return new URL(path, `${configuredSiteUrl}/`).toString();
  }
  if (requestUrl) {
    return new URL(path, requestUrl).toString();
  }
  return path;
}
