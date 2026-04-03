import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Uncaught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-dark)] px-4 text-center">
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4">Something went wrong</p>
          <h1 className="text-white text-3xl font-extrabold mb-4">Unexpected error</h1>
          <p className="text-text-secondary mb-8">Try refreshing the page. If it keeps happening, go back home.</p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-6 py-3 border border-[var(--border)] hover:border-primary text-white font-bold rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
