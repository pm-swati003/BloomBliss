import { Link } from "react-router-dom";

export function OrderRenderer({ order }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-[#10B981]";
      case "pending":
        return "bg-[#F59E0B]";
      case "processing":
        return "bg-[#3B82F6]";
      case "shipped":
        return "bg-[#8B5CF6]";
      default:
        return "bg-[#6B7280]";
    }
  };

  return (
    <div className="border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#1F2937] mb-1">{order.order_number}</h3>
          <p className="text-[#6B7280] text-sm">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 ${getStatusColor(order.status)} text-white rounded-full text-sm`}
        >
          {order.status}
        </span>
      </div>

      {order.items && order.items.length > 0 && (
        <p className="text-[#374151] mb-3">
          {order.items.map((item) => item.product_name).join(", ")}
        </p>
      )}

      {order.tracking_number && (
        <div className="bg-[#FFF5F7] rounded-lg p-3 mb-4">
          <p className="text-[#6B7280] text-sm">
            Tracking:{" "}
            <span className="text-[#E91E8C]">{order.tracking_number}</span>
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-[#1F2937]">₹{order.total.toLocaleString("en-IN")}</p>
        <div className="flex gap-3">
          <Link
            to={`/orders/${order.id}`}
            className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
