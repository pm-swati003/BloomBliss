import { Check, Package, CreditCard, ShieldCheck } from "lucide-react";

export function CheckoutStepper({ currentStep }) {
  return (
    <div className="flex items-center justify-center max-w-3xl mx-auto mb-12">
      {[1, 2, 3].map((step) => {
        const Icon = step === 1 ? Package : step === 2 ? CreditCard : ShieldCheck;
        const isCompleted = currentStep > step;
        const isCurrent = currentStep === step;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-[#10B981] text-white"
                    : isCurrent
                      ? "bg-[#E91E8C] text-white"
                      : "bg-white border-2 border-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <p
                className={`mt-2 text-sm ${
                  isCurrent
                    ? "text-[#E91E8C]"
                    : isCompleted
                      ? "text-[#10B981]"
                      : "text-[#6B7280]"
                }`}
              >
                {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
              </p>
            </div>
            {step < 3 && (
              <div className="flex-1 h-0.5 bg-[#E5E7EB] mx-4 -mt-8">
                <div
                  className={`h-full transition-all ${currentStep > step ? "bg-[#10B981]" : ""}`}
                  style={{ width: currentStep > step ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
