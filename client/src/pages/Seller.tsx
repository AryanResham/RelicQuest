import { useState } from "react"
import { SellerForm } from "../components/SellerForm"
import type { Product } from "../types/product"
import Header from "@/components/Header"

export default function Seller() {
  const [isLoading, setIsLoading] = useState(false)

  const handleProductSubmit = async (data: any) => {
    setIsLoading(true)
    
    try {
      // Generate a unique ID for the product
      const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create the product object according to the Product interface
      const newProduct: Product = {
        id: productId,
        name: data.name,
        description: data.description,
        category: data.category,
        seller: data.seller,
        condition: data.condition,
        rating: 0, // Default rating for new products
        reviews: 0, // Default review count
        image: data.image || "/placeholder.jpg",
        specifications: data.specifications || {},
        
        // Pricing fields based on type
        ...(data.pricingType === "fixed" ? {
          price: data.price,
          originalPrice: data.originalPrice,
          discount: data.discount,
          isAuction: false,
        } : {
          startingBid: data.startingBid,
          currentBid: data.startingBid,
          minBidIncrement: data.minBidIncrement,
          auctionEndTime: data.auctionEndTime,
          isAuction: true,
          price: data.startingBid, // Set price to starting bid for display
          bidHistory: [],
        })
      }

      // Here you would typically send the data to your backend API
      console.log("New Product:", newProduct)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert("Product listed successfully!")
      
    } catch (error) {
      console.error("Error listing product:", error)
      alert("Failed to list product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header cartCount={0} />
      <div className="container mx-auto py-8">
        <SellerForm 
          onSubmit={handleProductSubmit} 
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}