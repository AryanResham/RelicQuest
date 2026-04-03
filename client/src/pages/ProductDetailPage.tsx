import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useItem } from "@/hooks/useItem";
import { useRelatedItems } from "@/hooks/useRelatedItems";
import { queryKeys } from "@/lib/queryKeys";

// Import new components
import { ProductGallery } from "@/components/product-listing/ProductGallery";
import { ProductDescription } from "@/components/product-listing/ProductDescription";
import { BiddingCard } from "@/components/product-listing/BiddingCard";
import { SellerInfo } from "@/components/product-listing/SellerInfo";
import { RelatedItems } from "@/components/product-listing/RelatedItems";

function calculateTimeRemaining(endTime: string) {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isEnded: false };
}

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: item, isLoading: loading, error } = useItem(id);
  const { data: relatedItems = [] } = useRelatedItems(id, item?.category_id);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false });

  // Refresh item data after placing a bid (invalidate cache → React Query refetches)
  const refreshItem = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(id) });
    }
  };

  // Update time remaining every second
  useEffect(() => {
    if (!item) return;

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(item.end_time));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [item]);

  // When auction timer hits 0, refetch item (triggers lazy close + winner_id), won items, and watchlist
  useEffect(() => {
    if (timeRemaining.isEnded && id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.items.won });
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.byUser });
    }
  }, [timeRemaining.isEnded, id, queryClient]);

  // Computed values
  const isLive = useMemo(() => !timeRemaining.isEnded, [timeRemaining.isEnded]);

  // Loading state
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-text-secondary">Loading auction...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Item Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              {error?.message || "The auction item you're looking for doesn't exist."}
            </p>
            <Link to="/">
              <Button variant="primary">Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-5">
        
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 py-4 mb-4">
            <Link
              to="/"
              className="text-text-secondary text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="text-text-secondary text-sm font-medium">/</span>
            <span className="text-text-secondary text-sm font-medium hover:text-primary cursor-pointer transition-colors" >
              Auctions
            </span>
            <span className="text-text-secondary text-sm font-medium">/</span>
            <span className="text-white text-sm font-medium truncate max-w-[200px]">
              {item.title}
            </span>
        </nav>

        {/* Layout Grid */}
        <div className="flex justify-end gap-8">
          
          {/* Left Column: Title, Image, Description */}
          <div className="flex flex-col flex-2">
            
            {/* Header Info (Title & Badges) */}
            <div>
              {/* <div className="flex items-center gap-2 mb-3">
                {item.is_verified && (
                  <span className="flex items-center gap-1 text-text-secondary text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px] text-blue-400">
                      verified
                    </span>
                    Verified
                  </span>
                )}
              </div> */}
              <h1 className="text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight mb-2">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-8">
                <span className="material-symbols-outlined text-[16px] text-blue-400">
                  verified
                </span>
                <span>Authenticity Guaranteed by {item.seller?.store_name || "RelicQuest"}</span>
              </div>
            </div>

            {/* Main Image Stage & Thumbnails */}
            <ProductGallery images={item.images} />

            {/* Description Section */}
            <div className="flex gap-8 mt-8">
              <div className="flex-2">
                <ProductDescription
                  description={item.description}
                  min_price={item.min_price}
                  start_price={item.start_price}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Bidding Card & Seller Info */}
          <div className="flex-1 sticky top-0">
             <div className="flex flex-col gap-6">
                
                <BiddingCard 
                  item={item} 
                  isLive={isLive} 
                  timeRemaining={timeRemaining}
                  onBidPlaced={refreshItem}
                />

                {item.seller && <SellerInfo seller={item.seller} />}
             </div>
          </div>
        </div>       

        {/* Similar Items */}
        <RelatedItems items={relatedItems} />
        
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
