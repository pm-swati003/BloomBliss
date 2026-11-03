import { Link } from "react-router-dom";

// Category image mapping for fallback images
const categoryImageMap = {
  roses:
    "https://bouqs.com/blog/wp-content/uploads/2024/02/shutterstock_368490641-min.jpg",
  lilies:
    "https://i.pinimg.com/564x/1c/1c/d8/1c1cd8eb27ce8498e4003adabeea6b8b.jpg",
  tulips:
    "https://i.pinimg.com/originals/7e/83/38/7e8338594c7bb21fa5f36d356dd9fd74.jpg",
  orchids:
    "https://www.theknot.com/tk-media/images/e2bf0ea4-0c9d-4c86-905b-d2443f0a1d03",
  peonies:
    "https://static.vecteezy.com/system/resources/previews/044/280/936/large_2x/woman-florist-making-beautiful-bouquet-of-pink-peonies-in-a-flower-shop-photo.jpg",
};

// Fallback images for each category
const getCategoryImage = (category) => {
  if (category.image) {
    return category.image;
  }

  const slug = category.slug.toLowerCase();
  if (categoryImageMap[slug]) {
    return categoryImageMap[slug];
  }

  // Default fallback images based on category name
  const name = category.name.toLowerCase();
  if (name.includes("rose")) {
    return "https://fiftyflowers.com/cdn/shop/articles/Rose-Color-Meaning_a28faae7-93a4-4174-a6b2-daa7b9a61dd1.jpg?v=1769460823";
  } else if (name.includes("lily")) {
    return "https://i.pinimg.com/564x/1c/1c/d8/1c1cd8eb27ce8498e4003adabeea6b8b.jpg";
  } else if (name.includes("tulip")) {
    return "https://i.pinimg.com/originals/7e/83/38/7e8338594c7bb21fa5f36d356dd9fd74.jpg";
  } else if (name.includes("orchid")) {
    return "https://www.theknot.com/tk-media/images/e2bf0ea4-0c9d-4c86-905b-d2443f0a1d03";
  } else if (name.includes("peony")) {
    return "https://static.vecteezy.com/system/resources/previews/044/280/936/large_2x/woman-florist-making-beautiful-bouquet-of-pink-peonies-in-a-flower-shop-photo.jpg";
  }

  // Generic flower image as final fallback
  return "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop&q=80";
};

export function CategoryRenderer({ category }) {
  const imageUrl = getCategoryImage(category);

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="flex flex-col items-center gap-4 cursor-pointer group"
    >
      <div className="w-full aspect-square bg-[#F9FAFB] rounded-lg overflow-hidden relative group-hover:shadow-xl transition-all duration-300 shadow-md border-2 border-transparent group-hover:border-[#E91E8C]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback to a generic flower image if the image fails to load
            e.target.src =
              "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop&q=80";
          }}
        />
      </div>
      <p className="text-[#1F2937] text-center font-medium group-hover:text-[#E91E8C] transition-colors duration-300">
        {category.name}
      </p>
    </Link>
  );
}
