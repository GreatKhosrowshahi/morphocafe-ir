import { motion, Variants } from "framer-motion";
import { Star, Heart, Sparkles } from "lucide-react";

interface FeaturedCardProps {
    id: number;
    name: string;
    description: string;
    price: string;
    rating: number;
    image: string;
    index: number;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
    onViewDetails?: (id: number) => void;
}

/**
 * FeaturedCard - Banner-style card for special offers
 * Horizontal layout optimized for mobile (full-width banner)
 */
const FeaturedCard = ({
    id,
    name,
    description,
    price,
    rating,
    image,
    index,
    isFavorite = false,
    onToggleFavorite,
    onViewDetails
}: FeaturedCardProps) => {

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <motion.article
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            onClick={() => onViewDetails?.(id)}
            className="relative w-full overflow-hidden rounded-3xl cursor-pointer group"
            role="article"
            aria-label={`پیشنهاد ویژه: ${name} - ${price} تومان`}
        >
            {/* Background Image with Overlay */}
            <div className="relative h-[180px] sm:h-[220px] w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-active:scale-105"
                />

                {/* Gradient Overlay - Stronger for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-morho-deep/95 via-morho-deep/80 to-morho-deep/60" />

                {/* Special Offer Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-morho-gold to-yellow-400 text-morho-deep font-bold text-xs shadow-glow-gold"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>پیشنهاد ویژه</span>
                    </motion.div>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.(id);
                    }}
                    aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    className="absolute top-4 left-4 touch-target z-10 active:scale-90 transition-transform"
                >
                    <motion.div
                        whileTap={{ scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${isFavorite
                                ? "bg-morho-lavender/25 border-morho-lavender/30 text-morho-lavender shadow-glow-sm"
                                : "bg-black/30 border-white/10 text-white/80"
                            }`}
                    >
                        <Heart
                            className={`w-4.5 h-4.5 transition-all duration-200 ${isFavorite ? "fill-current" : ""}`}
                            strokeWidth={2}
                        />
                    </motion.div>
                </button>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    {/* Title & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight flex-1">
                            {name}
                        </h3>

                        <div className="flex items-center gap-1.5 shrink-0 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20">
                            <Star className="w-4 h-4 text-morho-gold fill-morho-gold drop-shadow-sm" />
                            <span className="text-sm font-bold text-white tabular-nums">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/90 leading-relaxed line-clamp-2 mb-3">
                        {description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-bold text-morho-gold tabular-nums tracking-tight">
                                {price}
                            </span>
                            <span className="text-sm text-white/80 font-medium">
                                تومان
                            </span>
                        </div>

                        <motion.div
                            whileTap={{ scale: 0.92 }}
                            transition={{ duration: 0.15 }}
                            className="px-6 py-2.5 rounded-full bg-white text-morho-deep font-bold text-sm shadow-lg active:shadow-md transition-shadow"
                        >
                            سفارش
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default FeaturedCard;
