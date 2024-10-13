import { UserRound } from 'lucide-react';
import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

type PostAvatarProps = {
  profileName?: string;
  isEmbedded?: boolean;
} & Omit<ImageProps, 'alt'>;

export function PostAvatar({
  profileName,
  isEmbedded = false,
  className,
  ...props
}: PostAvatarProps) {
  if (!props.src) {
    return (
      <div className="rounded-full bg-primary p-1">
        <UserRound
          className={cn(
            'h-fit rounded-full fill-white text-primary',
            {
              'max-lg:h-8 max-lg:w-8': !isEmbedded,
              'h-6 w-6': isEmbedded,
            },
            className,
          )}
        />
      </div>
    );
  }

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
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPstAcAAVcAyrKrMM4AAAAASUVORK5CYII="
      {...props}
      alt={`foto de perfil${profileName ? ` de ${profileName}` : ''}`}
    />
  );
}
