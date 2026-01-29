import Badge from '../ui/Badge';

export type BidStatus = 'winning' | 'outbid' | 'ended' | 'watching';

export interface BidCardData {
  id: string;
  title: string;
  imageUrl: string;
  sellerName: string;
  status: BidStatus;
  watchCount: number;
  yourBid: number;
  currentPrice: number;
  timeLeft: string;
}

interface BidCardProps {
  bid: BidCardData;
  onIncreaseBid?: (id: string) => void;
  onBidAgain?: (id: string) => void;
}

const statusConfig: Record<BidStatus, { label: string; variant: 'success' | 'error' | 'warning' | 'info'; icon: React.ReactNode }> = {
  winning: {
    label: 'Winning',
    variant: 'success',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
  },
  outbid: {
    label: 'Outbid',
    variant: 'error',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  ended: {
    label: 'Ended',
    variant: 'warning',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  watching: {
    label: 'Watching',
    variant: 'info',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BidCard({ bid, onIncreaseBid, onBidAgain }: BidCardProps) {
  const config = statusConfig[bid.status];
  const isOutbid = bid.status === 'outbid';

  return (
    <div className="group bg-[var(--card-dark)] rounded-xl border border-[var(--border)] overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary/50">
      {/* Image */}
      <div
        className="md:w-64 h-48 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url("${bid.imageUrl}")` }}
      />

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold leading-tight mb-1 text-white group-hover:text-primary transition-colors">
              {bid.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Seller: <span className="text-white hover:underline cursor-pointer">{bid.sellerName}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={config.variant} icon={config.icon}>
              {config.label}
            </Badge>
            <span className="text-[var(--text-muted)] text-xs font-medium">{bid.watchCount} watching</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">
              {isOutbid ? 'Your Last Bid' : 'Your Max Bid'}
            </p>
            <p className={`text-xl font-bold ${isOutbid ? 'text-[var(--text-muted)]' : 'text-white'}`}>
              {formatCurrency(bid.yourBid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">Current Price</p>
            <p className={`text-xl font-bold ${isOutbid ? 'text-white' : 'text-primary'}`}>
              {formatCurrency(bid.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">Time Left</p>
            <p className={`text-xl font-bold ${bid.timeLeft.includes('d') && parseInt(bid.timeLeft) <= 1 ? 'text-red-500' : 'text-white'}`}>
              {bid.timeLeft}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => isOutbid ? onBidAgain?.(bid.id) : onIncreaseBid?.(bid.id)}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/80 transition-colors"
            >
              {isOutbid ? 'Bid Again' : 'Increase Bid'}
            </button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors text-[var(--text-muted)]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
