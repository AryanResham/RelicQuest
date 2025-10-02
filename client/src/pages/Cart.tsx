import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header  from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { Minus, Plus, X } from "lucide-react"

export default function Cart() {
  const navigate = useNavigate()
  const { cart, wishlist, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const subtotal = getCartTotal()
  const shipping: number = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cart.length} wishlistCount={wishlist.length} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground">
            <span>Home</span> / <span className="text-foreground">Cart</span>
          </nav>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 py-4 border-b font-semibold">
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Subtotal</div>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="grid grid-cols-4 gap-4 py-4 border-b items-center">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span 
                      className="font-medium cursor-pointer hover:text-red-500 transition-colors" 
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div>${item.price}</div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline">Return To Shop</Button>
              <Button variant="outline">Update Cart</Button>
            </div>

            {/* Coupon and Total */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex space-x-4">
                <Input
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-red-500 text-white hover:bg-red-600">Apply Coupon</Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Cart Total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-red-500 text-white hover:bg-red-600 mt-4">Proceed to checkout</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
