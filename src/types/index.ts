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

export type { ApiResponse, Auth, ILogin, IMeta } from './api.types';

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
  soldCount?: number;
}
