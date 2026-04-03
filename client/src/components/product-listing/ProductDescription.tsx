interface ProductDescriptionProps {
  description: string;
  min_price: number;
  start_price: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductDescription({ description, min_price, start_price }: ProductDescriptionProps) {
  return (
    <div className="py-6 border-t border-[#292e38]">
      <h3 className="text-lg font-bold text-white mb-4">Description</h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">{description}</p>
      
      <h3 className="text-lg font-bold text-white mb-4">Item Specifics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card-dark p-4 rounded-lg border border-[#292e38]">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Estimate</p>
          <p className="text-white font-medium">{formatCurrency(min_price)} - {formatCurrency(min_price * 1.5)}</p>
        </div>
        <div className="bg-card-dark p-4 rounded-lg border border-[#292e38]">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Starting Price</p>
          <p className="text-white font-medium">{formatCurrency(start_price)}</p>
        </div>
      </div>
    </div>
  );
}
