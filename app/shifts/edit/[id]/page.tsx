"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../lib/axiosClient";

export default function EditShiftPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [form, setForm] = useState({
    guardName: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    phone: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShift() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/shifts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch {
        setError("Failed to load shift");
      }
    }
    loadShift();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/shifts/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/shifts");
    } catch {
      setError("Failed to update shift");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Shift</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          className="border p-2"
          placeholder="Guard Name"
          value={form.guardName}
          onChange={(e) => setForm({ ...form, guardName: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Start Time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="End Time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button className="bg-green-600 text-white p-2">Update Shift</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
