import { useState } from "react";
import { X, UploadCloud, FileImage, Image as ImageIcon, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useDeliveryProfileUpdate } from "@/lib/api/hooks/useDelivery";

export function UploadDocumentsModal({ isOpen, onClose }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const updateProfile = useDeliveryProfileUpdate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profilePhoto && !vehiclePhoto && !idProof) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    if (profilePhoto) formData.append("profile_photo", profilePhoto);
    if (vehiclePhoto) formData.append("vehicle_photo", vehiclePhoto);
    if (idProof) formData.append("id_proof", idProof);

    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast.success("Documents uploaded successfully!");
        onClose();
      },
      onError: (err) => {
        const msg = err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Failed to upload documents.";
        toast.error(msg);
      },
    });
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-violet-600" /> Upload Documents
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            {/* Profile Photo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-500" /> Profile Photo (Avatar)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <span className="truncate block">
                    {profilePhoto ? profilePhoto.name : "Choose a square photo..."}
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setProfilePhoto)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Vehicle Photo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileImage className="w-4 h-4 text-gray-500" /> Vehicle Photo
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <span className="truncate block">
                    {vehiclePhoto ? vehiclePhoto.name : "Choose vehicle image..."}
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setVehiclePhoto)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* ID Proof */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" /> ID Proof (DL/Aadhar)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-300 border-dashed rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <span className="truncate block">
                    {idProof ? idProof.name : "Choose PDF or image..."}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setIdProof)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-5 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {updateProfile.isPending ? "Uploading..." : "Upload Selected"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
