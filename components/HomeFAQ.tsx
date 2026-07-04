import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQ_ITEMS, faqJsonLd } from "@/lib/faq";

export default function HomeFAQ() {
  return (
    <section className="border-t border-slate-100 bg-white py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className="container-tk">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-2xl font-bold text-brand-700">
            سوالات پرتکرار
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            پاسخ رایج‌ترین پرسش‌ها درباره خرید از ترکیه و ارسال به ایران.
          </p>
          <FAQAccordion items={FAQ_ITEMS} />
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-sm font-medium text-brand-700 hover:underline">
              مشاهده همه سوالات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
