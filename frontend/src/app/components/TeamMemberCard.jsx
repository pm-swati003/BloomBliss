export function TeamMemberCard({ name, role, image }) {
  return (
    <div className="text-center bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-[#E5E7EB]">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-pink-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";
          }}
        />
      </div>
      <h3 className="text-[#1F2937] font-semibold text-lg mb-1">{name}</h3>
      <p className="text-[#E91E8C] font-medium text-sm">{role}</p>
    </div>
  );
}
