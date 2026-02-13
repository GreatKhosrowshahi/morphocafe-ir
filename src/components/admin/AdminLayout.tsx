import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

/**
 * AdminLayout Redesign
 * 
 * Implements a fixed sidebar (right) and topbar with independent main scrolling.
 * Adheres to strict RTL layout requirements.
 */
const AdminLayout = ({ children, title }: AdminLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-primary-900 text-white font-vazir relative overflow-hidden selection:bg-accent selection:text-white">
            {/* Background Mesh Gradient Layers - Professional Dark Navy Aesthetic */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-primary-900" />
                <div className="absolute top-0 left-0 w-[70vw] h-[70vh] bg-[radial-gradient(circle_at_top_left,rgba(8,44,135,0.15),transparent_70%)] opacity-100" />
                <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.05),transparent_70%)] opacity-100" />
            </div>

            {/* Subtle Grain Overlay for texture */}
            <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* 1. Sidebar (Fixed Right) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* 2. Topbar (Fixed Top, shifts according to Sidebar) */}
            <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />

            {/* 3. Main Content Area */}
            <main className="lg:mr-[var(--sidebar-w)] mr-0 pt-[var(--header-h)] h-screen overflow-hidden flex flex-col relative">

                {/* Independent Scroll Container */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar scroll-smooth">
                    {/* Content Wrapper */}
                    <div className="relative max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="mt-20 pt-10 border-t border-[var(--border)] text-center px-1">
                        <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
                            Morpho Café & Patisserie — Smart Admin Dashboard v2.0
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
