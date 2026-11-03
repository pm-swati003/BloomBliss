import { CreditCard, Trash2, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function PaymentMethodsTab({
  paymentMethods,
  isPaymentMethodsLoading,
  handleDeletePaymentMethod,
  deletePaymentMethodPending,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <Link
          to="/complete-profile"
          className="px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg"
        >
          + Add New Card
        </Link>
      </div>
      {isPaymentMethodsLoading ? (
        <p>Loading payment methods...</p>
      ) : paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-[#E91E8C] mx-auto mb-4" />
          <p className="mb-4 text-[#6B7280]">No payment methods saved yet</p>
          <Link
            to="/complete-profile"
            className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            Add Payment Method
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {paymentMethods.map((m) => (
            <div
              key={m.id}
              className="border-2 border-[#E5E7EB] rounded-lg p-6 relative hover:border-[#E91E8C]"
            >
              {m.is_default && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#9333EA] text-white rounded-full text-sm">
                  Default
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-10 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#1F2937] font-bold mb-1">
                      {m.type} •••• {m.last4}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Expires {m.expiry} • {m.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeletePaymentMethod(m.id)}
                    disabled={deletePaymentMethodPending}
                    className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-[#FFF5F7] border-2 border-[#E91E8C]/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-[#E91E8C] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#1F2937] font-bold mb-2">Secure Payments</h3>
            <p className="text-[#6B7280] text-sm">
              All payment information is encrypted and stored securely. We never store your full card number or CVV code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
