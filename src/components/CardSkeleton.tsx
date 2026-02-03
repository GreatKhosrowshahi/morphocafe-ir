import { motion } from "framer-motion";

/**
 * CardSkeleton - Loading state for ProductCard
 * Mobile-optimized skeleton with shimmer animation
 */
const CardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-base w-full"
        >
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-morho-deep/50">
                <div className="skeleton w-full h-full" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Title & Rating */}
                <div className="flex justify-between items-start gap-2">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-5 w-12 rounded-md" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="skeleton h-2 w-8 rounded" />
                        <div className="skeleton h-4 w-16 rounded" />
                    </div>
                    <div className="skeleton w-10 h-10 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
};

export default CardSkeleton;
