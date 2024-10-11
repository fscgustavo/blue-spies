'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { useQueryState } from 'nuqs';
import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';

import { useDictionary } from './dictionary-provider';
import { SearchInput } from './search-input';
import { Button } from './ui/button';
import { Label } from './ui/label';

const handleRegex =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export function HandleForm() {
  const { search } = useDictionary();

  const [handle, setHandle] = useQueryState('handle', { defaultValue: '' });
  const [error, setError] = useState<string | undefined>(undefined);

  function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setHandle('');

    const formData = new FormData(event.currentTarget);

    const typedHandle = formData?.get('handle')?.toString().trim();

    if (!typedHandle) {
      setError('Digite um arroba válido');

      return;
    }

    const formattedHandle = typedHandle?.replace('@', '');

    const handleWithDomain = handleRegex.test(formattedHandle)
      ? formattedHandle
      : `${formattedHandle}.bsky.social`;

    sendGAEvent('event', 'search', {
      search_term: handleWithDomain,
    });

    setHandle(handleWithDomain);
  }

  function onChange() {
    setError('');
  }

  return (
    <form onSubmit={onHandleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="handle"
          className={cn(
            'font-semibold text-card-foreground',
            error && 'text-destructive',
          )}
        >
          {search.label}
        </Label>
        <SearchInput
          id="handle"
          defaultValue={handle}
          className="w-full max-w-[30rem]"
          name="handle"
          placeholder={search.placeholder}
          onChange={onChange}
        >
          <Button className="absolute right-0 top-0 hidden select-none rounded-md font-semibold hover:bg-transparent xs:block lg:hidden">
            {search.button}
          </Button>
        </SearchInput>
        {error && (
          <p
            id="handle-description"
            className="text-xs font-semibold text-destructive"
          >
            {error}
          </p>
        )}
      </div>
      <Button className="block font-semibold xs:hidden lg:block">
        {search.button}
      </Button>
    </form>
  );
}
