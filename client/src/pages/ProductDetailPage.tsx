import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  getProductById,
  getRelatedProducts,
  formatCurrency,
  type Product,
} from "@/data/products";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState<
    "description" | "history" | "shipping"
  >("description");

  if (!product) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              The auction item you're looking for doesn't exist.
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

  const relatedProducts = getRelatedProducts(product.id);
  const allImages = [product.mainImage, ...product.thumbnails];
  const nextBidAmount = product.currentBid + 1000;

  const handleQuickBid = (increment: number) => {
    setBidAmount(String(product.currentBid + increment));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 lg:px-20 py-5">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 py-4 mb-4">
            <Link
              to="/"
              className="text-text-secondary text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="text-text-secondary text-sm font-medium">/</span>
            <span className="text-text-secondary text-sm font-medium hover:text-primary cursor-pointer transition-colors">
              {product.category.main}
            </span>
            <span className="text-text-secondary text-sm font-medium">/</span>
            <span className="text-white text-sm font-medium">
              {product.category.sub}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Media Gallery */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              {/* Main Image */}
              <div className="w-full relative group rounded-xl overflow-hidden bg-card-dark border border-[#292e38] shadow-sm">
                <div
                  className="aspect-[4/3] w-full bg-contain bg-center bg-no-repeat cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${allImages[selectedImage]}")`,
                  }}
                />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    zoom_in
                  </span>
                  Click to zoom
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-3">
                {allImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`cursor-pointer rounded-lg overflow-hidden h-20 bg-card-dark transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "border border-[#292e38] opacity-70 hover:opacity-100 hover:border-primary"
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${image}")`,
                      }}
                    />
                  </button>
                ))}
                {allImages.length > 4 && (
                  <button className="cursor-pointer flex items-center justify-center border border-[#292e38] hover:border-primary rounded-lg h-20 bg-card-dark opacity-70 hover:opacity-100 transition-all">
                    <span className="text-text-secondary text-sm font-medium">
                      +{allImages.length - 4}
                    </span>
                  </button>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="mt-8 border-b border-[#292e38]">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`border-b-2 pb-3 font-medium text-base transition-colors ${
                      activeTab === "description"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-secondary hover:text-white"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`border-b-2 pb-3 font-medium text-base transition-colors ${
                      activeTab === "history"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-secondary hover:text-white"
                    }`}
                  >
                    Bidding History
                  </button>
                  <button
                    onClick={() => setActiveTab("shipping")}
                    className={`border-b-2 pb-3 font-medium text-base transition-colors ${
                      activeTab === "shipping"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-secondary hover:text-white"
                    }`}
                  >
                    Shipping & Returns
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="py-6 text-gray-300 leading-relaxed">
                {activeTab === "description" && (
                  <>
                    {product.description.map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}

                    <h3 className="text-lg font-bold text-white mt-6 mb-2">
                      Item Specifics
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                      <li>Year: {product.year}</li>
                      <li>Manufacturer: {product.manufacturer}</li>
                      <li>Player: {product.player}</li>
                      <li>Grade: {product.grade}</li>
                      <li>
                        Certification Number: {product.certificationNumber}
                      </li>
                    </ul>
                  </>
                )}

                {activeTab === "history" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-[#292e38]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary text-sm font-bold">
                            B
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Bidder ****4521
                          </p>
                          <p className="text-text-secondary text-sm">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      <span className="text-primary font-bold">
                        {formatCurrency(product.currentBid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-[#292e38]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#292e38] rounded-full flex items-center justify-center">
                          <span className="text-text-secondary text-sm font-bold">
                            A
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Bidder ****8923
                          </p>
                          <p className="text-text-secondary text-sm">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                      <span className="text-text-secondary font-bold">
                        {formatCurrency(product.currentBid - 500)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-[#292e38]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#292e38] rounded-full flex items-center justify-center">
                          <span className="text-text-secondary text-sm font-bold">
                            C
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Bidder ****1256
                          </p>
                          <p className="text-text-secondary text-sm">
                            1 day ago
                          </p>
                        </div>
                      </div>
                      <span className="text-text-secondary font-bold">
                        {formatCurrency(product.currentBid - 1200)}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        Shipping Information
                      </h3>
                      <div className="bg-card-dark p-4 rounded-lg border border-[#292e38]">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="material-symbols-outlined text-primary">
                            local_shipping
                          </span>
                          <span className="text-white font-medium">
                            {product.shipping.method}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">
                          Shipping Cost:{" "}
                          {formatCurrency(product.shipping.price)}
                        </p>
                        <p className="text-text-secondary text-sm">
                          Ships From: {product.shipping.location}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        Return Policy
                      </h3>
                      <p className="text-text-secondary">
                        All sales are final. Items are guaranteed authentic by
                        RelicQuest. If you receive an item that differs
                        significantly from its description, please contact our
                        support team within 3 days of delivery.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Action Panel */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Header Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        product.status === "live"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.status === "live" ? "Live Auction" : "Ended"}
                    </span>
                    <span className="flex items-center gap-1 text-text-secondary text-xs font-medium">
                      <span className="material-symbols-outlined text-[14px]">
                        visibility
                      </span>
                      {product.watching} watching
                    </span>
                  </div>
                  <h1 className="text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="material-symbols-outlined text-[16px] text-blue-400">
                      verified
                    </span>
                    <span>Authenticity Guaranteed</span>
                  </div>
                </div>

                {/* Pricing & Timer Card */}
                <div className="p-6 rounded-xl bg-card-dark border border-[#292e38] shadow-lg">
                  <div className="flex flex-col gap-1 mb-6">
                    <p className="text-text-secondary text-sm font-medium">
                      {product.status === "ended" ? "Sold For" : "Current Bid"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-white text-4xl font-bold tracking-tight">
                        {formatCurrency(product.currentBid)}
                      </p>
                      <span className="text-text-secondary text-sm">USD</span>
                    </div>
                    {product.reserveMet && product.status === "live" && (
                      <p className="text-text-secondary text-xs">Reserve met</p>
                    )}
                  </div>

                  {/* Timer */}
                  {product.status === "live" && (
                    <>
                      <div className="bg-[#111621] rounded-lg p-4 mb-6">
                        <p className="text-text-secondary text-xs font-medium mb-3 uppercase tracking-wider text-center">
                          Time Remaining
                        </p>
                        <div className="flex gap-2 justify-between">
                          <div className="flex flex-col items-center">
                            <span className="text-white text-xl font-bold font-mono">
                              {String(product.timeRemaining.days).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            <span className="text-text-secondary text-[10px] uppercase">
                              Days
                            </span>
                          </div>
                          <span className="text-text-secondary font-bold">
                            :
                          </span>
                          <div className="flex flex-col items-center">
                            <span className="text-white text-xl font-bold font-mono">
                              {String(product.timeRemaining.hours).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            <span className="text-text-secondary text-[10px] uppercase">
                              Hrs
                            </span>
                          </div>
                          <span className="text-text-secondary font-bold">
                            :
                          </span>
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-xl font-bold font-mono ${
                                product.timeRemaining.days === 0 &&
                                product.timeRemaining.hours < 6
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                            >
                              {String(product.timeRemaining.minutes).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            <span className="text-text-secondary text-[10px] uppercase">
                              Mins
                            </span>
                          </div>
                          <span className="text-text-secondary font-bold">
                            :
                          </span>
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-xl font-bold font-mono ${
                                product.timeRemaining.days === 0 &&
                                product.timeRemaining.hours < 6
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                            >
                              {String(product.timeRemaining.seconds).padStart(
                                2,
                                "0"
                              )}
                            </span>
                            <span className="text-text-secondary text-[10px] uppercase">
                              Secs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bidding Controls */}
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickBid(100)}
                            className="flex-1 py-2 rounded border border-[#383d47] hover:border-primary text-white text-sm font-bold bg-transparent transition-colors"
                          >
                            +$100
                          </button>
                          <button
                            onClick={() => handleQuickBid(500)}
                            className="flex-1 py-2 rounded border border-[#383d47] hover:border-primary text-white text-sm font-bold bg-transparent transition-colors"
                          >
                            +$500
                          </button>
                          <button
                            onClick={() => handleQuickBid(1000)}
                            className="flex-1 py-2 rounded border border-[#383d47] hover:border-primary text-white text-sm font-bold bg-transparent transition-colors"
                          >
                            +$1,000
                          </button>
                        </div>
                        <div className="flex w-full items-center rounded-lg h-12 bg-[#111621] px-4 border border-transparent focus-within:border-primary transition-colors">
                          <span className="text-text-secondary">$</span>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={String(nextBidAmount)}
                            className="flex-1 bg-transparent border-none text-white placeholder:text-text-secondary focus:ring-0 font-bold text-lg text-right"
                          />
                        </div>
                        <Button
                          variant="primary"
                          fullWidth
                          className="h-12 text-lg shadow-lg shadow-blue-900/20"
                        >
                          Place Bid
                        </Button>
                        <Button variant="outline" fullWidth className="h-10">
                          <span className="material-symbols-outlined text-[18px] mr-2">
                            favorite_border
                          </span>
                          Watch Item
                        </Button>
                      </div>
                    </>
                  )}

                  {product.status === "ended" && (
                    <div className="text-center py-4">
                      <p className="text-text-secondary mb-4">
                        This auction has ended
                      </p>
                      <Link to="/">
                        <Button variant="primary" fullWidth>
                          Browse Active Auctions
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                <div className="p-4 rounded-xl bg-card-dark border border-[#292e38] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                      style={{
                        backgroundImage: `url("${product.seller.avatar}")`,
                      }}
                    />
                    <div>
                      <p className="text-white text-sm font-bold">
                        {product.seller.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-yellow-500">
                          star
                        </span>
                        <p className="text-text-secondary text-xs font-medium">
                          {product.seller.rating} ({product.seller.sales} sold)
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="text-primary text-sm font-bold hover:underline">
                    Contact
                  </button>
                </div>

                {/* Shipping Summary */}
                <div className="p-4 rounded-xl bg-card-dark border border-[#292e38]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#111621] rounded-lg">
                      <span className="material-symbols-outlined text-text-secondary">
                        local_shipping
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">
                        Insured Shipping
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        {product.shipping.method} -{" "}
                        {formatCurrency(product.shipping.price)}
                      </p>
                      <p className="text-text-secondary text-xs">
                        Ships from {product.shipping.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Items */}
          <div className="mt-20 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-bold">
                You Might Also Like
              </h3>
              <Link
                to="/"
                className="text-primary text-sm font-bold hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const timeLabel =
    product.status === "ended"
      ? "Ended"
      : `${product.timeRemaining.days}d ${product.timeRemaining.hours}h`;

  return (
    <Link
      to={`/auction/${product.id}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      <div className="w-full bg-card-dark border border-[#292e38] rounded-xl overflow-hidden aspect-[3/4] relative">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url("${product.mainImage}")` }}
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded px-2 py-1">
          <span className="text-white text-xs font-bold">{timeLabel}</span>
        </div>
      </div>
      <div>
        <h4 className="text-white text-sm font-bold truncate">
          {product.title}
        </h4>
        <p className="text-text-secondary text-xs mt-1">
          {product.status === "ended" ? "Sold For" : "Current Bid"}
        </p>
        <p className="text-white text-base font-bold">
          {formatCurrency(product.currentBid)}
        </p>
      </div>
    </Link>
  );
}

export default ProductDetailPage;
