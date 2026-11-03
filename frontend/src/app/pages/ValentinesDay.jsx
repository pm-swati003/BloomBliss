import { ProductCollectionTemplate } from "./shared/components/ProductCollectionTemplate";

export function ValentinesDay() {
  return (
    <ProductCollectionTemplate
      title="Valentine's Day Special"
      description="Show your love with our romantic rose collection"
      queryKeyPrefix="valentines"
      allowedCategories={["roses", "lilies"]}
    />
  );
}
