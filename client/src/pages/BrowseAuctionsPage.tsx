import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FilterSidebar from "../components/auctions/FilterSidebar";
import AuctionCard from "../components/ui/AuctionCard";
import { useLiveAuctions } from "../hooks/useLiveAuctions";

const BrowseAuctionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const { data, isLoading: loading, error } = useLiveAuctions(currentPage, ITEMS_PER_PAGE);
  const auctions = data?.auctions ?? [];
  const totalItems = data?.total ?? 0;

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to calculate time left
  const calculateTimeLeft = (endTime: string) => {
    const total = Date.parse(endTime) - Date.now();
    
    if (total <= 0) return "Ended";

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Helper to determine if urgent (ending in < 24h)
  const isUrgent = (endTime: string) => {
    const total = Date.parse(endTime) - Date.now();
    return total < 24 * 60 * 60 * 1000 && total > 0;
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-x-hidden transition-colors duration-200">
      <Header />
      <main className="layout-container flex h-full grow flex-col w-full max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 py-5">
          {/* Breadcrumbs and Title Section */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Link
                className="text-[#9da6b8] text-sm font-medium leading-normal hover:text-primary"
                to="/"
              >
                Home
              </Link>
              <span className="text-[#9da6b8] text-sm font-medium leading-normal">
                /
              </span>
              <span className="text-[#111318] dark:text-white text-sm font-medium leading-normal">
                All Auctions
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-[#111318] dark:text-white text-3xl font-extrabold tracking-tight">
                  Browse All Auctions
                </h1>
                <p className="text-[#9da6b8] text-sm mt-1">
                  Showing {auctions.length} of {totalItems} rare collectibles currently live
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 py-2 px-3 bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-[#111318] dark:text-white hover:border-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {sidebarOpen ? 'filter_list_off' : 'filter_list'}
                  </span>
                  <span className="hidden sm:inline">Filters</span>
                </button>
                <span className="text-[#9da6b8] text-sm font-medium whitespace-nowrap">
                  Sort by:
                </span>
                <select className="bg-white ring-2 border-none rounded-lg text-sm font-medium text-black focus:ring-2 focus:ring-primary min-w-[160px]">
                  <option>Ending Soonest</option>
                  <option>Newly Listed</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Bids</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <FilterSidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center min-h-[400px] text-red-500 font-bold">
                  {error?.message || "An error occurred while loading auctions"}
                </div>
              ) : auctions.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                  <span className="material-symbols-outlined text-6xl text-gray-400">sentiment_dissatisfied</span>
                  <p className="text-gray-400 font-medium text-lg">No active auctions found at the moment.</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${sidebarOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}>
                  {auctions.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      title={auction.title}
                      currentBid={formatCurrency(auction.current_price)}
                      timeLeft={calculateTimeLeft(auction.end_time)}
                      imageUrl={auction.images[0] || "https://via.placeholder.com/300?text=No+Image"}
                      imageAlt={auction.title}
                      isUrgent={isUrgent(auction.end_time)}
                      link={`/auction/${auction.id}`}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-dark text-[#9da6b8] border border-gray-200 dark:border-gray-800 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white font-bold"
                          : "bg-surface-dark text-[#111318] dark:text-white border border-gray-200 dark:border-gray-800 hover:border-primary"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-dark text-[#9da6b8] border border-gray-200 dark:border-gray-800 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseAuctionsPage;
