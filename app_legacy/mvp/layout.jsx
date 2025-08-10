import '../../../styles/globals.css';

export const metadata = {
  title: 'Financial Education MVP',
  description: 'Three-track curriculum with lessons and quizzes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
          <footer>© 2025 Financial Education MVP</footer>
        </div>
      </body>
    </html>
  );
}
