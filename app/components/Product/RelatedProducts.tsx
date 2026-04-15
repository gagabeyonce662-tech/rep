import {Await} from 'react-router';
import {Suspense} from 'react';
import {ProductItem} from './ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

export function RelatedProducts({
  recommended,
}: {
  recommended: Promise<any>;
}) {
  return (
    <div className="related-products pt-16 pb-24 border-t border-brand-line mt-12 w-full">
      <h3 className="font-serif text-3xl md:text-4xl text-brand-black mb-10 tracking-[-0.01em]">
        You may also like
      </h3>
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <Await
          resolve={recommended}
          errorElement={
            <span className="text-brand-muted">
              Unable to load recommendations at this time.
            </span>
          }
        >
          {(data) => {
            if (!data?.productRecommendations?.length) return null;

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                {data.productRecommendations.slice(0, 4).map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="w-full aspect-[4/5] bg-brand-gray rounded-sm" />
          <div className="w-3/4 h-4 bg-brand-gray rounded-sm" />
          <div className="w-1/4 h-4 bg-brand-gray rounded-sm" />
        </div>
      ))}
    </div>
  );
}
