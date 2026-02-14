import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { parsePrice, formatPrice } from "../../lib/utils";
import {
    TrendingUp,
    ShoppingBag,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Zap,
    Users,
    Activity,
    Calculator
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Order {
    id: number;
    created_at: string;
    total_price: string;
    status: string;
    customer_name: string;
    type?: string;
}

const formatToman = (price: number) => {
    return price.toLocaleString('fa-IR');
};

const AccountingStats = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        todaySales: 0,
        todayOrders: 0,
        averageOrderValue: 0,
        manualOrders: 0,
        onlineOrders: 0,
        orderTrend: 0,
        manualPercentage: 0,
        onlinePercentage: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [weeklySales, setWeeklySales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !orders) {
            setLoading(false);
            return;
        }

        const validOrders = orders.filter(o => ['Paid', 'Completed'].includes(o.status));
        const today = new Date().toISOString().split('T')[0];

        let totalSum = 0;
        let todaySum = 0;
        let todayCount = 0;
        let manualCount = 0;
        let onlineCount = 0;

        const days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().split('T')[0];
            return {
                date: iso,
                display: ['ش', '۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج'][(d.getDay() + 1) % 7]
            };
        }).reverse();

        const chartData = days.map(d => ({ name: d.display, sales: 0, date: d.date }));

        validOrders.forEach(order => {
            const price = parsePrice(order.total_price);
            totalSum += price;

            const orderDate = order.created_at.split('T')[0];
            if (orderDate === today) {
                todaySum += price;
                todayCount++;
            }

            const chartItem = chartData.find(d => d.date === orderDate);
            if (chartItem) chartItem.sales += price;

            if (order.type === 'Manual') {
                manualCount++;
            } else {
                onlineCount++;
            }
        });

        // Calculate trends (Current 7 days vs Previous 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const fourteenDaysAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

        const currentWeekOrders = validOrders.filter(o => new Date(o.created_at) > sevenDaysAgo).length;
        const previousWeekOrders = validOrders.filter(o => {
            const date = new Date(o.created_at);
            return date > fourteenDaysAgo && date <= sevenDaysAgo;
        }).length;

        let orderTrend = 0;
        if (previousWeekOrders > 0) {
            orderTrend = Math.round(((currentWeekOrders - previousWeekOrders) / previousWeekOrders) * 100);
        } else if (currentWeekOrders > 0) {
            orderTrend = 100;
        }

        setStats({
            totalSales: totalSum,
            totalOrders: validOrders.length,
            todaySales: todaySum,
            todayOrders: todayCount,
            averageOrderValue: validOrders.length > 0 ? Math.round(totalSum / validOrders.length) : 0,
            manualOrders: manualCount,
            onlineOrders: onlineCount,
            orderTrend: orderTrend,
            manualPercentage: validOrders.length > 0 ? Math.round((manualCount / validOrders.length) * 100) : 0,
            onlinePercentage: validOrders.length > 0 ? Math.round((onlineCount / validOrders.length) * 100) : 0,
        });
        setRecentOrders(validOrders.slice(0, 10));
        setWeeklySales(chartData);
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
        const channel = supabase
            .channel('accounting_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend, subValue, percentage }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl group hover:border-accent/40 transition-all duration-500 relative overflow-hidden font-vazir"
        >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity" />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend !== undefined && (
                        <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${trend >= 0 ? 'bg-success-light text-success' : 'bg-danger-light text-danger'} flex items-center gap-1 border border-current/10 uppercase`}>
                                {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(trend)}%
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold tracking-tight text-white">{value}</h3>
                        {subValue && <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{subValue}</span>}
                    </div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{title}</p>
                </div>

                {percentage !== undefined && (
                    <div className="mt-8 space-y-2">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full bg-accent rounded-full shadow-[0_0_12px_rgba(245,158,11,0.2)]`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse text-xs">در حال تحلیل گزارشات مالی...</div>;

    return (
        <div className="space-y-10">
            {/* KPI Stats - Warm Aesthetic */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="درآمد ناخالص"
                    value={formatToman(stats.totalSales)}
                    subValue="تومان"
                    icon={DollarSign}
                    color="text-success"
                    percentage={Math.min(100, Math.round((stats.totalSales / 10000000) * 100))} // Target: 10M Toman
                />
                <StatCard
                    title="حجم سفارشات"
                    value={stats.totalOrders}
                    subValue="سفارش"
                    icon={ShoppingBag}
                    color="text-accent"
                    trend={stats.orderTrend}
                    percentage={Math.min(100, Math.round((stats.totalOrders / 500) * 100))} // Target: 500 orders
                />
                <StatCard
                    title="عملیات حضوری (POS)"
                    value={stats.manualOrders}
                    subValue="مورد"
                    icon={Calculator}
                    color="text-accent"
                    percentage={stats.manualPercentage}
                />
                <StatCard
                    title="سفارشات آنلاین"
                    value={stats.onlineOrders}
                    subValue="مورد"
                    icon={Zap}
                    color="text-accent"
                    percentage={stats.onlinePercentage}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart - Dark Aesthetic */}
                <div className="lg:col-span-2 p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/[0.02] blur-[100px] -mr-32 -mt-32 group-hover:bg-accent/[0.05] transition-colors duration-1000" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-extrabold text-white px-1 tracking-tight">تحلیل عملکرد هفتگی</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-1 mt-2">گزارش فروش و روند رشد</p>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-accent shadow-sm">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="h-80 w-full font-vazir">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklySales}>
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700 }}
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0F172A',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                        }}
                                        cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '5 5' }}
                                        itemStyle={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}
                                        formatter={(value: any) => [`${formatToman(value)} تومان`, 'مبلغ']}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#F59E0B"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#goldGradient)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Mini List - Dark Aesthetic */}
                <div className="p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden relative">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-2 h-8 bg-accent rounded-full shadow-glow" />
                        <h3 className="text-xl font-extrabold text-white tracking-tight">تراکنش‌های اخیر</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                        {recentOrders.length === 0 ? (
                            <div className="text-center text-white/20 py-20 text-[10px] font-bold uppercase tracking-widest">موردی یافت نشد</div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold shadow-sm border border-white/5 ${order.status === 'Paid' ? 'bg-white/10 text-accent' : 'bg-success/10 text-success'}`}>
                                            {order.type === 'Manual' ? 'POS' : 'WEB'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-white truncate group-hover:text-accent transition-colors">{order.customer_name}</p>
                                            <p className="text-[10px] text-white/40 font-bold mt-1 opacity-70">{new Date(order.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-extrabold text-white text-base tracking-tight">{formatPrice(order.total_price)}</p>
                                        <p className="text-[8px] text-white/40 font-bold uppercase mt-0.5">تومان</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="w-full mt-10 py-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
                        مشاهده تمامی گزارشات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountingStats;
