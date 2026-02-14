import { Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice, parsePrice } from "@/lib/utils";
import { CartItem as CartItemType } from "../types/cart.types";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    return (
        <div className="group relative flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            {/* Remove Button - Top Right corner on hover */}
            <button
                onClick={() => onRemove(item.id)}
                className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600 scale-90 hover:scale-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between pt-1">
                <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">
                        {item.name}
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">
                        {item.badge || 'انتخاب مورفو'}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black w-5 text-center text-white tabular-nums">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="text-right">
                        <span className="block text-xs text-white/40 font-bold mb-0.5">قیمت واحد: {formatPrice(item.price)}</span>
                        <div className="font-black text-morho-gold text-lg leading-none">
                            {formatPrice(parsePrice(item.price) * item.quantity)} <span className="text-[10px] text-white/60 font-medium">تومان</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
