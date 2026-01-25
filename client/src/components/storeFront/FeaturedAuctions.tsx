import { Link } from "react-router-dom";
import { products, formatCurrency } from "@/data/products";

// Featured baseball card auctions from our product data
function FeaturedAuctions() {
  const featuredProducts = products.slice(0, 4); // Show first 4 products

  return (
    <section className="px-4 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">
          Featured Baseball Cards
        </h2>
        <Link
          to="/"
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          View All{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.map((product) => {
          const timeLabel =
            product.status === "ended"
              ? "Ended"
              : `${product.timeRemaining.days}d ${product.timeRemaining.hours}h`;

          return (
            <Link
              key={product.id}
              to={`/auction/${product.id}`}
              className="group flex flex-col gap-3 cursor-pointer"
            >
              <div className="w-full bg-card-dark border border-[#292e38] rounded-xl overflow-hidden aspect-[3/4] relative">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url("${product.mainImage}")`,
                  }}
                />
                <div
                  className={`absolute top-2 right-2 backdrop-blur rounded px-2 py-1 ${
                    product.status === "ended" ? "bg-red-500/80" : "bg-black/60"
                  }`}
                >
                  <span className="text-white text-xs font-bold">
                    {timeLabel}
                  </span>
                </div>
                {/* Live badge for active auctions */}
                {product.status === "live" && (
                  <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur rounded px-2 py-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white text-sm font-bold truncate group-hover:text-primary transition-colors">
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
        })}
      </div>
    </section>
  );
}

export default FeaturedAuctions;
