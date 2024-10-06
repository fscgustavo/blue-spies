import { AppBskyFeedPost, AtUri } from '@atproto/api';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { ComponentProps, forwardRef, useMemo } from 'react';
import useSWR from 'swr';

import { DEFAULT_SERVICE, WEB_APP } from '@/constants';
import { cn } from '@/lib/utils';
import { getProfile } from '@/services/profile';

import { PostEmbed } from './post-embed';
import { RichText } from './rich-text';

type PostProps = {
  post: AppBskyFeedPost.Record;
  uri: string;
  service?: string;
  isEmbedded?: boolean;
} & ComponentProps<'article'>;

export const Post = forwardRef<HTMLElement, PostProps>(
  ({ post, uri, service = DEFAULT_SERVICE, isEmbedded, ...props }, ref) => {
    const atUri = useMemo(() => new AtUri(uri), [uri]);

    // const { data } = useSWR(['post', uri], () => getPost({ post, uri }));

    const { data: profileData } = useSWR(
      ['profile', service, atUri.hostname],
      () => getProfile({ handle: atUri.hostname }),
    );

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

    if (!profileData) {
      return;
    }

    return (
      <article
        className={cn('flex gap-3 border-b text-card-foreground', {
          'rounded-sm border p-3': isEmbedded,
          'border-b px-4 py-3 first:pt-8 last:border-b-0 last:pb-10':
            !isEmbedded,
        })}
        {...props}
        ref={ref}
      >
        <Image
          width="48"
          height="48"
          src={profileData.profile.photo}
          alt={`foto de perfil do ${atUri.hostname}`}
          className={cn('h-fit rounded-full', {
            'h-6 w-6': isEmbedded,
          })}
        />
        <div>
          <div className="mb-1 flex items-center">
            <a
              href={`${WEB_APP}/profile/${profileData ? profileData.handle : atUri.hostname}`}
              target="_blank"
            >
              <span className="font-bold">{profileData.profile.name}</span>
              &nbsp;
              <span className="text-muted-foreground">
                @{profileData.handle}
              </span>
            </a>
            <div className="ml-auto flex items-center gap-2 text-muted-foreground">
              {date && !isEmbedded && (
                <a
                  href={`${WEB_APP}/profile/${atUri.hostname}/post/${atUri.rkey}`}
                >
                  <time
                    dateTime={date.ISO}
                    title={date.locale}
                    // aria-label={`${relativeDate} — click to open the post in the Bluesky web app`}
                  >
                    {date.formatted}
                  </time>
                </a>
              )}
              {!isEmbedded && (
                <a
                  href={`${WEB_APP}/profile/${atUri.hostname}/post/${atUri.rkey}`}
                  className="hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div>
            <RichText text={post.text} facets={post.facets} />
          </div>
          {post.embed && (
            <div className="mt-2">
              <PostEmbed embed={post.embed} did={atUri.hostname} />
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
    );
  },
);

Post.displayName = 'Post';
