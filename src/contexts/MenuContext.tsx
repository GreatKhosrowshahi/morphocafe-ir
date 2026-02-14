import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/shared/lib/supabase";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    rating: number;
    image: string;
    category: string;
    badge?: string;
    isFavorite?: boolean;
}

interface Category {
    id: string;
    label: string;
    iconName: string;
}

interface MenuContextType {
    products: Product[];
    categories: Category[];
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    toggleFavorite: (id: number) => void;
    favorites: number[];
    featuredProduct: FeaturedProductType;
    updateFeaturedProduct: (data: FeaturedProductType) => void;
}

export interface FeaturedProductType {
    title: string;
    subtitle: string;
    description: string;
    price: string;
    image: string;
    badge: string;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Initial Categories (Hardcoded as per plan)
const initialCategories: Category[] = [
    { id: "all", label: "همه", iconName: "Coffee" },
    { id: "espresso-based", label: "نوشیدنیهای بر پایه قهوه", iconName: "Coffee" },
    { id: "non-coffee", label: "نوشیدنیهای بدون قهوه", iconName: "CupSoda" },
    { id: "pastry", label: "شیرینی", iconName: "Cake" },
    { id: "bakery", label: "نان", iconName: "Croissant" },
    { id: "dessert", label: "دسر", iconName: "IceCream" },
    { id: "favorites", label: "علاقه‌مندی‌ها", iconName: "Heart" },
];

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories] = useState<Category[]>(initialCategories);
    const [favorites, setFavorites] = useState<number[]>([]);

    const fetchProductsAndStats = useCallback(async () => {
        // 1. Fetch products - Select only needed columns for performance
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id, name, description, price, rating, image, category, badge')
            .order('id', { ascending: true });

        if (productsError) {
            console.error('Error fetching products:', productsError);
            return;
        }

        // 2. Fetch orders - Select only items for stats calculation
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('items');

        if (ordersError) {
            console.error('Error fetching orders for stats:', ordersError);
            if (productsData) setProducts(productsData);
            return;
        }

        // 3. Calculate popularity based on orders
        const stats: Record<number, number> = {};
        ordersData?.forEach((order: any) => {
            const items = Array.isArray(order.items) ? order.items : [];
            items.forEach((item: any) => {
                const id = item.id;
                if (id) {
                    stats[id] = (stats[id] || 0) + (item.quantity || 1);
                }
            });
        });

        const statsValues = Object.values(stats);
        const maxOrders = statsValues.length > 0 ? Math.max(...statsValues) : 1;

        // 4. Update products with calculated ratings
        const updatedProducts = (productsData || []).map((p: Product) => {
            const orderCount = stats[p.id] || 0;
            const calculatedRating = orderCount > 0
                ? Number((3.5 + (1.5 * (orderCount / maxOrders))).toFixed(1))
                : p.rating;

            return {
                ...p,
                rating: calculatedRating,
                isFavorite: orderCount > (maxOrders * 0.5)
            };
        });

        setProducts(updatedProducts);

        // 5. Update favorites
        const topOrderedIds = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([id]) => parseInt(id));

        setFavorites(topOrderedIds);
    }, []);

    useEffect(() => {
        fetchProductsAndStats();

        const channel = supabase.channel('menu_realtime');

        channel
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProductsAndStats();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchProductsAndStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchProductsAndStats]);

    const addProduct = useCallback(async (product: Omit<Product, "id">) => {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) {
            console.error('Error adding product:', error);
        } else if (data) {
            fetchProductsAndStats();
        }
    }, [fetchProductsAndStats]);

    const updateProduct = useCallback(async (updatedProduct: Product) => {
        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', updatedProduct.id);

        if (error) {
            console.error('Error updating product:', error);
        } else {
            fetchProductsAndStats();
        }
    }, [fetchProductsAndStats]);

    const deleteProduct = useCallback(async (id: number) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
        } else {
            fetchProductsAndStats();
        }
    }, [fetchProductsAndStats]);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    }, []);

    // Featured Product State
    const [featuredProduct, setFeaturedProductState] = useState<FeaturedProductType>({
        title: "لاته مخصوص مورفو",
        subtitle: "رویال",
        description: "بهترین انتخاب کاربران در هفته گذشته بر اساس بیشترین ثبت سفارش.",
        price: "۸۵,۰۰۰",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
        badge: "محبوب‌ترین"
    });

    useEffect(() => {
        if (products.length > 0 && favorites.length > 0) {
            const topId = favorites[0];
            const topProduct = products.find(p => p.id === topId);
            if (topProduct) {
                setFeaturedProductState({
                    title: topProduct.name,
                    subtitle: "انتخاب اول مشتریان",
                    description: topProduct.description || "این محصول در صدر لیست سفارشات مشتریان عزیز مورفو قرار دارد.",
                    price: topProduct.price,
                    image: topProduct.image,
                    badge: "محبوب‌ترین"
                });
            }
        }
    }, [products, favorites]);

    const updateFeaturedProduct = useCallback((data: FeaturedProductType) => {
        setFeaturedProductState(data);
    }, []);

    const value = useMemo(() => ({
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFavorite,
        favorites,
        featuredProduct,
        updateFeaturedProduct
    }), [products, categories, addProduct, updateProduct, deleteProduct, toggleFavorite, favorites, featuredProduct, updateFeaturedProduct]);

    return (
        <MenuContext.Provider value={value}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};
