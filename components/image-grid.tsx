import { AppBskyEmbedImages } from '@atproto/api';
import Image from 'next/image';

import { getBlobURL } from '@/utils/media';

type ImageGridProps = {
  images: AppBskyEmbedImages.Image[];
  did: string;
};

export function ImageGrid({ images, did }: ImageGridProps) {
  return (
    <div>
      {images.map((image, idx) => (
        <Image
          src={getBlobURL({ did, ref: image.image })}
          width={image.aspectRatio?.width}
          height={image.aspectRatio?.height}
          alt={image.alt}
          key={idx}
        />
      ))}
    </div>
  );
}
