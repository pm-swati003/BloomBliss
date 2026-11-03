export function ProductGallery({ product, productImages, selectedImage, setSelectedImage }) {
  return (
    <div>
      <div className="aspect-square bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] rounded-lg mb-4 overflow-hidden">
        {productImages[selectedImage] ? (
          <img
            src={productImages[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🌸</span>
          </div>
        )}
      </div>
      {productImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {productImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === i ? "border-[#E91E8C]" : "border-gray-200"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
