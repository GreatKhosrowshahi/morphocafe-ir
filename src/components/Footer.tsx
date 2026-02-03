import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Instagram,
  Coffee,
  Heart,
  ExternalLink,
  Phone,
  Mail
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative pt-16 sm:pt-28 pb-8 sm:pb-12 border-t border-white/5 bg-morho-deep/30 no-scroll-x overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-morho-royal/10 via-morho-lavender/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-morho-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mobile-container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-8 mb-16 sm:mb-20">

          {/* Brand Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center sm:items-start text-center sm:text-right"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-morho-gold via-yellow-400 to-orange-500 flex items-center justify-center shadow-glow-gold">
                <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-morho-deep" />
              </div>
              <img src="/logotype.png" alt="MORPHO" className="h-9 sm:h-10 object-contain" />
            </div>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xs mb-4">
              تجربه‌ای منحصربه‌فرد از قهوه و شیرینی فرانسوی در فضایی لوکس و مدرن
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <motion.a
                href="https://instagram.com/morpho.patisserie"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-morho-lavender/40 flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-white/60 group-hover:text-morho-lavender transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center sm:text-right"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-morho-gold to-orange-500 rounded-full" />
              تماس با ما
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 text-morho-lavender shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  بلوار آزادگان، ابتدای بلوار فرمانداری
                </p>
              </div>
            </div>
          </motion.div>

          {/* Working Hours - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center sm:text-right"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-morho-gold to-orange-500 rounded-full" />
              ساعات کاری
            </h3>
            <div className="flex items-start gap-3 justify-center sm:justify-start">
              <Clock className="w-5 h-5 text-morho-lavender shrink-0 mt-1" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">میزبان شما هستیم</p>
                <p className="text-xl sm:text-2xl font-black text-white mb-1">۸ صبح تا ۱۰ شب</p>
                <p className="text-xs sm:text-sm text-morho-lavender font-medium">همه روزه، حتی تعطیلات</p>
              </div>
            </div>
          </motion.div>

          {/* Instagram Card - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-morho-gold to-orange-500 rounded-full" />
              ما را دنبال کنید
            </h3>

            <motion.a
              href="https://instagram.com/morpho.patisserie"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-morho-lavender/40 transition-all duration-500 overflow-hidden shadow-lg"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 mb-0.5">Instagram</p>
                  <p className="font-bold text-sm sm:text-base text-white group-hover:text-morho-lavender transition-colors">morpho.patisserie</p>
                </div>
              </div>

              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-morho-lavender group-hover:translate-x-1 transition-all duration-300" />
            </motion.a>

            {/* Map Preview - Compact */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-white/5 h-32 w-full group relative shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d202.32954060904297!2d50.05198023745464!3d35.76867836165996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1769845682784!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>
        </div>

        {/* Elegant Divider */}
        <div className="relative h-px mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-morho-lavender shadow-glow" />
        </div>

        {/* Bottom Bar - Refined */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm text-white/60"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-right">
            <p>© ۲۰۲۵ مجموعه MORPHO. تمامی حقوق محفوظ است.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p className="text-white/80">
              طراحی و توسعه: <span className="text-morho-lavender font-semibold">یزدان آسترکی</span>
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
            <span className="text-white/70">ساخته شده با</span>
            <Heart className="w-3.5 h-3.5 text-morho-lavender fill-morho-lavender animate-pulse" />
            <span className="text-white/70">برای شما</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
