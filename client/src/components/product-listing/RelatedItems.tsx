import { Link } from "react-router-dom";
import type  { Item } from "./types";

interface RelatedItemsProps {
  items: Item[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateTimeRemaining(endTime: string) {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, isEnded: false };
}

function RelatedItemCard({ item }: { item: Item }) {
  const timeRemaining = calculateTimeRemaining(item.end_time);
  const timeLabel = timeRemaining.isEnded
    ? "Ended"
    : `${timeRemaining.days}d ${timeRemaining.hours}h`;

  return (
    <Link
      to={`/auction/${item.id}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      <div className="w-full bg-card-dark border border-[#292e38] rounded-xl overflow-hidden aspect-[3/4] relative">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url("${item.images[0] || 'https://placehold.co/300x400/1a1f2e/9ca3af?text=No+Image'}")` }}
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded px-2 py-1">
          <span className="text-white text-xs font-bold">{timeLabel}</span>
        </div>
      </div>
      <div>
        <h4 className="text-white text-sm font-bold truncate">
          {item.title}
        </h4>
        <p className="text-text-secondary text-xs mt-1">
          {timeRemaining.isEnded ? "Sold For" : "Current Bid"}
        </p>
        <p className="text-white text-base font-bold">
          {formatCurrency(item.current_price)}
        </p>
      </div>
    </Link>
  );
}

export function RelatedItems({ items }: RelatedItemsProps) {
  if (items.length === 0) return null;

  return (
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
        {items.map((relatedItem) => (
          <RelatedItemCard
            key={relatedItem.id}
            item={relatedItem}
          />
        ))}
      </div>
    </div>
  );
}
