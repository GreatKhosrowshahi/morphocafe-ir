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

    useEffect(() => {
        // Fetch products from Supabase
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true }); // Simple ordering

            if (error) {
                console.error('Error fetching products:', error);
            } else if (data) {
                setProducts(data);
            }
        };

        fetchProducts();

        // Optional: Realtime subscription
        const subscription = supabase
            .channel('products_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                // Ideally trigger refetch or handle event. 
                // For simplicity, let's just refetch to ensure consistency or handle simple adds.
                // Simple Refetch:
                fetchProducts();
            })
            .subscribe();

        // Load favorites from LocalStorage (Client-side preference)
        const savedFavorites = localStorage.getItem("morho_favorites");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

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
            setProducts([...products, data[0]]);
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
            setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
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
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    const toggleFavorite = (id: number) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter((fid) => fid !== id)
            : [...favorites, id];
        setFavorites(newFavorites);
        localStorage.setItem("morho_favorites", JSON.stringify(newFavorites));
    };

    // Featured Product State (Persisted in LocalStorage)
    const [featuredProduct, setFeaturedProduct] = useState<FeaturedProductType>({
        title: "لاته پسته و زعفران",
        subtitle: "رویال",
        description: "سمفونی طعم‌ها: ترکیب جادویی اسپرسوی ۱۰۰٪ عربیکا، شیر غنی شده با خامه پسته رفسنجان و عطر اصیل زعفران قائنات.",
        price: "۸۵,۰۰۰",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
        badge: "پیشنهاد مورفو"
    });

    useEffect(() => {
        const saved = localStorage.getItem("morho_featured_product");
        if (saved) {
            setFeaturedProduct(JSON.parse(saved));
        }
    }, []);

    const updateFeaturedProduct = (data: FeaturedProductType) => {
        setFeaturedProduct(data);
        localStorage.setItem("morho_featured_product", JSON.stringify(data));
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
