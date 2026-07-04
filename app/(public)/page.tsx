import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TrustBox from "@/components/TrustBox";
import PriceCalculator from "@/components/PriceCalculator";
import HomeFAQ from "@/components/HomeFAQ";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// تاریخ آخرین به‌روزرسانی برای سیگنال تازگی محتوا (زمان بیلد)
const LAST_MODIFIED = new Date().toISOString();

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: "fa-IR",
  dateModified: LAST_MODIFIED,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Hero />
      <HowItWorks />
      <TrustBox />
      <PriceCalculator />
      <HomeFAQ />
    </>
  );
}
