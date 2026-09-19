export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        inset: "var(--bg-inset)",
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["Figtree", "sans-serif"],
      },
      fontSize: {
        display: ["34px", { lineHeight: "40px", fontWeight: "800", letterSpacing: "-0.03em" }],
        h1: ["24px", { lineHeight: "30px", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["19px", { lineHeight: "26px", fontWeight: "600", letterSpacing: "-0.015em" }],
        body: ["15px", { lineHeight: "23px", fontWeight: "400" }],
        bodymd: ["15px", { lineHeight: "23px", fontWeight: "500" }],
        label: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        caption: ["11px", { lineHeight: "14px", fontWeight: "600", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        full: "var(--r-full)",
      },
      boxShadow: {
        glowAccent: "var(--glow-accent)",
        glowSoft: "var(--glow-soft)",
      },
      animation: {
        drift: "drift 60s linear infinite",
        pulseslow: "pulse-slow 4s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
        floaty: "floaty 2.4s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(44px, 44px, 0)" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.035)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -6px, 0)" },
        },
      },
    },
  },
  plugins: [],
};
