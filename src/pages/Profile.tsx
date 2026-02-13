import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, ShoppingBag, Clock, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);

            // Fetch user orders
            const { data: ordersData, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id) // This assumes we have a user_id column
                .order("created_at", { ascending: false });

            if (!error) {
                setOrders(ordersData || []);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("از حساب خود خارج شدید");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-900 text-white font-vazir relative overflow-hidden">
            <Header />

            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] -left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[150px]" />
            </div>

            <main className="container-custom mx-auto pt-32 pb-20 px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent to-accent-hover p-1 shadow-xl mb-6">
                                    <div className="w-full h-full rounded-2xl bg-primary-900 flex items-center justify-center">
                                        <User className="w-10 h-10 text-accent" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-white">{user?.user_metadata?.full_name || "کاربر مورفو"}</h2>
                                <p className="text-white/40 text-sm mt-1">{user?.email}</p>

                                <div className="w-full h-px bg-white/10 my-8" />

                                <div className="w-full space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">تعداد سفارشات</span>
                                        <span className="font-black text-accent">{orders.length}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-10 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-danger/20 hover:border-danger/30 transition-all font-bold text-sm flex items-center justify-center gap-2 group"
                                >
                                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    خروج از حساب
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Order History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-2xl font-black text-white">تاریخچه سفارشات</h3>
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-20 text-center flex flex-col items-center shadow-2xl"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 text-white/10" />
                                </div>
                                <h4 className="text-xl font-bold text-white/40">هنوز سفارشی ثبت نکرده‌اید</h4>
                                <button
                                    onClick={() => navigate("/")}
                                    className="mt-8 px-10 py-4 rounded-full bg-accent text-primary-900 font-black text-sm shadow-glow-accent hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    <span>مشاهده منو و سفارش</span>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {orders.map((order, idx) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-[28px] p-6 hover:bg-white/10 transition-all group relative overflow-hidden flex flex-col sm:flex-row items-center gap-6"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-primary-900 border border-white/5 flex items-center justify-center text-accent font-black shadow-inner">
                                            #{order.id.toString().slice(-3)}
                                        </div>

                                        <div className="flex-1 text-center sm:text-right">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <span className="text-white font-bold text-lg">{formatPrice(order.total_price)} تومان</span>
                                                <span className={`text-[10px] w-fit px-3 py-1 rounded-full font-bold uppercase tracking-widest mx-auto sm:mr-auto sm:ml-0 ${order.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                                                        order.status === 'Cancelled' ? 'bg-danger/10 text-danger border border-danger/20' :
                                                            'bg-accent/10 text-accent border border-accent/20'
                                                    }`}>
                                                    {order.status === 'Completed' ? 'تکمیل شده' : order.status === 'Cancelled' ? 'لغو شده' : 'در جریان'}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-[11px]">ثبت شده در {new Date(order.created_at).toLocaleDateString('fa-IR')} ساعت {new Date(order.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>

                                        <button className="sm:opacity-0 group-hover:opacity-100 transition-all p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-accent/20">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
