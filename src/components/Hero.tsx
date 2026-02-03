import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
}

const Hero = ({ onExplore }: HeroProps) => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 rounded-full bg-morho-royal/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-morho-lavender/20 blur-3xl"
        />
      </div>

      <div className="container-custom mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 category-badge mb-6 sm:mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm">بوتیک شیرینی فرانسوی مورفو</span>
          </motion.div>


          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="title-responsive font-bold mb-4 sm:mb-6"
          >
            <span className="text-gradient">MORPHO</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="subtitle-responsive text-muted-foreground mb-10 sm:mb-14 max-w-2xl leading-relaxed px-2 dir-ltr"
            dir="ltr"
          >
            𝐃𝐞𝐬𝐬𝐞𝐫𝐭 𝐬𝐩𝐞́𝐜𝐢𝐚𝐮𝐱 & 𝐏𝐚̂𝐭𝐢𝐬𝐬𝐞𝐫𝐢𝐞 𝐅𝐫𝐚𝐧𝐜̧𝐚𝐢𝐬𝐞
            <span className="block mt-3 text-morho-lavender font-medium text-lg sm:text-xl tracking-wider">
              𝐄𝐥𝐞𝐠𝐚𝐧𝐜𝐞 𝐨𝐟 𝐓𝐡𝐞 𝐀𝐫𝐭 𝐢𝐧 𝐄𝐚𝐜𝐡 𝐁𝐢𝐭𝐞
            </span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExplore}
              className="group relative px-12 py-5 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold text-lg sm:text-xl overflow-hidden shadow-lg hover:shadow-glow-gold hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-3">
                مشاهده منو
                <span className="w-8 h-8 rounded-full bg-morho-gold flex items-center justify-center text-morho-deep group-hover:scale-110 transition-transform">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </span>
            </motion.button>
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-morho-gold/20 to-morho-lavender/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            />

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col items-center gap-3 text-muted-foreground mt-8"
            >
              <span className="text-xs uppercase tracking-widest font-semibold opacity-60">اسکرول کنید</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-6 h-6 text-morho-lavender" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
