import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatPrice - Ensures price doesn't contain duplicate "تومان" 
 * and is clean for UI rendering
 */
export function formatPrice(price: string): string {
  if (!price) return "";
  // Strip "تومان" and any extra whitespace
  return price.replace(/تومان/g, "").trim();
}
