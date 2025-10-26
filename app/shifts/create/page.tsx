"use client";

import { useState } from "react";
import { api } from "../../../lib/axiosClient";
import { useRouter } from "next/navigation";

export default function CreateShiftPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    guardName: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    phone: "",
  });
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/shifts", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/shifts");
    } catch (err) {
      console.error(err);
      setError("Failed to create shift");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Shift</h1>
      <form onSubmit={handleCreate} className="flex flex-col gap-3 w-72">
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
          placeholder="Start Time (06:00)"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="End Time (18:00)"
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
        <button className="bg-green-600 text-white p-2">Create Shift</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
