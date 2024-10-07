import { AppBskyRichtextFacet, RichText as RichTextParser } from '@atproto/api';

import { WEB_APP } from '@/constants';

type RichTextProps = {
  text: string;
  facets?: AppBskyRichtextFacet.Main[];
};

export const RichText = ({ text, facets }: RichTextProps) => {
  const rt = new RichTextParser({ text, facets });

  return Array.from(rt.segments()).map((segment, index) => {
    if (segment.isLink()) {
      return (
        <a
          className="text-primary hover:underline"
          key={`${segment.text}-${segment.link?.uri}`}
          href={segment.link?.uri}
          target="_blank"
        >
          {segment.text}
        </a>
      );
    }

    if (segment.isMention()) {
      return (
        <a
          className="text-primary hover:underline"
          href={`${WEB_APP}/profile/${segment.mention?.did}`}
          key={`${segment.link?.uri}-${segment.text}`}
          target="_blank"
        >
          {segment.text}
        </a>
      );
    }

    if (segment.isTag()) {
      return (
        <a
          className="text-primary hover:underline"
          href={`${WEB_APP}/hashtag/${segment.tag?.tag}`}
          key={`${segment.tag}-${index}`}
          target="_blank"
        >
          {segment.text}
        </a>
      );
    }

    const lines = segment.text.split('\n');

    return lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>);
  });
};
