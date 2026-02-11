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

export default function InterestProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterestProjects = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      const q = query(
        collection(db, "likes"),
        where("userId", "==", user.uid),
        where("type", "==", "like")
      );

      const snap = await getDocs(q);
      const ids = snap.docs.map((d) => d.data().projectId);

      const results: Project[] = [];
      for (const id of ids) {
        const p = await getDoc(doc(db, "projects", id));
        if (p.exists()) {
          results.push({
            id: p.id,
            ...(p.data() as Omit<Project, "id">),
          });
        }
      }

      setProjects(results);
      setLoading(false);
    };

    fetchInterestProjects();
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
          興味ありの投稿
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">
            興味ありの投稿はまだありません
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
