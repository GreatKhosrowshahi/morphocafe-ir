import { Instagram, MapPin, Clock, Coffee, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-black via-black/95 to-morho-deep/90 text-white pt-24 pb-8 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-morho-gold/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-morho-gold to-orange-500 flex items-center justify-center shadow-glow-gold">
                <Coffee className="w-6 h-6 text-morho-deep" />
              </div>
              <span className="text-2xl font-bold tracking-wider">MORPHO</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              تجربه‌ای متفاوت از طعم قهوه در فضایی آرام و دلنشین. ما در مورفو متعهد به ارائه بهترین کیفیت برای لحظات خاص شما هستیم.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com/morpho.patisserie"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-morho-gold hover:text-morho-deep transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-morho-gold relative inline-block">
              دسترسی سریع
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-morho-gold/50 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {['منوی کافه', 'درباره ما', 'تماس با ما'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-morho-gold hover:px-2 transition-all duration-300 inline-block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (Address Only) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-morho-gold relative inline-block">
              آدرس
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-morho-gold/50 rounded-full"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-muted-foreground hover:text-white transition-colors group">
                <MapPin className="w-5 h-5 text-morho-gold shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm leading-relaxed">
                  بوئین زهرا، بلوار آزادگان، ابتدای بلوار فرمانداری، کافه مورفو
                </span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-morho-gold relative inline-block">
              ساعات کاری
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-morho-gold/50 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-white">شنبه تا چهارشنبه</span>
                <div className="flex items-center gap-2 text-morho-gold">
                  <Clock className="w-4 h-4" />
                  <span>۸:۰۰ - ۲۳:۰۰</span>
                </div>
              </li>
              <li className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-white">پنجشنبه و جمعه</span>
                <div className="flex items-center gap-2 text-morho-gold">
                  <Clock className="w-4 h-4" />
                  <span>۹:۰۰ - ۲۴:۰۰</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} تمامی حقوق برای کافه مورفو محفوظ است.</p>
          <div dir="ltr" className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors">
            <span className="font-light">Developed by</span>
            <a
              href="https://runtimestudio.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-morho-gold/80 hover:text-morho-gold transition-colors border-b border-white/0 hover:border-morho-gold"
            >
              Runtime Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
