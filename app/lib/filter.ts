// app/lib/filter.ts
// This file contains utility functions for parsing and handling product filters in the collection page. It includes functions to parse URL search params into Storefront API filters, and to serialize filters back into URL search params.

import type { ProductFilter } from '@shopify/hydrogen/storefront-api-types';

export function parseAsCurrency(value: string | null) {
  if (!value) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parses URL search params into a valid Storefront API `ProductFilter` array.
 */
export function getFiltersFromParams(searchParams: URLSearchParams): ProductFilter[] {
  const filters: ProductFilter[] = [];

  // Parse price
  const priceMin = parseAsCurrency(searchParams.get('price_min'));
  const priceMax = parseAsCurrency(searchParams.get('price_max'));
  if (priceMin !== undefined || priceMax !== undefined) {
    filters.push({
      price: {
        ...(priceMin !== undefined ? { min: priceMin } : {}),
        ...(priceMax !== undefined ? { max: priceMax } : {}),
      },
    });
  }

  // Parse productVendor
  const productVendor = searchParams.getAll('productVendor');
  productVendor.forEach((vendor) => {
    filters.push({ productVendor: vendor });
  });

  // Parse productType
  const productType = searchParams.getAll('productType');
  productType.forEach((type) => {
    filters.push({ productType: type });
  });

  // Parse variantOption (e.g. ?variantOption=Color:Red)
  const variantOptions = searchParams.getAll('variantOption');
  variantOptions.forEach((option) => {
    const [name, value] = option.split(':');
    if (name && value) {
      filters.push({ variantOption: { name, value } });
    }
  });

  return filters;
}
