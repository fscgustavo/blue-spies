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
      <Input className="pr-10" {...props} />
      <Button className="xs:block absolute right-0 top-0 hidden rounded-md font-semibold hover:bg-transparent lg:hidden">
        Pesquisar
      </Button>
    </div>
  );
}
