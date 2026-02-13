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
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-24 relative flex flex-col items-center"
        >
          {/* Backing Text Layer - Large, Serif, Elegant */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] select-none pointer-events-none w-full">
            <span className="block text-[5rem] md:text-[8rem] lg:text-[10rem] font-serif italic text-white/[0.03] whitespace-nowrap tracking-widest leading-none">
              Morpho Selection
            </span>
          </div>

          {/* Premium Badge - Top centered floating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mb-6"
          >
            <div className="px-4 py-1 rounded-full bg-morho-gold/10 border border-morho-gold/30 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-morho-gold">
                Collection 2024
              </span>
            </div>
          </motion.div>

          {/* Main Content Layer */}
          <div className="relative z-10 flex flex-col items-center max-w-2xl px-4">
            {/* Title with Gold Gradient and Subtle Shadow */}
            <h2 className="text-4xl sm:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
              <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent inline-block pb-2">
                منوی اختصاصی
              </span>
            </h2>

            {/* Subtitle / Description - Minimalist and Clean */}
            <p className="text-white/40 text-sm sm:text-base font-medium max-w-[280px] sm:max-w-md mb-8 leading-relaxed font-vazir">
              ترکیبی هنرمندانه از عطر قهوه و طعم‌های ماندگار، برای لحظات ناب شما
            </p>

            {/* Advanced Decorative Divider */}
            <div className="flex items-center gap-6 w-full max-w-xs group">
              <div className="h-px flex-1 bg-gradient-to-l from-morho-gold/50 via-white/5 to-transparent transition-all duration-700 group-hover:via-morho-gold/30" />
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-lg border border-morho-gold/20 flex items-center justify-center rotate-45 backdrop-blur-sm"
                >
                  <Coffee className="w-3.5 h-3.5 text-morho-gold -rotate-45" />
                </motion.div>
                <div className="absolute inset-0 bg-morho-gold/20 blur-xl opacity-50 animate-pulse" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-morho-gold/50 via-white/5 to-transparent transition-all duration-700 group-hover:via-morho-gold/30" />
            </div>
          </div>

          {/* Side Floating Accents - Hidden on very small screens */}
          <div className="absolute top-0 left-0 sm:left-10 lg:left-20 h-full flex flex-col justify-center gap-10 opacity-20 hidden sm:flex">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-morho-gold" />
          </div>
          <div className="absolute top-0 right-0 sm:right-10 lg:right-20 h-full flex flex-col justify-center gap-10 opacity-20 hidden sm:flex">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-morho-gold" />
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
