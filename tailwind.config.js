/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ['ui-sans-serif','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Inter','Helvetica Neue','Arial','Noto Sans'] },
      colors: {
        ink: '#0B0B0E',
        paper: '#F6F6F8',
        card: '#FFFFFF',
        lilac: '#EAE4FF',
        mint: '#E3F6F1',
        peach: '#FFE6E0',
        lemon: '#FFF6CF'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,.06), 0 2px 12px rgba(0,0,0,.04)',
        softDark: '0 12px 40px rgba(0,0,0,.45), 0 2px 12px rgba(0,0,0,.35)'
      },
      borderRadius: { xl2: '1.25rem', pill: '999px' }
    }
  },
  plugins: [],
}