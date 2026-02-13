import { useState, useMemo } from "react";
import { useMenu, Product } from "../../contexts/MenuContext";
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    User,
    Calculator,
    Printer,
    RotateCcw,
    CheckCircle2,
    FileText,
    CreditCard,
    Banknote,
    ChevronDown
} from "lucide-react";
import { formatPrice, parsePrice } from "../../lib/utils";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { printReceipt } from "./ReceiptPrinter";

const ManualOrderEntry = () => {
    const { products, categories } = useMenu();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash'>('Cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastOrder, setLastOrder] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const totalPrice = cart.reduce((sum, item) => {
        const price = parsePrice(item.product.price);
        return sum + (price * item.quantity);
    }, 0);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (cart.length === 0) {
            toast.error("لطفاً حداقل یک محصول را انتخاب کنید");
            return;
        }

        const loadingToast = toast.loading("در حال ثبت نهایی سفارش...");
        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: customerName || "مشتری حضوری",
                total_price: totalPrice.toString(),
                status: 'Paid',
                payment_method: paymentMethod,
                type: 'Manual', // Distinguish from online orders
                notes: orderNotes,
                items: cart.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image
                })),
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (error) throw error;

            const newOrder = data?.[0] || { ...orderData, id: 'جدید' };
            setLastOrder(newOrder);
            setShowSuccess(true);
            setCart([]);
            setCustomerName("");
            setOrderNotes("");

            toast.success("سفارش با موفقیت ثبت شد");

            // Auto-print receipt
            setTimeout(() => {
                try {
                    printReceipt({
                        cafeName: "MORPHO",
                        cafeLogoUrl: "/logopos.png",
                        customerName: newOrder.customer_name,
                        orderId: (newOrder.id || '0').toString().padStart(4, '0'),
                        dateTime: new Date(newOrder.created_at).toLocaleString('fa-IR'),
                        items: newOrder.items || [],
                        totalAmount: parsePrice(newOrder.total_price)
                    });
                } catch (err) {
                    console.error("Print Error:", err);
                }
            }, 500);

        } catch (error: any) {
            console.error("Submit Error:", error);
            toast.error("خطا در ثبت سفارش: " + error.message);
        } finally {
            setIsSubmitting(false);
            toast.dismiss(loadingToast);
        }
    };

    if (showSuccess && lastOrder) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-10 animate-in zoom-in duration-500 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl m-10 relative overflow-hidden font-vazir">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-[0.05] blur-[100px]" />
                <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center text-success shadow-xl border border-success/20 relative">
                    <CheckCircle2 className="w-12 h-12 relative z-10" />
                </div>
                <div className="space-y-3 relative z-10">
                    <h2 className="text-4xl font-extrabold text-white px-2 tracking-tight">سفارش با موفقیت ثبت شد</h2>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">شماره پیگیری: <span className="text-accent">#{lastOrder.id.toString().padStart(4, '0')}</span></p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 pt-6 relative z-10">
                    <button
                        onClick={() => { setShowSuccess(false); setLastOrder(null); }}
                        className="px-10 py-5 rounded-full bg-accent text-primary-900 font-bold uppercase text-xs hover:scale-105 transition-all shadow-lg shadow-accent/20 flex items-center gap-3"
                    >
                        <Plus className="w-4 h-4" />
                        سفارش جدید
                    </button>
                    <button
                        onClick={() => {
                            printReceipt({
                                cafeName: "MORPHO",
                                cafeLogoUrl: "/logopos.png",
                                customerName: lastOrder.customer_name,
                                orderId: lastOrder.id.toString().padStart(4, '0'),
                                dateTime: new Date(lastOrder.created_at).toLocaleString('fa-IR'),
                                items: lastOrder.items || [],
                                totalAmount: parsePrice(lastOrder.total_price)
                            });
                        }}
                        className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold uppercase text-xs hover:bg-white/10 transition-all flex items-center gap-3 shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        چاپ مجدد رسید
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[650px]">
            {/* Left Column: Menu Items Selection */}
            <div className="lg:col-span-8 flex flex-col gap-8 overflow-hidden">
                {/* Search & Categories */}
                <div className="space-y-6 shrink-0">
                    <div className="relative group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="جستجوی در محصولات منو..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-14 pl-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30 font-vazir"
                        />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide font-vazir">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-8 py-3.5 rounded-full text-[11px] font-bold uppercase transition-all whitespace-nowrap border ${selectedCategory === "all" ? "bg-accent text-primary-900 border-accent shadow-lg shadow-accent/10" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 shadow-sm"}`}
                        >
                            همه موارد
                        </button>
                        {categories.filter(c => c.id !== "all" && c.id !== "favorites").map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-8 py-3.5 rounded-full text-[11px] font-bold uppercase transition-all whitespace-nowrap border ${selectedCategory === cat.id ? "bg-accent text-primary-900 border-accent shadow-lg shadow-accent/10" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 shadow-sm"}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, i) => (
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`group relative flex flex-col bg-white/5 border border-white/10 rounded-[20px] overflow-hidden hover:border-accent/40 transition-all text-right shadow-2xl hover:shadow-accent/5 animate-card-up stagger-${(i % 8) + 1} font-vazir`}
                            >
                                <div className="aspect-[1/1] w-full relative overflow-hidden bg-primary-900">
                                    <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
                                </div>
                                <div className="p-4 space-y-1">
                                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                                    <p className="text-[11px] font-bold text-accent tracking-tight">
                                        {product.price} <span className="text-[8px] opacity-60 tracking-tighter">تومان</span>
                                    </p>
                                </div>
                                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-accent text-primary-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                                    <Plus className="w-4 h-4" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Order Cart & Checkout */}
            <div className="lg:col-span-4 flex flex-col bg-primary-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative font-vazir">
                {/* Header */}
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary-900 shadow-lg">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">پنل فروش</h3>
                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">فاکتور جاری</p>
                        </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[9px] font-bold border border-accent/20">
                        {cart.length} مورد
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white/5">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/10 gap-6">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-sm">
                                <Calculator className="w-10 h-10 stroke-[1px] opacity-20" />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-center">انتخاب محصول<br />برای شروع</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item.product.id}
                                    className="p-4 bg-white/5 border border-white/5 rounded-[20px] flex items-center gap-4 group shadow-lg hover:shadow-accent/5 transition-all"
                                >
                                    <img src={item.product.image} className="w-14 h-14 rounded-xl object-cover shrink-0" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">{item.product.name}</h5>
                                        <p className="text-[11px] font-bold text-accent tracking-tight mt-1">
                                            {formatPrice(parsePrice(item.product.price) * item.quantity)} <span className="text-[8px] opacity-60 uppercase tracking-tighter">تومان</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white shadow-sm active:scale-90 transition-transform"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white shadow-sm active:scale-90 transition-transform"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(item.product.id); }}
                                            className="px-3 py-1 rounded-full bg-danger/10 text-[9px] font-bold text-danger uppercase tracking-widest hover:bg-danger/20 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer / Summary */}
                <div className="p-8 border-t border-white/5 bg-white/5 space-y-8">
                    {/* Customer Info Form */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="نام مشتری / شماره میز..."
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full pr-12 pl-4 py-3.5 rounded-full bg-white/5 border border-white/10 focus:border-accent outline-none text-xs font-bold text-white transition-all placeholder:text-white/20 shadow-sm font-vazir"
                            />
                        </div>
                        <div className="relative group">
                            <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="یادداشت اختصاصی سفارش..."
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                className="w-full pr-12 pl-4 py-3.5 rounded-full bg-white/5 border border-white/10 focus:border-accent outline-none text-xs font-bold text-white transition-all placeholder:text-white/20 shadow-sm font-vazir"
                            />
                        </div>

                        {/* Payment Toggle */}
                        <div className="flex p-1 rounded-full bg-white/5 border border-white/10">
                            <button
                                onClick={() => setPaymentMethod('Cash')}
                                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-full text-[10px] font-bold uppercase transition-all ${paymentMethod === 'Cash' ? 'bg-accent text-primary-900 shadow-md' : 'text-white/40 hover:text-white'}`}
                            >
                                <Banknote className="w-4 h-4" />
                                نقدی
                            </button>
                            <button
                                onClick={() => setPaymentMethod('Card')}
                                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-full text-[10px] font-bold uppercase transition-all ${paymentMethod === 'Card' ? 'bg-accent text-primary-900 shadow-md' : 'text-white/40 hover:text-white'}`}
                            >
                                <CreditCard className="w-4 h-4" />
                                کارت
                            </button>
                        </div>
                    </div>

                    {/* Total & Submit */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">مبلغ قابل پرداخت</span>
                                <span className="text-xs font-bold text-white uppercase">Total Balance</span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-extrabold text-white drop-shadow-sm">{formatPrice(totalPrice.toString())}</span>
                                <span className="text-[10px] text-white/40 px-2 font-bold uppercase">تومان</span>
                            </div>
                        </div>
                        <button
                            disabled={isSubmitting || cart.length === 0}
                            onClick={() => handleSubmit()}
                            className="w-full py-6 rounded-full bg-accent text-primary-900 font-bold text-xs uppercase tracking-widest hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-primary-900/30 border-t-primary-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Calculator className="w-5 h-5 text-primary-900" />
                                    <span>ثبت نهایی و پرداخت</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualOrderEntry;
