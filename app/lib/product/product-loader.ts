import {getSelectedProductOptions} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_QUERY, RECOMMENDATIONS_QUERY} from '~/lib/product/product.queries';
import type {ProductQuery, ProductRecommendationsQuery} from 'storefrontapi.generated';

type Storefront = {
  query: <T>(query: string, args?: Record<string, any>) => Promise<T>;
};

export async function loadCriticalProductData({
  storefront,
  handle,
  request,
}: {
  storefront: Storefront;
  handle?: string;
  request: Request;
}) {
  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

export function loadDeferredProductData({
  storefront,
  productId,
}: {
  storefront: Storefront;
  productId: string;
}) {
  const recommended = storefront
    .query<ProductRecommendationsQuery>(RECOMMENDATIONS_QUERY, {variables: {productId}})
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommended};
}
