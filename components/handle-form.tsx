import { useQueryState } from 'nuqs';
import { FormEvent } from 'react';

export function HandleForm() {
  const [handle, setHandle] = useQueryState('handle', { defaultValue: '' });

  function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const typedHandle = formData?.get('handle')?.toString();

    if (!typedHandle) {
      alert('digite um arroba');

      return;
    }

    setHandle(typedHandle);
  }

  return (
    <form onSubmit={onHandleSubmit}>
      <input
        placeholder="handle"
        name="handle"
        defaultValue={handle}
        className="text-black"
      />
    </form>
  );
}
