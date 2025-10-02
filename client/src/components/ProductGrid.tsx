import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCollectibleProducts } from "@/data/products"
import type { Product } from "@/types/product"

interface ProductGridProps {
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
  wishlist: Product[]
}

export default function ProductGrid({ onAddToCart, onAddToWishlist, wishlist }: ProductGridProps) {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch collectible products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const collectibleProducts = await getCollectibleProducts()
        setProducts(collectibleProducts)
      } catch (error) {
        console.error('Error fetching collectible products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-5 h-10 bg-red-500 rounded"></div>
        <span className="text-red-500 font-semibold">Our Products</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold">Explore Our Collectibles</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group relative overflow-hidden">
            {product.discount && (
              <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white">-{product.discount}%</Badge>
            )}
            <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white"
                onClick={() => onAddToWishlist(product)}
              >
                <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-red-500 text-red-500")} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <div 
                className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer" 
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 
                  className="font-semibold mb-2 text-balance cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-red-500 font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through text-sm">${product.originalPrice}</span>
                  )}
                </div>
                {product.isAuction && (
                  <div className="text-sm text-muted-foreground mb-2">Current Bid: ${product.currentBid}</div>
                )}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn("text-sm", i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300")}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={() => onAddToCart(product)}>
                  {product.isAuction ? "Place Bid" : "Add To Cart"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
