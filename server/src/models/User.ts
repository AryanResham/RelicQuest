import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  wishlist: mongoose.Types.ObjectId[];
  cart: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
  }[];
  orders: mongoose.Types.ObjectId[];
  isVerified: boolean;
  authProvider: 'local' | 'google';
  role: 'customer' | 'seller' | 'admin';
  // Seller-specific fields
  isSeller: boolean;
  sellerProfile?: {
    storeName: string;
    storeDescription: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    taxId?: string;
    isVerified: boolean;
    verificationDocuments?: string[];
    rating: number;
    totalSales: number;
    joinedAsSellerAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    required: function(this: IUser): boolean {
      return this.authProvider === 'local';
    }
  },
  googleId: {
    type: String,
    sparse: true, // Allows multiple null values but unique when present
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'US' }
  },
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  sellerProfile: {
    storeName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    storeDescription: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    businessEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    businessPhone: {
      type: String,
      trim: true
    },
    businessAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'US' }
    },
    taxId: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDocuments: [{
      type: String // URLs to uploaded documents
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0
    },
    joinedAsSellerAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Hash password before saving (only for local auth)
UserSchema.pre('save', async function(this: IUser, next) {
  // Only hash password if it exists and is modified
  if (!this.password || !this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // Return false if no password is set (Google auth user)
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ authProvider: 1 });

export default mongoose.model<IUser>('User', UserSchema);