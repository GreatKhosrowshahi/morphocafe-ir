import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, User, CreditCard, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { supabase } from "@/shared/lib/supabase";
import { toast } from "@/components/ui/Toast/toast";

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
                        items: items,
                        user_id: userId
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg bg-morho-deep border border-white/10 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl"
                    >
                        {success ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white">سفارش ثبت شد!</h3>
                                    <p className="text-white/40 text-lg font-medium">سفارش شما به کانتر کافه ارسال شد.<br />لطفا منتظر بمانید.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 left-6 p-3 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 active:scale-90"
                                >
                                    <X className="w-5 h-5 text-white/50" />
                                </button>

                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-black text-white mb-3">نهایی کردن سفارش</h2>
                                    <p className="text-white/40 text-sm">لطفا اطلاعات خود را برای ثبت فاکتور تایید کنید</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-inner">
                                        <div className="flex justify-between text-sm text-white/40 font-bold uppercase tracking-wider">
                                            <span>تعداد اقلام انتخابی:</span>
                                            <span className="text-white">{items.reduce((acc, item) => acc + item.quantity, 0)} عدد</span>
                                        </div>
                                        <div className="h-px bg-white/10 w-full" />
                                        <div className="flex justify-between items-center font-black text-2xl">
                                            <span className="text-white/60 text-lg">مبلغ قابل پرداخت:</span>
                                            <span className="text-morho-gold drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                                {cartTotal.toLocaleString()} <span className="text-sm font-bold text-white/40">تومان</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-black uppercase text-white/40 tracking-widest mr-2">
                                            <User className="w-3.5 h-3.5 text-morho-gold" />
                                            نام شما یا شماره میز
                                        </label>
                                        <input
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="مثلا: علی رضایی - میز ۷"
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-morho-gold outline-none transition-all text-white placeholder:text-white/20 font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 rounded-2xl bg-gradient-accent text-white font-black text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            {loading ? "در حال ارسال..." : "تایید و ثبت نهایی"}
                                        </button>
                                        <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                            پرداخت به صورت حضوری در کانتر انجام می‌شود
                                        </p>
                                    </div>
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
