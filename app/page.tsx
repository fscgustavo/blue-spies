'use client';

import { FavoriteFeed } from '@/components/favorite-feed';
import { Menu } from '@/components/menu';

export default function Home() {
  return (
    <main className="h-screen">
      <div className="mx-auto grid min-h-dvh max-w-7xl auto-rows-min gap-6 lg:grid-cols-[minmax(auto,_17.18rem)_minmax(auto,_37.5rem)_auto]">
        <Menu />
        <FavoriteFeed />
      </div>
    </main>
  );
}
