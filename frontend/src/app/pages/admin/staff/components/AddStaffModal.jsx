import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_STAFF_ROLES = {
  delivery: "Delivery Partner",
  shop_keeper: "Shop Keeper",
  admin: "Admin",
};

export function AddStaffModal({ assignableLabels, onClose, onSubmit, isSaving }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("delivery");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });
  };

  const rolesToDisplay =
    assignableLabels && Object.keys(assignableLabels).length > 0
      ? Object.entries(assignableLabels).filter(([k]) => k !== "customer" && k !== "super_admin")
      : Object.entries(DEFAULT_STAFF_ROLES);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[#1F2937] text-xl font-bold font-sans mb-2">Add Staff Member</h2>
        <p className="text-[#6B7280] text-sm mb-6">
          Create an Admin, Shop Keeper, or Delivery partner account. Delivery partners log in at
          the Delivery Portal (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/delivery/login</code>).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#374151] mb-1 font-medium text-sm">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium text-sm">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. staff@bloombliss.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium text-sm">
              Password * <span className="text-[#6B7280] font-normal">(min 8 characters)</span>
            </label>
            <input
              type="password"
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium text-sm">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors bg-white font-medium text-sm text-[#374151] cursor-pointer"
            >
              {rolesToDisplay.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg text-[#374151] hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50 transition-colors font-medium text-sm shadow-md"
            >
              {isSaving ? "Adding..." : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
