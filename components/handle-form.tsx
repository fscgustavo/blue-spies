import { sendGAEvent } from '@next/third-parties/google';
import { track } from '@vercel/analytics';
import { useQueryState } from 'nuqs';
import { FormEvent, useState } from 'react';

import { cn } from '@/lib/utils';

import { SearchInput } from './search-input';
import { Button } from './ui/button';
import { Label } from './ui/label';

const handleRegex =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export function HandleForm() {
  const [handle, setHandle] = useQueryState('handle', { defaultValue: '' });
  const [error, setError] = useState<string | undefined>(undefined);

  function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setHandle('');

    const formData = new FormData(event.currentTarget);

    const typedHandle = formData?.get('handle')?.toString();

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

    track(
      'Search',
      {
        value: handleWithDomain,
      },
      { flags: ['search'] },
    );

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
          Digite o arroba do perfil
        </Label>
        <SearchInput
          id="handle"
          defaultValue={handle}
          className="w-full max-w-[30rem]"
          name="handle"
          placeholder="exemplo.bsky.social"
          onChange={onChange}
        />
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
        Pesquisar
      </Button>
    </form>
  );
}
