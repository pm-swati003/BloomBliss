import { Clock, Truck } from "lucide-react";
import { useAdminOrdersLogic } from "./hooks/useAdminOrdersLogic";
import { OrderFilters } from "./components/OrderFilters";
import { OrdersTable } from "./components/OrdersTable";
import { OrderTrackingModal } from "./components/OrderTrackingModal";

export function AdminOrders() {
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    trackingOrder,
    setTrackingOrder,
    showOverrideForm,
    setShowOverrideForm,
    overrideForm,
    setOverrideForm,
    orders,
    isLoading,
    currentPage,
    lastPage,
    total,
    dueTodayCount,
    overdueCount,
    showDeliveryAlert,
    openTrackingModal,
    handleSaveOverrideTracking,
    handleStatusChange,
    getStatusColor,
    updateTracking,
  } = useAdminOrdersLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7] w-full max-w-full overflow-hidden">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-2 text-2xl lg:text-3xl font-bold">Order Management</h1>
          <p className="text-white/90 text-sm lg:text-base">Manage and track all customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {showDeliveryAlert && (
          <div className="mb-6 p-5 rounded-xl border-2 border-amber-400 bg-amber-50 shadow-lg flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900">
                  Delivery commitment – do not delay
                </h2>
                <p className="text-amber-800 text-sm">
                  {overdueCount > 0 && (
                    <span className="font-semibold text-red-700">
                      {overdueCount} overdue.{" "}
                    </span>
                  )}
                  {dueTodayCount > 0 && (
                    <span>{dueTodayCount} due today. </span>
                  )}
                  Orders must be delivered within the customer’s chosen time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-800 text-sm">
              <Truck className="w-5 h-5" />
              <span>Highlighted rows below need attention</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setPage={setPage}
          />

          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            setPage={setPage}
            handleStatusChange={handleStatusChange}
            getStatusColor={getStatusColor}
            openTrackingModal={openTrackingModal}
          />
        </div>
      </div>

      {trackingOrder && (
        <OrderTrackingModal
          trackingOrder={trackingOrder}
          setTrackingOrder={setTrackingOrder}
          showOverrideForm={showOverrideForm}
          setShowOverrideForm={setShowOverrideForm}
          overrideForm={overrideForm}
          setOverrideForm={setOverrideForm}
          handleSaveOverrideTracking={handleSaveOverrideTracking}
          isUpdating={updateTracking.isPending}
        />
      )}
    </div>
  );
}
