import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // رنگ اصلی: سرمه‌ای تیره
        brand: {
          DEFAULT: "#1e293b",
          50: "#f8fafc",
          100: "#f1f5f9",
          600: "#334155",
          700: "#1e293b",
          800: "#172033",
          900: "#0f172a",
        },
        // رنگ CTA: سبز ملایم قابل اعتماد
        accent: {
          DEFAULT: "#16a34a",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
