import mongoose, { Schema, Document } from 'mongoose';

interface ISpecifications {
  [key: string]: string;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  category: string;
  description: string;
  isAuction: boolean;
  specifications: ISpecifications;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Gaming', 'Electronics', 'Collectibles', 'Books', 'Toys', 'Other']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isAuction: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);