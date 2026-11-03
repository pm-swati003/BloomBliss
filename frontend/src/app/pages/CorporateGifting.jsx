import { ProductCollectionTemplate } from "./shared/components/ProductCollectionTemplate";

export function CorporateGifting() {
  return (
    <ProductCollectionTemplate
      title="Corporate Gifting"
      description="Professional arrangements for business and corporate events"
      queryKeyPrefix="corporate"
      allowedCategories={["roses", "lilies"]}
    />
  );
}
