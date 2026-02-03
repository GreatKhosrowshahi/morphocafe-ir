import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Coffee, ChevronLeft, ChevronRight, User, Mail, Lock, ArrowLeft } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen = ({ onEnter }: WelcomeScreenProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0], [0, 1]);
  const scale = useTransform(x, [-150, 0], [0.8, 1]);
  const swipeTextOpacity = useTransform(x, [-50, 0], [0, 1]);

  // Swiping left to enter (negative x direction)
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -100 || info.velocity.x < -500) {
      onEnter();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, hsl(221 87% 15%) 0%, hsl(221 70% 20%) 50%, hsl(221 90% 30% / 0.5) 100%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-morho-lavender/10"
            style={{
              width: Math.random() * 100 + 40,
              height: Math.random() * 100 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showLogin ? (
          <motion.div
            key="welcome"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            style={{
              x,
              opacity,
              scale,
              minHeight: '100dvh'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -200, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 w-full max-w-lg px-8 text-center select-none mx-auto flex flex-col items-center justify-center"
          >


            {/* Brand Logotype */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8 flex justify-center"
            >
              <img
                src="/logotype.png"
                alt="MORPHO"
                className="h-20 sm:h-28 w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-muted-foreground text-xl sm:text-2xl mb-10 max-w-md mx-auto leading-relaxed font-medium"
            >
              بوتیک شیرینی فرانسوی مورفو
            </motion.p>

            {/* Elegant French/English Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col items-center gap-4 mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-serif italic text-morho-lavender text-center leading-tight drop-shadow-lg">
                Dessert spéciaux <br /> & Pâtisserie Française
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-medium tracking-[0.2em] uppercase text-center">
                Elegance of the Art in Each Bite
              </p>
            </motion.div>

            {/* View Menu Button */}
            <motion.div
              style={{ opacity: swipeTextOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-[0_0_20px_rgba(167,139,250,0.1)] hover:shadow-[0_0_30px_rgba(167,139,250,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <ChevronLeft className="w-6 h-6 text-morho-lavender group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="text-xl font-medium text-white tracking-wide">مشاهده منو</span>
                </div>
              </motion.button>

              <div className="w-16 h-0.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-morho-lavender/50 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Login trigger button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              onClick={() => setShowLogin(true)}
              className="mt-20 flex items-center gap-3 mx-auto px-10 py-5 rounded-2xl glass-card text-lg font-medium text-morho-lavender hover:bg-morho-lavender/10 transition-all duration-300 border border-morho-lavender/20 shadow-lg"
            >
              <User className="w-6 h-6" />
              ورود به حساب کاربری
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm px-6"
          >
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowLogin(false)}
              className="absolute -top-16 right-6 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
            >
              بازگشت
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Login form */}
            <div className="glass-card rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-morho-royal to-morho-lavender shadow-glow mb-4">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">خوش آمدید</h2>
                <p className="text-muted-foreground text-sm">وارد حساب خود شوید</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="آدرس ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-morho-deep/50 border border-border focus:border-morho-lavender focus:outline-none focus:ring-2 focus:ring-morho-royal/20 transition-all text-right"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-morho-deep/50 border border-border focus:border-morho-lavender focus:outline-none focus:ring-2 focus:ring-morho-royal/20 transition-all text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-morho-royal to-morho-lavender font-semibold text-white shadow-glow hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  ورود
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  حساب ندارید؟{" "}
                  <button className="text-morho-lavender hover:text-white transition-colors">
                    ثبت‌نام کنید
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={onEnter}
                  className="w-full text-center text-sm text-muted-foreground hover:text-morho-lavender transition-colors"
                >
                  ادامه بدون ورود
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomeScreen;
