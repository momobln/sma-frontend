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
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  // ✅ جلب المستخدم من التوكن
  useEffect(() => {
  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }
  };

  loadUser();
}, []);


  // ✅ جلب كل الشفتات
  useEffect(() => {
    api.get("/shifts").then((res) => setShifts(res.data));
  }, []);

  // ✅ حذف شفت
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

      <Link
        href="/shifts/create"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Create Shift
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
                    Read-only
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
