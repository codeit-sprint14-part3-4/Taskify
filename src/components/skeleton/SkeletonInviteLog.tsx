export default function SkeletonInviteLog() {
  return (
    <div className="bg-white max-w-[62rem] p-[2.6rem_2.8rem] animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-[2.4rem] w-[10rem] bg-gray-200 rounded" />
        <div className="flex items-center gap-[1.6rem]">
          <div className="h-[2.4rem] w-[10rem] bg-gray-200 rounded" />
          <div className="h-[3.2rem] w-[9rem] bg-gray-200 rounded" />
        </div>
      </div>

      <div className="h-[2rem] w-[4rem] bg-gray-200 rounded mb-4" />

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b border-gray-200 py-[1.6rem]"
        >
          <div className="h-[2.4rem] w-[20rem] bg-gray-200 rounded" />
          <div className="h-[3.2rem] w-[9rem] bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}
