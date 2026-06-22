import { Auth } from '@/types';

export interface IUserAddress {
  title: string;
  address: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  addresses: IUserAddress[];
  role: string;
  userId?: number;
  picture?: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  hasPassword: boolean;
  auths: Auth[];
  createdAt: string;
  updatedAt: string;
}
