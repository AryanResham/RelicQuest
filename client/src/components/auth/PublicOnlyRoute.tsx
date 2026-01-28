import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * PublicOnlyRoute - Wrapper for routes that should only be accessible when NOT logged in
 * Example: Login, Signup pages - logged in users should be redirected away
 */
export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-dark)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to home or where they came from
  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // User is not authenticated, render the public content (login/signup)
  return <>{children}</>;
}
