import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function ETACountdown({ estimatedAt, className = "" }) {
  const [remaining, setRemaining] = useState(null);
  const [overdue, setOverdue] = useState(false);

  useEffect(() => {
    if (!estimatedAt) {
      setRemaining(null);
      return;
    }
    const target = new Date(estimatedAt).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setOverdue(true);
        setRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setOverdue(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [estimatedAt]);

  if (!estimatedAt || remaining === null) return null;

  if (overdue) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-3 text-amber-800 ${className}`}
      >
        <Clock size={20} />
        <span className="font-medium">Arriving soon / Check status</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-[#FFF5F7] border border-[#E91E8C]/30 px-4 py-3 ${className}`}
    >
      <Clock className="text-[#E91E8C]" size={24} />
      <div>
        <p className="text-xs text-[#6B7280] font-medium">Estimated arrival</p>
        <p className="text-lg font-bold text-[#E91E8C] tabular-nums">
          {String(remaining.hours).padStart(2, "0")}:
          {String(remaining.minutes).padStart(2, "0")}:
          {String(remaining.seconds).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
