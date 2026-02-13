import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toEnglishDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  return str.toString()
    .replace(/[۰-۹]/g, (w) => persianDigits.indexOf(w).toString())
    .replace(/[٠-٩]/g, (w) => arabicDigits.indexOf(w).toString());
}

export function formatPrice(price: number | string): string {
  if (!price) return "0";
  const strPrice = price.toString();
  const cleanPrice = toEnglishDigits(strPrice).replace(/\D/g, ""); // Remove non-digits
  const numPrice = parseInt(cleanPrice, 10);
  return isNaN(numPrice) ? "0" : numPrice.toLocaleString('fa-IR');
}

export function parsePrice(price: number | string): number {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const cleanStr = toEnglishDigits(price.toString()).replace(/\D/g, ""); // Keep only digits
  return parseInt(cleanStr, 10) || 0;
}
