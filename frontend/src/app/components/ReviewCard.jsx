import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils/helpers";

export function ReviewCard({ rating, text, customer }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-[#E5E7EB]">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={
              i < rating ? "fill-[#E91E8C] text-[#E91E8C]" : "text-[#E5E7EB]"
            }
          />
        ))}
      </div>
      <p className="text-[#6B7280] mb-4 italic">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-[#E91E8C] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {getInitials(customer)}
        </span>
        <p className="text-[#1F2937] font-medium">{customer}</p>
      </div>
    </div>
  );
}
