import { motion } from "framer-motion";
import { Coffee, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";

const Header = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      navigate("/admin");
      setClickCount(0);
    }

    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/5 shadow-lg support-backdrop-blur:bg-white/10"
    >
      <div className="mobile-container mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 px-4">
          {/* Brand - Enhanced */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={handleLogoClick}
          >
            <div className="relative shrink-0">
              {/* Icon Container with Glow */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-morho-gold via-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-300 border border-white/10">
                <Coffee className="w-5 h-5 sm:w-7 sm:h-7 text-morho-deep" />
              </div>
            </div>

            {/* Logo */}
            <img
              src="/logotype.png"
              alt="MORPHO"
              className="h-9 sm:h-14 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Right Side - Account Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent flex items-center justify-center text-primary-900 shadow-lg">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm font-bold text-white/80 group-hover:text-white">پروفایل</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-accent text-primary-900 font-extrabold text-xs sm:text-sm shadow-glow-accent hover:bg-accent/80 transition-all border border-accent/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>ورود</span>
                  </motion.button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-bold text-white/40 hover:text-white transition-colors px-2"
                  >
                    ثبت‌نام
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Live Status - Mobile Minimalist */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/5">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
              />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Live</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;