import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "./contexts/CartContext"
import Cart from "./pages/Cart"
import StoreFront from "./pages/StoreFront"
import { ProductDetail } from "./pages/ProductDetail"
import Wishlist from "./pages/Wishlist"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StoreFront />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App

