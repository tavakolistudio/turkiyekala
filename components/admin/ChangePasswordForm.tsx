"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: "رمز عبور باید حداقل ۶ کاراکتر باشد." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "رمز عبور و تکرار آن یکسان نیستند." });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "تغییر رمز عبور ناموفق بود. دوباره تلاش کنید." });
      return;
    }

    setPassword("");
    setConfirm("");
    setMessage({ type: "ok", text: "رمز عبور با موفقیت تغییر کرد." });
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label">رمز عبور جدید</label>
        <input
          type="password"
          className="input"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <label className="label">تکرار رمز عبور جدید</label>
        <input
          type="password"
          className="input"
          dir="ltr"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {message && (
        <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button type="submit" className="btn-brand" disabled={loading}>
        {loading ? "در حال ذخیره…" : "تغییر رمز عبور"}
      </button>
    </form>
  );
}
