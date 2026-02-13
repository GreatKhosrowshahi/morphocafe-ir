import React, { useEffect, useState, useRef } from "react";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { CheckCircle2, AlertCircle, ShoppingBag, XCircle, Info, X, Loader2 } from "lucide-react";
import { toastStore, ToastData } from "./ToastStore";

export const ToastItem = ({ id, message, description, type, icon: CustomIcon, duration = 4000, action }: ToastData) => {
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const remainingRef = useRef<number>(duration);

    const theme = {
        success: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/20",
            Icon: CheckCircle2
        },
        error: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
            iconColor: "text-red-400",
            iconBg: "bg-red-500/20",
            Icon: XCircle
        },
        warning: {
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/20",
            Icon: AlertCircle
        },
        info: {
            bg: "bg-morho-lavender/10",
            border: "border-morho-lavender/20",
            glow: "shadow-[0_0_30px_rgba(95,125,206,0.15)]",
            iconColor: "text-morho-lavender",
            iconBg: "bg-morho-lavender/20",
            Icon: Info
        },
        loading: {
            bg: "bg-white/5",
            border: "border-white/10",
            glow: "shadow-[0_0_30px_rgba(255,255,255,0.05)]",
            iconColor: "text-white/60",
            iconBg: "bg-white/10",
            Icon: Loader2
        },
        cart: {
            bg: "bg-morho-gold/10",
            border: "border-morho-gold/20",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
            iconColor: "text-morho-gold",
            iconBg: "bg-morho-gold/20",
            Icon: ShoppingBag
        }
    }[type];

    const Icon = CustomIcon || theme.Icon;

    useEffect(() => {
        if (type === "loading") return; // Loading toasts don't auto-dismiss by default until updated

        const step = 10;
        const interval = setInterval(() => {
            if (!isPaused) {
                remainingRef.current -= step;
                setProgress((remainingRef.current / duration) * 100);

                if (remainingRef.current <= 0) {
                    clearInterval(interval);
                    toastStore.remove(id);
                }
            }
        }, step);

        return () => clearInterval(interval);
    }, [id, duration, isPaused, type]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            toastStore.remove(id);
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`
                relative group flex items-start gap-4 p-5 rounded-[1.5rem] 
                backdrop-blur-2xl border ${theme.border} ${theme.bg} ${theme.glow}
                min-w-[340px] max-w-md pointer-events-auto cursor-grab active:cursor-grabbing
                overflow-hidden select-none mb-1
            `}
        >
            {/* Progress Bar */}
            {type !== "loading" && (
                <div className="absolute bottom-0 left-0 h-[3px] bg-white/10 w-full overflow-hidden">
                    <motion.div
                        className={`h-full ${theme.iconColor} opacity-50`}
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.01 }}
                    />
                </div>
            )}

            {/* Icon Container */}
            <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${theme.iconColor} ${type === "loading" ? "animate-spin" : ""}`} />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 pt-0.5">
                <h3 className="text-white font-bold text-base leading-tight">
                    {message}
                </h3>
                {description && (
                    <p className="text-white/60 text-sm font-medium">
                        {description}
                    </p>
                )}

                {action && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                            toastStore.remove(id);
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all w-fit"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {/* Manual Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toastStore.remove(id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 -mr-2 -mt-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};
