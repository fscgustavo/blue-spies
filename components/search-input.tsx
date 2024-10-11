'use client';

import { ComponentProps, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchInputProps = {
  children: ReactNode;
} & ComponentProps<typeof Input>;

export function SearchInput({
  className,
  children,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Input
        className="xs:pr-28 lg:pr-3"
        inputMode="search"
        autoCapitalize="off"
        {...props}
      />
      {children}
    </div>
  );
}
