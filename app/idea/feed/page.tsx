"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

type IdeaPost = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

export default function IdeaFeedPage() {
  const [posts, setPosts] = useState<IdeaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "ideaPosts"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<IdeaPost, "id">),
      }));

      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="p-4">読み込み中...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">💡 アイデア一覧</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">まだ投稿がありません</p>
      )}

      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <h2 className="font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
