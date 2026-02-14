import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowLeft, Coffee } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import CartItem from "./CartItem";
import CheckoutModal from "./CheckoutModal";

const CartSidebar = () => {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Improved Glass Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                        />

                        {/* Premium Sidebar Design */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-morho-deep/95 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[70] flex flex-col font-vazir overflow-hidden"
                        >
                            {/* Decorative Background Accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-morho-gold/5 blur-[100px] pointer-events-none" />

                            {/* Header Section */}
                            <div className="relative p-8 pb-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02] backdrop-blur-sm">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                        <ShoppingBag className="w-7 h-7 text-morho-gold" />
                                        سبد خرید
                                    </h2>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mr-10">
                                        Morpho Experience
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {items.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="p-3 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all active:scale-90"
                                            title="پاک کردن همه"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl transition-all active:scale-95 group"
                                    >
                                        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Areas */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center space-y-8"
                                    >
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                                <Coffee className="w-16 h-16 text-white/10 animate-pulse" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-morho-gold/10 border border-morho-gold/20 flex items-center justify-center backdrop-blur-md">
                                                <ShoppingBag className="w-6 h-6 text-morho-gold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white">هنوز چیزی انتخاب نکردی</h3>
                                            <p className="text-white/40 text-sm max-w-[200px] leading-relaxed mx-auto">
                                                عطر قهوه‌های امروز رو از دست نده! سری به منوی جذاب ما بزن.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="px-8 py-4 rounded-2xl bg-white text-morho-deep font-black text-sm uppercase tracking-widest hover:bg-morho-gold hover:text-white transition-all active:scale-95"
                                        >
                                            بازگشت به منو
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2 mb-2">
                                            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">لیست انتخابی شما</span>
                                            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{items.length} آیتم</span>
                                        </div>
                                        <AnimatePresence mode="popLayout">
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                >
                                                    <CartItem
                                                        item={item}
                                                        onUpdateQuantity={updateQuantity}
                                                        onRemove={removeFromCart}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Summary - Sticky Header Style */}
                            {items.length > 0 && (
                                <div className="p-8 space-y-6 bg-white/[0.03] backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm text-white/40 font-bold">
                                            <span>جمع اقلام:</span>
                                            <span className="text-white tabular-nums">{cartTotal.toLocaleString()} تومان</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-white/40 font-bold">
                                            <span>سرویس و مالیات:</span>
                                            <span className="text-green-400">رایگان</span>
                                        </div>
                                        <div className="h-px bg-white/5 w-full my-2" />
                                        <div className="flex justify-between items-center text-2xl font-black text-white">
                                            <span>کل فاکتور:</span>
                                            <span className="text-morho-gold drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                                                {formatPrice(cartTotal.toLocaleString())} <span className="text-xs font-bold text-white/60">تومان</span>
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full py-5 rounded-[1.25rem] bg-gradient-accent text-white font-black text-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-3 group"
                                    >
                                        تکمیل و ثبت نهایی
                                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </>
    );
};

export default CartSidebar;
