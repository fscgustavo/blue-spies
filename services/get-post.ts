import { AppBskyFeedPost, AtpAgent, AtUri } from '@atproto/api';

import { DEFAULT_SERVICE } from '@/constants';

export type GetPostParams = {
  service?: string;
  uri: string;
  cid?: string;
};

export async function getPost({
  service = DEFAULT_SERVICE,
  uri,
  cid,
}: GetPostParams) {
  const agent = new AtpAgent({ service });
  const atUri = new AtUri(uri);

  // console.log({ record });

  const {
    data: { value },
  } = await agent.com.atproto.repo.getRecord({
    repo: atUri.hostname,
    collection: atUri.collection,
    rkey: atUri.rkey,
    cid: cid,
  });

  if (AppBskyFeedPost.isRecord(value)) {
    return value;
  }

  throw new Error(`Invalid post record ${uri}`);
}
