import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "ساعات کاری کافه مورفو چگونه است؟",
        answer: "ما همه روزه از ساعت ۸ صبح تا ۱۲ شب در خدمت شما عزیزان هستیم. برای روزهای تعطیل و مناسبت‌ها لطفا اینستاگرام ما را چک کنید."
    },
    {
        question: "آیا امکان رزرو میز وجود دارد؟",
        answer: "بله، شما می‌توانید از طریق تماس تلفنی یا دایرکت اینستاگرام میز خود را رزرو کنید. برای آخرهفته‌ها پیشنهاد می‌کنیم حداقل ۱ روز قبل رزرو کنید."
    },
    {
        question: "آیا منوی گیاهخواری و وگان دارید؟",
        answer: "بله، ما در بخش 'نوشیدنی‌های بدون قهوه' و 'اسنک‌ها' گزینه‌های متنوعی برای گیاهخواران و وگان‌ها داریم. اسموتی‌ها و سالادهای ما بسیار محبوب هستند."
    },
    {
        question: "فضای کافه برای کار با لپ‌تاپ مناسب است؟",
        answer: "بله، ما فضای آرام به همراه پریز برق در دسترس و اینترنت پرسرعت رایگان برای فریلنسرها و دانشجویان عزیز فراهم کرده‌ایم."
    },
    {
        question: "سفارش‌ها چگونه ثبت می‌شوند؟",
        answer: "شما می‌توانید به راحتی از طریق همین وب‌اپلیکیشن (منوی دیجیتال) سفارش خود را ثبت کنید. گارسون‌های ما سفارش را سر میز شما می‌آورند."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-morho-gold/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <HelpCircle className="w-4 h-4 text-morho-gold" />
                        <span className="text-xs font-bold tracking-wider text-morho-gold uppercase">سوالات متداول</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 mb-6">
                        پاسخ به سوالات شما
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        هر آنچه که نیاز است درباره مورفو بدانید
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group rounded-2xl border transition-all duration-300 ${activeIndex === index
                                ? "bg-white/10 border-morho-gold/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                }`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-right"
                            >
                                <span className={`text-lg font-bold transition-colors ${activeIndex === index ? "text-morho-gold" : "text-white"}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-2 rounded-full transition-all ${activeIndex === index ? "bg-morho-gold text-morho-deep rotate-180" : "bg-white/5 text-white"
                                    }`}>
                                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
