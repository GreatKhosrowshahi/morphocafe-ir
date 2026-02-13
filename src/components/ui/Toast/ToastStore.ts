import { LucideIcon } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading" | "cart";

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastOptions {
    id?: string;
    message: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    icon?: LucideIcon;
    action?: ToastAction;
    promise?: Promise<any>;
}

export interface ToastData extends ToastOptions {
    id: string;
    type: ToastType;
    createdAt: number;
}

type Listener = (toasts: ToastData[]) => void;

class ToastStore {
    private toasts: ToastData[] = [];
    private listeners: Set<Listener> = new Set();
    private maxToasts = 5;

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify() {
        this.listeners.forEach((listener) => listener([...this.toasts]));
    }

    add(toast: ToastOptions): string {
        const id = toast.id || Math.random().toString(36).substring(2, 9);
        const newToast: ToastData = {
            ...toast,
            id,
            type: toast.type || "info",
            createdAt: Date.now()
        };

        this.toasts = [newToast, ...this.toasts].slice(0, this.maxToasts);
        this.notify();
        return id;
    }

    update(id: string, data: Partial<ToastData>) {
        this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, ...data } : t));
        this.notify();
    }

    remove(id: string) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }

    getToasts() {
        return this.toasts;
    }
}

export const toastStore = new ToastStore();
