import type {ProductMediaFragment, ProductQuery} from 'storefrontapi.generated';

type ProductMediaNode = ProductQuery['product']['media']['nodes'][number];

export function getProductMediaLayout(mediaNodes: ProductMediaNode[]) {
  const model3d = mediaNodes.find((m) => m.__typename === 'Model3d') ?? null;
  const firstImageMedia =
    !model3d
      ? mediaNodes.find((m): m is Extract<ProductMediaNode, {__typename: 'MediaImage'}> =>
          m.__typename === 'MediaImage' && !!m.image,
        ) ?? null
      : null;
  const pinnedMedia = model3d ?? firstImageMedia ?? null;
  const firstImage = firstImageMedia?.image ?? null;
  const model3dGlbSrc =
    model3d?.sources?.find(
      (s) => s.mimeType === 'model/gltf-binary' || s.format === 'glb',
    )?.url ??
    model3d?.sources?.[0]?.url ??
    null;

  const scrollableMedia = mediaNodes.filter(
    (m) => !pinnedMedia || m.id !== pinnedMedia.id,
  );

  return {
    model3d,
    firstImage,
    model3dGlbSrc,
    scrollableMedia: scrollableMedia as ProductMediaFragment[],
    hasMultipleImages: scrollableMedia.length > 0,
  };
}
