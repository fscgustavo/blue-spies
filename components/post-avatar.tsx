import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

type PostAvatarProps = {
  hostname: string;
  isEmbedded?: boolean;
} & Omit<ImageProps, 'alt'>;

export function PostAvatar({
  hostname,
  isEmbedded = false,
  className,
  ...props
}: PostAvatarProps) {
  return (
    <Image
      width="48"
      height="48"
      className={cn(
        'h-fit rounded-full',
        {
          'max-lg:h-8 max-lg:w-8': !isEmbedded,
          'h-6 w-6': isEmbedded,
        },
        className,
      )}
      {...props}
      alt={`foto de perfil do ${hostname}`}
    />
  );
}
