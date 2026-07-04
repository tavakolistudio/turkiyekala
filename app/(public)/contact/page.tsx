import { CONTACT } from "@/lib/contact";

export const metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباط با TurkiyeKala از طریق واتساپ، اینستاگرام و تلگرام برای ثبت سفارش، مشاوره و پشتیبانی خرید از ترکیه.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-tk py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-brand-700">تماس با ما</h1>
        <p className="mb-6 text-sm leading-7 text-slate-500">
          برای ثبت، پیگیری یا هماهنگی سفارش‌ها می‌توانید از راه‌های زیر با پشتیبانی
          در ارتباط باشید. پاسخ‌گویی در ساعات کاری انجام می‌شود.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <ContactCard
            title="واتساپ (سفارش)"
            value={CONTACT.whatsappNumber}
            href={CONTACT.whatsappLink}
          />
          <ContactCard
            title="اینستاگرام"
            value={"@" + CONTACT.instagramHandle}
            href={CONTACT.instagramLink}
          />
          <ContactCard
            title="تلگرام"
            value={"@" + CONTACT.telegramHandle}
            href={CONTACT.telegramLink}
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-slate-800">فرم تماس</h2>
          <form
            action="mailto:support@turkiyekala.example"
            method="post"
            encType="text/plain"
            className="card space-y-4 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">نام</label>
                <input name="name" className="input" required />
              </div>
              <div>
                <label className="label">شماره تماس</label>
                <input name="phone" className="input" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="label">پیام</label>
              <textarea name="message" className="input" rows={4} required />
            </div>
            <button type="submit" className="btn-primary">ارسال پیام</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="card p-5 text-center transition-colors hover:border-accent-600/40">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 font-bold text-brand-700" dir="ltr">{value}</p>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    content
  );
}
