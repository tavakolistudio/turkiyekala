// تنظیمات مرکزی سایت برای SEO و متادیتا

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://turkiyekala.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "TurkiyeKala";

export const SITE_TITLE = "TurkiyeKala — خرید از ترکیه، تحویل در ایران";

export const SITE_DESCRIPTION =
  "لینک محصول را بفرستید یا از پیشنهادهای تخفیف‌دار انتخاب کنید؛ ما خرید، ارسال تا تهران و پیگیری سفارش را انجام می‌دهیم.";

export const SITE_KEYWORDS = [
  "خرید از ترکیه",
  "خرید اینترنتی از ترکیه",
  "ارسال کالا از ترکیه به ایران",
  "واسط خرید ترکیه",
  "TurkiyeKala",
  "ترکیه کالا",
];
