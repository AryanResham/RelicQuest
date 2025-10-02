import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import Header from "@/components/Header"
import useCart from "@/hooks/useCart"
import useWishlist from "@/hooks/useWishlist"

export default function NotFound() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const { wishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.length} wishlistCount={wishlist.length} />
      <div className="flex items-center justify-center" style={{minHeight: "calc(100vh - 120px)"}}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}