import { User, MapPin, CreditCard, Check } from "lucide-react";
import { useCompleteProfileLogic } from "./hooks/useCompleteProfileLogic";
import { ProfileStep } from "./components/ProfileStep";
import { AddressStep } from "./components/AddressStep";
import { PaymentStep } from "./components/PaymentStep";

export function CompleteProfile() {
  const {
    currentStep,
    setCurrentStep,
    loading,
    profileInfo,
    setProfileInfo,
    addressInfo,
    setAddressInfo,
    paymentInfo,
    setPaymentInfo,
    handleProfileSubmit,
    handleAddressSubmit,
    handlePaymentSubmit,
    formatCardNumber,
    formatExpiry,
  } = useCompleteProfileLogic();

  const steps = [
    { number: 1, title: "Profile", icon: User },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-white/90">Let's set up your account for the best shopping experience</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center max-w-3xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="flex items-center flex-1">
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
                    className={`mt-2 text-sm font-medium ${
                      isCurrent
                        ? "text-[#E91E8C]"
                        : isCompleted
                        ? "text-[#10B981]"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#E5E7EB] mx-4 -mt-8">
                    <div
                      className={`h-full transition-all ${currentStep > step.number ? "bg-[#10B981]" : ""}`}
                      style={{ width: currentStep > step.number ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <ProfileStep
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
              handleProfileSubmit={handleProfileSubmit}
              loading={loading}
            />
          )}

          {currentStep === 2 && (
            <AddressStep
              addressInfo={addressInfo}
              setAddressInfo={setAddressInfo}
              handleAddressSubmit={handleAddressSubmit}
              setCurrentStep={setCurrentStep}
              loading={loading}
            />
          )}

          {currentStep === 3 && (
            <PaymentStep
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              handlePaymentSubmit={handlePaymentSubmit}
              setCurrentStep={setCurrentStep}
              loading={loading}
              formatCardNumber={formatCardNumber}
              formatExpiry={formatExpiry}
            />
          )}
        </div>
      </div>
    </div>
  );
}
