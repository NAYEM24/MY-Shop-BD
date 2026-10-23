/**
 * WhatsApp Helper Utilities for MY SHOP BD
 * Official Support Hotline: 01940320627 (+8801940320627)
 */

export const DEFAULT_WHATSAPP_NUMBER = '01940320627';

/**
 * Normalizes Bangladeshi phone number to international WhatsApp format (e.g. 8801940320627)
 */
export function formatToWhatsAppPhone(phone: string): string {
  if (!phone) return '8801940320627';

  // Strip non-digits
  let cleaned = phone.replace(/\D/g, '');

  // If starts with 880, keep it
  if (cleaned.startsWith('880')) {
    return cleaned;
  }

  // If starts with 0, replace leading 0 with 880
  if (cleaned.startsWith('0')) {
    return '880' + cleaned.slice(1);
  }

  // If standard 10-digit without leading 0 (e.g. 1940320627)
  if (cleaned.length === 10 && cleaned.startsWith('1')) {
    return '880' + cleaned;
  }

  return cleaned || '8801940320627';
}

/**
 * Generates direct wa.me chat link with optional pre-filled message
 */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const cleanPhone = formatToWhatsAppPhone(phoneNumber);
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (!message || !message.trim()) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Generates an order inquiry message for WhatsApp
 */
export function getOrderWhatsAppMessage(
  orderNumber: string,
  lang: 'en' | 'bn' = 'bn',
  carrier?: string,
  trackingNumber?: string
): string {
  if (lang === 'bn') {
    let msg = `আসসালামু আলাইকুম MY SHOP BD টিম, আমি আমার অর্ডার (${orderNumber}) এর ডেলিভারি ও শিপমেন্ট স্ট্যাটাস জানতে চাচ্ছি।`;
    if (carrier && trackingNumber) {
      msg += `\nকুরিয়ার: ${carrier} (ট্র্যাকিং: ${trackingNumber})`;
    }
    msg += `\nঅনুগ্রহ করে বর্তমান ডেলিভারি আপডেট জানিয়ে সহায়তা করবেন।`;
    return msg;
  }

  let msg = `Hello MY SHOP BD Support, I would like to inquire about my order #${orderNumber}.`;
  if (carrier && trackingNumber) {
    msg += `\nCarrier: ${carrier} (Tracking: ${trackingNumber})`;
  }
  msg += `\nPlease provide the latest shipment status update. Thank you!`;
  return msg;
}

/**
 * Generates a general live assistance message
 */
export function getGeneralWhatsAppMessage(lang: 'en' | 'bn' = 'bn', customerName?: string): string {
  if (lang === 'bn') {
    const greeting = customerName
      ? `আসসালামু আলাইকুম MY SHOP BD টিম, আমি ${customerName}।`
      : 'আসসালামু আলাইকুম MY SHOP BD টিম,';
    return `${greeting} আমার পণ্য, অর্ডার বা কেনাকাটা সম্পর্কিত তথ্যের জন্য সরাসরি সহায়তা প্রয়োজন।`;
  }
  const greeting = customerName
    ? `Hello MY SHOP BD Live Support, I am ${customerName}.`
    : 'Hello MY SHOP BD Live Support,';
  return `${greeting} I have an inquiry regarding products and purchasing. Please assist me.`;
}
