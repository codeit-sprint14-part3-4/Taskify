export default function SkeletonAttribute() {
  return (
    <div className="bg-white max-w-[62rem] p-[3.2rem]">
      <div className="text-2xl font-bold mb-6 w-40 h-8 bg-gray-200 rounded animate-pulse"></div>

      <div className="text-lg mb-2 w-32 h-6 bg-gray-200 rounded animate-pulse"></div>

      <div className="w-full h-12 rounded bg-gray-200 animate-pulse mb-8"></div>

      <div className="flex gap-3 mb-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>

      <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}
