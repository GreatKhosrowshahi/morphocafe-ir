import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface WelcomeGateProps {
    onEnter: () => void;
}

export const WelcomeGate: React.FC<WelcomeGateProps> = ({ onEnter }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Parallax & Opacity effects based on drag
    const opacity = useTransform(y, [-150, 0], [0, 1]);
    const scale = useTransform(y, [-150, 0], [0.95, 1]);
    const bgOpacity = useTransform(y, [-300, 0], [0, 0.4]);
    const hintOpacity = useTransform(y, [-100, 0], [0, 1]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleDragEnd = (_: any, info: PanInfo) => {
        // Threshold detection (120px or high velocity)
        if (info.offset.y < -120 || info.velocity.y < -500) {
            onEnter();
        }
    };

    return (
        <motion.div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black select-none pointer-events-auto"
            initial={{ y: 0 }}
            exit={{ y: "-100dvh" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
        >
            {/* Premium Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="absolute inset-0 bg-gradient-to-br from-morho-deep via-[#02040a] to-black"
                />

                {/* Floating Animated Orbs */}
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 -right-20 w-96 h-96 bg-morho-gold/5 rounded-full blur-[120px]"
                />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Gesture Interaction Layer */}
            <motion.div
                drag="y"
                dragConstraints={{ top: -1000, bottom: 0 }}
                dragElastic={{ top: 0.2, bottom: 0 }}
                onDragEnd={handleDragEnd}
                style={{ y: ySpring }}
                className="relative w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    style={{ opacity, scale }}
                    className="flex flex-col items-center text-center px-6 max-w-2xl"
                >
                    {/* Brand Identity */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mb-12"
                    >
                        <img
                            src="/logotype.png"
                            alt="Morpho"
                            className="h-24 sm:h-32 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        />
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl sm:text-6xl font-serif italic text-white leading-tight">
                            Experience the Art of <br />
                            <span className="text-morho-gold underline decoration-white/10 underline-offset-8">French Pastry</span>
                        </h1>
                        <p className="text-white/40 text-sm sm:text-lg font-medium tracking-[0.3em] uppercase">
                            Boutique de Pâtisserie
                        </p>
                    </motion.div>

                    {/* Desktop Fallback Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={onEnter}
                        className="mt-12 group relative px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest text-white/60 hover:text-white hidden lg:block"
                    >
                        Click to Enter
                    </motion.button>
                </motion.div>

                {/* Swipe Indicator */}
                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="absolute bottom-16 flex flex-col items-center gap-4"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md"
                    >
                        <ChevronUp className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] animate-pulse">
                        Swipe Up to Enter
                    </span>
                </motion.div>
            </motion.div>

            {/* Glossy Overlay Borders */}
            <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none rounded-[40px] m-4 hidden sm:block" />
        </motion.div>
    );
};
