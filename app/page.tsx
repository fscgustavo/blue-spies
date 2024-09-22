'use client';

import { useQueryState } from 'nuqs';

import { HandleForm } from '@/components/handle-form';
import { Post } from '@/components/post';
import { useLikedPosts } from '@/services/get-liked-posts';

export default function Home() {
  const [handle] = useQueryState('handle');

  const { data: likedPosts } = useLikedPosts({
    handle: handle,
  });

  return (
    <main>
      <HandleForm />
      <ul>
        {likedPosts?.map((post) => {
          if (!post.value) {
            return;
          }

          return <Post key={post.uri} uri={post.uri} post={post.value} />;
        })}
      </ul>
    </main>
  );
}
