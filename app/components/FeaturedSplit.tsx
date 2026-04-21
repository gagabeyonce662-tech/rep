import { Image, getSeoMeta } from '@shopify/hydrogen';
import type {
    FeaturedCollectionFragment,
    RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { Link } from 'react-router';

export default function FeaturedSplit({ collection }: { collection: FeaturedCollectionFragment }) {
    if (!collection?.image) return null;
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 items-stretch bg-brand-bg">
            <div className="relative aspect-square md:aspect-auto md:min-h-[85vh] overflow-hidden bg-brand-gray group">
                <Image
                    data={collection.image}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
                    sizes="50vw"
                />
            </div>
            <div className="flex items-center justify-center px-6 md:px-20 py-20 md:py-28 bg-brand-bg">
                <div className="max-w-md flex flex-col gap-7">
                    <span className="text-sm font-medium uppercase tracking-[0.18em] text-brand-muted">
                        Featured Collection
                    </span>
                    <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-[-0.04em] text-brand-black">
                        {collection.title}
                    </h2>
                    <p className="text-[15px] text-brand-muted leading-[1.7] font-light">
                        A considered edit of the season&rsquo;s most essential pieces. Each
                        silhouette made in small runs, finished by hand, and built to last.
                    </p>
                    <Link
                        to={`/collections/${collection.handle}`}
                        className="group self-start inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-black mt-2"
                    >
                        <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
                            Shop the collection
                        </span>
                        <span className="transition-transform duration-500 group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
