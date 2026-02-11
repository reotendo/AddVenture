"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

type IdeaPost = {
  id: string;
  title: string;
  description: string;
};

export default function LikesPage() {
  const [posts, setPosts] = useState<IdeaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // ① 自分の「like」取得
      const likeQuery = query(
        collection(db, "likes"),
        where("userId", "==", user.uid),
        where("type", "==", "like")
      );

      const likeSnap = await getDocs(likeQuery);

      // ② projectId から投稿取得
      const results: IdeaPost[] = [];

      for (const like of likeSnap.docs) {
        const projectId = like.data().projectId;
        const ref = doc(db, "ideaPosts", projectId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          results.push({
            id: snap.id,
            ...(snap.data() as Omit<IdeaPost, "id">),
          });
        }
      }

      setPosts(results);
      setLoading(false);
    };

    fetchLikedPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        興味ありにした投稿はまだありません
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">興味ありの投稿</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h2 className="font-bold">{post.title}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {post.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
