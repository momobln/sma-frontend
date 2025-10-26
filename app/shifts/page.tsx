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
  const [totalHours, setTotalHours] = useState<number>(0);

  // ✅ Load user from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

   try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  setTimeout(() => setUser(payload), 0);
} catch {
  setTimeout(() => setUser(null), 0);
}

  }, []);

  // ✅ Fetch all shifts
  useEffect(() => {
    api.get("/shifts").then((res) => setShifts(res.data));
  }, []);

  // ✅ Fetch total worked hours for logged-in user
  useEffect(() => {
    async function fetchHours() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/shifts/my/total-hours", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalHours(res.data.totalHours);
      } catch {
        console.error("Failed to fetch total hours");
      }
    }

    fetchHours();
  }, []);

  // ✅ Delete a shift
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

      {/* ✅ Total Hours Box */}
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
