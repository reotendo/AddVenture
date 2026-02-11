"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* =====================
   型定義
===================== */
type Project = {
  id: string;
  title: string;
  description: string;
};

/* =====================
   メインコンポーネント
===================== */
export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState(0);
  const [decision, setDecision] = useState<"like" | "skip" | null>(null);

  /* 上下スワイプ用 */
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 0, 200], [-10, 0, 10]);

  /* =====================
     処理済み projectId 取得
  ===================== */
  const fetchProcessedProjectIds = async (): Promise<string[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "likes"),
      where("userId", "==", user.uid)
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data().projectId);
  };

  /* =====================
     プロジェクト取得
  ===================== */
  useEffect(() => {
    const fetchProjects = async () => {
      const processedIds = await fetchProcessedProjectIds();
      const snap = await getDocs(collection(db, "projects"));

      const data = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        }))
        .filter((project) => !processedIds.includes(project.id));

      setProjects(data);
    };

    fetchProjects();
  }, []);

  /* =====================
     Like / Skip 保存
  ===================== */
  const saveDecision = async (
    projectId: string,
    type: "like" | "skip"
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "likes"), {
      userId: user.uid,
      projectId,
      type,
      createdAt: serverTimestamp(),
    });
  };

  const project = projects[index];

  /* =====================
     全部見終わった時
  ===================== */
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold">今日はここまで 🎉</h2>
        <p className="mt-4 text-gray-500">
          新しい投稿が追加されると表示されます
        </p>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <motion.div
        drag="y"
        style={{ y, rotate }}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.6}
        onDragEnd={async (e, info) => {
          // 上スワイプ → 興味あり
          if (info.offset.y < -150) {
            setDecision("like");
            await saveDecision(project.id, "like");

          // 下スワイプ → 興味なし
          } else if (info.offset.y > 150) {
            setDecision("skip");
            await saveDecision(project.id, "skip");

          } else {
            setDecision(null);
            y.set(0);
            return;
          }

          setTimeout(() => {
            setDecision(null);
            setIndex((prev) => prev + 1);
            y.set(0);
          }, 600);
        }}
        className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {/* 上：興味あり */}
        {decision === "like" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2
            text-green-500 text-2xl font-bold
            border-2 border-green-500
            px-4 py-2 rounded-lg">
            興味あり
          </div>
        )}

        {/* 下：興味なし */}
        {decision === "skip" && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2
            text-red-500 text-2xl font-bold
            border-2 border-red-500
            px-4 py-2 rounded-lg">
            興味なし
          </div>
        )}

        <div className="h-64 bg-gray-200 flex items-center justify-center">
          Image
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {project.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}