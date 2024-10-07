import {
  AppBskyFeedLike,
  AppBskyFeedPost,
  AtpAgent,
  AtUri,
} from '@atproto/api';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { DEFAULT_SERVICE, TWEETS_PER_PAGE } from '@/constants';

type GetLikedPostsParams = {
  service?: string;
  handle: string | null;
  cursor?: string;
};

export type Post =
  | {
      uri: string;
      value: AppBskyFeedPost.Record;
      error: undefined;
    }
  | {
      uri: string;
      value: undefined;
      error: string;
    }
  | {
      uri: string;
      value: undefined;
      error: unknown;
    }
  | {
      uri: string;
      value: undefined;
      error: string;
    };

export type LikedPostsResponse = {
  posts: Post[];
  cursor: string | undefined;
};

export async function getLikedPosts({
  service = DEFAULT_SERVICE,
  handle,
  cursor,
}: GetLikedPostsParams) {
  const agent = new AtpAgent({ service });

  // console.log('cursor usado ', cursor);

  const {
    data: { records, cursor: newCursor },
  } = await agent.com.atproto.repo.listRecords({
    repo: handle ?? '',
    collection: 'app.bsky.feed.like',
    limit: TWEETS_PER_PAGE,
    cursor,
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

  return { posts: likes, cursor: newCursor };
}

type UseLikedPostsParams = GetLikedPostsParams;

export function useLikedPosts({ service, handle }: UseLikedPostsParams) {
  return useInfiniteQuery<
    LikedPostsResponse,
    Error,
    InfiniteData<LikedPostsResponse, unknown>,
    QueryKey,
    string | undefined
  >({
    queryKey: [service, handle],
    queryFn: ({ pageParam }) =>
      getLikedPosts({ service, handle, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    enabled: Boolean(handle),
  });
}
