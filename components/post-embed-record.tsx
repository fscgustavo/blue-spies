import { AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia } from '@atproto/api';
import useSWR from 'swr';

import { getPost } from '@/services/get-post';

import { Media } from './media';
import { Post } from './post';

type PostEmbedRecordProps = {
  embed: AppBskyEmbedRecord.Main;
  media?: AppBskyEmbedRecordWithMedia.Main['media'];
  uri: string;
  cid: string;
  did?: string;
};

export function PostEmbedRecord({
  embed,
  media,
  uri,
  cid,
  did,
}: PostEmbedRecordProps) {
  const { data: post } = useSWR(['post', uri], () => getPost({ uri, cid }));

  if (!post) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {media && did && <Media embed={media} did={did} />}
      <Post post={post} uri={embed.record.uri} isEmbedded />
    </div>
  );
}
