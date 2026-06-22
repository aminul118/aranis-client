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
