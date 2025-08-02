// import type { Config } from "tailwindcss";

const config: Config = {
  // darkMode can be enabled if needed
  // darkMode: 'class',
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        border: "#e5e7eb", // Cool gray 200
        input: "#f3f4f6", // Cool gray 100
        ring: "#3b82f6", // Blue 500
        background: "#ffffff", // White
        foreground: "#111827", // Cool gray 900
        primary: {
          DEFAULT: "#2563eb", // Blue 600
          foreground: "#ffffff", // White
        },
        secondary: {
          DEFAULT: "#6b7280", // Cool gray 500
          foreground: "#ffffff", // White
        },
        destructive: {
          DEFAULT: "#dc2626", // Red 600
          foreground: "#ffffff", // White
        },
        muted: {
          DEFAULT: "#9ca3af", // Cool gray 400
          foreground: "#6b7280", // Cool gray 500
        },
        accent: {
          DEFAULT: "#f97316", // Orange 500
          foreground: "#ffffff", // White
        },
        gold: {
          DEFAULT: "#b45309", // Amber 700
          foreground: "#ffffff", // White
        },
        popover: {
          DEFAULT: "#f9fafb", // Gray 50
          foreground: "#111827", // Cool gray 900
        },
        card: {
          DEFAULT: "#f3f4f6", // Gray 100
          foreground: "#111827", // Cool gray 900
        },
        sidebar: {
          DEFAULT: "#1f2937", // Gray 800
          foreground: "#9ca3af", // Gray 400
          primary: "#2563eb", // Blue 600
          "primary-foreground": "#ffffff",
          accent: "#f97316", // Orange 500
          "accent-foreground": "#ffffff",
          border: "#374151", // Gray 700
          ring: "#3b82f6", // Blue 500
        },
      },
      borderRadius: {
        lg: "0.5rem", // 8px
        md: "0.375rem", // 6px
        sm: "0.25rem", // 4px
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [], // Removed tailwindcss-animate plugin
};

export default config;
