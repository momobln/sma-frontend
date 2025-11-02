"use client";
import { useState } from "react";// نستورد لتخزين البيانات (مثل البريد الإلكتروني وكلمة السر).

import { api } from "../../lib/axiosClient"; // I Axios => API (backend+frontend)
import { useRouter } from "next/navigation"; 

export default function LoginPage() {   // Credirect after successful login.

  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" }); 
  // نُنشئ حالة (state) لحفظ بيانات المستخدم المدخلة في النموذج.
  // setForm تُستخدم لتحديث القيم أثناء الكتابة.

  const [error, setError] = useState("");
  // حالة ثانية لتخزين رسالة الخطأ في حال فشل تسجيل الدخول.

  async function handleLogin(e: React.FormEvent) { //هذا نوع خاص من React يُستخدم لتعريف نوع الحدث event في النماذج
        // Runs when the form is submitted.
    e.preventDefault();
    try { //try ← نضع فيه العملية الحساسة (الاتصال بالسيرفر).
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      router.push("/shifts");
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-72">
        <input
          className="border p-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white p-2">Login</button>
      </form>
      {/* Show error if exists */}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

/*try { ... } catch { ... }
هي طريقة في JavaScript لمعالجة الأخطاء (Error Handling).
أي كود يمكن أن يفشل (مثل اتصال بـ API أو قراءة ملف)، نضعه داخل try،
وإذا حدث خطأ أثناء التنفيذ، الكود داخل catch هو الذي يُنفّذ  */
//لذلك نستخدم الانتشار (spread operator ...) للاحتفاظ بالباقي.
