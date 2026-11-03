import { MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export function AddressesTab({
  addresses,
  isAddressesLoading,
  handleSetDefaultAddress,
  handleDeleteAddress,
  deleteAddressPending,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <Link
          to="/complete-profile"
          className="px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg"
        >
          + Add New Address
        </Link>
      </div>
      {isAddressesLoading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-[#E91E8C] mx-auto mb-4" />
          <p className="mb-4 text-[#6B7280]">No addresses saved yet</p>
          <Link
            to="/complete-profile"
            className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            Add Address
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border-2 border-[#E5E7EB] rounded-lg p-6 relative hover:border-[#E91E8C]"
            >
              {addr.is_default && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#9333EA] text-white rounded-full text-sm">
                  Default
                </span>
              )}
              <div className="mb-3">
                <h3 className="text-[#1F2937] font-bold mb-1">{addr.type}</h3>
                <p className="text-[#374151] font-medium">{addr.name}</p>
              </div>
              <p className="text-[#6B7280] mb-1">{addr.street}</p>
              <p className="text-[#6B7280] mb-2">
                {addr.city}, {addr.state} {addr.zip}
              </p>
              <p className="text-[#6B7280] mb-4">{addr.phone}</p>
              <div className="flex space-x-3">
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    className="flex-1 px-3 py-2 text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  disabled={deleteAddressPending}
                  className="px-3 py-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
