/* eslint-disable @next/next/no-img-element */
import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedPost,
} from '@atproto/api';

import { Media } from './media';
import { PostEmbedRecord } from './post-embed-record';

type PostEmbedProps = {
  did: string;
  embed: AppBskyFeedPost.Record['embed'];
};

export function PostEmbed({ embed, did }: PostEmbedProps) {
  const isMedia =
    AppBskyEmbedImages.isMain(embed) ||
    AppBskyEmbedExternal.isMain(embed) ||
    AppBskyEmbedVideo.isMain(embed);

  if (isMedia) {
    return <Media embed={embed} did={did} />;
  }

  if (AppBskyEmbedRecord.isMain(embed)) {
    return (
      <PostEmbedRecord
        embed={embed}
        uri={embed.record.uri}
        cid={embed.record.cid}
      />
    );
  }

  if (AppBskyEmbedRecordWithMedia.isMain(embed)) {
    return (
      <PostEmbedRecord
        embed={embed.record}
        uri={embed.record.record.uri}
        cid={embed.record.record.cid}
        media={embed.media}
        did={did}
      />
    );
  }

  if (process.env.NODE_ENV === 'development') {
    alert('formato não suportado');
  }

  return null;
}
