export function PersonalInfoForm({
  form,
  setForm,
  touched,
  setTouched,
  handleSubmit,
  nameValid,
  phoneValid,
  canSave,
  user,
  joinDate,
  updateProfile,
  REQUIRED_MESSAGE,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-[#1F2937] mb-2 text-xl font-bold font-sans">Personal Information</h2>
      <p className="text-sm text-[#6B7280] mb-6">
        Fields marked with <span className="text-red-500">*</span> are required to complete your profile.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-[#374151] font-medium mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Your full name"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${
              touched.name && !nameValid ? "border-red-300 bg-red-50" : "border-[#E5E7EB]"
            }`}
          />
          {touched.name && !nameValid && <p className="text-red-600 text-sm mt-1">{REQUIRED_MESSAGE}</p>}
        </div>
        <div>
          <label className="block text-[#374151] font-medium mb-1">Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#6B7280]"
          />
          <p className="text-xs text-[#6B7280] mt-1">Email cannot be changed here.</p>
        </div>
        <div>
          <label className="block text-[#374151] font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="e.g. 9876543210"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${
              touched.phone && !phoneValid ? "border-red-300 bg-red-50" : "border-[#E5E7EB]"
            }`}
          />
          {touched.phone && !phoneValid && <p className="text-red-600 text-sm mt-1">{REQUIRED_MESSAGE}</p>}
        </div>
        <div>
          <label className="block text-[#374151] font-medium mb-1">Date of birth (optional)</label>
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E91E8C]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#6B7280] mb-1 font-medium">Member since</label>
          <p className="text-[#1F2937]">{joinDate}</p>
        </div>
        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={!canSave || updateProfile.isPending}
            className="px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {updateProfile.isPending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
