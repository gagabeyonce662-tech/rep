// app/components/Hero.tsx

// this component is used in the home page to display the featured collection. It includes a background image, title, and a call-to-action button. The background image has a zoom animation, and the text elements have fade-up animations with staggered delays for a dynamic entrance effect. Additionally, there is a scroll hint at the bottom to encourage users to explore further down the page.

import type {
    FeaturedCollectionFragment
} from 'storefrontapi.generated';
import { Button } from '~/components/ui/Button';
import heroImage from 'app/assets/Model_hero-upscaled.png'

export default function Hero({ collection }: { collection: FeaturedCollectionFragment }) {
    if (!collection) return null;

    return (
        <section className="relative h-screen w-full overflow-hidden group">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={heroImage}
                    className="object-cover w-full h-full scale-110 motion-safe:animate-hero-zoom"
                    alt="Collection Background"
                />
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/50" />

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
                <span className="text-sm md:text-base font-medium uppercase tracking-[0.22em] text-white/85 mb-5 motion-safe:animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                    Featured Collection
                </span>
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-white font-semibold tracking-[-0.05em] leading-[0.9] mb-10 motion-safe:animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
                    {collection.title}
                </h1>
                <div className="motion-safe:animate-fade-up [animation-delay:700ms] opacity-0 [animation-fill-mode:forwards]">
                    <Button to={`/collections/${collection.handle}`} variant="white">
                        Explore Drop
                    </Button>
                </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/60 font-assistant uppercase tracking-[0.3em] text-[10px]">
                <span>Scroll</span>
                <span className="block w-px h-10 bg-white/40 overflow-hidden relative">
                    <span className="absolute inset-x-0 top-0 h-1/2 bg-white motion-safe:animate-scroll-hint" />
                </span>
            </div>
        </section>
    );
}
