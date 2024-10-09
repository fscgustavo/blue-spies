'use client';

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
        className="xs:pr-28 lg:pr-3"
        inputMode="search"
        autoCapitalize="off"
        {...props}
      />
      <Button className="absolute right-0 top-0 hidden select-none rounded-md font-semibold hover:bg-transparent xs:block lg:hidden">
        Pesquisar
      </Button>
    </div>
  );
}
