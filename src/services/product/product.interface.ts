import type { ISizeGuide } from '@/services/size-guide/size-guide.interface';
import { IVariant, IVariantSize } from '@/types';

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  thumbnails: string[];
  description?: string;
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
  youtubeVideoUrl?: string;
  refundPolicy?: string;
  returnPolicy?: string;
  sizeGuide?: ISizeGuide | string;
  isDeleted?: boolean;
  isActive?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IProductUpload {
  name: string;
  category: string;
  subCategory?: string;
  type?: string;
  price: number | string;
  salePrice: number | string;
  buyPrice: number | string;
  stock: number | string;
  slug: string;
  description: string;
  color: string;
  variants: {
    color: string;
    sizes: {
      size: string;
      stock: number | string;
    }[];
    thumbnails: (string | File)[];
    sku: string;
  }[];
  sizes: string[];
  featured: boolean;
  isOffer: boolean;
  isActive: boolean;
  offerTag: string;
  discountPercentage: number | string;
  sizeStock: {
    size: string;
    stock: number | string;
  }[];
  thumbnails: (string | File)[];
  sku: string;
  videoUrl: string | File;
  youtubeVideoUrl: string;
  refundPolicy: string;
  returnPolicy: string;
  sizeGuide: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}
