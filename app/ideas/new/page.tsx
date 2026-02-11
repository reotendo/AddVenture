"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function NewIdeaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !description) return;

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "ideas"), {
      title,
      description,
      authorId: user.uid,
      authorName: user.displayName ?? "匿名",
      createdAt: serverTimestamp(),
    });

    router.push("/ideas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">アイデアを投稿</h1>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg p-2 h-32"
          placeholder="アイデアの説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold"
        >
          投稿する
        </button>
      </div>
    </div>
  );
}
