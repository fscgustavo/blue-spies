import { AppBskyFeedPost, AtUri } from '@atproto/api';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { useMemo } from 'react';
import useSWR from 'swr';

import { DEFAULT_SERVICE, WEB_APP } from '@/constants';
import { getProfile } from '@/services/profile';

import { PostEmbed } from './post-embed';
import { RichText } from './rich-text';

export function Post({
  post,
  uri,
  service = DEFAULT_SERVICE,
}: {
  post: AppBskyFeedPost.Record;
  uri: string;
  service?: string;
}) {
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
      relativeFromNow: formatRelative(postDate, new Date(), {
        locale: ptBR,
      }),
      locale: postDate.toLocaleString('pt-BR'),
      ISO: postDate.toISOString(),
    };
  }, [post.createdAt]);

  if (!profileData) {
    return;
  }

  return (
    <article className="">
      <Image
        width="25"
        height="25"
        src={profileData.profile.photo}
        alt={`foto de perfil do ${atUri.hostname}`}
      />
      <a
        className=""
        href={`${WEB_APP}/profile/${profileData ? profileData.handle : atUri.hostname}`}
        target="_blank"
      >
        {profileData.profile.name}
      </a>

      <span className="Post__author-handle">@{profileData.handle}</span>

      <a
        className="Post__relative-date"
        href={`${WEB_APP}/profile/${atUri.hostname}/post/${atUri.rkey}`}
      >
        {date && (
          <time
            dateTime={date.ISO}
            title={date.locale}
            // aria-label={`${relativeDate} — click to open the post in the Bluesky web app`}
          >
            {date.relativeFromNow}
          </time>
        )}
      </a>
      <div className="Post__content">
        <RichText text={post.text} facets={post.facets} />
      </div>
      {post.embed && <PostEmbed embed={post.embed} did={atUri.hostname} />}
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
}
