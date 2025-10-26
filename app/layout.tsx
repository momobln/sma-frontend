"use client";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <html lang="en">
      <body>
        <nav className="p-4 bg-gray-100 flex justify-between">
          <h1 className="font-bold">SMA Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600">
            Logout
          </button>
        </nav>
        {children}
      </body>
    </html>
  );
}
