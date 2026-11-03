import { Clock, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export function DeliveriesDue({ deliveriesDueToday, dueLoading }) {
  if (dueLoading || deliveriesDueToday.length === 0) return null;

  return (
    <div className="mb-8 p-6 rounded-xl border-2 border-amber-400 bg-amber-50 shadow-lg ring-2 ring-amber-300/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-900">
            Deliveries due today – do not delay
          </h2>
          <p className="text-amber-800 text-sm">
            {deliveriesDueToday.length} order(s) must be delivered within the customer’s chosen time.
          </p>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {deliveriesDueToday.map((order) => {
          const customerName =
            order.customer ||
            order.user?.name ||
            (order.user?.email ? order.user.email.split("@")[0] : "Customer");

          return (
            <Link
              key={order.id}
              to="/admin/orders"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-500 transition-colors"
            >
              <span className="font-mono font-semibold text-[#1F2937] text-sm">
                {order.order_number || order.id?.substring(0, 8)}
              </span>
              <span className="text-[#6B7280] text-sm">{customerName}</span>
              <span className="text-amber-700 font-medium flex items-center gap-1 text-sm">
                <Truck className="w-4 h-4" />
                By {order.delivery_time || "Today"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                  order.status === "pending"
                    ? "bg-amber-200 text-amber-900"
                    : order.status === "processing"
                    ? "bg-blue-200 text-blue-900"
                    : "bg-purple-200 text-purple-900"
                }`}
              >
                {order.status}
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors text-sm"
      >
        View all orders
        <Truck className="w-4 h-4" />
      </Link>
    </div>
  );
}
