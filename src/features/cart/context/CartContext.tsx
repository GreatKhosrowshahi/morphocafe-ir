import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/contexts/MenuContext"; // Existing path until menu is migrated
import { parsePrice } from "@/lib/utils";
import { toast } from "@/components/ui/Toast/toast";
import { CartItem, CartContextType } from "../types/cart.types";

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

    const addToCart = useCallback((product: Product) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);
            if (existingItem) {
                toast.info("محصول در سبد موجود است", { description: "تعداد آن افزایش یافت" });
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            toast.cart("به سبد خرید اضافه شد", { description: product.name });
            return [...currentItems, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
        toast.error("محصول از سبد حذف شد");
    }, []);

    const updateQuantity = useCallback((productId: number, delta: number) => {
        setItems((currentItems) => {
            return currentItems.map((item) => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem("morho_cart");
    }, []);

    const cartTotal = useMemo(() => {
        return items.reduce((total, item) => {
            return total + parsePrice(item.price) * item.quantity;
        }, 0);
    }, [items]);

    const itemCount = useMemo(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    const value = useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
    }), [items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isCartOpen]);

    return (
        <CartContext.Provider value={value}>
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
