import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'customer'
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                toast.success("ثبت‌نام با موفقیت انجام شد. خوش آمدید!");
                navigate("/");
            }
        } catch (error: any) {
            toast.error(error.message || "خطا در ثبت‌نام");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-primary-900 text-white font-vazir">
            <Header />

            {/* Background blobs */}
            <div className="fixed top-1/4 -right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none opacity-50" />
            <div className="fixed bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none opacity-50" />

            <div className="flex-1 flex items-center justify-center pt-20 px-4 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 relative z-10 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg mb-6">
                            <UserPlus className="w-8 h-8 text-primary-900" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">ساخت حساب کاربری</h1>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">Join the Morpho Community</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest text-right mr-2">نام و نام خانوادگی</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="نام خود را وارد کنید"
                                    className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent/50 outline-none transition-all text-white placeholder:text-white/10 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest text-right mr-2">ایمیل</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent/50 outline-none transition-all text-white placeholder:text-white/10 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest text-right mr-2">رمز عبور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="حداقل ۶ کاراکتر"
                                    minLength={6}
                                    className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent/50 outline-none transition-all text-white placeholder:text-white/10 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-accent text-primary-900 font-extrabold text-lg hover:bg-accent/80 transition-all shadow-glow-accent mt-6 uppercase tracking-widest flex items-center justify-center group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ثبت‌نام و ایجاد حساب</span>
                                    <ArrowRight className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm">
                            قبلاً ثبت‌نام کرده‌اید؟{" "}
                            <Link to="/login" className="text-accent font-bold hover:underline">وارد شوید</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
