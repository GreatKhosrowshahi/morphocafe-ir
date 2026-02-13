import { createPortal } from "react-dom";
import { useToastContext } from "./ToastContext";
import { ToastItem } from "./ToastItem";
import { AnimatePresence, motion } from "framer-motion";

export const ToastContainer = () => {
    const { toasts } = useToastContext();

    // Use a portal to render at the top level of the DOM
    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed top-0 right-0 z-[9999] p-6 flex flex-col items-end gap-3 pointer-events-none w-full max-w-md overflow-hidden"
            aria-live="polite"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {toasts.map((toast) => (
                    <motion.div
                        layout
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        className="pointer-events-auto"
                    >
                        <ToastItem {...toast} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
};
