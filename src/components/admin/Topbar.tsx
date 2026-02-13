import { Search, Bell, Menu } from "lucide-react";

interface TopbarProps {
    title: string;
    onMenuClick: () => void;
}

const Topbar = ({ title, onMenuClick }: TopbarProps) => {
    return (
        <header className="fixed top-0 left-0 lg:right-[var(--sidebar-w)] right-0 h-[var(--header-h)] z-[60] bg-primary-900/60 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center border-[1.5px] border-white/10 rounded-full px-5 py-2 hover:border-accent/40 transition-colors">
                    <img src="/logotype.png"
                        className="h-8 w-auto object-contain"
                        alt="logo" loading="eager" draggable="false" />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -mr-2 bg-accent/10 hover:bg-accent/20 rounded-xl transition-colors lg:hidden"
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
                </div>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden sm:block">
                <div className="relative group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی سریع..."
                        className="w-full pr-12 pl-4 py-2.5 rounded-[12px] bg-white/5 border border-white/10 focus:border-accent/50 outline-none transition-all text-sm font-medium text-white placeholder:text-white/30"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group hover:bg-white/10">
                    <Bell className="w-5 h-5 text-white/50 group-hover:text-white" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-primary-900" />
                </button>
                <div className="h-8 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-3 pr-2">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        SA
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
