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
    url: 'offers',
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: 'blog',
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: 'contact',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: 'location',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: 'gift',
    changeFrequency: 'monthly',
    priority: 0.6,
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
    url: 'track-order',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: 'wishlist',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: 'login',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: 'register',
    changeFrequency: 'monthly',
    priority: 0.5,
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
