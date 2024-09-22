import { AppBskyActorProfile, AtpAgent, AtUri } from '@atproto/api';

import { DEFAULT_SERVICE } from '@/constants';
import { getBlobURL } from '@/utils/media';

type GetProfileParams = {
  handle: string;
  service?: string;
};

export async function getProfile({
  handle,
  service = DEFAULT_SERVICE,
}: GetProfileParams) {
  const agent = new AtpAgent({ service });

  const { uri, value: profile } = await agent.com.atproto.repo
    .getRecord({
      repo: handle,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
    })
    .then(({ data: { uri, value } }) => {
      if (AppBskyActorProfile.isRecord(value)) {
        return { uri, value };
      }

      throw new Error(`Invalid profile record ${uri}`);
    })
    .catch(() => ({
      uri: AtUri.make(handle).toString(),
      value: {},
    }));

  const repo = new AtUri(uri).hostname;

  const handleResult = await agent.com.atproto.repo
    .describeRepo({
      repo,
    })
    .then(({ data }) => data.handle)
    .catch(() => handle);

  const additionalProfileData = AppBskyActorProfile.isRecord(profile)
    ? {
        avatar: profile.avatar,
        name: profile.displayName ?? handle ?? repo,
      }
    : undefined;

  const profileSrc = getBlobURL({
    did: repo,
    ref: additionalProfileData?.avatar,
  });

  return {
    uri,
    handle: handleResult,
    profile: {
      ...profile,
      photo: profileSrc,
      name: additionalProfileData?.name,
    },
  };
}
