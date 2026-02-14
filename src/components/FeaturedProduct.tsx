import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Sparkles, Flame, Eye, ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useMenu } from "../contexts/MenuContext";
import ProductModal from "./ProductModal";
import { formatPrice } from "../lib/utils";

const FeaturedProduct = () => {
    const { featuredProduct } = useMenu();
    const ref = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <>
            <section ref={ref} className="py-12 sm:py-16 lg:py-20 relative w-full overflow-hidden">
                <div className="container-custom mx-auto px-4">
                    {/* Premium Horizontal Banner - Static Layout */}
                    <motion.div
                        style={{ opacity }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => setShowModal(true)}
                        className="relative group w-full h-[280px] sm:h-[320px] lg:h-[380px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-morho-deep border border-white/10 shadow-2xl cursor-pointer"
                    >
                        {/* Background Image with Parallax */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.img
                                src={featuredProduct.image}
                                alt={featuredProduct.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-active:scale-105"
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.2 }}
                            />

                            {/* Premium Layered Overlays for Depth and Legibility */}
                            {/* 1. Base Darkening for left-side content contrast */}
                            <div className="absolute inset-0 bg-gradient-to-r from-morho-deep via-morho-deep/60 to-transparent z-[1]" />

                            {/* 2. Sophisticated Edge Vignette - Warm Gold/Black mix */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[2]" />

                            {/* 3. Bottom-up contrast booster for price/CTA readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-[3]" />

                            {/* 4. Subtle Top-down "Atmospheric" light */}
                            <div className="absolute inset-0 bg-gradient-to-b from-morho-lavender/10 via-transparent to-transparent z-[4]" />
                        </div>

                        {/* Ambient Content Glow - Subtly Pulse */}
                        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(8,44,135,0.4)_0%,transparent_60%)] pointer-events-none animate-pulse-slow" />

                        <style>{`
                            @keyframes pulse-slow {
                                0%, 100% { opacity: 0.3; transform: scale(1); }
                                50% { opacity: 0.5; transform: scale(1.05); }
                            }
                            .animate-pulse-slow {
                                animation: pulse-slow 4s ease-in-out infinite;
                            }
                        `}</style>

                        {/* Main Content - Centered Vertically */}
                        <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {/* Special Tag */}
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(95,125,206,0.3)", "rgba(95,125,206,0.6)", "rgba(95,125,206,0.3)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full border border-morho-lavender/30 bg-morho-lavender/10 backdrop-blur-sm shadow-[0_0_15px_rgba(95,125,206,0.2)]"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-morho-lavender" />
                                    <span className="text-xs sm:text-sm text-morho-lavender font-semibold tracking-wide">تجربه اختصاصی مورفو</span>
                                </motion.div>

                                {/* Title - Single Line, No Wrap */}
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight line-clamp-2 sm:line-clamp-none">
                                    {featuredProduct.title} <span className="text-gradient inline-block">{featuredProduct.subtitle}</span>
                                </h2>

                                {/* Rating & Orders */}
                                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-morho-gold fill-morho-gold" />
                                        ))}
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span className="text-xs sm:text-sm text-white/70 font-medium">+۵۰۰ سفارش</span>
                                </div>

                                {/* Description - Hidden on Mobile for Cleaner Look */}
                                <p className="hidden sm:block text-white/80 text-sm lg:text-base leading-relaxed mb-5 max-w-lg">
                                    {featuredProduct.description}
                                </p>

                                {/* Price & CTA Row */}
                                <div className="flex items-center gap-4 sm:gap-6">
                                    {/* Premium Price Badge */}
                                    <div className="flex items-baseline gap-1.5 px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-br from-morho-gold/20 to-orange-500/10 border border-morho-gold/30 backdrop-blur-sm shadow-lg shrink-0 price-nowrap">
                                        <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-morho-gold tabular-nums drop-shadow-lg leading-none">
                                            {formatPrice(featuredProduct.price)}
                                        </span>
                                        <span className="text-xs sm:text-base text-white/70 font-bold shrink-0">تومان</span>
                                    </div>

                                    {/* Tap Indicator with Arrow */}
                                    <motion.div
                                        animate={{ x: [-4, 0, -4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm font-semibold">مشاهده جزئیات</span>
                                        <ArrowLeft className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Constant Shine Sweep Effect */}
                        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{
                                    x: ["-200%", "200%"]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 4,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[35deg]"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Product Modal */}
            {featuredProduct && (
                <ProductModal
                    product={{
                        id: 999,
                        name: featuredProduct.title + " " + featuredProduct.subtitle,
                        description: featuredProduct.description,
                        price: featuredProduct.price,
                        image: featuredProduct.image,
                        category: "پیشنهاد ویژه",
                        rating: 5
                    }}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default FeaturedProduct;
