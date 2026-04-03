import { Link } from 'react-router-dom';
import { Header, Footer } from '../components/layout';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-dark)]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">404</p>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Page not found
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/auctions"
            className="px-6 py-3 border border-[var(--border)] hover:border-primary text-white font-bold rounded-lg transition-colors"
          >
            Browse Auctions
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
