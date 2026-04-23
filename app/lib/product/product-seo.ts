import {getSeoMeta} from '@shopify/hydrogen';
import type {ProductQuery} from 'storefrontapi.generated';

type MetaArgs = {
  product?: NonNullable<ProductQuery['product']>;
  matches?: Array<{id?: string; data?: {publicStoreDomain?: string} | unknown}>;
};

export function getProductMeta({product, matches}: MetaArgs) {
  if (!product) return [{title: 'Hydrogen | Product'}];

  const rootData = matches?.find((match) => match.id === 'root')?.data as
    | {publicStoreDomain?: string}
    | undefined;
  const baseUrl = rootData?.publicStoreDomain
    ? `https://${rootData.publicStoreDomain}`
    : '';

  const firstMedia = product.media?.nodes?.find((m) => {
    if (m.__typename === 'MediaImage') return !!m.image;
    if (m.__typename === 'Model3d') return !!m.previewImage;
    return false;
  });
  const firstImage =
    firstMedia?.__typename === 'MediaImage'
      ? firstMedia.image
      : firstMedia?.__typename === 'Model3d'
        ? firstMedia.previewImage
        : undefined;

  return getSeoMeta({
    title: product.seo?.title ?? product.title,
    description: product.seo?.description ?? product.description,
    url: `${baseUrl}/products/${product.handle}`,
    media: firstImage
      ? {
          url: firstImage.url,
          width: firstImage.width,
          height: firstImage.height,
          altText: firstImage.altText || product.title,
        }
      : undefined,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.seo?.description ?? product.description,
      image: firstImage?.url,
      sku: product.selectedOrFirstAvailableVariant?.sku,
      offers: {
        '@type': 'Offer',
        price: product.selectedOrFirstAvailableVariant?.price?.amount,
        priceCurrency: product.selectedOrFirstAvailableVariant?.price?.currencyCode,
        availability: product.selectedOrFirstAvailableVariant?.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    },
  });
}
