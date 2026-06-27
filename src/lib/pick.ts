export const pick = <T extends Record<string, any>>(
  obj: T,
  keys: string[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === 'limit') {
        const limitVal = Number(obj[key]);
        if (!isNaN(limitVal) && limitVal > 50) {
          finalObj[key as keyof T] = '50' as any;
          continue;
        }
      }
      finalObj[key as keyof T] = obj[key];
    }
  }
  return finalObj;
};

export const validProductFilters = [
  'searchTerm',
  'search',
  'q',
  'page',
  'limit',
  'sort',
  'fields',
  'view',
  'size',
  'minPrice',
  'maxPrice',
  'discount',
  'name',
  'description',
  'color',
  'sizes',
  'category',
  'subCategory',
  'type',
  'sku',
  'offerTag',
  'isActive',
  'isDeleted',
  'showDeleted',
  'isOffer',
  'featured',
];
