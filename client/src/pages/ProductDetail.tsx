import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { getProductById } from '@/data/products';
import type { Product } from '@/types/product';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await getProductById(id);
        
        if (!productData) {
          setError('Product not found');
        } else {
          setProduct(productData);
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.isAuction && product.auctionEndTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(product.auctionEndTime!).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Auction ended');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cart.length} wishlistCount={wishlist.length} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cart.length} wishlistCount={wishlist.length} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Product Not Found'}
            </h1>
            <Button onClick={() => navigate('/')} className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.isAuction) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handlePlaceBid = () => {
    const bid = parseFloat(bidAmount);
    if (product.isAuction && bid > (product.currentBid || 0) && bid >= (product.startingBid || 0)) {
      console.log(`Bid placed: $${bid} for product ${product.id}`);
      setBidAmount('');
      alert('Bid placed successfully!');
    } else {
      alert('Invalid bid amount. Please enter a higher bid.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.length} wishlistCount={wishlist.length} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
              <p className="text-gray-700 text-lg">{product.description}</p>
            </div>

            {product.isAuction ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="destructive">Live Auction</Badge>
                    <div className="flex items-center text-red-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-mono">{timeLeft}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Bid</p>
                      <p className="text-3xl font-bold text-green-600">${product.currentBid?.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Place Your Bid (Min: ${product.startingBid})</p>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={`Min $${((product.currentBid || 0) + 1).toFixed(2)}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={handlePlaceBid} className="bg-green-600 hover:bg-green-700">
                          Place Bid
                        </Button>
                      </div>
                    </div>

                    {product.bidHistory && product.bidHistory.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recent Bids</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {product.bidHistory.slice(-5).reverse().map((bid, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>${bid.amount.toFixed(2)}</span>
                              <span className="text-gray-500">
                                {new Date(bid.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <Badge variant="destructive">{product.discount}% OFF</Badge>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={handleAddToCart} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleWishlistToggle}
                    variant={isInWishlist(product.id) ? "default" : "outline"}
                    className="px-4"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            )}

            {product.specifications && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.isAuction && (
              <Button
                onClick={handleWishlistToggle}
                variant={isInWishlist(product.id) ? "default" : "outline"}
                className="w-full"
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};