export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#E5E7EB] animate-pulse">
      <div className="h-5 w-32 bg-[#E5E7EB] rounded mb-4" />
      <div className="h-4 bg-[#E5E7EB] rounded mb-2" />
      <div className="h-4 bg-[#E5E7EB] rounded mb-2" />
      <div className="h-4 bg-[#E5E7EB] rounded w-3/4 mb-4" />
      <div className="h-4 bg-[#E5E7EB] rounded w-1/3" />
    </div>
  );
}
