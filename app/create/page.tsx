"use client";

import { useRouter } from "next/navigation";
import { Lightbulb, Coffee } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function CreateSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20 bg-white">
      <header className="h-12 flex items-center px-4 border-b">
        <h1 className="font-bold text-lg">投稿を作成</h1>
      </header>

      <main className="px-6 pt-10 space-y-6">
        {/* 日常投稿 */}
        <button
          onClick={() => router.push("/daily/post")}
          className="w-full flex items-center gap-4 p-4
            rounded-2xl border hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Coffee className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold">日常を投稿</p>
            <p className="text-sm text-gray-500">
              いまの気分や出来事をシェア
            </p>
          </div>
        </button>

        {/* アイデア投稿 */}
        <button
          onClick={() => router.push("/idea/post")}
          className="w-full flex items-center gap-4 p-4
            rounded-2xl border hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Lightbulb className="text-yellow-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold">アイデアを投稿</p>
            <p className="text-sm text-gray-500">
              新規事業・企画・構想を共有
            </p>
          </div>
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
