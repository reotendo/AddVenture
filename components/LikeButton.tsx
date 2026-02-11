"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  postId: string;
  postUserId: string;
};

export default function LikeButton({ postId, postUserId }: Props) {
  const user = useAuth(); // ✅ 修正ここ

  const handleLike = async () => {
    if (!user) return;
    if (user.uid === postUserId) return;

    await addDoc(
      collection(db, "notifications", postUserId, "items"),
      {
        type: "like",
        fromUserId: user.uid,
        postId,
        isRead: false,
        createdAt: serverTimestamp(),
      }
    );
  };

  return (
    <button
      onClick={handleLike}
      className="text-sm text-blue-600"
    >
      いいね
    </button>
  );
}
