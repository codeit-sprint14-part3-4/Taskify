export default function SkeletonMember() {
  return (
    <div className="bg-white max-w-[62rem] p-[2.6rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold bg-gray-200 w-32 h-8 rounded animate-pulse"></div>
      </div>

      <div className="text-lg text-gray-400 mb-4 bg-gray-200 w-20 h-6 rounded animate-pulse"></div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b border-gray-200 py-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}
