import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['Vazirmatn', 'sans-serif'],
        price: ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "rgba(8,44,135,0.3)",
        background: "#F9FAFB",
        foreground: "#111827",
        luxury: {
          deep: "#0e1040",
          surface: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
          primary: "#f0f4ff",
          muted: "#64748b",
          violet: "#7c3aed",
          cyan: "#00d4ff",
        },
        primary: {
          DEFAULT: "#082C87",
          foreground: "#FFFFFF",
          50: "#F2F6FF",
          100: "#DCE5FA",
          200: "#9BB0E6",
          300: "#5F7DCE",
          400: "#2A4FB3",
          500: "#082C87",
          600: "#0A3CA0",
          700: "#07307A",
          800: "#06236B",
          900: "#041A4F",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          active: "#B45309",
          light: "#FEF3C7",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
          light: "#FEE2E2",
        },
        info: {
          DEFAULT: "#0EA5E9",
          light: "#E0F2FE",
        },
        /* ───────────────────────────────────────────────
         * Legacy morho-* aliases → new professional palette
         * These map old class names used in customer-facing
         * components to the new blue/orange design tokens.
         * ─────────────────────────────────────────────── */
        "morho-deep": "#041A4F",   // primary-900
        "morho-royal": "#082C87",   // primary-500
        "morho-lavender": "#5F7DCE",   // primary-300
        "morho-gold": "#F59E0B",   // accent
        "morho-violet": "#2A4FB3",   // primary-400
        "morho-dark": "#020617",     // near-black (slate-950)
      },
      borderRadius: {
        lg: "20px",
        md: "12px",
        sm: "8px",
        pill: "50px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        'card': '0 4px 24px rgba(8, 44, 135, 0.06)',
        'hover': '0 8px 30px rgba(8, 44, 135, 0.08)',
        'glow': '0 0 20px rgba(8, 44, 135, 0.15)',
        'glow-accent': '0 4px 14px rgba(245, 158, 11, 0.3)',
        'card-active': '0 2px 8px rgba(8, 44, 135, 0.12)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;