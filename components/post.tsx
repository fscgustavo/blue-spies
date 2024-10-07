'use client';

import { AppBskyFeedPost, AtUri } from '@atproto/api';
import { sendGAEvent } from '@next/third-parties/google';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { ComponentProps, forwardRef, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DEFAULT_SERVICE, WEB_APP } from '@/constants';
import { cn } from '@/lib/utils';
import { getProfile } from '@/services/profile';

import { PostAvatar } from './post-avatar';
import { PostEmbed } from './post-embed';
import { RichText } from './rich-text';
import { Skeleton } from './ui/skeleton';

type PostProps = {
  post: AppBskyFeedPost.Record;
  uri: string;
  service?: string;
  isEmbedded?: boolean;
  isEmbeddedLoading?: boolean;
} & ComponentProps<'article'>;

export const Post = forwardRef<HTMLElement, PostProps>(
  (
    {
      post,
      uri,
      service = DEFAULT_SERVICE,
      isEmbedded,
      isEmbeddedLoading,
      ...props
    },
    ref,
  ) => {
    const atUri = useMemo(() => new AtUri(uri), [uri]);

    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
      queryKey: ['profile', service, atUri.hostname],
      queryFn: () => getProfile({ handle: atUri.hostname }),
    });

    const date = useMemo(() => {
      if (!post.createdAt) {
        return undefined;
      }

      const postDate = new Date(post.createdAt);

      return {
        formatted: format(postDate, 'dd/MM/yyyy hh:mm'),
        locale: postDate.toLocaleString('pt-BR'),
        ISO: postDate.toISOString(),
      };
    }, [post.createdAt]);

    if ((isLoadingProfile || isEmbeddedLoading) && isEmbedded) {
      return <Skeleton className="h-80 w-full" />;
    }

    if (!profileData) {
      return;
    }

    const links = {
      profile: `${WEB_APP}/profile/${profileData ? profileData.handle : atUri.hostname}`,
      post: `${WEB_APP}/profile/${atUri.hostname}/post/${atUri.rkey}`,
    };

    function onPostError(error: Error) {
      sendGAEvent('event', 'error', {
        category: 'Erro',
        action: 'Post descartado',
        description: error?.cause ?? error.message,
        nonInteraction: true,
      });
    }

    return (
      <ErrorBoundary fallback={null} onError={onPostError}>
        <article
          className={cn(
            'relative flex gap-3 border-b text-sm text-card-foreground lg:text-base',
            {
              'rounded-sm border p-3': isEmbedded,
              'border-b px-4 py-3 first:border-t last:border-b-0 last:pb-10':
                !isEmbedded,
            },
          )}
          {...props}
          ref={ref}
        >
          <a href={links.profile} target="_blank">
            <PostAvatar
              hostname={atUri.hostname}
              src={profileData.profile.photo}
              isEmbedded={isEmbedded}
              className={cn('shrink-0', {
                'hidden lg:block': isEmbedded,
              })}
            />
          </a>
          <div className="w-full">
            <div
              className={cn('mb-1 flex sm:items-center', {
                'max-sm:flex-col': !isEmbedded,
              })}
            >
              <a
                href={links.profile}
                target="_blank"
                className="flex flex-wrap max-sm:pr-4"
              >
                <PostAvatar
                  hostname={atUri.hostname}
                  src={profileData.profile.photo}
                  isEmbedded={isEmbedded}
                  className={cn({
                    hidden: !isEmbedded,
                    'mr-2 block lg:hidden': isEmbedded,
                  })}
                />
                <span className="font-bold">{profileData.profile.name}</span>
                &nbsp;
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                  @{profileData.handle}
                </span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground sm:ml-auto">
                {date && !isEmbedded && (
                  <time
                    dateTime={date.ISO}
                    title={date.locale}
                    className="max-sm:text-xs"
                  >
                    {date.formatted}
                  </time>
                )}

                <a
                  href={links.post}
                  className="right-4 top-3 hover:text-primary max-sm:absolute"
                  target="_blank"
                >
                  <ExternalLink
                    className={cn('h-4 w-4', isEmbedded && 'h-3 w-3')}
                  />
                  <span className="sr-only">
                    Ver sobre o post de {profileData.profile.name} no Bluesky
                  </span>
                </a>
              </div>
            </div>
            <div className="w-full">
              <RichText text={post.text} facets={post.facets} />
            </div>
            {post.embed && (
              <div className="mt-2">
                <PostEmbed
                  embed={post.embed}
                  did={atUri.hostname}
                  isEmbedded={isEmbedded}
                />
              </div>
            )}
          </div>
          {/* {post.embed ? (
        AppBskyEmbedImages.isMain(post.embed) ? (
          <PostImages
            service={service}
            did={atUri.hostname}
            images={post.embed.images}
          />
        ) : AppBskyEmbedRecordWithMedia.isMain(post.embed) ? (
          <>
            {AppBskyEmbedImages.isMain(post.embed.media) ? (
              <PostImages
                did={atUri.hostname}
                images={post.embed.media.images}
                service={service}
              />
            ) : null}
          </>
        ) : null
      ) : null}
      {embeddedPost ? (
        <Post
          service={service}
          className="Post__post-embed"
          uri={embeddedPost.uri}
          post={embeddedPost.record}
          isEmbedded
        />
      ) : null}
      {profileError ? (
        <FriendlyError
          className="Post__profile-error"
          heading="Error fetching author's profile"
          message={profileError}
        />
      ) : null}
      {embeddedPostError ? (
        <FriendlyError
          className="Post__post-embed-error"
          heading="Error fetching the quoted post"
          message={embeddedPostError}
        />
      ) : null}
      {isEmbedded && (
        <a
          className="Post__link"
          href={`${WEB_APP}/profile/${atUri.hostname}/post/${atUri.rkey}`}
        >
          Open post in the Bluesky web app
        </a>
      )} */}
        </article>
      </ErrorBoundary>
    );
  },
);

Post.displayName = 'Post';
