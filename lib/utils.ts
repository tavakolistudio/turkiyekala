// ابزارهای عمومی

// ساخت slug از عنوان (پشتیبانی فارسی/انگلیسی)
export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "item-" + Date.now().toString(36);
}

// تبدیل رشته‌ی جداشده با کاما به آرایه
export function parseList(input: string | null | undefined): string[] {
  if (!input) return [];
  return input
    .split(/[,،\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// تبدیل ارقام فارسی/عربی به لاتین
export function toEnglishDigits(input: string): string {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return input.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d);
    if (i > -1) return String(i);
    return String(ar.indexOf(d));
  });
}

// تبدیل امن رشته به عدد (با ارقام فارسی)
export function toNumber(input: unknown): number | null {
  if (input == null || input === "") return null;
  const n = parseFloat(toEnglishDigits(String(input)).replace(/,/g, ""));
  return Number.isNaN(n) ? null : n;
}

export function formatDate(input: string | null | undefined): string {
  if (!input) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(input));
  } catch {
    return "—";
  }
}
