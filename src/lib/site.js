export const SITE_NAME = "Pahad Se";
export const SITE_TITLE = "PahadSe Taste of Salt | Garlic, Chilli, Hari Mirch & Jeera Salt";
export const SITE_TAGLINE = "Pahadon ka asli swaad";
export const SITE_DESCRIPTION =
  "Experience the authentic taste of the mountains with PahadSe. Discover premium Garlic Salt, Chilli Salt, Hari Mirch Salt, and Jeera Salt made to add natural flavor to every meal.";
export const SITE_KEYWORDS =
  "Pahad Se, mountain salt, garlic salt, chilli salt, hari mirch salt, jeera salt, Himalayan salt, flavored salt, natural spices, premium salt, Indian spices, seasoning salt, cooking salt,";
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
