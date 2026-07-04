import FAQAccordion from "@/components/FAQAccordion";
import { FAQ_ITEMS, faqJsonLd } from "@/lib/faq";

export const metadata = {
  title: "سوالات پرتکرار",
  description:
    "پاسخ پرسش‌های رایج درباره خرید از ترکیه، نحوه محاسبه قیمت، هزینه ارسال، زمان تحویل و شرایط بازگشت وجه در TurkiyeKala.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <div className="container-tk py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-brand-700">سوالات پرتکرار</h1>
        <FAQAccordion items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
