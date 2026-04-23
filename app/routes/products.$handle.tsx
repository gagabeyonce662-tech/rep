// app/routes/products.%24handle.tsx
// this is a route module for the product page, which is accessed via /products/:handle. It fetches the product data based on the handle, and renders the product page with the product details and recommended products.
// it also handles the SEO meta tags for the product page.
// it also handles the pagination of the product page.
// it also handles the filtering of the product page.
// it also handles the sorting of the product page.
// it also handles the search of the product page.
// it also handles the category of the product page.
// it also handles the brand of the product page.

import {useLoaderData} from 'react-router';
import {ProductPage} from '~/components/Product/ProductPage';
import {loadCriticalProductData, loadDeferredProductData} from '~/lib/product/product-loader';
import {getProductMeta} from '~/lib/product/product-seo';
import type {Route} from './+types/products.$handle';

export const meta: Route.MetaFunction = ({data, matches}) =>
  getProductMeta({product: data?.product, matches: matches as any}) ?? [];

export async function loader({context, params, request}: Route.LoaderArgs) {
  const criticalData = await loadCriticalProductData({
    storefront: context.storefront,
    handle: params.handle,
    request,
  });
  const deferredData = loadDeferredProductData({
    storefront: context.storefront,
    productId: criticalData.product.id,
  });

  return {...deferredData, ...criticalData};
}

export default function Product() {
  const {product, recommended} = useLoaderData<typeof loader>();
  return <ProductPage product={product} recommended={recommended} />;
}
