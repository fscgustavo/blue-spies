import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from '@tanstack/react-virtual';
import { Heart, LoaderCircle } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useRef } from 'react';

import { Post } from '@/components/post';
import { TWEETS_PER_PAGE } from '@/constants';
import { Post as PostType, useLikedPosts } from '@/services/get-liked-posts';

import { Skeleton } from './ui/skeleton';

export function FavoriteFeed() {
  const [handle] = useQueryState('handle');

  const listRef = useRef(null);
  const infiniteScrollRef = useRef(null);
  const infiniteScrollObserver = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useLikedPosts({
      handle: handle,
    });

  const allPosts = data ? data.pages.flatMap((page) => page.posts) : [];

  const virtualizer = useVirtualizer({
    count: allPosts.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 150,
    enabled: Boolean(handle),
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    if (
      !infiniteScrollRef.current ||
      isLoading ||
      infiniteScrollObserver.current
    ) {
      return;
    }

    infiniteScrollObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    infiniteScrollObserver.current.observe(infiniteScrollRef.current);
  }, [fetchNextPage, isLoading]);

  return (
    <div className="border-x">
      <section
        ref={listRef}
        style={{
          height: allPosts.length > 0 ? virtualizer.getTotalSize() : 'auto',
        }}
      >
        <PostList
          items={items}
          allPosts={allPosts}
          virtualizer={virtualizer}
          isLoading={isLoading}
        />
      </section>
      {isFetchingNextPage && hasNextPage && (
        <div className="pb-8">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {hasNextPage && <div ref={infiniteScrollRef} />}
    </div>
  );
}

type PostListProps = {
  items: VirtualItem[];
  allPosts: PostType[];
  virtualizer: Virtualizer<Element, Element>;
  isLoading: boolean;
};

function PostList({ items, allPosts, virtualizer, isLoading }: PostListProps) {
  if (isLoading || (items.length === 0 && allPosts.length > 0)) {
    return [...Array(TWEETS_PER_PAGE).keys()].map((index) => (
      <div
        className="relative flex flex-col gap-3 border-b px-4 py-3 text-sm text-card-foreground first:border-t last:border-b-0 last:pb-10 lg:text-base lg:first:border-t-0 lg:first:pt-8"
        key={index}
      >
        <div className="mb-1 flex gap-2 sm:items-center">
          <Skeleton className="h-8 w-8 rounded-full" />

          <Skeleton className="h-4 w-full max-w-[52ch]" />

          <Skeleton className="ml-auto h-4 w-6" />
        </div>
        <div className="flex w-full flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full max-w-[20rem]" />
        </div>
        {index % 2 === 1 && <Skeleton className="h-[20rem] w-full" />}
      </div>
    ));
  }

  if (allPosts.length === 0) {
    return (
      <div className="border-t">
        <div className="mx-auto flex h-screen max-w-[70%] flex-col items-center gap-6 p-4 pt-20 text-center text-muted-foreground">
          <Heart className="h-16 w-16 text-muted-foreground" />
          <p>
            Quando você digitar o arroba de um perfil, os posts curtidos
            aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  return items.map((virtualRow) => {
    const post = allPosts[virtualRow.index];

    if (!post?.value) {
      return;
    }

    return (
      <Post
        uri={post.uri}
        post={post.value}
        key={`${post.uri}-${virtualRow.index}`}
        data-index={virtualRow.index}
        ref={virtualizer.measureElement}
      />
    );
  });
}
