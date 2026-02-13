import React, { createContext, useContext, useEffect, useState } from "react";
import { toastStore, ToastData } from "./ToastStore.ts";
import { ToastContainer } from "./ToastContainer.tsx";

interface ToastContextType {
    toasts: ToastData[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        return toastStore.subscribe((newToasts) => {
            setToasts(newToasts);
        });
    }, []);

    return (
        <ToastContext.Provider value={{ toasts }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToastContext must be used within a ToastProvider");
    }
    return context;
};
