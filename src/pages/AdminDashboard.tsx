import { useState, useEffect } from "react";
import { supabase } from "@/shared/lib/supabase";
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    PieChart,
    LogOut,
    Plus,
    Trash2,
    Edit2,
    User,
    Search,
    Bell,
    Menu,
    TrendingUp,
    TrendingDown,
    Package,
    Activity,
    Star,
    CheckCircle2,
    Clock,
    Users,
    Zap,
    Filter,
    Save,
    X,
    Calculator,
    ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import ManualOrderEntry from "../components/admin/ManualOrderEntry";
import OrdersTable from "../components/admin/OrdersTable";
import AccountingStats from "../components/admin/AccountingStats";

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
    badge?: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = new URLSearchParams(location.search).get("tab") || "overview";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFeaturedEdit, setIsFeaturedEdit] = useState(false);
    const [featuredProduct, setFeaturedProduct] = useState({
        title: "ماکیاتو کارامل ویژه",
        subtitle: "نوشیدنی‌های گرم",
        price: "۸۵,۰۰۰",
        description: "ترکیب قهوه عربیکا با سیروپ کارامل خانگی و شیر مخملی",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510ef81a?q=80&w=1974&auto=format&fit=crop",
        badge: "ویژه امروز"
    });

    const emptyProduct: Product = {
        id: 0,
        name: "",
        description: "",
        price: "",
        category: "نوشیدنی‌های گرم",
        image: "",
        badge: ""
    };

    const [formData, setFormData] = useState<Product>(emptyProduct);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const categories = [
        { id: "all", label: "همه محصولات" },
        { id: "نوشیدنی‌های گرم", label: "نوشیدنی‌های گرم" },
        { id: "نوشیدنی‌های سرد", label: "نوشیدنی‌های سرد" },
        { id: "دسر و شیرینی", label: "دسر و شیرینی" },
        { id: "کیک‌ها", label: "کیک‌ها" }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, name, description, price, category, image, badge')
            .order('id', { ascending: true });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsFeaturedEdit(false);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData(emptyProduct);
        setIsFeaturedEdit(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) alert("خطا در حذف محصول");
            else fetchProducts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        if (isFeaturedEdit) {
            setFeaturedProduct({
                title: formData.name,
                subtitle: formData.category,
                price: formData.price,
                description: formData.description,
                image: formData.image,
                badge: formData.badge || "ویژه"
            });
            setIsModalOpen(false);
            setUploading(false);
            return;
        }

        if (editingProduct) {
            const { error } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    category: formData.category,
                    image: formData.image,
                    badge: formData.badge
                })
                .eq('id', editingProduct.id);

            if (error) alert("خطا در بروزرسانی");
            else {
                setIsModalOpen(false);
                fetchProducts();
            }
        } else {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    category: formData.category,
                    image: formData.image,
                    badge: formData.badge
                }]);

            if (error) alert("خطا در ثبت محصول جدید");
            else {
                setIsModalOpen(false);
                fetchProducts();
            }
        }
        setUploading(false);
    };

    const [dashStats, setDashStats] = useState({
        activeOrders: 0,
        customerCount: 0,
        growth: 0,
        systemStatus: "آنلاین"
    });
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === "overview") {
            fetchDashboardStats();
        }
    }, [activeTab]);

    const fetchDashboardStats = async () => {
        const { count: urgentOrders } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .in('status', ['Pending', 'Processing']);

        const { count: customers } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });

        const { data: allSales } = await supabase
            .from('orders')
            .select('total_price, created_at')
            .in('status', ['Paid', 'Completed']);

        let growth = 0;
        if (allSales && allSales.length > 0) {
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

            const currentMonthSales = allSales.filter(o => new Date(o.created_at) > lastMonth)
                .reduce((acc, o) => acc + parseInt(o.total_price.replace(/,/g, '')), 0);

            const totalSales = allSales.reduce((acc, o) => acc + parseInt(o.total_price.replace(/,/g, '')), 0);

            if (totalSales > 0) {
                growth = Math.round((currentMonthSales / totalSales) * 100);
            }
        }

        setDashStats({
            activeOrders: urgentOrders || 0,
            customerCount: customers || 0,
            growth: growth,
            systemStatus: "فعال"
        });

        const { data: latestOrders } = await supabase
            .from('orders')
            .select('customer_name, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        const activityLogs = (latestOrders || []).map(o => ({
            title: "سفارش جدید ثبت شد",
            desc: `${new Date(o.created_at).toLocaleTimeString('fa-IR')} - ${o.customer_name}`,
            icon: ShoppingCart
        }));

        setActivities(activityLogs);
    };

    const titleMap: Record<string, string> = {
        overview: "پیشخوان مدیریتی",
        products: "مدیریت منو و محصولات",
        orders: "بررسی سفارشات",
        accounting: "گزارشات فروش و آمار",
        pos: "ثبت سفارش دستی (POS)"
    };

    return (
        <AdminLayout title={titleMap[activeTab] || "داشبورد"}>
            <div className="space-y-6">

                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* Quick Stats Summary - Warm Aesthetic */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "سیستم مرکزی", value: dashStats.systemStatus, icon: Zap, status: "Connected" },
                                { title: "سهم فروش ماه", value: `+${dashStats.growth}٪`, icon: TrendingUp, status: "Revenue" },
                                { title: "سفارشات باز", value: `${dashStats.activeOrders} مورد`, icon: ShoppingCart, status: "Active" },
                                { title: "کل مشتریان", value: `${dashStats.customerCount} نفر`, icon: Users, status: "Registered" }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="p-8 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:shadow-accent/5 transition-all duration-500 animate-card-up stagger-${i + 1}"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-4 rounded-full bg-accent/10 text-accent">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border border-white/10 text-white/40">
                                            {stat.status}
                                        </span>
                                    </div>
                                    <h4 className="text-4xl font-extrabold tracking-tight mb-1 text-white">{stat.value}</h4>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                                        {stat.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Middle Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Activity - Warm Style */}
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[20px] shadow-2xl p-8 animate-card-up stagger-5">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                                        <h3 className="text-xl font-bold text-white tracking-tight">آخرین اقدامات</h3>
                                    </div>
                                    <button
                                        onClick={() => navigate("/admin/dashboard?tab=orders")}
                                        className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline"
                                    >
                                        مشاهده همه
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {activities.length > 0 ? activities.map((act, i) => (
                                        <div key={i} className="flex gap-4 items-center group cursor-pointer">
                                            <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-accent group-hover:text-primary-900 transition-all shrink-0 border border-white/5">
                                                <act.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{act.title}</h5>
                                                <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">{act.desc}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-white/20 text-center py-10 text-sm">فعالیتی ثبت نشده است</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick POS Action - Profile Style Gradient */}
                            <div className="p-10 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl animate-card-up stagger-6 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-[0.03] blur-3xl" />
                                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative transition-all group-hover:scale-110">
                                    <Calculator className="w-9 h-9 text-accent" />
                                </div>
                                <h3 className="text-3xl font-extrabold mb-3 tracking-tight text-white">ثبت سفارش سریع</h3>
                                <p className="text-xs text-white/40 leading-relaxed max-w-[240px] mb-8 font-bold uppercase">
                                    از سیستم ثبت سفارش دستی (POS) برای مشتریان حضوری استفاده کنید.
                                </p>
                                <button
                                    onClick={() => navigate("/admin/dashboard?tab=pos")}
                                    className="px-10 py-4 rounded-full bg-accent text-primary-900 font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-accent/20 active:scale-95"
                                >
                                    شروع سفارش جدید
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Products Tab Content */}
                {activeTab === "products" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Actions & Filters */}
                        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddNew}
                                    className="flex items-center justify-center gap-3 px-8 h-14 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] font-black shadow-lg shadow-glow hover:brightness-110 transition-all text-white group"
                                >
                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="uppercase tracking-widest text-xs">افزودن محصول</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setFormData({
                                            ...emptyProduct,
                                            name: featuredProduct.title,
                                            description: featuredProduct.description,
                                            price: featuredProduct.price,
                                            image: featuredProduct.image,
                                            badge: featuredProduct.badge,
                                            category: featuredProduct.subtitle
                                        });
                                        setIsFeaturedEdit(true);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-3 px-8 h-14 rounded-xl bg-white/5 border border-[var(--border)] text-[var(--gold)] font-black hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/50 transition-all group"
                                >
                                    <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="uppercase tracking-widest text-xs">ویرایش ویژه</span>
                                </button>
                            </div>

                            <div className="flex flex-1 gap-4 w-full lg:max-w-xl">
                                <div className="relative flex-1 group">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[var(--accent)] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="جستجوی محصول..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pr-12 pl-4 py-4 rounded-xl bg-white/5 border border-[var(--border)] focus:border-[var(--accent)]/50 outline-none transition-all text-sm font-bold text-white placeholder:text-white/20"
                                    />
                                </div>
                                <div className="relative group">
                                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="pr-12 pl-10 py-4 rounded-xl bg-white/5 border border-[var(--border)] focus:border-[var(--accent)]/50 outline-none transition-all text-sm appearance-none min-w-[160px] font-black text-white"
                                    >
                                        <option value="all">همه دسته‌ها</option>
                                        {categories.filter(c => c.id !== "all").map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products
                                .filter(p => !searchQuery || p.name.includes(searchQuery))
                                .filter(p => filterCategory === "all" || p.category === filterCategory)
                                .map((product) => (
                                    <div
                                        key={product.id}
                                        className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-accent/40 transition-all hover:bg-white/10 flex flex-col font-vazir shadow-2xl"
                                    >
                                        <div className="aspect-[16/10] w-full overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-60" />
                                            {product.badge && (
                                                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-primary-900 text-[10px] font-black uppercase tracking-widest shadow-lg">{product.badge}</span>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2 text-right">
                                                <h3 className="font-extrabold text-xl text-white">{product.name}</h3>
                                                <span className="text-accent font-black tracking-tight">
                                                    {product.price}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-sm line-clamp-2 mb-6 h-10 font-bold">{product.description}</p>

                                            <div className="mt-auto flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 text-white"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="w-12 h-12 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-all flex items-center justify-center border border-danger/20"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "orders" && <OrdersTable />}
                {activeTab === "accounting" && <AccountingStats />}
                {activeTab === "pos" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ManualOrderEntry />
                    </motion.div>
                )}

            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-primary-900 border border-white/10 rounded-2xl p-10 m-4 max-h-[90vh] overflow-y-auto relative shadow-2xl font-vazir"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute left-6 top-6 p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-widest text-center">
                                {isFeaturedEdit ? "ویرایش محصول ویژه" : editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">نام محصول</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold placeholder:text-white/10"
                                        placeholder="مثلاً: قهوه ترک ویژه"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">دسته بندی</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold appearance-none"
                                        >
                                            {categories.filter(c => c.id !== "all").map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-primary-900 text-white">{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">قیمت (تومان)</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold placeholder:text-white/10"
                                            placeholder="۸۵,۰۰۰"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">توضیحات</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold resize-none placeholder:text-white/10"
                                        placeholder="توضیحات کوتاه درباره محصول..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">لینک تصویر</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold placeholder:text-white/10"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mr-2">نشان اختصاصی (Badge)</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none transition-all font-bold placeholder:text-white/10"
                                        placeholder="ویژه امروز / جدید"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-5 rounded-xl bg-accent text-primary-900 font-black uppercase tracking-[0.2em] mt-4 hover:bg-accent/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-glow-accent"
                                >
                                    <Save className="w-5 h-5" />
                                    {uploading ? "در حال پردازش..." : "ذخیره تغییرات نهایی"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminDashboard;
