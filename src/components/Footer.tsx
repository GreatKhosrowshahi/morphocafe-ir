import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Instagram,
  Coffee,
  Heart
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 border-t border-white/5 bg-morho-deep/40 backdrop-blur-sm overflow-hidden" id="footer" dir="rtl">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-morho-royal/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[50%] bg-morho-lavender/5 blur-[100px] rounded-full" />
      </div>

      <div className="mobile-container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Section 1: Brand Identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start text-center lg:text-right"
          >
            <div className="relative mb-8 group">
              <div className="absolute -inset-2 bg-gradient-to-r from-morho-gold to-morho-royal opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img src="/logotype.png" alt="MORPHO" className="h-12 w-auto object-contain relative transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-8">
              برند برتر شیرینی فرانسوی و قهوه تخصصی در ساوه. جایی که هنر و طعم به هم می‌پیوندند.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://instagram.com/morpho.patisserie"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-morho-lavender hover:border-morho-lavender/50 transition-all duration-300 shadow-lg backdrop-blur-md"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Section 2: Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center lg:items-start"
          >
            <h4 className="text-morho-gold font-bold text-lg mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-12 after:h-1 after:bg-morho-gold/30 after:rounded-full">
              اطلاعات تماس
            </h4>
            <ul className="space-y-6 w-full">
              <li className="flex items-start gap-4 group justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-morho-lavender/30 transition-colors">
                  <MapPin size={18} className="text-morho-lavender" />
                </div>
                <div>
                  <span className="text-xs text-white/40 block mb-1">آدرس ما</span>
                  <p className="text-white/80 text-sm leading-relaxed text-right">
                    بوئین زهرا، بلوار آزادگان، <br /> ابتدای بلوار فرمانداری، <br /> کافه فرانسوی مورفو
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-morho-lavender/30 transition-colors">
                  <Clock size={18} className="text-morho-lavender" />
                </div>
                <div>
                  <span className="text-xs text-white/40 block mb-1">ساعات پذیرایی</span>
                  <p className="text-white/80 text-sm font-bold tabular-nums text-right">
                    ۸:۰۰ صبح تا ۱۰:۰۰ شب
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Section 3: Location Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center lg:items-start w-full"
          >
            <h4 className="text-morho-gold font-bold text-lg mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-12 after:h-1 after:bg-morho-gold/30 after:rounded-full">
              موقعیت روی نقشه
            </h4>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/10 group relative shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d202.32954060904297!2d50.05198023745464!3d35.76867836165996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1769845682784!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Separator / Credit */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row-reverse items-center justify-between gap-6">
          <p className="text-xs text-white/40 text-center md:text-right">
            © ۲۰۲۵ تمامی حقوق برای مجموعه <span className="text-morho-gold font-bold">MORPHO</span> محفوظ است
          </p>

          <div className="flex items-center gap-6" dir="ltr">
            <div className="flex items-center gap-2 group cursor-default">
              <span className="text-[11px] text-white/30">Developed by</span>
              <span className="text-xs font-bold text-white/60 group-hover:text-morho-lavender transition-colors">YAZDAN ASTARAKI</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/50">
              <span>Made with</span>
              <Heart size={10} className="text-morho-lavender fill-morho-lavender animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
