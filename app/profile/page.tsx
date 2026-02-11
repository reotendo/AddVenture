"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

type UserProfile = {
  name?: string;
  bio?: string;
  skills?: string[];
};

type Project = {
  id: string;
  title: string;
  description: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return setLoading(false);

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setProfile(snap.data());

      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid)
      );
      const projectSnap = await getDocs(q);

      setProjects(
        projectSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Project, "id">),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
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
      <div className="max-w-md mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="relative bg-white rounded-2xl shadow p-6 text-center">
          <Link
            href="/profile/edit"
            className="absolute right-4 top-4 text-sm text-pink-500 font-semibold"
          >
            編集
          </Link>

          <div className="w-20 h-20 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-3xl font-bold text-white">
            {profile?.name?.[0] ?? "?"}
          </div>

          <h1 className="mt-3 text-xl font-bold">
            {profile?.name || "未設定"}
          </h1>

          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
            {profile?.bio || "自己紹介が未設定です"}
          </p>
        </div>

        {/* スキル */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold mb-2">スキル</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.length ? (
              profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">
                未設定
              </span>
            )}
          </div>
        </div>

        {/* 投稿 */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold mb-3">投稿したアイデア</h2>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm">
              まだ投稿はありません
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <h3 className="font-semibold">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* アクション */}
<div className="bg-white rounded-2xl shadow p-4">
  <h2 className="font-bold mb-3">
    あなたのアクション
  </h2>

  <div className="grid grid-cols-2 gap-3">
    <Link href="/profile/likes">
      <button
        className="
          w-full py-3 rounded-xl
          bg-pink-100 text-pink-600
          font-bold text-sm
          hover:bg-pink-200
          transition
        "
      >
        いいねした投稿
      </button>
    </Link>

    <Link href="/profile/interests">
      <button
        className="
          w-full py-3 rounded-xl
          bg-blue-100 text-blue-600
          font-bold text-sm
          hover:bg-blue-200
          transition
        "
      >
        興味ありの投稿
      </button>
    </Link>
  </div>
</div>


      </div>
    </div>
  );
}
