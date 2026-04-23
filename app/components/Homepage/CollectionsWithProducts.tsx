import { Link } from 'react-router';
import type { AllCollectionsWithProductsQuery } from 'storefrontapi.generated';
import { ProductCard } from '../Product/ProductCard';


export default function CollectionsWithProducts({
    collections,
}: {
    collections: AllCollectionsWithProductsQuery['collections']['nodes'];
}) {
    const collectionsWithProducts = collections.filter(
        (collection) => (collection.products?.nodes?.length ?? 0) > 0,
    );

    return (
        <div className="bg-brand-bg font-assistant text-brand-black">
            {collectionsWithProducts.map((collection) => (
                <section key={collection.id} className="py-20">
                    {/* Collection Header */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-inter text-4xl md:text-6xl font-light tracking-[-0.03em]">
                                {collection.title}
                            </h2>
                        </div>
                        <Link
                            to={`/collections/${collection.handle}`}
                            className="text-sm font-medium uppercase tracking-widest hover:opacity-60 transition"
                        >
                            View All →
                        </Link>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {collection.products.nodes.map((product) => (
                            <div
                                key={product.id}
                                className="h-full"
                            >
                                <ProductCard product={product as any} loading="lazy" />
                            </div>
                        ))}
                    </div>

                    <div className="h-px w-full bg-brand-line mt-12" />
                </section>
            ))}
        </div>
    );
}