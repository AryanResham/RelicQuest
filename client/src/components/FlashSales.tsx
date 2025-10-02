import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFlashSaleProducts } from "@/data/products"
import type { Product } from "@/types/product"

interface FlashSalesProps {
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
  wishlist: Product[]
}

export function FlashSales({ onAddToCart, onAddToWishlist, wishlist }: FlashSalesProps) {
  const navigate = useNavigate()
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  })

  // Fetch flash sale products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const products = await getFlashSaleProducts()
        setFlashSaleProducts(products)
      } catch (error) {
        console.error('Error fetching flash sale products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flash sales...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-5 h-10 bg-red-500 rounded"></div>
        <span className="text-red-500 font-semibold">Today's</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-8">
          <h2 className="text-4xl font-bold">Flash Sales</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Days</div>
              <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, "0")}</div>
            </div>
            <span className="text-red-500 text-2xl">:</span>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Hours</div>
              <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
            </div>
            <span className="text-red-500 text-2xl">:</span>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Minutes</div>
              <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
            </div>
            <span className="text-red-500 text-2xl">:</span>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Seconds</div>
              <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {flashSaleProducts.map((product) => (
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
                  className="font-semibold mb-2 cursor-pointer hover:text-red-500 transition-colors" 
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

      <div className="text-center">
        <Button className="bg-red-500 text-white hover:bg-red-600 px-12">View All Products</Button>
      </div>
    </section>
  )
}
