import { Car, FileText } from "lucide-react";

export function VehicleInfoForm({
  form,
  setForm,
  touched,
  setTouched,
  handleFileChange,
  vehicleValid,
  REQUIRED_MESSAGE,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Car className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold font-sans">Vehicle Information</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Vehicle Type <span className="text-[#E91E8C]">*</span></label>
            <select
              value={form.vehicle_type}
              onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
              onBlur={() => setTouched({ ...touched, vehicle_type: true })}
              className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors duration-300 ${
                touched.vehicle_type && !form.vehicle_type.trim()
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-[#E5E7EB] focus:border-[#E91E8C]"
              }`}
            >
              <option value="">Select Type</option>
              <option value="Bike">Bike (2-Wheeler)</option>
              <option value="Scooter">Scooter (2-Wheeler)</option>
              <option value="Car">Car (4-Wheeler)</option>
              <option value="Van">Van / Truck</option>
            </select>
            {touched.vehicle_type && !form.vehicle_type.trim() && (
              <p className="text-red-500 text-xs mt-1">{REQUIRED_MESSAGE}</p>
            )}
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Vehicle Model</label>
            <input
              type="text"
              value={form.vehicle_model}
              onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
              placeholder="e.g. Honda Activa"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">License Plate / Reg No. <span className="text-[#E91E8C]">*</span></label>
            <input
              type="text"
              value={form.license_plate}
              onChange={(e) => setForm({ ...form, license_plate: e.target.value.toUpperCase() })}
              onBlur={() => setTouched({ ...touched, license_plate: true })}
              className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors duration-300 ${
                touched.license_plate && !form.license_plate.trim()
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-[#E5E7EB] focus:border-[#E91E8C]"
              }`}
              placeholder="e.g. MH 01 AB 1234"
            />
            {touched.license_plate && !form.license_plate.trim() && (
              <p className="text-red-500 text-xs mt-1">{REQUIRED_MESSAGE}</p>
            )}
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Driving License Number</label>
            <input
              type="text"
              value={form.license_number}
              onChange={(e) => setForm({ ...form, license_number: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#374151] mb-2 font-medium">Upload Document (DL, RC, or Insurance)</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                id="vehicle-doc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="vehicle-doc"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#E5E7EB] hover:border-[#E91E8C] rounded-lg cursor-pointer transition-colors text-[#6B7280] hover:text-[#E91E8C]"
              >
                <FileText className="w-5 h-5 mr-2" />
                {form.document ? form.document.name : "Choose a file..."}
              </label>
            </div>
          </div>
          <p className="text-xs text-[#6B7280] mt-2">Accepted formats: PDF, JPG, PNG (Max 5MB).</p>
        </div>
      </div>
    </div>
  );
}
