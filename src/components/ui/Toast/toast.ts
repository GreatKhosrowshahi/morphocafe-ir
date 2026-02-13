import { toastStore, ToastOptions, ToastType } from "./ToastStore";

interface ToastPromiseOptions {
    loading: string;
    success: string | ((data: any) => string);
    error: string | ((error: any) => string);
}

const createToast = (message: string, type: ToastType = "info", options?: Partial<ToastOptions>) => {
    return toastStore.add({
        message,
        type,
        ...options
    });
};

export const toast = {
    success: (message: string, options?: Partial<ToastOptions>) => createToast(message, "success", options),
    error: (message: string, options?: Partial<ToastOptions>) => createToast(message, "error", options),
    warning: (message: string, options?: Partial<ToastOptions>) => createToast(message, "warning", options),
    info: (message: string, options?: Partial<ToastOptions>) => createToast(message, "info", options),
    cart: (message: string, options?: Partial<ToastOptions>) => createToast(message, "cart", options),
    loading: (message: string, options?: Partial<ToastOptions>) => createToast(message, "loading", options),

    promise: <T>(
        promise: Promise<T>,
        { loading, success, error }: ToastPromiseOptions,
        options?: Partial<ToastOptions>
    ) => {
        const id = toastStore.add({
            message: loading,
            type: "loading",
            ...options
        });

        promise
            .then((data) => {
                const message = typeof success === "function" ? success(data) : success;
                toastStore.update(id, {
                    message,
                    type: "success",
                    duration: 4000 // Reset duration for result
                });
            })
            .catch((err) => {
                const message = typeof error === "function" ? error(err) : error;
                toastStore.update(id, {
                    message,
                    type: "error",
                    duration: 5000
                });
            });

        return promise;
    },

    dismiss: (id: string) => toastStore.remove(id)
};
