import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu, Product } from "../contexts/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Upload, Save, LogOut, Star } from "lucide-react";
import { supabase } from "../supabaseClient";

// Initial empty product for the form
const emptyProduct: Omit<Product, "id"> = {
    name: "",
    description: "",
    price: "",
    rating: 5,
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80",
    category: "espresso-based",
    badge: "",
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { products, categories, addProduct, updateProduct, deleteProduct, featuredProduct, updateFeaturedProduct } = useMenu();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeaturedEdit, setIsFeaturedEdit] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, "id">>(emptyProduct);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("morho_admin_auth");
        if (!auth) {
            navigate("/admin");
        }
    }, [navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert('خطا در آپلود عکس! آیا باکت "product-images" را در سوپابیس ساخته‌اید؟');
                setUploading(false);
                return;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image: data.publicUrl });
        } catch (error) {
            console.error("Error:", error);
            alert("خطایی رخ داد");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("morho_admin_auth");
        navigate("/");
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsFeaturedEdit(false);
        setFormData(emptyProduct);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFeaturedEdit(false);
        setFormData(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
            deleteProduct(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFeaturedEdit) {
            updateFeaturedProduct({
                title: formData.name,
                subtitle: formData.category, // Using category field for subtitle
                description: formData.description,
                price: formData.price,
                image: formData.image,
                badge: formData.badge || "پیشنهاد مورفو"
            });
        } else if (editingProduct) {
            updateProduct({ ...formData, id: editingProduct.id });
        } else {
            addProduct(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-morho-dark text-foreground p-4 sm:p-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-morho-lavender to-morho-blue">
                        پنل مدیریت
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        خروج
                    </button>
                </div>

                {/* Actions */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={handleAddNew}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-accent font-semibold shadow-glow hover:brightness-110 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        افزودن محصول جدید
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null); // Clear product editing state
                            setFormData({
                                ...emptyProduct,
                                name: featuredProduct.title,
                                description: featuredProduct.description,
                                price: featuredProduct.price,
                                image: featuredProduct.image,
                                badge: featuredProduct.badge,
                                category: featuredProduct.subtitle // Using category field for subtitle hackily for now or add explicit field
                            });
                            // Better approach: use a specific state mode
                            setIsFeaturedEdit(true);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-morho-gold/10 border border-morho-gold/20 text-morho-gold font-semibold hover:bg-morho-gold/20 transition-all"
                    >
                        <Star className="w-5 h-5" />
                        ویرایش پیشنهاد ویژه
                    </button>
                </div>

                {/* Products List */}
                <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl glass-card border border-white/5 hover:border-white/10 transition-all"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full sm:w-24 h-24 rounded-xl object-cover"
                            />
                            <div className="flex-1 text-center sm:text-right">
                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-1">{product.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                    <span className="text-xs px-2 py-1 rounded-full bg-morho-royal/50">
                                        {categories.find(c => c.id === product.category)?.label || product.category}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-accent text-white font-bold">
                                        {product.price}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 min-w-max">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-morho-deep border border-white/10 rounded-2xl p-6 m-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">
                                    {editingProduct ? "ویرایش محصول" : "محصول جدید"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">نام محصول</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">دسته‌بندی</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none appearance-none"
                                    >
                                        {categories.filter(c => c.id !== "all" && c.id !== "favorites").map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-morho-deep text-foreground">
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">قیمت</label>
                                    <input
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none text-white"
                                        placeholder="مثلا: ۴۵,۰۰۰"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">واحد «تومان» به صورت خودکار اضافه می‌شود.</p>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">توضیحات</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none min-h-[100px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">نشان (اولویت/تگ)</label>
                                    <input
                                        value={formData.badge || ""}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none"
                                        placeholder="پیشنهادی، محبوب، ..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-muted-foreground">تصویر محصول</label>

                                    {/* File Upload */}
                                    <div className="flex gap-2 mb-2">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">آپلود عکس جدید</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    {uploading && <p className="text-xs text-yellow-400 mb-2">در حال آپلود...</p>}

                                    <input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-morho-lavender outline-none text-left text-xs text-muted-foreground"
                                        dir="ltr"
                                        placeholder="یا لینک تصویر را وارد کنید"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3 rounded-xl bg-gradient-accent font-bold mt-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {uploading ? "لطفا صبر کنید..." : "ذخیره محصول"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
