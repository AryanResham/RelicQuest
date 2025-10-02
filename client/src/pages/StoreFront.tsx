import { Categories } from "../components/Categories"
import { FlashSales } from "../components/FlashSales"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import ProductGrid from "../components/ProductGrid"
import { useCart } from "../contexts/CartContext"

function StoreFront() {
  const { cart, addToCart, wishlist, addToWishlist } = useCart()

  return (
    <>
        <Header cartCount={cart.length} wishlistCount={wishlist.length} />
        <HeroSection />

        <FlashSales
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            wishlist={wishlist}
        />
        <Categories />
        <ProductGrid
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            wishlist={wishlist}
        />  
      </>
  )
}

export default StoreFront