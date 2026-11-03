import { useCategories } from "@/lib/api/hooks/useCategories";
import { CategoryRenderer } from "./data-renderers/CategoryRenderer";

export function FeaturedCategories() {
  const { data: categories = [], isLoading } = useCategories();

  // Priority categories to show first (roses, lilies, tulips, orchids, peonies)
  const prioritySlugs = ["roses", "lilies", "tulips", "orchids", "peonies"];

  // Sort categories: priority first, then others
  const sortedCategories = [...categories].sort((a, b) => {
    const aIndex = prioritySlugs.indexOf(a.slug.toLowerCase());
    const bIndex = prioritySlugs.indexOf(b.slug.toLowerCase());

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  const featuredCategories = sortedCategories.slice(0, 5);

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-20">
        <h2 className="text-[#1F2937] mb-12 text-center text-4xl font-bold">
          Shop By Category
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">Loading categories...</p>
          </div>
        ) : featuredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {featuredCategories.map((category) => (
              <CategoryRenderer key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
