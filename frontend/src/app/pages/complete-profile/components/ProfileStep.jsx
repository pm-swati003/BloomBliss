export function ProfileStep({ profileInfo, setProfileInfo, handleProfileSubmit, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Personal Information</h2>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Phone Number *</label>
          <input
            type="tel"
            required
            value={profileInfo.phone}
            onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Birthday *</label>
          <input
            type="date"
            required
            value={profileInfo.birthday}
            onChange={(e) => setProfileInfo({ ...profileInfo, birthday: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
