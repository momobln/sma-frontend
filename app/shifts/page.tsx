"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/axiosClient";
import Link from "next/link";

interface Shift {
  id: number;
  guardName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  phone?: string;
  guardId: number;
  guard?: { id: number; name: string; email: string };
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  // نُخزن جميع الشفتات القادمة من السيرفر في مصفوفة.
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);  // نُخزن بيانات المستخدم الحالي (مأخوذة من التوكن).
  const [totalHours, setTotalHours] = useState<number>(0);

  //  Load user from JWT
  useEffect(() => { //هذا الكود يعمل مرة واحدة فقط عندما تفتح الصفحة.
    const token = localStorage.getItem("token"); // نبحث عن التوكن الذي حفظناه عند تسجيل الدخول.لو لم يوجد، نخرج فورًا (المستخدم غير مسجل دخول).
    if (!token) return;

   try { //vlt. n.func
  const payload = JSON.parse(atob(token.split(".")[1]));//الجزء الأوسط (payload) يحتوي على معلومات المستخدم بشكل مشفّر (Base64).
  setTimeout(() => setUser(payload), 0);//تفك التشفير من Base64 إلى نص عادي.atob
} catch {
  setTimeout(() => setUser(null), 0);
}

  }, []);

  // Fetch all shifts
  useEffect(() => {
    api.get("/shifts").then((res) => setShifts(res.data)); //بمجرد تحميل الصفحة، يتم إرسال طلب إلى /shifts لجلب كل الشفتات.
  }, []);

  // Fetch total worked hours for logged-in user
  useEffect(() => {
    async function fetchHours() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/shifts/my/total-hours", {
          headers: { Authorization: `Bearer ${token}` }, //Bearer  كلمة ثابتة تعني "أحمل التوكن التالي"
        });
        setTotalHours(res.data.totalHours);
      } catch {
        console.error("Failed to fetch total hours");
      }
    }

    fetchHours();
  }, []);

  //  Delete a shift
  async function handleDelete(id: number) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authorized");
    if (!confirm("Are you sure you want to delete this shift?")) return;

    try {
      await api.delete(`/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete shift");
    }
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Shifts</h1>

      {/*  Total Hours Box */}
      <div
        style={{
          backgroundColor: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="text-lg font-semibold">
          Your Total Hours:{" "}
          <span className="text-blue-600">{totalHours}</span> hrs
        </h3>
      </div>

      <Link
        href="/shifts/create"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Shift
      </Link>

      <table className="border-collapse border w-full max-w-4xl text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Guard</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.guardName}</td>
              <td className="border p-2">{s.date}</td>
              <td className="border p-2">{s.startTime}</td>
              <td className="border p-2">{s.endTime}</td>
              <td className="border p-2">{s.location}</td>
              <td className="border p-2">{s.phone || "-"}</td>
              <td className="border p-2 text-center">
                {user && user.id === s.guardId ? (
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/shifts/edit/${s.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs italic">
                    your frinds
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*.map() تعني: مرّ على كل عنصر داخل المصفوفة shifts وارجع لي صف (tr) جديد لكل شفت.
بمعنى آخر:
إذا عندك 3 شفتات في قاعدة البيانات → هذا الكود سينشئ 3 صفوف داخل الجدول.
نضع خاصية key={s.id} حتى يتميّز كل صف عن الآخر (مطلوب في React عند استخدام .map()).*/

/*user && user.id === s.guardId ? ( ... ) : ( ... )
إذا كان المستخدم الحالي (user) موجود
و رقم المستخدم user.id يساوي s.guardId (يعني هو صاحب هذا الشفت)
→ نعرض له الأزرار Edit و Delete.*/