import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/lib/api/hooks/useCart";
import { useAddresses, useCreateAddress } from "@/lib/api/hooks/useAddresses";
import {
  usePaymentMethods,
  useCreatePaymentMethod,
} from "@/lib/api/hooks/usePaymentMethods";
import { useCreateOrder } from "@/lib/api/hooks/useOrders";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { useMe } from "@/lib/api/hooks/useAuth";
import { useValidateCoupon, useMyPerks } from "@/lib/api/hooks/useNewsletter";
import { toast } from "sonner";

const DELIVERY_SLOTS = [
  { value: "morning", label: "Morning (8AM - 12PM)", cutoffHour: 12 },
  { value: "afternoon", label: "Afternoon (12PM - 5PM)", cutoffHour: 17 },
  { value: "evening", label: "Evening (5PM - 8PM)", cutoffHour: 20 },
];

export function getAvailableTimeSlotsForDate(deliveryDate) {
  if (!deliveryDate) return [];
  const today = new Date().toISOString().slice(0, 10);
  if (deliveryDate > today) return DELIVERY_SLOTS.map((s) => s.value);
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  return DELIVERY_SLOTS.filter((s) => currentHour < s.cutoffHour).map(
    (s) => s.value,
  );
}

export function useCheckoutLogic() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const couponFromCart = location.state?.couponCode;

  // Hooks
  const { data: cartItems = [], isLoading: isCartLoading } = useCart();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
  const { data: paymentMethods = [], isLoading: isPaymentMethodsLoading } = usePaymentMethods();
  const { data: profileData } = useProfile();
  const { data: me } = useMe();
  const { data: perksData } = useMyPerks();
  
  const createAddress = useCreateAddress();
  const createPaymentMethod = useCreatePaymentMethod();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const userEmail = me?.email ?? profileData?.user?.email;

  // Local State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponMessage, setAppliedCouponMessage] = useState(null);
  const [isCreatingNewAddress, setIsCreatingNewAddress] = useState(false);
  const [isCreatingNewPayment, setIsCreatingNewPayment] = useState(false);
  const appliedCartCouponRef = useRef(false);

  const [newAddress, setNewAddress] = useState({
    type: "Home",
    name: profileData?.user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: profileData?.user?.phone || "",
    is_default: false,
  });

  const [newPayment, setNewPayment] = useState({
    type: "Visa",
    cardNumber: "",
    cardName: profileData?.user?.name || "",
    expiryDate: "",
    cvv: "",
    is_default: false,
  });

  // Derived State
  const availableTimeSlots = getAvailableTimeSlotsForDate(deliveryDate);
  const isDeliveryDateToday = deliveryDate === new Date().toISOString().slice(0, 10);
  const subtotal = cartItems.reduce(
    (s, i) => s + (i.product?.discounted_price || i.product?.price || 0) * i.quantity,
    0,
  );
  const shipping = subtotal >= 1000 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - appliedDiscount);

  // Effects
  useEffect(() => {
    if (addresses.length && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddress?.id);
    }
    if (paymentMethods.length && !selectedPaymentMethodId) {
      const defaultPayment = paymentMethods.find((p) => p.is_default) || paymentMethods[0];
      setSelectedPaymentMethodId(defaultPayment?.id);
    }
  }, [addresses, paymentMethods]);

  useEffect(() => {
    if (!couponFromCart || appliedCartCouponRef.current || !cartItems.length) return;
    appliedCartCouponRef.current = true;
    setCouponCode(couponFromCart);
    validateCoupon.mutate(
      { code: couponFromCart, email: userEmail, subtotal },
      {
        onSuccess: (data) => {
          if (data.valid) {
            setAppliedCouponCode(data.code);
            setAppliedDiscount(Number(data.discount_amount) || 0);
            setAppliedCouponMessage(data.message);
          }
        },
      },
    );
  }, [couponFromCart, cartItems, userEmail, subtotal, validateCoupon]);

  // Handlers
  const handleApplyCoupon = () => {
    const code = couponCode.trim();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }
    validateCoupon.mutate(
      { code, email: userEmail, subtotal },
      {
        onSuccess: (data) => {
          if (data.valid) {
            setAppliedCouponCode(data.code);
            setAppliedDiscount(Number(data.discount_amount) || 0);
            setAppliedCouponMessage(data.message);
            toast.success(data.message || "Coupon applied");
          } else {
            setAppliedCouponCode(null);
            setAppliedDiscount(0);
            setAppliedCouponMessage(null);
            toast.error(data.message || "Invalid coupon");
          }
        },
        onError: (err) => {
          setAppliedCouponCode(null);
          setAppliedDiscount(0);
          setAppliedCouponMessage(null);
          toast.error(err.response?.data?.message || "Invalid coupon");
        },
      },
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCouponCode(null);
    setAppliedDiscount(0);
    setAppliedCouponMessage(null);
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    if (isCreatingNewAddress) {
      try {
        const addr = await createAddress.mutateAsync(newAddress);
        setSelectedAddressId(addr.id);
        setIsCreatingNewAddress(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save address");
        return;
      }
    }
    if (!selectedAddressId) {
      toast.error("Please select or create a shipping address");
      return;
    }
    if (!deliveryDate || !deliveryTime) {
      toast.error("Please select delivery date and time");
      return;
    }
    const allowed = getAvailableTimeSlotsForDate(deliveryDate);
    if (!allowed.includes(deliveryTime)) {
      toast.error("The selected time is no longer available. Please choose an available slot.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isCreatingNewPayment) {
      try {
        const last4 = newPayment.cardNumber.replace(/\s/g, "").slice(-4);
        const pm = await createPaymentMethod.mutateAsync({
          type: newPayment.type,
          last4,
          expiry: newPayment.expiryDate,
          name: newPayment.cardName,
          is_default: newPayment.is_default,
        });
        setSelectedPaymentMethodId(pm.id);
        setIsCreatingNewPayment(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save payment method");
        return;
      }
    }
    if (!selectedPaymentMethodId) {
      toast.error("Please select or add a payment method");
      return;
    }
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethodId || !deliveryDate || !deliveryTime) {
      toast.error("Please complete all required information");
      return;
    }
    try {
      await createOrder.mutateAsync({
        shipping_address_id: selectedAddressId,
        payment_method_id: selectedPaymentMethodId,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        ...(appliedCouponCode ? { coupon_code: appliedCouponCode } : {}),
      });
      toast.success("Order placed successfully! 🎉");
      setTimeout(() => navigate("/profile?tab=orders"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to place order",
      );
    }
  };

  return {
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
  };
}
