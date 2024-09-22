import { AppBskyRichtextFacet, RichText as RichTextParser } from '@atproto/api';

import { WEB_APP } from '@/constants';

type RichTextProps = {
  text: string;
  facets?: AppBskyRichtextFacet.Main[];
};

export const RichText = ({ text, facets }: RichTextProps) => {
  const rt = new RichTextParser({ text, facets });

  return Array.from(rt.segments()).map((segment) => {
    if (segment.isLink()) {
      return (
        <a
          key={`${segment.text}-${segment.link?.uri}`}
          href={segment.link?.uri}
        >
          {segment.text}
        </a>
      );
    }

    if (segment.isMention()) {
      return (
        <a
          href={`${WEB_APP}/profile/${segment.mention?.did}`}
          key={`${segment.link?.uri}-${segment.text}`}
        >
          {segment.text}
        </a>
      );
    }

    const lines = segment.text.split('\n');

    return lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>);
  });
};
