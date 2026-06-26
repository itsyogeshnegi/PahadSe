export const WHATSAPP_NUMBER = "919310309829";
export const DEFAULT_WHATSAPP_MESSAGE = "Hi Pahad Se! I'd like to order.";
export const INSTAGRAM_URL = "https://www.instagram.com/pahadse.store/";

export const RED_NAMAK_PRICE = 69;
export const GREEN_NAMAK_PRICE = 59;
export const DELIVERY_CHARGE_DELHI = 50;

export function getWhatsAppUrl(productName) {
  const message = productName
    ? `Hi Pahad Se! I'd like to order ${productName}.`
    : DEFAULT_WHATSAPP_MESSAGE;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartUrl(items, shippingRegion = "delhi_ncr") {
  let message = "Hi Pahad Se! I'd like to place an order:\n\n";
  let subtotal = 0;
  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    message += `- ${item.name} (${item.quantity} x Rs. ${item.price}) = Rs. ${itemTotal}\n`;
  });

  message += `\nSubtotal: Rs. ${subtotal}`;

  if (shippingRegion === "delhi_ncr") {
    const deliveryCharge = subtotal > 299 ? 0 : DELIVERY_CHARGE_DELHI;
    const total = subtotal + deliveryCharge;
    message += `\nDelivery Charges (Delhi NCR): ${deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}`;
    message += `\nTotal Amount: Rs. ${total}\n\n`;
  } else {
    message += `\nDelivery Charges (Other State): To be discussed/calculated on WhatsApp`;
    message += `\nTotal Amount: Rs. ${subtotal} + Shipping Charges\n\n`;
    message += "*Note: Delivery region is outside Delhi NCR. Need shipping quotes discussed.*\n\n";
  }

  message += "Please confirm my order.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCustomOrderUrl() {
  const message = "Hi Pahad Se! I'd like to talk about a custom order.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_URL = getWhatsAppUrl();
