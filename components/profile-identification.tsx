import { useQuery } from '@tanstack/react-query';

import { DEFAULT_SERVICE, WEB_APP } from '@/constants';
import { getProfile } from '@/services/profile';

import { PostAvatar } from './post-avatar';
import { Skeleton } from './ui/skeleton';

type ProfileIdentificatorProps = {
  handle: string | null;
  service?: string;
};

export function ProfileIdentificator({
  handle,
  service = DEFAULT_SERVICE,
}: ProfileIdentificatorProps) {
  const {
    data: profileData,
    error,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ['profile', service, handle],
    queryFn: () => getProfile({ handle: handle ?? '' }),
    enabled: Boolean(handle),
  });

  if (isLoadingProfile) {
    return (
      <div className="grid gap-1 p-4">
        <Skeleton className="h-4 w-[20ch]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="grid">
            <Skeleton className="h-4 w-[25ch]" />
            <Skeleton className="h-4 w-[25ch]" />
          </div>
        </div>
      </div>
    );
  }

  if (!handle || error) {
    return null;
  }

  return (
    <div className="grid gap-1 p-4 py-6 max-lg:pt-0">
      <div className="flex items-center gap-2">
        <PostAvatar
          profileName={profileData?.profile.name}
          src={profileData?.profile.photo ?? ''}
          width={56}
          height={56}
          className="h-14 w-14 max-lg:h-14 max-lg:w-14"
        />

        <div className="grid">
          <p className="font-bold text-card-foreground">
            {profileData?.profile.name}
            <a
              href={`${WEB_APP}/profile/${handle}`}
              className="block text-sm font-normal text-muted-foreground"
              target="_blank"
            >
              @{profileData?.handle}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
