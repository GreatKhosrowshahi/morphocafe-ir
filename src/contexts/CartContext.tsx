import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./MenuContext";
import { toast } from "sonner";
import { parsePrice } from "../lib/utils";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("morho_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem("morho_cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);
            if (existingItem) {
                toast.custom((t) => (
                    <div className="bg-emerald-600/80 backdrop-blur-md border border-emerald-400/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3 font-bold mx-auto min-w-max">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        تعداد محصول افزایش یافت
                    </div>
                ), { duration: 1500 });
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            toast.custom((t) => (
                <div className="bg-emerald-600/80 backdrop-blur-md border border-emerald-400/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3 font-bold mx-auto min-w-max">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    به سبد خرید اضافه شد
                </div>
            ), { duration: 1500 }); // Short duration
            return [...currentItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
        toast.custom((t) => (
            <div className="bg-red-600/80 backdrop-blur-md border border-red-400/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-3 font-bold mx-auto min-w-max">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                محصول از سبد حذف شد
            </div>
        ), { duration: 1500 });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setItems((currentItems) => {
            return currentItems.map((item) => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    if (newQuantity === 0) return item; // Don't remove on 0, let user explicitly remove or keep at 1? usually remove at 0 is standard but let's stick to explicit remove button for safety or remove if 0
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("morho_cart");
    };



    // ... existing code ...

    const cartTotal = items.reduce((total, item) => {
        return total + parsePrice(item.price) * item.quantity;
    }, 0);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                itemCount,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
