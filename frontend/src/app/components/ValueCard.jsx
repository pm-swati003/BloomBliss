export function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="text-center p-6 bg-[#F9FAFB] rounded-lg hover:shadow-md transition-shadow border border-[#E5E7EB]">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center shadow-md">
        <Icon size={32} className="text-white" />
      </div>
      <h3 className="text-[#1F2937] mb-2">{title}</h3>
      <p className="text-[#6B7280]">{description}</p>
    </div>
  );
}
