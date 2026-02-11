"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  // 既存プロフィール取得
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setSkills((data.skills ?? []).join(", "));
      }
    };

    fetchProfile();
  }, []);

  // 保存処理
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        bio,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-xl font-bold text-center">
          プロフィール編集
        </h1>

        {/* 名前 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            名前
          </label>
          <input
            className="w-full border rounded-lg p-2"
            placeholder="例：天野 玲於捺"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            自己紹介
          </label>
          <textarea
            className="w-full border rounded-lg p-2 h-28"
            placeholder="あなたの活動や興味について書いてください"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* スキル */}
        <div>
          <label className="block text-sm font-medium mb-1">
            スキル
          </label>
          <input
            className="w-full border rounded-lg p-2"
            placeholder="例：React, Firebase, デザイン"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            カンマ（,）区切りで入力してください
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-pink-500 hover:bg-pink-600
                     text-white py-3 rounded-xl font-bold"
        >
          保存する
        </button>
      </div>
    </div>
  );
}
