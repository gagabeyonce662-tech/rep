import { Suspense } from 'react';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';
import { Await } from 'react-router';
import { ProductItem } from '~/components/Product/ProductItem';


export default function RecommendedProducts({
    products,
}: {
    products: Promise<RecommendedProductsQuery | null>;
}) {
    return (
        <Suspense
            fallback={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 italic opacity-50">
                    Loading Drops...
                </div>
            }
        >
            <Await resolve={products}>
                {(response) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                        {response
                            ? response.products.nodes.map((product) => (
                                <ProductItem key={product.id} product={product} />
                            ))
                            : null}
                    </div>
                )}
            </Await>
        </Suspense>
    );
}
