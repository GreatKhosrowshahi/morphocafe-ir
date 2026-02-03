import { motion } from "framer-motion";
import { Coffee, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

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
      className="fixed top-0 inset-x-0 z-50 bg-morho-deep/95 border-b border-white/5 shadow-lg"
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
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-morho-gold via-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300">
                <Coffee className="w-5 h-5 sm:w-7 sm:h-7 text-morho-deep" />
              </div>
              {/* Pulsing Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-morho-gold to-orange-500"
              />
            </div>

            {/* Logo */}
            <img
              src="/logotype.png"
              alt="MORPHO"
              className="h-9 sm:h-14 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Right Side - Status Indicator */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Divider */}
            <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Live Status */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
              />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium text-white/80">باز است</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;