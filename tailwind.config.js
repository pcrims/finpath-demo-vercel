export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink:"#0B0C0D", paper:"#F6F7F9", neon:"#D8FF3F", mute:"#6B7280", chip:"#ECEEF1", surface:"#F7F8F9" },
      boxShadow: { depth: "0 18px 44px rgba(0,0,0,.06), 0 2px 10px rgba(0,0,0,.04)" },
      borderRadius: { xl2: "1.25rem", pill: "999px" }
    }
  },
  plugins: [],
}