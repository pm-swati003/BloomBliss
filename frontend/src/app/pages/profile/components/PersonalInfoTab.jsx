export function PersonalInfoTab({
  profileData,
  isEditingProfile,
  setIsEditingProfile,
  profileForm,
  setProfileForm,
  handleProfileUpdate,
  updateProfilePending,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#1F2937] text-2xl font-bold">Personal Information</h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
        >
          {isEditingProfile ? "Cancel" : "Edit"}
        </button>
      </div>
      {isEditingProfile ? (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#374151] mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Email *</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Phone</label>
              <input
                type="tel"
                value={profileForm.phone || ""}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Birthday</label>
              <input
                type="date"
                value={profileForm.birthday || ""}
                onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updateProfilePending}
            className="px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            {updateProfilePending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#6B7280] mb-2">Full Name</label>
            <p className="text-[#1F2937]">{profileData?.user?.name || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[#6B7280] mb-2">Email</label>
            <p className="text-[#1F2937]">{profileData?.user?.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[#6B7280] mb-2">Phone</label>
            <p className="text-[#1F2937]">{profileData?.user?.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-[#6B7280] mb-2">Birthday</label>
            <p className="text-[#1F2937]">{formatDate(profileData?.user?.birthday || "")}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[#6B7280] mb-2">Member Since</label>
            <p className="text-[#1F2937]">{formatDate(profileData?.user?.created_at || "")}</p>
          </div>
        </div>
      )}
      <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
        <h3 className="text-[#1F2937] mb-4 text-xl font-bold">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFF5F7] rounded-lg p-6 text-center">
            <p className="text-[#E91E8C] mb-1 text-2xl font-bold">{profileData?.stats?.total_orders || 0}</p>
            <p className="text-[#6B7280]">Total Orders</p>
          </div>
          <div className="bg-[#FFF5F7] rounded-lg p-6 text-center">
            <p className="text-[#E91E8C] mb-1 text-2xl font-bold">
              ₹{profileData?.stats?.total_spent?.toLocaleString("en-IN") || "0"}
            </p>
            <p className="text-[#6B7280]">Total Spent</p>
          </div>
          <div className="bg-[#FFF5F7] rounded-lg p-6 text-center">
            <p className="text-[#E91E8C] mb-1 text-2xl font-bold">{profileData?.stats?.reward_points || 0}</p>
            <p className="text-[#6B7280]">Reward Points</p>
          </div>
        </div>
      </div>
    </div>
  );
}
