"use client";

import { useState } from "react";     // لتخزين بيانات النموذج (الاسم، البريد، كلمة السر).
import { api } from "../../lib/axiosClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  // تعريف state لتخزين القيم التي يكتبها المستخدم في الحقول الثلاثة:
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);  // إرسال طلب POST إلى السيرفر على المسار /auth/register مع بيانات المستخدم (الاسم، الإيميل، الباسوورد).
      router.push("/"); // بعد التسجيل ننتقل لصفحة تسجيل الدخول
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* تنسيق الصفحة لتكون في منتصف الشاشة عموديًا وأفقيًا */}
      <h1 className="text-2xl font-bold mb-4">Create New Account</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-3 w-64">
        <input
          className="border p-2"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="border p-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-green-600 text-white p-2">Register</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

/* ما الذي يحدث هنا خطوة بخطوة:

الصفحة الرئيسية (/) تُحمّل أولاً.

هذا الكود يعمل تلقائيًا ويبحث عن "token" في localStorage.

إذا وجد التوكن => يرسل المستخدم إلى /shifts.

إذا لم يجد التوكن => يرسله إلى /login.*/