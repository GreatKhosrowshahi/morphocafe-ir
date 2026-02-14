import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { supabase } from "@/shared/lib/supabase";
import { toast } from "../components/ui/Toast/toast";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
    const { items, cartTotal, clearCart, setIsCartOpen } = useCart();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                if (user.user_metadata?.full_name) {
                    setName(user.user_metadata.full_name);
                }
            }
        };
        if (isOpen) getUser();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: name,
                        total_price: cartTotal.toLocaleString(),
                        status: 'Pending',
                        items: items, // Storing JSON of items
                        user_id: userId // Link to auth.users
                    }
                ]);

            if (error) throw error;

            setSuccess(true);
            clearCart();
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setIsCartOpen(false);
                setName("");
            }, 3000);
            toast.success("سفارش شما با موفقیت ثبت شد!");

        } catch (error) {
            console.error("Order error:", error);
            toast.error("خطا در ثبت سفارش. لطفا دوباره تلاش کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md bg-morho-deep border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                    >
                        {success ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-green-400">سفارش ثبت شد!</h3>
                                <p className="text-muted-foreground">سفارش شما به کافه‌من ارسال شد.<br />لطفا منتظر بمانید.</p>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h2 className="text-2xl font-bold mb-6 text-center">نهایی کردن سفارش</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>تعداد اقلام:</span>
                                            <span>{items.reduce((acc, item) => acc + item.quantity, 0)} عدد</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
                                            <span>مبلغ قابل پرداخت:</span>
                                            <span className="text-morho-gold">{cartTotal.toLocaleString()} تومان</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-2 text-muted-foreground">نام شما (یا شماره میز)</label>
                                        <input
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="مثلا: علی محمدی - میز ۴"
                                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-morho-gold outline-none transition-colors text-white placeholder:text-white/40"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl bg-gradient-accent font-bold text-lg hover:brightness-110 transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "در حال ثبت..." : "ثبت سفارش (پرداخت حضوری)"}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
