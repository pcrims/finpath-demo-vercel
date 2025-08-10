/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0C0D0E",
        paper: "#EFF1F3",
        surface: "#F7F8F9",
        chip: "#ECEEF1",
        neon: "#D8FF3F",
        neonDark: "#B8E62E",
        mute: "#6B7280"
      },
      boxShadow: {
        depth: "0 18px 44px rgba(0,0,0,.08), 0 2px 10px rgba(0,0,0,.05)",
        depthDark: "0 18px 44px rgba(0,0,0,.45), 0 2px 10px rgba(0,0,0,.35)"
      },
      borderRadius: { xl2: "1.25rem", pill: "999px" }
    }
  },
  plugins: [],
}