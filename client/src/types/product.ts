export interface Bid {
  id: string
  userId: string
  userName: string
  amount: number
  timestamp: Date
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  discount?: number
  category: string
  description: string
  currentBid?: number
  auctionEndTime?: Date
  isAuction?: boolean
  minBidIncrement?: number
  startingBid?: number
  bidHistory?: Bid[]
  seller?: string
  condition?: string
  specifications?: Record<string, string>
}
