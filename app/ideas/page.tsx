"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Idea = {
  id: string;
  title: string;
  description: string;
  authorName: string;
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      const q = query(
        collection(db, "ideas"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setIdeas(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Idea, "id">),
        }))
      );
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="bg-white rounded-2xl shadow p-4"
        >
          <h2 className="font-bold text-lg">{idea.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {idea.description}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            by {idea.authorName}
          </p>
        </div>
      ))}
    </div>
  );
}
