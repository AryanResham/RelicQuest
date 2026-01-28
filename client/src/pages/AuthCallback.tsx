import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // The auth state change listener in AuthContext will handle the session
    // This page just provides a loading state while the OAuth callback is processed
    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-dark)]">
      <div className="text-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Completing sign in...</p>
      </div>
    </div>
  );
}
