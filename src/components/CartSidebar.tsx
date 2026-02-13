import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { formatPrice, parsePrice } from "../lib/utils";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

const CartSidebar = () => {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-morho-deep/95 border-l border-white/10 shadow-2xl z-50 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                    <ShoppingBag className="w-6 h-6 text-morho-gold" />
                                    سبد خرید
                                </h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4">
                                        <ShoppingBag className="w-16 h-16 opacity-20" />
                                        <p className="text-white font-medium">سبد خرید شما خالی است</p>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-xl object-cover"
                                            />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-extrabold text-white text-lg">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="font-bold text-morho-gold">
                                                        {formatPrice(parsePrice(item.price) * item.quantity)} <span className="text-xs text-white">تومان</span>
                                                    </span>
                                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/5 text-white">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
                                    <div className="flex justify-between items-center text-xl font-black text-white">
                                        <span>جمع کل:</span>
                                        <span className="text-morho-gold">
                                            {formatPrice(cartTotal.toLocaleString())} <span className="text-sm text-white">تومان</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full py-4 rounded-xl bg-gradient-accent font-bold text-lg hover:brightness-110 transition-all shadow-glow"
                                    >
                                        تکمیل سفارش
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
