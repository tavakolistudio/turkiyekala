// اطلاعات تماس مرکزی سایت.
// مقادیر پیش‌فرض اینجا تعریف شده‌اند و در صورت وجود متغیر محیطی، با آن جایگزین می‌شوند.

const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "+905554005777";
const rawInstagram = process.env.NEXT_PUBLIC_INSTAGRAM || "turkiyekala";
const rawTelegram = process.env.NEXT_PUBLIC_TELEGRAM || "turkiyekalaa";

// فقط ارقام برای لینک wa.me
const whatsappDigits = rawWhatsapp.replace(/[^\d]/g, "");
const instagramHandle = rawInstagram.replace(/^@/, "");
const telegramHandle = rawTelegram.replace(/^@/, "");

export const CONTACT = {
  whatsappNumber: rawWhatsapp,
  whatsappLink: `https://wa.me/${whatsappDigits}`,
  instagramHandle,
  instagramLink: `https://instagram.com/${instagramHandle}`,
  telegramHandle,
  telegramLink: `https://t.me/${telegramHandle}`,
};

// لینک واتساپ همراه با پیام آماده برای ثبت سفارش
export function whatsappOrderLink(message?: string) {
  const base = CONTACT.whatsappLink;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const POWERED_BY = {
  label: "TAVAKOLISTUDIO",
  url: "https://tavakolistudio.vercel.app/en",
};
