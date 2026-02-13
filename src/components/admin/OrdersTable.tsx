import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
    Search,
    Filter,
    Eye,
    ChevronLeft,
    RotateCcw,
    Printer,
    XCircle,
    User,
    ShoppingBag,
    CheckCircle,
    Trash2,
    Calendar,
    DollarSign,
    Clock
} from "lucide-react";
import { formatPrice, parsePrice } from "../../lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { printReceipt } from "./ReceiptPrinter";

interface Order {
    id: number;
    created_at: string;
    customer_name: string;
    total_price: string;
    status: string;
    type?: string;
    notes?: string;
    payment_method?: string;
    items: any[];
}

const OrdersTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handlePrint = () => {
        if (!selectedOrder) return;

        printReceipt({
            cafeName: "MORPHO",
            cafeLogoUrl: "/logopos.png",
            customerName: selectedOrder.customer_name,
            orderId: selectedOrder.id.toString().padStart(4, '0'),
            dateTime: new Date(selectedOrder.created_at).toLocaleString('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            items: selectedOrder.items,
            totalAmount: parsePrice(selectedOrder.total_price)
        });
    };

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            toast.error("خطا در دریافت سفارشات");
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        const channel = supabase
            .channel('orders_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
                toast.info("سفارش جدید دریافت شد");
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error("خطا در تغییر وضعیت");
        } else {
            toast.success(`وضعیت سفارش به ${newStatus} تغییر کرد`);
            fetchOrders();
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const config: Record<string, { label: string, color: string, dot: string }> = {
            'Pending': {
                label: 'در انتظار',
                color: 'bg-accent/10 text-accent border-accent/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
                dot: 'bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            },
            'Paid': {
                label: 'پرداخت شده',
                color: 'bg-success/10 text-success border-success/20 shadow-[0_0_15px_rgba(22,163,74,0.1)]',
                dot: 'bg-success shadow-[0_0_8px_rgba(22,163,74,0.5)]'
            },
            'Completed': {
                label: 'تحویل شده',
                color: 'bg-success text-white border-success shadow-[0_0_20px_rgba(22,163,74,0.2)]',
                dot: 'bg-white'
            },
            'Cancelled': {
                label: 'لغو شده',
                color: 'bg-danger/10 text-danger border-danger/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]',
                dot: 'bg-danger shadow-[0_0_8px_rgba(220,38,38,0.5)]'
            },
        };

        const { label, color, dot } = config[status] || config['Pending'];

        return (
            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 w-fit transition-all duration-300 backdrop-blur-sm ${color}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${dot}`} />
                {label}
            </div>
        );
    };

    const filteredOrders = orders.filter(o =>
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی مشتری یا شماره سفارش..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-14 pl-6 py-4 rounded-full bg-white/5 border border-white/10 focus:border-accent group-focus-within:ring-4 group-focus-within:ring-accent/10 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchOrders}
                        className="px-8 h-14 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase flex items-center gap-3"
                    >
                        <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        بروزرسانی
                    </button>
                    <button className="px-8 h-14 rounded-full bg-primary text-white font-bold uppercase text-xs hover:bg-primary-600 transition-all flex items-center gap-3 shadow-lg">
                        <Filter className="w-4 h-4 text-accent" />
                        فیلتر وضعیت
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-right font-vazir">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40">شماره</th>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40">مشتری</th>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40">مبلغ کل</th>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40">زمان ثبت</th>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40">وضعیت</th>
                                <th className="p-6 text-[11px] font-bold uppercase text-white/40 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest text-xs">در حال دریافت اطلاعات سفره‌ها...</td></tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr><td colSpan={6} className="p-20 text-center text-gray-400 flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-xs">هیچ سفارشی یافت نشد</span>
                                    </td></tr>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-white/5 transition-all group cursor-pointer"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <td className="p-6 text-sm font-bold text-white/20">#{order.id.toString().padStart(4, '0')}</td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors border border-white/5">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2 text-base">
                                                            {order.customer_name}
                                                            {order.type === 'Manual' && (
                                                                <span className="text-[9px] bg-accent text-primary-900 px-2 py-0.5 rounded-full font-bold uppercase">POS</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-white font-extrabold text-xl">{formatPrice(order.total_price)}</span>
                                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">تومان</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                                                    <span className="text-white">{new Date(order.created_at).toLocaleDateString('fa-IR')}</span>
                                                    <span className="opacity-60">{new Date(order.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="p-6"><StatusBadge status={order.status} /></td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-accent transition-all flex items-center justify-center border border-white/10"
                                                        title="مشاهده جزئیات"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {order.status === 'Pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'Paid'); }}
                                                            className="w-10 h-10 rounded-xl bg-success-light hover:bg-success/20 text-success transition-all flex items-center justify-center border border-success/20 shadow-lg shadow-success/10"
                                                            title="تایید پرداخت"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Slide-over - Warm Aesthetic */}
            <AnimatePresence>
                {selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[400]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-primary-900 border-l border-white/5 shadow-2xl z-[500] flex flex-col font-vazir"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-primary-900/80 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">جزئیات سفارش</h3>
                                        <span className="text-accent font-bold text-xl tracking-tighter">#{selectedOrder.id.toString().padStart(4, '0')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={selectedOrder.status} />
                                        {selectedOrder.type === 'Manual' && (
                                            <span className="text-[10px] bg-accent text-primary-900 px-3 py-1 rounded-full font-bold uppercase">POS OPERATED</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrint}
                                        className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all group flex items-center justify-center shadow-sm"
                                        title="چاپ فیش"
                                    >
                                        <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/50 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                {/* Customer Data Card */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest px-2">
                                        <User className="w-3.5 h-3.5" />
                                        مشخصات مشتری و ثبت
                                    </div>
                                    <div className="bg-white/5 rounded-[20px] p-8 border border-white/5 space-y-5 relative shadow-2xl group">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-white/40 text-xs font-bold uppercase">مشتری / میز</span>
                                            <span className="font-bold text-white text-lg group-hover:text-accent transition-colors">{selectedOrder.customer_name}</span>
                                        </div>
                                        <div className="h-px bg-white/5 w-full" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/40 text-xs font-bold uppercase">زمان دقیق ثبت</span>
                                            <div className="text-left flex flex-col items-end">
                                                <p className="font-bold text-white text-sm">{new Date(selectedOrder.created_at).toLocaleDateString('fa-IR')}</p>
                                                <p className="text-[10px] text-accent font-bold mt-1">{new Date(selectedOrder.created_at).toLocaleTimeString('fa-IR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Items List Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            اقلام فاکتور
                                        </div>
                                        <span className="text-[9px] font-bold tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full text-white/50 border border-white/5 shadow-sm">
                                            {Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0} ITEMS
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex gap-5 p-5 bg-white/5 hover:bg-white/10 rounded-[20px] border border-white/5 shadow-2xl transition-all group"
                                            >
                                                <div className="w-20 h-20 bg-primary-900 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                                                    {item.image ? (
                                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                    ) : (
                                                        <ShoppingBag className="w-8 h-8 text-white/10" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <div className="flex justify-between items-start mb-2 gap-2">
                                                        <span className="font-bold text-lg text-white truncate group-hover:text-accent transition-colors">{item.name}</span>
                                                        <span className="bg-accent text-primary-900 text-[10px] px-2 py-1 rounded-lg font-bold shadow-md">
                                                            {item.quantity}×
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 opacity-40">
                                                            <span className="text-[9px] font-bold uppercase text-white">واحد:</span>
                                                            <span className="text-xs font-bold text-white">{formatPrice(item.price)}</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-1.5 text-white">
                                                            <span className="text-xl font-black text-accent">
                                                                {formatPrice(parsePrice(item.price) * item.quantity)}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase opacity-60">تومان</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Action Footer */}
                            <div className="p-8 border-t border-white/5 bg-primary-900/90 backdrop-blur-2xl space-y-6">
                                <div className="flex justify-between items-center group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">جمع کل فاکتور</p>
                                        <p className="text-xs font-bold text-white/30 uppercase">Grand Total Amount</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-extrabold text-white drop-shadow-sm">{formatPrice(selectedOrder.total_price)}</span>
                                        <span className="text-[10px] font-bold text-white/40 mr-2 uppercase">تومان</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {selectedOrder.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => { updateStatus(selectedOrder.id, 'Cancelled'); setSelectedOrder(null); }}
                                                className="py-5 rounded-full bg-white/5 text-white/40 hover:text-danger border border-white/10 hover:border-danger/30 font-bold text-[11px] uppercase transition-all flex items-center justify-center gap-3 group"
                                            >
                                                <XCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                لغو سفارش
                                            </button>
                                            <button
                                                onClick={() => { updateStatus(selectedOrder.id, 'Paid'); setSelectedOrder(null); }}
                                                className="py-5 rounded-full bg-accent text-primary-900 font-bold text-[11px] uppercase hover:bg-accent/80 transition-all shadow-glow-accent flex items-center justify-center gap-3 group"
                                            >
                                                <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                تأیید و پرداخت
                                            </button>
                                        </>
                                    )}
                                    {selectedOrder.status === 'Paid' && (
                                        <button
                                            onClick={() => { updateStatus(selectedOrder.id, 'Completed'); setSelectedOrder(null); }}
                                            className="col-span-2 py-6 rounded-full bg-accent text-primary-900 font-bold text-xs uppercase hover:bg-accent/80 transition-all shadow-xl flex items-center justify-center gap-3 group"
                                        >
                                            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                                            تحویل و تکمیل نهایی
                                        </button>
                                    )}
                                    {(selectedOrder.status === 'Completed' || selectedOrder.status === 'Cancelled') && (
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="col-span-2 py-6 rounded-full bg-white/5 text-white/50 hover:text-white border border-white/10 font-bold text-xs uppercase transition-all"
                                        >
                                            بستـن پـنـل
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Receipt printing handled by ReceiptPrinter utility */}
        </div>
    );
};

export default OrdersTable;
