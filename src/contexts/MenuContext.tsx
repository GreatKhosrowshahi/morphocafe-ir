import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

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
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [favorites, setFavorites] = useState<number[]>([]);

    const fetchProductsAndStats = async () => {
        // 1. Fetch products
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (productsError) {
            console.error('Error fetching products:', productsError);
            return;
        }

        // 2. Fetch orders to calculate popularity
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

        // 4. Update products with calculated ratings (1-5 range based on relative popularity)
        const maxOrders = Math.max(...Object.values(stats), 1);
        const updatedProducts = productsData.map((p: Product) => {
            const orderCount = stats[p.id] || 0;
            // Calculate a rating from 3.5 to 5.0 for products that have orders
            const calculatedRating = orderCount > 0
                ? Number((3.5 + (1.5 * (orderCount / maxOrders))).toFixed(1))
                : p.rating; // Keep existing or default if no orders

            return {
                ...p,
                rating: calculatedRating,
                // Automatically mark top 20% or items with many orders as favorites if we want dynamic favorites
                isFavorite: orderCount > (maxOrders * 0.5)
            };
        });

        setProducts(updatedProducts);

        // 5. Update favorites based on top ordered items (e.g. top 10)
        const topOrderedIds = Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([id]) => parseInt(id));

        setFavorites(topOrderedIds);
    };

    useEffect(() => {
        fetchProductsAndStats();

        const subscription = supabase
            .channel('products_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProductsAndStats();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchProductsAndStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const addProduct = async (product: Omit<Product, "id">) => {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) {
            console.error('Error adding product:', error);
        } else if (data) {
            fetchProductsAndStats();
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', updatedProduct.id);

        if (error) {
            console.error('Error updating product:', error);
        } else {
            fetchProductsAndStats();
        }
    };

    const deleteProduct = async (id: number) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
        } else {
            fetchProductsAndStats();
        }
    };

    const toggleFavorite = (id: number) => {
        // Manual toggle still works but now we also have dynamic favorites
        const newFavorites = favorites.includes(id)
            ? favorites.filter((fid) => fid !== id)
            : [...favorites, id];
        setFavorites(newFavorites);
    };

    // Featured Product State (Dynamic based on top ordered item)
    const [featuredProduct, setFeaturedProduct] = useState<FeaturedProductType>({
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
                setFeaturedProduct({
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

    const updateFeaturedProduct = (data: FeaturedProductType) => {
        setFeaturedProduct(data);
    };

    return (
        <MenuContext.Provider
            value={{
                products,
                categories,
                addProduct,
                updateProduct,
                deleteProduct,
                toggleFavorite,
                favorites,
                featuredProduct,
                updateFeaturedProduct
            }}
        >
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
