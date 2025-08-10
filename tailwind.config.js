/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0C0D0E",
        paper: "#EFF1F3",
        neon: "#D8FF3F",
        mute: "#6B7280",
        chip: "#ECEEF1",
        surface: "#F7F8F9"
      },
      boxShadow: { depth: "0 18px 44px rgba(0,0,0,.08), 0 2px 10px rgba(0,0,0,.05)" },
      borderRadius: { xl2: "1.25rem", pill: "999px" }
    }
  },
  plugins: [],
}