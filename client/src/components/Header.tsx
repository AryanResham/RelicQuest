"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Heart, ShoppingCart, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../contexts/AuthContext"

interface HeaderProps {
  cartCount: number
  wishlistCount?: number
}

export default function Header({ cartCount, wishlistCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const { user, signOut } = useAuth()

  const getLinkClass = (path: string) => {
    const baseClass = "text-foreground hover:text-red-500 transition-colors"
    const activeClass = "text-red-500 font-semibold"
    return location.pathname === path ? `${baseClass} ${activeClass}` : baseClass
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="border-b bg-background">
      {/* Top banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Summer Sale For All Collectibles And Free Express Delivery - OFF 50%! ShopNow
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-red-500 transition-colors">
            RelicQuest
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/wishlist" className={getLinkClass("/wishlist")}>
              Wishlist
            </Link>
            {user && (
              <Link to="/sell" className={getLinkClass("/sell")}>
                Sell
              </Link>
            )}
            <Link to="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>
            <Link to="/about" className={getLinkClass("/about")}>
              About
            </Link>
            {!user && (
              <Link to="/signup" className={getLinkClass("/signup")}>
                Sign Up
              </Link>
            )}
          </nav>

          {/* Search and actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.displayName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
