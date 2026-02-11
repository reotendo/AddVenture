"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
};

export default function LikedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProjects = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      // ① 自分の like を取得
      const likeQuery = query(
        collection(db, "likes"),
        where("userId", "==", user.uid),
        where("type", "==", "like")
      );

      const likeSnap = await getDocs(likeQuery);

      // ② projectId 一覧
      const projectIds = likeSnap.docs.map(
        (d) => d.data().projectId
      );

      if (projectIds.length === 0) {
        setLoading(false);
        return;
      }

      // ③ projects を取得
      const results: Project[] = [];
      for (const id of projectIds) {
        const snap = await getDoc(doc(db, "projects", id));
        if (snap.exists()) {
          results.push({
            id: snap.id,
            ...(snap.data() as Omit<Project, "id">),
          });
        }
      }

      setProjects(results);
      setLoading(false);
    };

    fetchLikedProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-4">

        <h1 className="text-xl font-bold text-center">
          いいねした投稿
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">
            まだいいねした投稿はありません
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow p-4"
            >
              <h2 className="font-bold">{p.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {p.description}
              </p>
            </div>
          ))
        )}

        <Link
          href="/profile"
          className="block text-center text-sm text-gray-500"
        >
          ← プロフィールへ戻る
        </Link>

      </div>
    </div>
  );
}
