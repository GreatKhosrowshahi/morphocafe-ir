import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Heart, ShoppingBag, Plus, X, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { parsePrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * ============================================================================
 * TYPE DEFINITIONS - UPDATED FOR BACKWARD COMPATIBILITY
 * ============================================================================
 */
interface ProductCardProps {
  id?: number | string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number;
  imageUrl?: string;
  image?: string;          // Compatibility with MenuContext
  badge?: string;
  category?: string;       // Compatibility with MenuContext
  rating: number;
  reviewCount?: number;
  specs?: { label: string; value: string }[];
  variants?: { id: string; color: string; label: string }[];
  stock?: number;
  index?: number;          // Compatibility with MenuSection animations
  isWishlisted?: boolean;
  isFavorite?: boolean;    // Compatibility with MenuSection
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  onToggleFavorite?: (id: any) => void; // Compatibility with MenuSection
  onViewDetails?: (id: any) => void;    // Compatibility with MenuSection
}

/**
 * ============================================================================
 * HELPER: Persian Formatter
 * ============================================================================
 */
const formatFa = (num: number | string) => {
  if (typeof num === "string") return num;
  return num.toLocaleString("fa-IR");
};

/**
 * ============================================================================
 * MASTERPIECE PRODUCT CARD (V5) - PERSIAN LUXURY EDITION
 * ============================================================================
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  originalPrice,
  imageUrl,
  image,
  badge,
  category,
  rating,
  reviewCount = 0,
  specs = [],
  variants = [],
  stock = 100,
  index = 0,
  isWishlisted = false,
  isFavorite = false,
  onAddToCart,
  onToggleWishlist,
  onToggleFavorite,
  onViewDetails,
}) => {
  const { addToCart } = useCart();
  const [cartState, setCartState] = useState<"idle" | "loading" | "success">("idle");

  // Resolve legacy props
  const activeImageUrl = imageUrl || image || "";
  const activeBadge = badge || category;
  const activeWishlisted = isWishlisted || isFavorite;
  const numericPrice = typeof price === "number" ? price : parsePrice(price);

  // --- 1. 3D TILT PHYSICS ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX / rect.width - rect.left / rect.width - 0.5);
    y.set(e.clientY / rect.height - rect.top / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- 2. HANDLERS ---
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartState("loading");

    // Support both prop-based and internal context-based add to cart
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart({
        id: id as number,
        name,
        description,
        price: numericPrice.toString(),
        image: activeImageUrl,
        rating,
        category: activeBadge || "نوشیدنی"
      });
    }

    setTimeout(() => setCartState("success"), 800);
    setTimeout(() => {
      setCartState("idle");
    }, 2300);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist();
    } else if (onToggleFavorite && id !== undefined) {
      onToggleFavorite(id);
    }
  };

  return (
    <TooltipProvider>
      <motion.article
        dir="rtl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: index * 0.05 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onViewDetails?.(id)}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative w-full font-vazir select-none cursor-pointer"
      >
        {/* Ambient Bloom Effect */}
        <div className="absolute -inset-4 bg-luxury-violet/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative h-full bg-luxury-surface backdrop-blur-xl border border-luxury-border rounded-2xl overflow-hidden shadow-2xl flex flex-col">

          {/* Header Controls */}
          <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-start pointer-events-none">
            {activeBadge && (
              <Badge className="bg-luxury-violet/20 text-luxury-primary border-luxury-violet/40 px-2 py-0.5 rounded-full animate-pulse pointer-events-auto text-[10px]">
                {activeBadge}
              </Badge>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleWishlist}
                  className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
                >
                  <motion.div animate={{ scale: activeWishlisted ? [1, 1.4, 1] : 1 }}>
                    <Heart
                      className={`w-4 h-4 transition-colors duration-500 ${activeWishlisted ? "text-red-500 fill-red-500" : "text-white/40"}`}
                      strokeWidth={activeWishlisted ? 0 : 2}
                    />
                  </motion.div>

                  {/* Heart Particles */}
                  <AnimatePresence>
                    {activeWishlisted && (
                      <motion.div className="absolute inset-0 pointer-events-none">
                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                              x: Math.cos(angle * Math.PI / 180) * 25,
                              y: Math.sin(angle * Math.PI / 180) * 25,
                              opacity: 0,
                              scale: 0
                            }}
                            className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-red-500 rounded-full"
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-luxury-deep border-luxury-border">
                <p>علاقه‌مندی‌ها</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Product Image Area */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <motion.img
              src={activeImageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Sheen Sweep */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ x: "-200%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-deep/80 via-transparent to-transparent z-[5]" />
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-5 flex flex-col flex-1 gap-4">
            {/* Rating & Identity Section - Stacked for full width visibility */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-luxury-violet/5 px-2.5 py-1 rounded-full border border-luxury-violet/10 backdrop-blur-sm">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" : "text-luxury-muted opacity-20"}`}
                        strokeWidth={s <= Math.floor(rating) ? 1 : 2}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-500 font-black pt-0.5">
                    {formatFa(rating)}
                  </span>
                </div>

                {reviewCount > 0 && (
                  <span className="text-[9px] text-luxury-cyan font-bold tracking-widest uppercase bg-luxury-cyan/5 px-2 py-0.5 rounded-md border border-luxury-cyan/10">
                    {formatFa(reviewCount)} نظر
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-luxury-primary leading-tight line-clamp-2">
                {name}
              </h3>
            </div>

            <p className="text-xs text-white/80 leading-relaxed line-clamp-2 font-medium">
              {description}
            </p>

            {/* Price Row - Centered */}
            <div className="flex flex-col items-center gap-3 mt-auto">
              <div className="flex flex-col items-center">
                <AnimatePresence>
                  {originalPrice && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      className="text-[10px] text-luxury-muted line-through relative decoration-luxury-violet/50"
                    >
                      {formatFa(originalPrice)}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                  <span className="text-2xl font-black font-vazir text-luxury-primary drop-shadow-sm">
                    {formatFa(numericPrice)}
                  </span>
                  <span className="text-[10px] text-luxury-violet font-bold bg-luxury-violet/10 px-1.5 py-0.5 rounded-md">تومان</span>
                </div>
              </div>

              {stock < 100 && (
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-green-400 font-bold mb-1">
                    {formatFa(stock)}٪ موجود
                  </span>
                  <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${stock}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex gap-2">
              <button
                disabled={cartState !== "idle"}
                onClick={handleAddToCart}
                className="flex-1 h-11 rounded-xl relative overflow-hidden group/btn bg-luxury-violet shadow-lg shadow-luxury-violet/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <AnimatePresence mode="wait">
                  {cartState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center gap-2 text-white font-bold text-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن به سبد</span>
                    </motion.div>
                  )}
                  {cartState === "loading" && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                  )}
                  {cartState === "success" && (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-green-500 flex items-center justify-center gap-2 text-white font-bold text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اضافه شد</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Detailed Specs removed from card as per request to focus on Modal sync */}
        </div>
      </motion.article>
    </TooltipProvider>
  );
};

/**
 * ============================================================================
 * PERSIAN LUXURY DEMO WRAPPER
 * ============================================================================
 */
export const ProductCardDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxury-deep flex items-center justify-center p-8">
      <ProductCard
        name="هدفون بیسیم پرو مکس"
        description="صدای کریستالی با تکنولوژی نویز کنسلینگ فعال"
        price={4850000}
        originalPrice={6200000}
        imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
        badge="پرفروش"
        rating={4.7}
        reviewCount={1284}
        stock={65}
        specs={[
          { label: "جنس", value: "آلومینیوم + چرم" },
          { label: "اتصال", value: "بلوتوث ۵.۳" },
          { label: "باتری", value: "۳۰ ساعت" },
          { label: "وزن", value: "۲۵۰ گرم" },
        ]}
        variants={[
          { id: "gold", color: "#D4AF37", label: "طلایی" },
          { id: "silver", color: "#C0C0C0", label: "نقره‌ای" },
          { id: "black", color: "#1A1A1A", label: "مشکی" },
        ]}
        onAddToCart={() => console.log("Added to cart")}
        onToggleWishlist={() => console.log("Toggled wishlist")}
      />
    </div>
  );
};

export default ProductCard;
