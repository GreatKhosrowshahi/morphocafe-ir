import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Flame, Droplets, ThermometerSun, Leaf, CheckCircle2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "../lib/utils";
import { useCart } from "@/features/cart/context/CartContext";

interface ProductModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setAdded(false);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!product) return null;

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            rating: product.rating,
            category: product.category || "پیشنهاد اختصاصی"
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Persian Formatter
    const formatFa = (num: number | string) => {
        if (typeof num === "string" && isNaN(Number(num))) return num;
        return Number(num).toLocaleString("fa-IR");
    };

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
                        className="fixed inset-0 bg-luxury-deep/90 backdrop-blur-xl z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        dir="rtl"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="fixed inset-4 sm:inset-10 md:inset-20 z-[101] flex flex-col md:flex-row bg-luxury-deep border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] max-w-6xl mx-auto font-vazir"
                    >
                        {/* Close Button Pin */}
                        <div className="absolute top-6 left-6 z-50">
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-luxury-primary hover:bg-white/10 hover:scale-110 active:scale-90 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image Section - The Display */}
                        <div className="w-full md:w-1/2 h-[45vh] md:h-full relative overflow-hidden group">
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Cinematic Layers */}
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-deep via-transparent to-transparent md:hidden z-[1]" />
                            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-luxury-deep via-transparent to-transparent z-[1]" />
                            <div className="absolute inset-x-0 bottom-0 p-8 z-10 hidden md:block">
                                <span className="px-4 py-1.5 rounded-full bg-luxury-violet/20 text-luxury-primary border border-luxury-violet/40 text-xs font-bold animate-pulse">
                                    {product.category || "پیشنهاد اختصاصی"}
                                </span>
                            </div>
                        </div>

                        {/* Content Section - The Interface */}
                        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col overflow-y-auto custom-scrollbar relative">
                            {/* Decorative Grid BG */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)] pointer-events-none" />

                            <div className="relative">
                                {/* Enhanced Rating Header */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
                                        <div className="flex gap-1 shrink-0">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-luxury-muted opacity-20"}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-black text-amber-500 mt-1">
                                            {formatFa(product.rating)}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-luxury-cyan tracking-widest uppercase bg-luxury-cyan/10 px-3 py-1.5 rounded-xl border border-luxury-cyan/20">
                                        تایید شده توسط {formatFa(120)} کاربر
                                    </span>
                                </div>

                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-4xl sm:text-6xl font-black text-luxury-primary mb-4 leading-[1.2]"
                                >
                                    {product.name}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-luxury-primary/80 leading-relaxed text-lg mb-8 max-w-xl"
                                >
                                    {product.description}
                                    <br /><br />
                                    <span className="text-luxury-muted text-base">
                                        تهیه شده از بهترین مواد اولیه با رسپی اختصاصی سرآشپز مورفو. یک تجربه طعمی متفاوت که با عشق برای شما آماده شده است.
                                    </span>
                                </motion.p>
                            </div>

                            {/* Detailed Specs Grid (Synced with ProductCard V5) */}
                            <div className="grid grid-cols-2 gap-4 mb-12">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 text-luxury-primary text-sm font-bold">
                                        <Droplets className="w-4 h-4 text-luxury-cyan" />
                                        <span>بافت و غلظت</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            className="h-full bg-luxury-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 text-luxury-primary text-sm font-bold">
                                        <Flame className="w-4 h-4 text-luxury-violet" />
                                        <span>میزان شیرینی</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "70%" }}
                                            className="h-full bg-luxury-violet shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 text-luxury-muted text-[10px] font-bold uppercase tracking-wider">
                                        <ThermometerSun className="w-3.5 h-3.5 text-orange-400" />
                                        <span>طبع و انرژی</span>
                                    </div>
                                    <span className="text-sm font-black text-luxury-primary">گرم و انرژی‌بخش</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 text-luxury-muted text-[10px] font-bold uppercase tracking-wider">
                                        <Leaf className="w-3.5 h-3.5 text-green-400" />
                                        <span>ترکیبات</span>
                                    </div>
                                    <span className="text-sm font-black text-luxury-primary">۱۰۰٪ طبیعی</span>
                                </div>
                            </div>

                            {/* Sticky Footer - Centered */}
                            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col items-center gap-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-luxury-muted font-bold uppercase tracking-[0.2em] mb-3">قیمت نهایی</span>
                                    <div className="flex items-center gap-3 bg-white/5 px-8 py-4 rounded-[2rem] border border-white/5 shadow-2xl">
                                        <span className="text-5xl font-black text-luxury-primary font-vazir">{formatFa(product.price)}</span>
                                        <span className="text-sm text-luxury-violet font-bold bg-luxury-violet/10 px-3 py-1 rounded-lg">تومان</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAdd}
                                    className={`relative h-14 w-full rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl active:scale-95 ${added ? "bg-green-500" : "bg-luxury-violet hover:bg-luxury-violet/90 group/cta"
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {!added ? (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 text-white font-black"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                                <span>افزودن به سبد خرید</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex items-center gap-3 text-white font-black"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>اضافه شد</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
