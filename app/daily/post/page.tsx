"use client";

import { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const MAX_LENGTH = 140;

export default function DailyPostPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  /* textarea 自動リサイズ */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (content.length > MAX_LENGTH) return;

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    await addDoc(collection(db, "dailyPosts"), {
      userId: user.uid,
      content,
      createdAt: serverTimestamp(),
      likeCount: 0,
    });

    setLoading(false);
    router.push("/daily/feed");
  };

  return (
    <div className="min-h-screen pb-20 bg-white">
      <header className="h-12 flex items-center justify-between px-4 border-b">
        <button
          onClick={() => router.back()}
          className="text-blue-500"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className={`px-4 py-1 rounded-full text-white text-sm
            ${
              content.trim()
                ? "bg-blue-500"
                : "bg-blue-300 cursor-not-allowed"
            }`}
        >
          投稿
        </button>
      </header>

      <main className="px-4 pt-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="いまどうしてる？"
          className="w-full resize-none outline-none text-lg"
          rows={1}
        />

        <div className="mt-2 text-right text-sm text-gray-400">
          {content.length}/{MAX_LENGTH}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
