import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getVisibleProducts, getPublishedShoppingProducts } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shopping`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/order-link`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/track`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/rules`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const [products, shopping] = await Promise.all([
      getVisibleProducts(),
      getPublishedShoppingProducts(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const shoppingRoutes: MetadataRoute.Sitemap = shopping.map((p) => ({
      url: `${SITE_URL}/shopping/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...shoppingRoutes];
  } catch {
    // اگر دیتابیس در دسترس نبود، حداقل مسیرهای ثابت ارائه شوند
    return staticRoutes;
  }
}
