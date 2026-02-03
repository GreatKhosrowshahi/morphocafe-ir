import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Header from "@/components/Header";

const AdminLogin = () => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.toLowerCase() === "morpho") {
            // Simple PIN check
            localStorage.setItem("morho_admin_auth", "true");
            navigate("/admin/dashboard");
        } else {
            setError("کد اشتباه است");
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-morho-dark text-foreground">
            <Header />

            {/* Background blobs */}
            <div className="fixed top-1/4 -right-1/4 w-96 h-96 rounded-full bg-morho-royal/20 blur-3xl pointer-events-none" />
            <div className="fixed bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-morho-lavender/20 blur-3xl pointer-events-none" />

            <div className="flex-1 flex items-center justify-center pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            ورود مدیریت
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 text-right">
                                کد امنیتی
                            </label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-morho-royal/30 border border-white/10 focus:border-morho-lavender/50 text-center text-2xl tracking-widest outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="••••••"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-accent font-semibold text-lg hover:brightness-110 transition-all shadow-glow mt-4"
                        >
                            ورود
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
