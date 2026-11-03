export function FeaturedCollectionCard({
  to,
  image,
  title,
  description,
  buttonText,
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-[#E5E7EB] hover:border-[#E91E8C]"
    >
      <div className="w-full h-64 bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-4xl">🌸</span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-[#1F2937] mb-2 group-hover:text-[#E91E8C] font-semibold text-lg">
          {title}
        </h3>
        <p className="text-[#6B7280] mb-6 text-sm">{description}</p>
        <button className="w-full py-3 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] text-white rounded-lg hover:shadow-md transition-all">
          {buttonText}
        </button>
      </div>
    </Link>
  );
}
