"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください");
      return;
    }

    if (!title || !description) {
      alert("タイトルと説明を入力してください");
      return;
    }

    setLoading(true);

    await addDoc(collection(db, "projects"), {
      title,
      description,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4">
      <div className="w-full max-w-md mt-12 bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-xl font-bold mb-4">💡 アイデアを投稿</h1>

        <input
          className="w-full border rounded-xl p-3 mb-3"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-xl p-3 h-32 mb-4"
          placeholder="アイデアの説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
