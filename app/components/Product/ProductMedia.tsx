import {MediaFile} from '@shopify/hydrogen';
import type {ProductMediaFragment} from 'storefrontapi.generated';

export function ProductMedia({
  media,
}: {
  media: ProductMediaFragment[];
}) {
  if (!media.length) {
    return <div className="product-media-empty" />;
  }

  return (
    <div className="product-media flex flex-col gap-4 md:gap-8">
      {media.map((med) => {
        return (
          <div
            className="product-media-item rounded-xl overflow-hidden bg-brand-gray/50 shadow-sm border border-brand-black/5"
            key={med.id}
          >
            <MediaFile
              data={med}
              className="w-full h-auto object-cover aspect-square md:aspect-auto"
              draggable={false}
              mediaOptions={{
                video: {
                  controls: true,
                  muted: true,
                  autoPlay: true,
                  loop: true,
                },
                image: {
                  sizes: '(min-width: 45em) 50vw, 100vw',
                  aspectRatio: '1/1',
                },
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
