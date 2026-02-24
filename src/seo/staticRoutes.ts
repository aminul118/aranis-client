import { Routes } from '@/types';

export const staticRoutes: Routes[] = [
  {
    url: '',
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: 'shop',
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: 'cart',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: 'checkout',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: 'contact',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: 'emi',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: 'pre-order',
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: 'location',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: 'privacy-policy',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: 'terms-conditions',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];
