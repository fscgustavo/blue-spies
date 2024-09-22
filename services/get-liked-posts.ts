import {
  AppBskyFeedLike,
  AppBskyFeedPost,
  AtpAgent,
  AtUri,
} from '@atproto/api';
import useSWR from 'swr';

import { DEFAULT_SERVICE } from '@/constants';

type GetLikedPostsParams = {
  service?: string;
  handle: string | null;
};

export async function getLikedPosts({
  service = DEFAULT_SERVICE,
  handle,
}: GetLikedPostsParams) {
  const agent = new AtpAgent({ service });

  const {
    data: { records },
  } = await agent.com.atproto.repo.listRecords({
    repo: handle ?? '',
    collection: 'app.bsky.feed.like',
    limit: 5,
    cursor: undefined,
  });

  const likes = await Promise.all(
    records.map((record) => {
      if (!AppBskyFeedLike.isRecord(record.value)) {
        return {
          uri: record.uri,
          value: undefined,
          error: `Invalid like record ${record.uri}`,
        };
      }

      const post = record.value.subject;

      const uri = new AtUri(post.uri);

      return agent.com.atproto.repo
        .getRecord({
          repo: uri.hostname,
          collection: uri.collection,
          rkey: uri.rkey,
          cid: post.cid,
        })
        .then(({ data: { uri, value } }) => {
          if (AppBskyFeedPost.isRecord(value)) {
            return { uri, value, error: undefined };
          }
          return {
            uri: uri,
            value: undefined,
            error: `Invalid post record ${uri}`,
          };
        })
        .catch((error) => ({
          uri: post.uri,
          value: undefined,
          error: error.message,
        }));
    }),
  );

  return likes;
}

export function useLikedPosts({ service, handle }: GetLikedPostsParams) {
  return useSWR(handle ? [service, handle] : undefined, () => {
    return getLikedPosts({ service, handle });
  });
}
