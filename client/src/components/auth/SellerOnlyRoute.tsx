import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import { supabase } from "../../supabase";

interface SellerOnlyRouteProps {
  children: React.ReactNode;
}

export default function SellerOnlyRoute({ children }: SellerOnlyRouteProps) {
  const { user, loading: authLoading } = useAuthContext();
  const location = useLocation();
  const [isSeller, setIsSeller] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSellerStatus = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_seller')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking seller status:', error);
          setIsSeller(false);
        } else {
          setIsSeller(data?.is_seller ?? false);
        }
      } catch (err) {
        console.error('Error checking seller status:', err);
        setIsSeller(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkSellerStatus();
    }
  }, [user?.id, authLoading]);

  // Show loading spinner while checking auth and seller status
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-dark)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to become-seller if not a seller
  if (!isSeller) {
    return <Navigate to="/become-seller" replace />;
  }

  // User is authenticated and is a seller, render the content
  return <>{children}</>;
}
