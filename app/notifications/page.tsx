"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const user = useAuth(); // ✅ 修正ここ
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications", user.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">通知</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">通知はありません</p>
      )}

      {notifications.map((n) => (
        <div key={n.id} className="border-b py-3 text-sm">
          {n.type === "like" && "あなたの投稿にいいねがつきました"}
        </div>
      ))}
    </div>
  );
}
