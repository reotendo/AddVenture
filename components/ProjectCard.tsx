import ProjectCard from "@/components/ProjectCard";

export default function Dashboard() {
  return (
    <div className="mx-auto mt-6 w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
  <img
    src="/sample.jpg"
    className="h-64 w-full object-cover"
  />

  <div className="p-5">
    <h2 className="text-xl font-bold">
      スタートアップ仲間募集
    </h2>
    <p className="mt-2 text-gray-600 text-sm">
      エンジニア / デザイナー歓迎
     </p>

    <div className="mt-5 flex justify-around">
      <button className="h-14 w-14 rounded-full bg-red-100 text-red-500 shadow">
        ✕
      </button>
      <button className="h-14 w-14 rounded-full bg-green-100 text-green-500 shadow">
        ♥
      </button>
    </div>
  </div>
</div>

  );
}
