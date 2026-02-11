"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type DailyPost = {
  id: string;
  userId: string;
  content: string;
  createdAt: any;
  likeCount: number;
  liked?: boolean;
  likeId?: string;
};

export default function DailyFeedPage() {
  const [posts, setPosts] = useState<DailyPost[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "dailyPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubPosts = onSnapshot(q, async (snapshot) => {
      const postList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DailyPost[];

      const likesQuery = query(
        collection(db, "likes"),
        where("userId", "==", user.uid),
        where("type", "==", "daily")
      );

      const unsubLikes = onSnapshot(likesQuery, (likeSnap) => {
        const likeMap = new Map<
          string,
          { likeId: string }
        >();

        likeSnap.docs.forEach((doc) => {
          likeMap.set(doc.data().targetId, {
            likeId: doc.id,
          });
        });

        setPosts(
          postList.map((post) => ({
            ...post,
            liked: likeMap.has(post.id),
            likeId: likeMap.get(post.id)?.likeId,
          }))
        );
      });

      return () => unsubLikes();
    });

    return () => unsubPosts();
  }, [user]);

  const toggleLike = async (post: DailyPost) => {
    if (!user) return;

    if (post.liked && post.likeId) {
      await deleteDoc(doc(db, "likes", post.likeId));
      await updateDoc(doc(db, "dailyPosts", post.id), {
        likeCount: increment(-1),
      });
    } else {
      await addDoc(collection(db, "likes"), {
        userId: user.uid,
        targetId: post.id,
        type: "daily",
        createdAt: new Date(),
      });
      await updateDoc(doc(db, "dailyPosts", post.id), {
        likeCount: increment(1),
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-white">
        
      <header className="sticky top-0 z-10 h-12 flex items-center px-4 border-b bg-white">
        <h1 className="font-bold text-lg">日常</h1>
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

                <button
                  onClick={() => toggleLike(post)}
                  className="mt-2 flex items-center gap-1 text-sm"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      post.liked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span>{post.likeCount ?? 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
