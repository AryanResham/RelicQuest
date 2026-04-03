import { createBrowserRouter } from "react-router";
import StorefrontPage from "./pages/StorefrontPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./pages/AuthCallback";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import ListItemPage from "./pages/ListItemPage";
import { PublicOnlyRoute, ProtectedRoute, SellerOnlyRoute } from "./components/auth";
import BrowseAuctionsPage from "./pages/BrowseAuctionsPage";

const Router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <StorefrontPage />
  },
  {
    path: "/auctions",
    element: <BrowseAuctionsPage />
  },
  {
    path: "/auction/:id",
    element: <ProductDetailPage />
  },

  // Auth routes (public only - redirect if logged in)
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicOnlyRoute>
        <SignupPage />
      </PublicOnlyRoute>
    )
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  },

  // Protected routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/become-seller",
    element: (
      <ProtectedRoute>
        <BecomeSellerPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/list-item",
    element: (
      <SellerOnlyRoute>
        <ListItemPage />
      </SellerOnlyRoute>
    )
  },
])

export default Router