"use client";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type DailyPost = {
  id: string;
  content: string;
  userId: string;
  createdAt: any;
  likeCount: number;
};

export default function DailyLikesPage() {
  const user = useAuth();
  const [posts, setPosts] = useState<DailyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "dailyLikes"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const list: DailyPost[] = [];

      for (const like of snapshot.docs) {
        const { postId } = like.data();
        const postSnap = await getDoc(doc(db, "dailyPosts", postId));
        if (postSnap.exists()) {
          list.push({
            id: postSnap.id,
            ...postSnap.data(),
          } as DailyPost);
        }
      }

      setPosts(list);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">読み込み中...</p>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="h-12 flex items-center px-4 border-b">
        <h1 className="font-bold">いいねした投稿</h1>
      </header>

      <main>
        {posts.map((post) => (
          <div key={post.id} className="px-4 py-3 border-b">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0" />

              <div className="flex-1">
                <p className="whitespace-pre-wrap text-[15px]">
                  {post.content}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  ❤️ {post.likeCount ?? 0}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            まだいいねした投稿がありません
          </p>
        )}
      </main>
    </div>
  );
}
