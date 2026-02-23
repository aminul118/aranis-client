import React from 'react';

export interface Children {
  children: React.ReactNode;
}

export interface Params {
  params: Promise<{ slug: string }>;
}

export interface IGlobalError {
  error: Error & { digest?: string };
  reset: () => void;
}

export type ElementProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>;

export type DivProps = ElementProps<'div'>;
export type SectionProps = ElementProps<'section'>;

export interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
