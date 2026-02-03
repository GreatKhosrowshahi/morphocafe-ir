import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Flame, Droplets, ThermometerSun, Leaf } from "lucide-react";
import { useEffect } from "react";
import { formatPrice } from "../lib/utils";

interface ProductModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-morho-deep/90 backdrop-blur-md z-50"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-4 sm:inset-10 md:inset-20 z-50 flex flex-col md:flex-row bg-morho-deep border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-w-6xl mx-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden group">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-morho-deep via-transparent to-transparent md:bg-gradient-to-r" />

                            {/* Floating tags */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-morho-gold fill-morho-gold" />
                                    {product.rating} امتیاز
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col overflow-y-auto">
                            {/* Category Badge */}
                            <div className="flex justify-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-morho-lavender/10 text-morho-lavender text-xs font-bold border border-morho-lavender/20">
                                    {product.category || "محصول ویژه"}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight break-words">
                                {product.name}
                            </h2>

                            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-8">
                                {product.description}
                                <br /><br />
                                تهیه شده از بهترین مواد اولیه با رسپی اختصاصی سرآشپز مورفو. یک تجربه طعمی متفاوت که با عشق برای شما آماده شده است.
                            </p>

                            {/* Flavor Profile / Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Droplets className="w-4 h-4 text-blue-400" />
                                        <span>رطوبت و بافت</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            transition={{ delay: 0.3 }}
                                            className="h-full bg-blue-400"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Flame className="w-4 h-4 text-red-400" />
                                        <span>شیرینی</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "70%" }}
                                            transition={{ delay: 0.4 }}
                                            className="h-full bg-red-400"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <ThermometerSun className="w-4 h-4 text-orange-400" />
                                        <span>طبع</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">گرم و انرژی‌بخش</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Leaf className="w-4 h-4 text-green-400" />
                                        <span>گیاهی</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">۱۰۰٪ طبیعی</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/40 uppercase tracking-widest mb-1">قیمت نهایی</span>
                                    <div className="flex items-baseline gap-1 price-nowrap">
                                        <span className="text-3xl font-bold text-white tabular-nums">{formatPrice(product.price)}</span>
                                        <span className="text-sm text-white/50 shrink-0">تومان</span>
                                    </div>
                                </div>

                                {/* View Only Badge */}
                                <div className="px-6 py-3 rounded-xl bg-white/5 text-white/80 font-medium text-sm backdrop-blur-md border border-white/10">
                                    موجود در کافه
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
