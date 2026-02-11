import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">AddVenture</h1>
        <p className="text-gray-400">未知を開拓する初めの一歩を</p>

        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold transition"
        >
          はじめる
        </Link>
      </div>
    </main>
  );
}
