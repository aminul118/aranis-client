export type { MenuGroup } from './admin-menu';

export type { MetaConfig, MetaProps, Routes } from './meta.types';
export type {
  Children,
  DivProps,
  ElementProps,
  IGlobalError,
  Params,
  SearchParams,
  SectionProps,
} from './react.types';

export type {
  ApiResponse,
  Auth,
  IBlog,
  IContact,
  ICoupon,
  IExperience,
  IInvoice,
  ILogin,
  IMeta,
  IProject,
  ISizeGuide,
  IStats,
  IUser,
} from './api.types';

import { ISizeGuide } from './api.types';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface IVariantSize {
  size: string;
  stock: number;
}

export interface IVariant {
  color: string;
  thumbnails: string[];
  sizes: IVariantSize[];
  sku?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  thumbnails: string[];
  description: string;
  details: string | string[];
  color: string;
  variants?: IVariant[];
  sizes: string[];
  featured: boolean;
  slug: string;
  sku?: string;
  stock: number;
  sizeStock?: IVariantSize[];
  buyPrice: number;
  salePrice?: number;
  discountPercentage?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  isOffer?: boolean;
  offerTag?: string;
  rating?: number;
  soldCount?: number;
  videoUrl?: string;
  sizeGuide?: ISizeGuide | string;
  isDeleted?: boolean;
}

export interface ICartItem extends IProduct {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
