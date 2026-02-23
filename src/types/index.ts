import React from 'react';
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
  IExperience,
  IInvoice,
  ILogin,
  IMeta,
  IProject,
  IStats,
  IUser,
} from './api.types';

export type TAbout = {
  title: string;
  paragraphs: string[];
  list?: string[];
  techStack?: {
    icon?: React.ElementType;
    title: string;
    items: string[];
    color?: string;
  }[];
  timeline?: {
    year: string;
    title: string;
    description: string;
  }[];
  icon?: React.ElementType;
};

export type THobby = {
  icon: React.ElementType;
  label: string;
};

export interface IProjects {
  id: number;
  project_name: string;
  portal_img?: string;
  project_img: string;
  liveLink: string;
  github?: string;
  about: string;
  features: string[];
  tech: string[];
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface IProduct {
  _id?: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  details: string | string[];
  color: string;
  sizes: string[];
  featured: boolean;
  rating: number;
  slug: string;
  stock: number;
  buyPrice: number;
  salePrice?: number;
  soldCount?: number;
  isDeleted?: boolean;
}

export interface ICartItem extends IProduct {
  quantity: number;
}
