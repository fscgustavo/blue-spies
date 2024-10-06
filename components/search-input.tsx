'use client';

import { Search } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <div className={cn('relative w-full', className)}>
      <Input
        type="search"
        placeholder="Search..."
        className="pr-10"
        {...props}
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      >
        <Search className="h-6 w-6 text-primary" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
