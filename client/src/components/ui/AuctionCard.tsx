import { Link } from "react-router-dom";
import Button from "./Button";

interface AuctionCardProps {
  title: string;
  currentBid: string;
  timeLeft: string;
  imageUrl: string;
  imageAlt: string;
  isUrgent?: boolean; // red timer for items ending soon
  onPlaceBid?: () => void;
  link?: string; // optional link to product detail page
}

function AuctionCard({
  title,
  currentBid,
  timeLeft,
  imageUrl,
  imageAlt,
  isUrgent = false,
  onPlaceBid,
  link,
}: AuctionCardProps) {
  const cardContent = (
    <>
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
        {/* Timer badge */}
        <div
          className={`absolute top-3 left-3 ${
            isUrgent ? "bg-red-500 text-white" : "bg-[#eab308] text-black"
          } text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10 shadow-sm`}
        >
          <span className="material-symbols-outlined text-[14px]">timer</span>
          {timeLeft}
        </div>
        {/* Image */}
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
          data-alt={imageAlt}
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between p-5 pt-2 gap-4">
        <div>
          <h3 className="text-white text-lg font-bold leading-normal truncate">
            {title}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-text-secondary text-sm font-medium">
              Current Bid:
            </span>
            <span className="text-primary text-xl font-bold">{currentBid}</span>
          </div>
        </div>
        <Button variant="secondary" fullWidth onClick={onPlaceBid}>
          Place Bid
        </Button>
      </div>
    </>
  );

  const cardClasses =
    "snap-start flex-none w-[280px] md:w-[320px] flex flex-col gap-4 rounded-xl bg-card-dark border border-[#292e38] shadow-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all group cursor-pointer";

  if (link) {
    return (
      <Link to={link} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}

export default AuctionCard;
