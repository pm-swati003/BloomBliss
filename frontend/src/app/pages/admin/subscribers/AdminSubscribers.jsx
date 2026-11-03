import { Mail, Tag, Gift } from "lucide-react";
import { useAdminSubscribersLogic } from "./hooks/useAdminSubscribersLogic";
import { SubscribersTab } from "./components/SubscribersTab";
import { CouponsTab } from "./components/CouponsTab";
import { BenefitsTab } from "./components/BenefitsTab";
import { CouponModal } from "./components/CouponModal";

export function AdminSubscribers() {
  const {
    activeTab,
    setActiveTab,
    subscriberSearch,
    setSubscriberSearch,
    subscriberPage,
    setSubscriberPage,
    subscribers,
    subscribersData,
    loadingSubscribers,
    coupons,
    loadingCoupons,
    couponModalOpen,
    setCouponModalOpen,
    editingCoupon,
    couponForm,
    setCouponForm,
    openNewCoupon,
    openEditCoupon,
    handleSaveCoupon,
    handleDeleteCoupon,
    createCoupon,
    updateCoupon,
    benefits,
    loadingBenefits,
    benefitsDraft,
    benefitsEditing,
    startEditBenefits,
    cancelEditBenefits,
    addBenefitRow,
    updateBenefitRow,
    removeBenefitRow,
    saveBenefits,
    updateBenefits,
  } = useAdminSubscribersLogic();

  const tabs = [
    { id: "subscribers", label: "Subscribers", icon: Mail },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "benefits", label: "Subscriber benefits", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white mb-2 text-3xl font-bold">Newsletter & Promos</h1>
          <p className="text-white/90">
            Manage subscribers, coupons and special features for subscribed users.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6 border-b border-[#E5E7EB]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === id
                  ? "bg-white text-[#E91E8C] border border-[#E5E7EB] border-b-white -mb-px"
                  : "text-[#6B7280] hover:text-[#E91E8C]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "subscribers" && (
            <SubscribersTab
              subscriberSearch={subscriberSearch}
              setSubscriberSearch={setSubscriberSearch}
              subscriberPage={subscriberPage}
              setSubscriberPage={setSubscriberPage}
              subscribers={subscribers}
              subscribersData={subscribersData}
              loadingSubscribers={loadingSubscribers}
            />
          )}

          {activeTab === "coupons" && (
            <CouponsTab
              coupons={coupons}
              loadingCoupons={loadingCoupons}
              openNewCoupon={openNewCoupon}
              openEditCoupon={openEditCoupon}
              handleDeleteCoupon={handleDeleteCoupon}
            />
          )}

          {activeTab === "benefits" && (
            <BenefitsTab
              benefits={benefits}
              loadingBenefits={loadingBenefits}
              benefitsDraft={benefitsDraft}
              benefitsEditing={benefitsEditing}
              startEditBenefits={startEditBenefits}
              cancelEditBenefits={cancelEditBenefits}
              addBenefitRow={addBenefitRow}
              updateBenefitRow={updateBenefitRow}
              removeBenefitRow={removeBenefitRow}
              saveBenefits={saveBenefits}
              updateBenefits={updateBenefits}
            />
          )}
        </div>
      </div>

      {couponModalOpen && (
        <CouponModal
          editingCoupon={editingCoupon}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          setCouponModalOpen={setCouponModalOpen}
          handleSaveCoupon={handleSaveCoupon}
          isPending={editingCoupon ? updateCoupon.isPending : createCoupon.isPending}
        />
      )}
    </div>
  );
}
