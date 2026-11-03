import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { AdminLayout } from "./components/AdminLayout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/product-detail/ProductDetail";
import { Occasions } from "./pages/Occasions";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { AllReviews } from "./pages/AllReviews";
import { FAQ } from "./pages/FAQ";
import { ShippingInfo } from "./pages/ShippingInfo";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { Profile } from "./pages/profile/Profile";
import { OrderDetail } from "./pages/OrderDetail";
import { OrderTracking } from "./pages/OrderTracking";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/checkout/Checkout";
import { CompleteProfile } from "./pages/complete-profile/CompleteProfile";
import { Wedding } from "./pages/Wedding";
import { Anniversary } from "./pages/Anniversary";
import { Housewarming } from "./pages/Housewarming";
import { Sympathy } from "./pages/Sympathy";
import { Birthday } from "./pages/Birthday";
import { NewBaby } from "./pages/NewBaby";
import { ValentinesDay } from "./pages/ValentinesDay";
import { MothersDay } from "./pages/MothersDay";
import { CorporateGifting } from "./pages/CorporateGifting";
import { AdminDashboard } from "./pages/admin/dashboard/AdminDashboard";
import { AdminProducts } from "./pages/admin/products/AdminProducts";
import { AdminOrders } from "./pages/admin/orders/AdminOrders";
import { AdminCustomers } from "./pages/admin/customers/AdminCustomers";
import { AdminSettings } from "./pages/admin/settings/AdminSettings";
import { AdminStaff } from "./pages/admin/staff/AdminStaff";
import { AdminSubscribers } from "./pages/admin/subscribers/AdminSubscribers";
import { DeliveryRoute } from "./components/DeliveryRoute";
import { DeliveryLogin } from "./pages/delivery/DeliveryLogin";
import { DeliveryDashboard } from "./pages/delivery/dashboard/DeliveryDashboard";
import { ActiveDeliveries } from "./pages/delivery/active/ActiveDeliveries";
import { DeliveryHistory } from "./pages/delivery/DeliveryHistory";
import { DeliveryProfile } from "./pages/delivery/profile/DeliveryProfile";
import { NotFound } from "./pages/NotFound";
import { ForgotPassword } from "./pages/ForgotPassword";
import { OtpVerification } from "./pages/OtpVerification";
import { ResetPassword } from "./pages/ResetPassword";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isDelivery = location.pathname.startsWith("/delivery");

  return (
    <div className="w-full bg-white">
      <ScrollToTop />
      {!isAdmin && !isDelivery && <Header />}
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminCustomers />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminStaff />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/subscribers"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminSubscribers />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route
          path="/delivery/dashboard"
          element={
            <DeliveryRoute>
              <DeliveryDashboard />
            </DeliveryRoute>
          }
        />
        <Route
          path="/delivery/active"
          element={
            <DeliveryRoute>
              <ActiveDeliveries />
            </DeliveryRoute>
          }
        />
        <Route
          path="/delivery/history"
          element={
            <DeliveryRoute>
              <DeliveryHistory />
            </DeliveryRoute>
          }
        />
        <Route
          path="/delivery/profile"
          element={
            <DeliveryRoute>
              <DeliveryProfile />
            </DeliveryRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<AllReviews />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions"
          element={
            <ProtectedRoute>
              <Occasions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/wedding"
          element={
            <ProtectedRoute>
              <Wedding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/anniversary"
          element={
            <ProtectedRoute>
              <Anniversary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/housewarming"
          element={
            <ProtectedRoute>
              <Housewarming />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/sympathy"
          element={
            <ProtectedRoute>
              <Sympathy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/birthday"
          element={
            <ProtectedRoute>
              <Birthday />
            </ProtectedRoute>
          }
        />
        <Route
          path="/occasions/new-baby"
          element={
            <ProtectedRoute>
              <NewBaby />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/valentines-day"
          element={
            <ProtectedRoute>
              <ValentinesDay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/mothers-day"
          element={
            <ProtectedRoute>
              <MothersDay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/corporate-gifting"
          element={
            <ProtectedRoute>
              <CorporateGifting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/track"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute requireProfileCompletion={true}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requireProfileCompletion={true}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && !isDelivery && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
