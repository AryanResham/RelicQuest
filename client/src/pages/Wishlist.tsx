import { Heart, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import { useCart } from "@/contexts/CartContext"
import { useNavigate } from "react-router-dom"
import type { Product } from "@/types/product"

export default function Wishlist() {
  const { wishlist, cart, removeFromWishlist, clearWishlist, addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id)
  }

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cart.length} wishlistCount={wishlist.length} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Save items you love for later</p>
          </div>

          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding items you love to your wishlist</p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.length} wishlistCount={wishlist.length} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
          </div>
          {wishlist.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => handleViewProduct(product.id)}
                  />
                </div>
                
                {/* Remove from wishlist button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 p-0 bg-white hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Discount badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}

                {/* Auction badge */}
                {product.isAuction && (
                  <Badge className="absolute bottom-2 left-2 bg-blue-500 hover:bg-blue-600">
                    Auction
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 
                    className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  {product.condition && (
                    <Badge variant="outline" className="text-xs">
                      {product.condition}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {product.isAuction ? (
                    <div>
                      <p className="text-sm text-gray-600">Current Bid</p>
                      <p className="text-lg font-bold text-green-600">
                        ${product.currentBid?.toFixed(2) || product.startingBid?.toFixed(2)}
                      </p>
                      {product.auctionEndTime && (
                        <p className="text-xs text-gray-500">
                          Ends: {new Date(product.auctionEndTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProduct(product.id)}
                    className="flex-1"
                  >
                    {product.isAuction ? 'View Auction' : 'View Details'}
                  </Button>
                  
                  {!product.isAuction && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}