import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Key } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                toast.success("خوش آمدید، مدیر");
                navigate("/admin/dashboard");
            }
        } catch (error: any) {
            toast.error(error.message || "خطا در ورود");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-primary-900 text-white font-vazir">
            <Header />

            {/* Background blobs */}
            <div className="fixed top-1/4 -right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
            <div className="fixed bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            <div className="flex-1 flex items-center justify-center pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative z-10 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shadow-lg border border-accent/20 mb-6">
                            <Lock className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            ورود مدیریت
                        </h1>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">Admin Portal Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest text-right mr-1">
                                پست الکترونیک
                            </label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent outline-none transition-all text-white placeholder:text-white/10"
                                    placeholder="admin@morphocafe.ir"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest text-right mr-1">
                                رمز عبور
                            </label>
                            <div className="relative group">
                                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent outline-none transition-all text-white placeholder:text-white/10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl bg-accent text-primary-900 font-extrabold text-lg hover:bg-accent/80 transition-all shadow-glow-accent mt-6 uppercase tracking-widest flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "ورود به سیستم"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
