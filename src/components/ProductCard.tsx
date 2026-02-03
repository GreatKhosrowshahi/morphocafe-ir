import { motion, Variants } from "framer-motion";
import { Star, Heart, ArrowLeft } from "lucide-react";
import { formatPrice } from "../lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  category?: string;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

/**
 * ProductCard - Mobile-First Card Component
 * 
 * Design Principles:
 * - Mobile viewport: 360px-430px optimized
 * - 44px minimum touch targets
 * - Auto-layout with clear hierarchy
 * - GPU-optimized animations (150-250ms)
 * - No hover dependencies
 */
const ProductCard = ({
  id,
  name,
  description,
  price,
  rating,
  image,
  category,
  index,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails
}: ProductCardProps) => {

  // Mobile-optimized animations - fast and smooth
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1] // cubic-bezier easing
      }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => onViewDetails?.(id)}
      className="card-base w-full cursor-pointer active:shadow-card-active transition-shadow will-change-transform"
      role="article"
      aria-label={`${name} - ${price} تومان`}
    >
      {/* ========================================
          LAYER 1: Image & Status
          - Aspect ratio: 4:3 (mobile-optimized)
          - Lazy loading
          - Category badge & Favorite button
      ======================================== */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-morho-deep/50">
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-morho-deep/60 via-transparent to-transparent pointer-events-none" />

        {/* Category Badge - Top Left */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white/95 tracking-wide shadow-sm">
              {category}
            </span>
          </div>
        )}

        {/* Favorite Button - Top Right (44px touch target) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className="absolute top-2 right-2 touch-target z-10 active:scale-90 transition-transform"
        >
          <motion.div
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${isFavorite
              ? "bg-morho-lavender/25 border-morho-lavender/30 text-morho-lavender shadow-glow-sm"
              : "bg-black/30 border-white/10 text-white/80 hover:bg-black/40"
              }`}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-all duration-200 ${isFavorite ? "fill-current" : ""}`}
              strokeWidth={2}
            />
          </motion.div>
        </button>
      </div>

      {/* ========================================
          LAYER 2: Content
          - Title, Rating, Description
          - Auto-layout with proper spacing
          - Smart text truncation
      ======================================== */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title & Rating Row */}
        <div className="flex justify-between items-start gap-3">
          {/* Title - line-clamp-2 for overflow */}
          <h3 className="text-base font-bold text-white leading-snug line-clamp-2 flex-1 min-h-[2.5rem] break-words">
            {name}
          </h3>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 shrink-0 bg-white/5 px-2 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-morho-gold fill-morho-gold drop-shadow-sm" />
            <span className="text-xs font-bold text-white/95 tabular-nums leading-none">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Description - line-clamp-2 */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* ========================================
            LAYER 3: Action
            - Price & CTA button
            - Divider for visual separation
        ======================================== */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">

          {/* Price Section */}
          <div className="flex items-baseline gap-1 price-nowrap overflow-hidden">
            <span className="text-lg font-bold text-white tabular-nums tracking-tight">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] text-white/60 font-medium shrink-0">
              تومان
            </span>
          </div>

          {/* CTA Button - 44px touch target */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="touch-target -mr-2"
            aria-label="مشاهده جزئیات"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-morho-lavender to-morho-royal text-morho-deep shadow-glow-sm active:shadow-card-active transition-shadow">
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
