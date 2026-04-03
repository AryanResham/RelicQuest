import type { Seller } from "./types";

interface SellerInfoProps {
  seller: Seller;
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
        {seller.store_name?.[0]?.toUpperCase() || 'S'}
      </div>
      <div>
        <p className="text-white text-sm font-bold">{seller.store_name}</p>
        <p className="text-text-secondary text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-yellow-500 text-fill">star</span>
          {seller.rating.toFixed(1)} Rating
        </p>
      </div>
    </div>
  );
}
