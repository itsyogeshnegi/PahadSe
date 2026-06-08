export const WHATSAPP_NUMBER = "919310309829";
export const DEFAULT_WHATSAPP_MESSAGE = "Hi Pahad Se! I'd like to order.";
export const INSTAGRAM_URL = "https://www.instagram.com/pahadse.store/";

export function getWhatsAppUrl(productName) {
  const message = productName
    ? `Hi Pahad Se! I'd like to order ${productName}.`
    : DEFAULT_WHATSAPP_MESSAGE;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_URL = getWhatsAppUrl();
