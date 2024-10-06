'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Binoculars, LoaderCircle } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useRef } from 'react';

import { HandleForm } from '@/components/handle-form';
import { Post } from '@/components/post';
import { useLikedPosts } from '@/services/get-liked-posts';

export default function Home() {
  const [handle] = useQueryState('handle');
  // const [isLastPage, setIsLastPage] = useState(false);
  // const [posts, setPosts] = useState<PostType[]>([]);

  const listRef = useRef(null);
  const infiniteScrollRef = useRef(null);
  const infiniteScrollObserver = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLikedPosts({
      handle: handle,
    });

  const allPosts = data ? data.pages.flatMap((page) => page.posts) : [];

  const virtualizer = useVirtualizer({
    count: allPosts.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 150,
    enabled: true,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!infiniteScrollRef.current || infiniteScrollObserver.current) {
      return;
    }

    infiniteScrollObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    infiniteScrollObserver.current.observe(infiniteScrollRef.current);
  }, [fetchNextPage]);

  return (
    <main className="h-screen">
      <div className="mx-auto grid min-h-dvh max-w-7xl grid-cols-[minmax(auto,_17.18rem)_minmax(auto,_37.5rem)_auto] gap-6">
        <div className="flex flex-col gap-4 p-3 pl-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xl">
              <Binoculars className="h-8 w-8 text-primary" />
              <span className="font-bold text-primary">BlueSpies</span>
            </div>
          </div>
          <HandleForm />
        </div>
        <div className="h-full border-x">
          <ul ref={listRef} style={{ height: virtualizer.getTotalSize() }}>
            {items.map((virtualRow) => {
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
            })}
          </ul>

          {/* {!isLastPage && (
            <button
              onClick={() => {
                // const lastPage = data;

                setCursor('3l4rgfjss3y2u');

                // await mutate<LikedPostsResponse>(
                //   (key) => Array.isArray(key) && key?.includes(handle),
                // );
              }}
            >
              More
            </button>
          )} */}
          {isFetchingNextPage && hasNextPage && (
            <div className="pb-8">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div ref={infiniteScrollRef} />
        </div>
      </div>
    </main>
  );
}
