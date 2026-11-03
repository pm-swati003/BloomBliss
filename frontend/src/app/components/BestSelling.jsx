import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useBestSellingProducts } from "@/lib/api/hooks/useProducts";
import { ProductRenderer } from "./data-renderers/ProductRenderer";
import { ProductCardShimmer } from "./effects/Shimmer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export function BestSelling() {
  const { data: products = [], isLoading } = useBestSellingProducts();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    setCount(api.scrollSnapList().length);
    onSelect();

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const isSlider = products.length > 4;

  return (
    <section className="w-full bg-[#F9FAFB] py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FCE7F3] rounded-full text-xs font-semibold text-[#E91E8C] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-[#1F2937] text-3xl md:text-4xl font-bold">
            Best Seller
          </h2>
          <p className="text-[#6B7280] text-base mt-2 max-w-xl mx-auto">
            Our most popular fresh floral arrangements, handpicked for you.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardShimmer key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-[#6B7280]">No best seller products available right now.</p>
          </div>
        ) : isSlider ? (
          /* Slider view when products > 4: single row of 4 items per view on desktop */
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 sm:-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 sm:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ProductRenderer product={product} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Desktop Slider Controls */}
              <CarouselPrevious className="hidden md:flex -left-5 lg:-left-7 xl:-left-10 bg-white hover:bg-[#E91E8C] hover:text-white border-[#E5E7EB] shadow-md size-11 text-[#1F2937] transition-all" />
              <CarouselNext className="hidden md:flex -right-5 lg:-right-7 xl:-right-10 bg-white hover:bg-[#E91E8C] hover:text-white border-[#E5E7EB] shadow-md size-11 text-[#1F2937] transition-all" />
            </Carousel>

            {/* Mobile navigation controls */}
            <div className="flex md:hidden justify-center items-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="p-2.5 rounded-full border border-gray-300 bg-white text-gray-700 disabled:opacity-40 shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="p-2.5 rounded-full border border-gray-300 bg-white text-gray-700 disabled:opacity-40 shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination dots */}
            {count > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      current === index
                        ? "w-8 bg-[#E91E8C]"
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Single row view when products <= 4 */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn(
              "grid gap-6",
              products.length === 1 && "grid-cols-1 max-w-sm mx-auto",
              products.length === 2 && "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto",
              products.length === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto",
              products.length === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ProductRenderer product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
