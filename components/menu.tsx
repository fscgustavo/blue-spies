import { Binoculars } from 'lucide-react';

import { HandleForm } from './handle-form';

export function Menu() {
  return (
    <div className="flex flex-col gap-4 p-3 pl-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xl">
          <Binoculars className="h-8 w-8 text-primary" />
          <span className="font-bold text-primary">BlueSpies</span>
        </div>
      </div>
      <HandleForm />
    </div>
  );
}
