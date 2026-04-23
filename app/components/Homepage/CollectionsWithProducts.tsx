import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type { AllCollectionsWithProductsQuery } from 'storefrontapi.generated';
import { ProductCard } from '../Product/ProductCard';


export default function CollectionsWithProducts({
    collections,
}: {
    collections: AllCollectionsWithProductsQuery['collections']['nodes'];
}) {
    return (
        <div className="bg-brand-bg font-assistant text-brand-black">
            {collections.map((collection) => (
                <section key={collection.id} className="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
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
                            <Link
                                key={product.id}
                                to={`/products/${product.handle}`}
                                className="group"
                            >
                                {product.featuredImage && (
                                    <Image
                                        alt={product.featuredImage.altText || product.title}
                                        aspectRatio="1/1"
                                        data={product.featuredImage}
                                        sizes="(min-width: 45em) 400px, 100vw"
                                        className="w-full object-cover mb-3 group-hover:opacity-75 transition"
                                    />
                                )}
                                <h3 className="text-sm font-medium mb-2">{product.title}</h3>
                                {product.priceRange && (
                                    <p className="text-sm text-brand-muted">
                                        ${product.priceRange.minVariantPrice.amount}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px w-full bg-brand-line mt-12" />
                </section>
            ))}
        </div>
    );
}