// This file is deprecated. Please use @/features/cart/context/CartContext
export const CartProvider = ({ children }: any) => children;
export const useCart = () => {
    console.warn("Legacy useCart called. Please update to @/features/cart/context/CartContext");
    return {};
};
