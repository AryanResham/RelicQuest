import { Request } from 'express';
import { IUser } from '../models/User';
import { IProduct } from '../models/Product';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  seller?: {
    id: string;
    storeName: string;
    isVerified: boolean;
  };
  product?: IProduct;
}

export interface UserRequest extends Request {
  user?: IUser;
}