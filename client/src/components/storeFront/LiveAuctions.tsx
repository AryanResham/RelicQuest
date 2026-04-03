import AuctionCard from "../ui/AuctionCard";
import { Link } from "react-router-dom";
import { useLiveAuctions } from "@/hooks/useLiveAuctions";

function getTimeLeft(endTime: string): { label: string; urgent: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { label: "Ended", urgent: true };
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const urgent = hours < 3;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return { label: `${days}d ${remainingHours}h`, urgent: false };
  }
  return {
    label: `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`,
    urgent,
  };
}

function LiveAuctions() {
  const { data, isLoading } = useLiveAuctions(1, 4);
  const auctions = data?.auctions ?? [];

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-10 pt-8 pb-4">
        <h2 className="text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">
          Live Auctions
        </h2>
        <Link
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
          to="/auctions"
        >
          View All{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>
      <section className="px-4 lg:px-10 pb-8">
        {isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="snap-start flex-none w-[280px] md:w-[320px] h-[380px] rounded-xl bg-card-dark border border-[#292e38] animate-pulse"
              />
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <p className="text-text-secondary text-sm py-4">
            No live auctions right now.{" "}
            <Link to="/auctions" className="text-primary hover:underline">
              Browse all auctions
            </Link>
          </p>
        ) : (
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {auctions.map((auction) => {
              const { label, urgent } = getTimeLeft(auction.end_time);
              return (
                <AuctionCard
                  key={auction.id}
                  title={auction.title}
                  currentBid={`$${auction.current_price.toLocaleString()}`}
                  timeLeft={label}
                  imageUrl={auction.images?.[0] ?? ""}
                  imageAlt={auction.title}
                  isUrgent={urgent}
                  link={`/auction/${auction.id}`}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default LiveAuctions;
