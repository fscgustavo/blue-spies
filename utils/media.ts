import { BlobRef } from '@atproto/api';

import { DEFAULT_SERVICE } from '@/constants';

type GetBlobURLParams = {
  service?: string;
  did: string;
  ref?: BlobRef;
};

export function getBlobURL({
  service = DEFAULT_SERVICE,
  did,
  ref,
}: GetBlobURLParams) {
  if (!ref) {
    return '';
  }

  return `${service}/xrpc/com.atproto.sync.getBlob?${new URLSearchParams({
    did,
    cid: ref.ref,
  }).toString()}`;
}

export const isGif = (filename: string) => /\.gif/i.test(filename);
