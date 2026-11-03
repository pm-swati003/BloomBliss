import { useState } from "react";
import { User, Phone, Calendar, Car, FileText, CheckCircle, Shield, UploadCloud, Headset } from "lucide-react";
import { Link } from "react-router-dom";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { UploadDocumentsModal } from "./UploadDocumentsModal";

export function ProfileDetails({ user, onEdit }) {
  const profile = user?.profile || user || {};
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E7EB]">
        <h2 className="text-[#1F2937] text-2xl font-bold font-sans">Profile Details</h2>
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors font-medium"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#374151] flex items-center gap-2 font-sans">
            <User className="w-5 h-5 text-[#E91E8C]" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">Full Name</p>
              <p className="text-[#1F2937] font-medium text-lg">{user?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Phone Number</p>
              <p className="text-[#1F2937] font-medium text-lg flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> {user?.phone || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Date of Birth</p>
              <p className="text-[#1F2937] font-medium text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {user?.birthday ? new Date(user.birthday).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#374151] flex items-center gap-2 font-sans">
            <Car className="w-5 h-5 text-[#E91E8C]" /> Vehicle Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">Vehicle Type</p>
              <p className="text-[#1F2937] font-medium text-lg">{profile.vehicle_type || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Vehicle Model</p>
              <p className="text-[#1F2937] font-medium text-lg">{profile.vehicle_model || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">License Plate</p>
              <p className="text-[#1F2937] font-medium text-lg uppercase tracking-wider">{profile.license_plate || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Document</p>
              {profile.document_path ? (
                <div className="mt-2 flex gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Document uploaded
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 mt-1 italic text-sm">No license uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
        <h3 className="text-xl font-bold text-[#1F2937] mb-6 font-sans">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:border-[#E91E8C] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-[#E91E8C] transition-colors">
              <Shield className="w-6 h-6 text-[#E91E8C] group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-[#E91E8C]">Change Password</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:border-violet-600 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
              <UploadCloud className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-violet-600">Upload Photos</span>
          </button>

          <Link
            to="/contact"
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all group text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <Headset className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-emerald-600">Contact Support</span>
          </Link>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-[#1F2937] font-medium">Profile Verification</p>
            <p className="text-sm text-gray-500">Your profile meets the minimum requirements for active deliveries.</p>
          </div>
        </div>

        {/* Uploaded Documents Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${profile.profile_photo_path ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                <span className="text-sm font-medium text-gray-700">Profile Photo</span>
                {profile.profile_photo_path && (
                  <a href={`http://localhost:8000/storage/${profile.profile_photo_path}`} target="_blank" rel="noreferrer" className="ml-auto text-xs text-blue-600 hover:underline">View</a>
                )}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${profile.vehicle_photo_path ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                <span className="text-sm font-medium text-gray-700">Vehicle Photo</span>
                {profile.vehicle_photo_path && (
                  <a href={`http://localhost:8000/storage/${profile.vehicle_photo_path}`} target="_blank" rel="noreferrer" className="ml-auto text-xs text-blue-600 hover:underline">View</a>
                )}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${profile.id_proof_path ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                <span className="text-sm font-medium text-gray-700">ID Proof</span>
                {profile.id_proof_path && (
                  <a href={`http://localhost:8000/storage/${profile.id_proof_path}`} target="_blank" rel="noreferrer" className="ml-auto text-xs text-blue-600 hover:underline">View</a>
                )}
            </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <UploadDocumentsModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </div>
  );
}
