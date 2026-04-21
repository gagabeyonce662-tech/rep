import { Link } from "react-router"
import RecommendedProducts from "./RecommendedProducts"
import type { RecommendedProductsQuery } from 'storefrontapi.generated';

export default function LatestArrivals({
    products
}: {
    products: Promise<RecommendedProductsQuery | null>
}) {
    return (
        <section className="md:px-8 py-24 md:py-32">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
                <div className="flex flex-col gap-3">
                    <span className="text-sm font-medium uppercase tracking-[0.18em] text-brand-muted">
                        Latest Arrivals
                    </span>
                    <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-[-0.04em] text-brand-black">
                        New Arrivals
                    </h2>
                </div>
                <Link
                    to="/collections/all"
                    className="group self-start md:self-end inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-black pb-1"
                >
                    <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
                        View all
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                    </span>
                </Link>
            </div>
            <RecommendedProducts products={products} />
        </section>
    )
}