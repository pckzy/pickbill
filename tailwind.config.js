/** @type {import('tailwindcss').Config} */ 
export default {
  darkMode: "class", 
  content: [ 
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
  ], 
  theme: { 
    extend: {
      colors: {
        "on-secondary": "#003731",
        "background": "#111318",
        "on-primary": "#002e6a",
        "surface-bright": "#37393e",
        "on-tertiary-fixed-variant": "#574500",
        "inverse-surface": "#e2e2e8",
        "surface": "#111318",
        "on-tertiary": "#3c2f00",
        "secondary-container": "#03c6b2",
        "surface-dim": "#111318",
        "error-container": "#93000a",
        "on-primary-fixed": "#001a42",
        "primary-container": "#4d8eff",
        "on-secondary-fixed": "#00201c",
        "on-secondary-container": "#004d44",
        "tertiary-fixed": "#ffe083",
        "surface-container-low": "#1a1c20",
        "surface-container-high": "#282a2e",
        "outline-variant": "#424754",
        "inverse-primary": "#005ac2",
        "on-tertiary-fixed": "#231b00",
        "on-error-container": "#ffdad6",
        "on-primary-fixed-variant": "#004395",
        "surface-container-highest": "#333539",
        "surface-container": "#1e2024",
        "on-error": "#690005",
        "on-secondary-fixed-variant": "#005047",
        "on-tertiary-container": "#4e3e00",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-background": "#e2e2e8",
        "surface-tint": "#adc6ff",
        "outline": "#8c909f",
        "primary": "#adc6ff",
        "secondary-fixed": "#62fae3",
        "tertiary": "#eec200",
        "secondary": "#44e2cd",
        "tertiary-container": "#cea700",
        "secondary-fixed-dim": "#3cddc7",
        "on-surface": "#e2e2e8",
        "on-surface-variant": "#c2c6d6",
        "surface-container-lowest": "#0c0e12",
        "error": "#ffb4ab",
        "tertiary-fixed-dim": "#eec200",
        "surface-variant": "#333539",
        "inverse-on-surface": "#2f3035",
        "on-primary-container": "#00285d"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "xs": "4px",
        "container-padding": "24px",
        "xl": "32px",
        "sm": "8px",
        "gutter": "20px",
        "md": "16px",
        "unit": "4px",
        "lg": "24px"
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "mono-code": ["JetBrains Mono", "monospace"],
        "mono-label": ["JetBrains Mono", "monospace"],
        "headline-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "mono-code": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "mono-label": ["12px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" }],
        "headline-sm": ["20px", { lineHeight: "1.4", fontWeight: "600" }]
      }
    }, 
  }, 
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ], 
} 
