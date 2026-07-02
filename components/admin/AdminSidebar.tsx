"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/products", label: "محصولات آماده" },
  { href: "/admin/shopping-products", label: "محصولات Shopping" },
  { href: "/admin/import-product", label: "افزودن از لینک" },
  { href: "/admin/settings", label: "تنظیمات و نرخ‌ها" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* موبایل: نوار بالا */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-brand-900 p-4 text-white md:hidden">
        <span className="font-bold">پنل TurkiyeKala</span>
        <button onClick={() => setOpen((v) => !v)} aria-label="منو">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} bg-brand-900 text-slate-200 md:block md:w-60 md:shrink-0`}
      >
        <div className="hidden border-b border-slate-800 p-5 md:block">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700">TK</span>
            پنل مدیریت
          </Link>
        </div>
        <nav className="flex flex-col p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  active ? "bg-brand-700 text-white" : "text-slate-300 hover:bg-brand-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <p className="mb-2 truncate text-xs text-slate-400" dir="ltr">{email}</p>
          <button
            onClick={logout}
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}
