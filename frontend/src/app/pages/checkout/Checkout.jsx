import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import { CheckoutStepper } from "./components/CheckoutStepper";
import { ShippingForm } from "./components/ShippingForm";
import { PaymentForm } from "./components/PaymentForm";
import { OrderReview } from "./components/OrderReview";
import { OrderSummary } from "./components/OrderSummary";

export function Checkout() {
  const {
    navigate,
    currentStep,
    setCurrentStep,
    cartItems,
    isCartLoading,
    addresses,
    isAddressesLoading,
    paymentMethods,
    isPaymentMethodsLoading,
    perksData,
    selectedAddressId,
    setSelectedAddressId,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    availableTimeSlots,
    isDeliveryDateToday,
    couponCode,
    setCouponCode,
    appliedCouponCode,
    appliedDiscount,
    appliedCouponMessage,
    isCreatingNewAddress,
    setIsCreatingNewAddress,
    isCreatingNewPayment,
    setIsCreatingNewPayment,
    newAddress,
    setNewAddress,
    newPayment,
    setNewPayment,
    subtotal,
    shipping,
    total,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleShippingSubmit,
    handlePaymentSubmit,
    handlePlaceOrder,
    validateCoupon,
    DELIVERY_SLOTS,
  } = useCheckoutLogic();

  if (isCartLoading || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280]">
            {isCartLoading ? "Loading..." : "Your cart is empty"}
          </p>
          {!isCartLoading && (
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-white/90">Complete your order in 3 easy steps</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                addresses={addresses}
                isAddressesLoading={isAddressesLoading}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                isCreatingNewAddress={isCreatingNewAddress}
                setIsCreatingNewAddress={setIsCreatingNewAddress}
                newAddress={newAddress}
                setNewAddress={setNewAddress}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                deliveryTime={deliveryTime}
                setDeliveryTime={setDeliveryTime}
                availableTimeSlots={availableTimeSlots}
                isDeliveryDateToday={isDeliveryDateToday}
                handleShippingSubmit={handleShippingSubmit}
                DELIVERY_SLOTS={DELIVERY_SLOTS}
              />
            )}

            {currentStep === 2 && (
              <PaymentForm
                paymentMethods={paymentMethods}
                isPaymentMethodsLoading={isPaymentMethodsLoading}
                selectedPaymentMethodId={selectedPaymentMethodId}
                setSelectedPaymentMethodId={setSelectedPaymentMethodId}
                isCreatingNewPayment={isCreatingNewPayment}
                setIsCreatingNewPayment={setIsCreatingNewPayment}
                newPayment={newPayment}
                setNewPayment={setNewPayment}
                handlePaymentSubmit={handlePaymentSubmit}
                setCurrentStep={setCurrentStep}
              />
            )}

            {currentStep === 3 && (
              <OrderReview
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                paymentMethods={paymentMethods}
                selectedPaymentMethodId={selectedPaymentMethodId}
                deliveryDate={deliveryDate}
                deliveryTime={deliveryTime}
                total={total}
                setCurrentStep={setCurrentStep}
                handlePlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              perksData={perksData}
              appliedCouponMessage={appliedCouponMessage}
              setCouponCode={setCouponCode}
              couponCode={couponCode}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              validateCoupon={validateCoupon}
              subtotal={subtotal}
              shipping={shipping}
              appliedDiscount={appliedDiscount}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
