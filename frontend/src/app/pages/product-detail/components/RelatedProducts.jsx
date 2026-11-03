import { Link } from "react-router-dom";
import { ProductRenderer } from "@/app/components/data-renderers/ProductRenderer";

export function RelatedProducts({ relatedProducts, productId }) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts
          .filter((p) => p.id !== productId)
          .slice(0, 4)
          .map((p) => (
            <Link key={p.id} to={`/product/${p.id}`}>
              <ProductRenderer product={p} />
            </Link>
          ))}
      </div>
    </div>
  );
}
