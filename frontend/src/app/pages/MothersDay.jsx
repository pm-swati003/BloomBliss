import { ProductCollectionTemplate } from "./shared/components/ProductCollectionTemplate";

export function MothersDay() {
  return (
    <ProductCollectionTemplate
      title="Mother's Day Collection"
      description="Honor the special women in your life with beautiful blooms"
      queryKeyPrefix="mothersday"
      allowedCategories={["roses", "lilies"]}
    />
  );
}
