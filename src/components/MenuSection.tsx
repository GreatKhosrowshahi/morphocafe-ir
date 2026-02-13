import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Coffee, Cake, Croissant, IceCream, CupSoda } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useMenu } from "../contexts/MenuContext";

// Map icon names to components
const iconMap: Record<string, any> = {
  Coffee,
  Cake,
  Croissant,
  IceCream,
  Heart,
  CupSoda
};

interface MenuSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
  initialCategory?: string | null;
}

const MenuSection = ({ sectionRef, initialCategory }: MenuSectionProps) => {
  const { products, categories, favorites, toggleFavorite } = useMenu();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Effect to update if prop changes (e.g. user clicks mood)
  useEffect(() => {
    if (initialCategory) {
      // Map moods to actual Category IDs
      // IDs based on MenuContext: espresso-based, non-coffee, dessert, pastry, bakery
      const moodMap: Record<string, string> = {
        'energy': 'espresso-based', // Matching "Espresso Based"
        'relax': 'non-coffee',     // Matching "Non-Coffee"
        'sweet': 'dessert',        // Matching "Dessert"
        'cool': 'all'              // Cool drinks might be scattered
      };

      // If specific category exists, switch to it. Otherwise 'all'.
      const targetCat = moodMap[initialCategory] || 'all';
      setActiveCategory(targetCat);
    }
  }, [initialCategory]);


  const filteredProducts = activeCategory === "all"
    ? products
    : activeCategory === "favorites"
      ? products.filter(p => favorites.includes(p.id))
      : products.filter(p => p.category === activeCategory);

  return (
    <section ref={sectionRef} className="section-padding no-scroll-x">
      <div className="mobile-container mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 sm:mb-28 relative"
        >
          {/* Decorative background text - Lighter and Serif */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] sm:text-[7rem] font-serif italic text-white/[0.02] pointer-events-none whitespace-nowrap tracking-widest">
            Fine Dining
          </span>

          <div className="relative z-10 flex flex-col items-center">
            {/* Delicate top accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              className="w-12 h-px bg-morho-gold/50 mb-6"
            />

            <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white tracking-wide">
              <span className="inline-block relative px-4">
                منوی ما
              </span>
            </h2>

            {/* Elegant bottom decoration */}
            <div className="flex items-center gap-3 opacity-60">
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-white/30" />
              <Heart className="w-3 h-3 text-morho-gold fill-morho-gold animate-pulse" />
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-white/30" />
            </div>
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="sticky top-[4.5rem] sm:top-[6rem] lg:top-[7rem] z-40 py-6 mb-10 sm:mb-16 border-y border-white/5 shadow-sm">
          <div className="mobile-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide"
            >
              {categories.map((cat) => {
                const Icon = iconMap[cat.iconName] || Coffee;
                const isActive = activeCategory === cat.id;
                const favoriteCount = cat.id === "favorites" ? favorites.length : null;

                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      if (window.innerWidth < 1024) {
                        const headerOffset = window.innerWidth < 640 ? 80 : 120;
                        const elementPosition = sectionRef.current?.getBoundingClientRect().top || 0;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className={`
                    flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-base whitespace-nowrap flex-shrink-0
                    transition-all duration-300 border
                    ${isActive
                        ? "bg-gradient-accent border-morho-lavender/50 shadow-glow text-white"
                        : "glass-card border-white/5 hover:border-morho-lavender/30 text-muted-foreground hover:text-white"
                      }
                  `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-morho-lavender"}`} />
                    {cat.label}
                    {favoriteCount !== null && favoriteCount > 0 && (
                      <span className={`mr-2 px-2.5 py-0.5 text-xs rounded-full ${isActive ? "bg-white/20 text-white" : "bg-morho-lavender/20 text-morho-lavender"}`}>
                        {favoriteCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Products grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  image={product.image}
                  category={product.badge}
                  index={index}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={(id) => setSelectedProduct(products.find(p => p.id === id))}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-24 glass-card rounded-[2.5rem] border-dashed border-2 border-white/5"
              >
                <Heart className="w-20 h-20 mx-auto mb-6 text-muted-foreground/20" />
                <h3 className="text-2xl font-bold mb-3">هنوز موردی انتخاب نشده</h3>
                <p className="text-muted-foreground text-lg">
                  روی آیکون قلب محصولات کلیک کنید تا در این بخش نمایش داده شوند
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default MenuSection;
