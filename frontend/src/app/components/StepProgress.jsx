import { Check } from "lucide-react";

export function StepProgress({ steps, currentStepIndex, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-stretch">
        {steps.map((step, index) => {
          const isDone = step.done ?? index < currentStepIndex;
          const isActive = index === currentStepIndex && !isDone;
          const isPast = index < currentStepIndex;
          const fillLineBefore =
            isPast || (index === currentStepIndex && isDone);
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-1 flex-1 transition-colors ${
                      fillLineBefore ? "bg-[#E91E8C]" : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                    isDone
                      ? "border-[#E91E8C] bg-[#E91E8C] text-white"
                      : isActive
                        ? "border-[#E91E8C] bg-[#FFF5F7] text-[#E91E8C] ring-4 ring-[#E91E8C]/20"
                        : "border-[#E5E7EB] bg-white text-[#9CA3AF]"
                  }`}
                >
                  {isDone ? <Check size={20} strokeWidth={3} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 transition-colors ${
                      isPast ? "bg-[#E91E8C]" : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
              </div>
              <p
                className={`mt-2 text-center text-sm font-medium ${
                  isActive
                    ? "text-[#E91E8C]"
                    : isDone
                      ? "text-[#1F2937]"
                      : "text-[#9CA3AF]"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
