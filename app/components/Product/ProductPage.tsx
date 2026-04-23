import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductDescription} from '~/components/Product/ProductDescription';
import {ProductForm} from '~/components/Product/ProductForm';
import {ProductMedia} from '~/components/Product/ProductMedia';
import {ProductPrice} from '~/components/Product/ProductPrice';
import {RelatedProducts} from '~/components/Product/RelatedProducts';
import {getProductMediaLayout} from '~/lib/product/product-media';
import type {ProductQuery, ProductRecommendationsQuery} from 'storefrontapi.generated';

export function ProductPage({
  product,
  recommended,
}: {
  product: NonNullable<ProductQuery['product']>;
  recommended: Promise<ProductRecommendationsQuery | null> | ProductRecommendationsQuery | null;
}) {
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const mediaLayout = getProductMediaLayout(product.media.nodes);

  return (
    <div className="w-full bg-brand-bg text-brand-black">
      <div
        className={`grid grid-cols-1 ${mediaLayout.hasMultipleImages ? 'lg:grid-cols-[1.1fr_1fr_1fr]' : 'lg:grid-cols-[1fr_1.2fr]'} items-start`}
      >
        <div className="lg:sticky lg:top-0 h-[55vh] lg:h-screen overflow-hidden bg-brand-gray border-b border-brand-line lg:border-r lg:border-b-0">
          {mediaLayout.model3dGlbSrc ? (
            <model-viewer
              src={mediaLayout.model3dGlbSrc}
              poster={mediaLayout.model3d?.previewImage?.url}
              camera-controls
              auto-rotate
              style={{width: '100%', height: '100%', background: 'transparent'}}
            />
          ) : mediaLayout.firstImage ? (
            <Image
              data={mediaLayout.firstImage}
              className="w-full h-full object-cover"
              sizes="40vw"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        {mediaLayout.hasMultipleImages && (
          <div className="lg:py-6 lg:px-3 border-r border-brand-line">
            <ProductMedia media={mediaLayout.scrollableMedia} />
          </div>
        )}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto product-main px-5 md:px-8 lg:px-10 py-16 lg:py-20">
          <div className="max-w-md flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="italic text-sm text-brand-muted">
                {product.vendor}
              </span>
              <h1 className="text-4xl md:text-5xl font-light leading-[1.05] tracking-[-0.02em] text-brand-black">
                {title}
              </h1>
              <div className="text-lg font-light text-brand-black/80 pt-1">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
            </div>

            <div className="h-px w-full bg-brand-line" />

            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            <div className="h-px w-full bg-brand-line" />

            <ProductDescription html={descriptionHtml} />
          </div>
          <RelatedProducts recommended={recommended} />
        </div>
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
