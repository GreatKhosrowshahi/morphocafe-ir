import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    PieChart,
    LogOut,
    User,
    ChevronLeft,
    Calculator
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = new URLSearchParams(location.search).get("tab") || "overview";

    const menuItems = [
        { id: "overview", label: "پیشخوان", icon: LayoutDashboard, path: "/admin/dashboard?tab=overview" },
        { id: "pos", label: "ثبت سفارش دستی", icon: Calculator, path: "/admin/dashboard?tab=pos" },
        { id: "products", label: "محصولات", icon: Settings, path: "/admin/dashboard?tab=products" },
        { id: "orders", label: "سفارشات", icon: ShoppingBag, path: "/admin/dashboard?tab=orders" },
        { id: "accounting", label: "حسابداری", icon: PieChart, path: "/admin/dashboard?tab=accounting" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("morho_admin_auth");
        navigate("/admin");
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-primary-900 border-l border-white/5 relative shadow-2xl">
            {/* Minimal Brand Section */}
            <div className="h-16 flex items-center px-8 border-b border-white/5">
                <div className="w-8 h-8 rounded-full border-[1.5px] border-accent flex items-center justify-center mr-0 ml-3">
                    <span className="font-bold text-accent text-xs">M</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-white">
                    Morpho<span className="text-accent">Admin</span>
                </span>
            </div>

            {/* Navigation Pill Container */}
            <div className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar font-vazir">
                <div className="bg-white/5 rounded-[32px] p-2 border border-white/5 shadow-sm space-y-1">
                    {menuItems.map((item) => {
                        const isActive = currentTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`w-full group relative flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-300 ${isActive
                                    ? "text-primary-900 bg-accent shadow-lg shadow-accent/20"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-white/5 font-vazir">
                <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 shadow-sm mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-inner">
                        <User className="w-5 h-5 text-primary-900" />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                        <p className="text-xs font-bold text-white truncate">مدیر سیستم</p>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 rounded-full text-white/70 hover:bg-danger/20 hover:text-danger hover:border-danger/30 transition-all text-sm font-bold border border-white/10"
                >
                    <LogOut className="w-4 h-4" />
                    <span>خروج از حساب</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Variable Sidebar (Hidden on mobile, controlled by parent layout) */}
            <aside className="hidden lg:block fixed right-0 top-0 bottom-0 w-[var(--sidebar-w)] z-[50]">
                {sidebarContent}
            </aside>

            {/* Mobile/Tablet Sidebar (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 right-0 w-[var(--sidebar-w)] shadow-2xl"
                        >
                            {sidebarContent}
                            <button
                                onClick={onClose}
                                className="absolute -left-12 top-4 w-10 h-10 rounded-full bg-[#161B27] border border-white/5 flex items-center justify-center text-white lg:hidden shadow-xl"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
