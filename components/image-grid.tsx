import { AppBskyEmbedImages } from '@atproto/api';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { getBlobURL } from '@/utils/media';

type ImageGridProps = {
  images: AppBskyEmbedImages.Image[];
  did: string;
};

export function ImageGrid({ images, did }: ImageGridProps) {
  return (
    <div
      className={cn('grid gap-2', {
        'grid-cols-2': images.length > 1,
      })}
    >
      {images.map((image, idx) => {
        return (
          <Image
            src={getBlobURL({ did, ref: image.image })}
            width={image?.aspectRatio?.width ?? '480'}
            height={image?.aspectRatio?.height ?? '480'}
            alt={image.alt}
            key={idx}
          />
        );
      })}
    </div>
  );
}
