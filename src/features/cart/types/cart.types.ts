import { Product } from "@/contexts/MenuContext";

export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
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
