/* eslint-disable @next/next/no-img-element */

import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  AppBskyFeedPost,
} from '@atproto/api';
import Image from 'next/image';

import { getBlobURL, isGif } from '@/utils/media';

import { ImageGrid } from './image-grid';

type MediaProps = {
  embed: AppBskyFeedPost.Record['embed'];
  did: string;
};

export function Media({ embed, did }: MediaProps) {
  if (AppBskyEmbedImages.isMain(embed)) {
    return <ImageGrid images={embed.images} did={did} />;
  }

  const isEmbedGif =
    AppBskyEmbedExternal.isMain(embed) && isGif(embed.external.uri);

  if (isEmbedGif) {
    return (
      <div>
        <img
          src={embed.external.uri}
          alt={embed.external.description}
          width="490"
          height="498"
        />
      </div>
    );
  }

  if (AppBskyEmbedVideo.isMain(embed)) {
    return (
      <div>
        <video
          width={embed.aspectRatio?.width}
          height={embed.aspectRatio?.height}
          controls
          preload="none"
          style={{
            aspectRatio: `${embed.aspectRatio?.width}/${embed.aspectRatio?.height}`,
          }}
        >
          <source
            src={getBlobURL({ did, ref: embed.video })}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (AppBskyEmbedExternal.isMain(embed)) {
    const src = embed.external.thumb
      ? getBlobURL({ did, ref: embed.external.thumb })
      : '/none.jpg';

    return (
      <a
        href={embed.external.uri}
        target="_blank"
        className="block rounded-sm border"
      >
        {/*TODO: Alterar o alt*/}
        <Image
          src={src}
          width="1000"
          height="750"
          alt="depois"
          className="w-max rounded-t"
        />
        <div className="px-4 py-2">
          <p className="font-bold">{embed.external.title}</p>
          <p className="text-sm">{embed.external.description}</p>
        </div>
      </a>
    );
  }

  return null;
}
