/* eslint-disable @typescript-eslint/no-explicit-any */
export const generateJsonLd = (type: string, data: Record<string, any>) => {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }),
  };
};
