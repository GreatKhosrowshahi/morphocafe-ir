
import { motion } from "framer-motion";
import { Zap, Feather, Candy, Snowflake } from "lucide-react";

interface MoodSelectorProps {
    onSelectMood: (mood: string) => void;
}

const moods = [
    {
        id: "energy",
        label: "نیاز به انرژی",
        emoji: "⚡️",
        icon: Zap,
        color: "from-amber-400 to-orange-500",
        description: "قهوه‌های قوی و اسپرسو"
    },
    {
        id: "relax",
        label: "ریلکس و آرام",
        emoji: "🍃",
        icon: Feather,
        color: "from-emerald-400 to-teal-500",
        description: "دمنوش و نوشیدنی‌های ملایم"
    },
    {
        id: "sweet",
        label: "شیرینی می‌چسبه",
        emoji: "🍫",
        icon: Candy,
        color: "from-pink-400 to-rose-500",
        description: "کیک، دسر و شیک‌ها"
    },
    {
        id: "cool",
        label: "خنک و تازه",
        emoji: "❄️",
        icon: Snowflake,
        color: "from-cyan-400 to-blue-500",
        description: "آیس کافی و اسموتی"
    }
];

const MoodSelector = ({ onSelectMood }: MoodSelectorProps) => {
    return (
        <section className="section-padding relative">
            <div className="container-custom mx-auto">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold mb-4 text-white"
                    >
                        امروز چه <span className="text-gradient">حسی</span> داری؟
                    </motion.h2>
                    <p className="text-white/70 text-base sm:text-lg">پیشنهاد مورفو بر اساس حال و هوای شما</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {moods.map((mood, index) => (
                        <motion.button
                            key={mood.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectMood(mood.id)}
                            className="group relative overflow-hidden rounded-3xl aspect-square sm:aspect-auto sm:h-48 p-5 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/30 transition-all text-right flex flex-col justify-between"
                        >
                            {/* Premium Hover Glow & Reflection */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-[1]`} />

                            {/* Soft Corner Reflection */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />

                            <div className={`w-14 h-14 rounded-[1.25rem] bg-gradient-to-br ${mood.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                                <mood.icon className="w-6 h-6 text-white" />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg sm:text-xl mb-1.5 text-white">{mood.label}</h3>
                                <p className="text-sm text-white/60 group-hover:text-white transition-colors">
                                    {mood.description}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MoodSelector;
