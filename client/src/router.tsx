import { createBrowserRouter } from "react-router";
import StorefrontPage from "./pages/StorefrontPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./pages/AuthCallback";
import { PublicOnlyRoute } from "./components/auth";

const Router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <StorefrontPage />
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
  }

  // Protected routes example (uncomment when you have protected pages):
  // {
  //   path: "/profile",
  //   element: (
  //     <ProtectedRoute>
  //       <ProfilePage />
  //     </ProtectedRoute>
  //   )
  // },
])

export default Router