import { ProductCollectionTemplate } from "./shared/components/ProductCollectionTemplate";

export function Shop() {
  return (
    <ProductCollectionTemplate
      title="Our Flower Collection"
      description="Discover our beautiful selection of fresh flowers for every occasion"
      queryKeyPrefix="infinite"
      allowedCategories={null}
    />
  );
}
