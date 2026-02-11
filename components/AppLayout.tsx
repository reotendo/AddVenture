"use client";

import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-bold">
            AddVenture
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-black"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
