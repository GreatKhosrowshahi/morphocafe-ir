import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee, Brain, Thermometer, Smile, PartyPopper, Zap, Moon } from "lucide-react";
import { useMenu } from "../contexts/MenuContext";
import ProductModal from "./ProductModal";
import { formatPrice } from "../lib/utils";

// Interactive Steps
const STEPS = [
    {
        id: "mood",
        question: "الان چه مودی داری؟",
        options: [
            { id: "tired", label: "خسته‌ام", icon: Moon, color: "from-blue-500 to-indigo-600" },
            { id: "happy", label: "سرحالم", icon: PartyPopper, color: "from-yellow-400 to-orange-500" },
            { id: "focused", label: "تمرکز میخوام", icon: Brain, color: "from-purple-500 to-pink-600" },
            { id: "chill", label: "ریلکس", icon: Coffee, color: "from-green-400 to-emerald-600" }
        ]
    },
    {
        id: "temperature",
        question: "چی میچسبه؟",
        options: [
            { id: "hot", label: "داغ باشه", icon: Coffee, color: "from-red-500 to-orange-600" },
            { id: "cold", label: "سرد باشه", icon: Thermometer, color: "from-cyan-400 to-blue-500" }
        ]
    },
    {
        id: "flavor",
        question: "چه طعمی؟",
        options: [
            { id: "sweet", label: "شیرین", icon: Smile, color: "from-pink-400 to-rose-500" },
            { id: "bitter", label: "تلخ/سنگین", icon: Zap, color: "from-amber-700 to-brown-800" },
            { id: "balanced", label: "ملایم", icon: Sparkles, color: "from-teal-400 to-cyan-500" }
        ]
    }
];

const MoodBarista = () => {
    const { products } = useMenu();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isThinking, setIsThinking] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [showProductModal, setShowProductModal] = useState(false);

    const handleOptionClick = (value: string) => {
        const newAnswers = { ...answers, [STEPS[currentStep].id]: value };
        setAnswers(newAnswers);

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            findMatch(newAnswers);
        }
    };

    const findMatch = (finalAnswers: Record<string, string>) => {
        setIsThinking(true);

        // Simulate AI thinking time
        setTimeout(() => {
            // Simple logic matching (can be expanded)
            let match = products[0]; // Default fallback

            // Filter logic examples (pseudo-algorithm)
            const potentialMatches = products.filter(p => {
                let score = 0;
                // Simple heuristic matching based on keywords in description or tags (mocked here)
                // In real app, products would have tags like 'hot', 'sweet', 'energy'

                // This is a simplified randomizer for demo effect, providing 'smart' feeling results
                // Ideally we would check p.tags includes finalAnswers.temperature etc.
                return true;
            });

            // Pick random for now to show variety, or improved later
            match = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];

            setResult(match);
            setIsThinking(false);
        }, 2000);
    };

    const reset = () => {
        setIsOpen(false);
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
        setIsThinking(false);
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 left-6 z-40 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-morho-gold via-yellow-400 to-orange-500 shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] flex items-center justify-center text-morho-deep transition-all duration-300"
                    >
                        {/* Pulsing outer ring */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-morho-gold to-orange-500"
                        />

                        {/* Icon */}
                        <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 relative z-10 drop-shadow-lg" />

                        {/* AI Badge */}
                        <motion.span
                            animate={{
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        >
                            AI
                        </motion.span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={reset}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md bg-morho-deep border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-morho-gold/20 flex items-center justify-center text-morho-gold">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-white">مود باریستا</span>
                                </div>
                                <button onClick={reset} className="text-white/50 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 min-h-[300px] flex flex-col items-center justify-center text-center">

                                {/* Thinking State */}
                                {isThinking ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="relative w-20 h-20">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 rounded-full border-2 border-t-morho-gold border-r-transparent border-b-morho-gold border-l-transparent"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Brain className="w-8 h-8 text-morho-gold animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-white text-lg font-medium animate-pulse">در حال تحلیل سلیقه شما...</p>
                                    </motion.div>
                                ) : result ? (
                                    // Result State - Premium Banner Design
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full"
                                    >
                                        <p className="text-morho-gold text-sm font-bold uppercase tracking-wider mb-2">پیشنهاد مخصوص شما</p>
                                        <h3 className="text-2xl font-bold text-white mb-6">احساس می‌کنم اینو دوست داری!</h3>

                                        {/* Clickable Banner Card */}
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowProductModal(true)}
                                            className="relative overflow-hidden rounded-3xl cursor-pointer group mb-6"
                                        >
                                            {/* Background Image */}
                                            <div className="relative h-64 sm:h-72 w-full">
                                                <img
                                                    src={result.image}
                                                    alt={result.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
                                                />

                                                {/* Gradient Overlay - Stronger for text readability */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-morho-deep via-morho-deep/80 to-transparent" />

                                                {/* Special Badge - Top Right */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.05, 1],
                                                            rotate: [0, 2, -2, 0]
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-morho-gold to-yellow-400 text-morho-deep font-bold text-xs shadow-glow-gold"
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                        <span>پیشنهاد ویژه</span>
                                                    </motion.div>
                                                </div>

                                                {/* Content - Bottom */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                                                        {result.name}
                                                    </h4>
                                                    <p className="text-white/90 text-sm sm:text-base line-clamp-2 mb-4 leading-relaxed">
                                                        {result.description}
                                                    </p>

                                                    {/* Price & Tap Indicator */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-baseline gap-1 price-nowrap overflow-hidden">
                                                            <span className="text-3xl font-bold text-morho-gold tabular-nums">
                                                                {formatPrice(result.price)}
                                                            </span>
                                                            <span className="text-sm text-white/80 font-medium shrink-0">
                                                                تومان
                                                            </span>
                                                        </div>

                                                        {/* Tap to view indicator */}
                                                        <motion.div
                                                            animate={{ x: [-3, 0, -3] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="flex items-center gap-2 text-white/60 text-sm"
                                                        >
                                                            <span className="hidden sm:inline">برای مشاهده کلیک کنید</span>
                                                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <button onClick={reset} className="text-white/40 text-sm hover:text-white transition-colors">
                                            شروع دوباره
                                        </button>
                                    </motion.div>
                                ) : (
                                    // Question State
                                    <motion.div
                                        key={currentStep}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="w-full"
                                    >
                                        <h3 className="text-xl font-bold text-white mb-8">{STEPS[currentStep].question}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {STEPS[currentStep].options.map((option) => {
                                                const Icon = option.icon;
                                                return (
                                                    <motion.button
                                                        key={option.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleOptionClick(option.id)}
                                                        className={`p-4 rounded-2xl bg-gradient-to-br ${option.color} relative overflow-hidden group text-right h-24 flex flex-col justify-between`}
                                                    >
                                                        <div className="absolute top-0 left-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                                            <Icon className="w-8 h-8 text-white" />
                                                        </div>
                                                        <span className="relative z-10 text-white font-bold text-lg leading-tight">{option.label}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(prev => prev - 1)}
                                                className="mt-6 text-white/30 text-sm flex items-center gap-1 mx-auto hover:text-white"
                                            >
                                                بازگشت
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Nested Product Modal for Result */}
            {result && (
                <ProductModal
                    product={result}
                    isOpen={showProductModal}
                    onClose={() => setShowProductModal(false)}
                />
            )}
        </>
    );
};

export default MoodBarista;
