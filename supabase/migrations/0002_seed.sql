-- =====================================================================
-- TurkiyeKala — Seed data
-- =====================================================================

-- تنظیمات پیش‌فرض (تک‌سطری)
insert into settings (
  id, exchange_rate_try_to_toman, real_exchange_rate_try_to_toman,
  shipping_rate_per_kg_try, service_fee_percent, minimum_service_fee_toman,
  default_delivery_time, shipping_rules_text, return_rules_text, preorder_enabled
) values (
  1, 4000, 3700, 400, 5, 250000,
  '۷ تا ۱۴ روز کاری',
  'قیمت نهایی سفارش شامل خرید کالا از ترکیه، هزینه تبدیل و انتقال وجه، ارسال از ترکیه تا تهران و خدمات ثبت، خرید و پیگیری سفارش است. هزینه ارسال داخل ایران جداگانه بر عهده خریدار است.',
  'مرجوعی فقط طبق شرایط هر محصول و قبل از خرید قطعی از ترکیه امکان‌پذیر است. بعد از خرید کالا، لغو یا تعویض فقط در شرایط خاص و با هماهنگی انجام می‌شود.',
  true
)
on conflict (id) do nothing;

-- محصولات آماده نمونه
insert into products (title, slug, description, price_try, estimated_weight, category, images, colors, sizes, status, price_type, delivery_time)
values
(
  'تیشرت نخی مردانه LC Waikiki',
  'lcw-mens-cotton-tshirt',
  'تیشرت نخی با کیفیت، مناسب استفاده روزمره. تهیه‌شده از سایت LC Waikiki ترکیه.',
  299, 0.4, 'پوشاک',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"]'::jsonb,
  '["مشکی","سفید","سرمه‌ای"]'::jsonb,
  '["S","M","L","XL"]'::jsonb,
  'active', 'fixed', '۷ تا ۱۰ روز کاری'
),
(
  'کفش کتانی ورزشی',
  'sport-sneakers',
  'کفش کتانی سبک و راحت. قیمت نهایی بعد از بررسی وزن و شرایط ارسال اعلام می‌شود.',
  1200, 1.2, 'کفش',
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]'::jsonb,
  '["مشکی","سفید"]'::jsonb,
  '["40","41","42","43","44"]'::jsonb,
  'needs_inquiry', 'estimate', '۱۰ تا ۱۴ روز کاری'
),
(
  'کیف دستی زنانه',
  'womens-handbag',
  'کیف دستی شیک با جنس مرغوب.',
  850, 1.0, 'کیف',
  '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"]'::jsonb,
  '["قهوه‌ای","مشکی"]'::jsonb,
  '[]'::jsonb,
  'out_of_stock', 'estimate', '۱۰ تا ۱۴ روز کاری'
)
on conflict (slug) do nothing;

-- محصولات Shopping نمونه (پیشنهاد خرید از ترکیه)
insert into shopping_products (
  title, slug, source_url, source_domain, source_site_name, brand, description,
  main_image, images, original_price_try, discounted_price_try, discount_percent,
  estimated_weight, category, colors, sizes, availability_status, publish_status,
  tags, estimated_delivery_time
) values
(
  'هودی زنانه Trendyol',
  'trendyol-womens-hoodie',
  'https://www.trendyol.com/example-hoodie',
  'trendyol.com', 'Trendyol', 'Trendyol',
  'هودی گرم و راحت زنانه، مناسب فصل سرد.',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
  '["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"]'::jsonb,
  600, 420, 30,
  0.8, 'پوشاک',
  '["طوسی","صورتی","مشکی"]'::jsonb,
  '["S","M","L"]'::jsonb,
  'available', 'published',
  '["تخفیف‌دار","پیشنهاد ویژه"]'::jsonb, '۷ تا ۱۴ روز کاری'
),
(
  'شلوار جین مردانه Zara',
  'zara-mens-jeans',
  'https://www.zara.com/example-jeans',
  'zara.com', 'Zara', 'Zara',
  'شلوار جین مردانه با برش مدرن.',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
  '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"]'::jsonb,
  1100, null, null,
  0.8, 'پوشاک',
  '["آبی","مشکی"]'::jsonb,
  '["30","32","34","36"]'::jsonb,
  'needs_review', 'published',
  '["آماده سفارش"]'::jsonb, '۱۰ تا ۱۴ روز کاری'
),
(
  'ساعت مچی Hepsiburada',
  'hepsiburada-watch',
  'https://www.hepsiburada.com/example-watch',
  'hepsiburada.com', 'Hepsiburada', null,
  'ساعت مچی شیک مناسب هدیه.',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
  '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"]'::jsonb,
  900, 720, 20,
  0.5, 'اکسسوری',
  '[]'::jsonb, '[]'::jsonb,
  'available', 'published',
  '["تخفیف‌دار"]'::jsonb, '۷ تا ۱۴ روز کاری'
)
on conflict (slug) do nothing;
