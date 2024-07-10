import React from 'react';
import { ModeToggle } from './ModeToggle';

export const PageHeader = () => (
  <header className="w-full max-w-3xl grid grid-cols-2 gap-2">
    <h1 className="justify-self-start font-black text-2xl">K8s Logs Streaming Demo</h1>
    <div className="justify-self-end">
      <ModeToggle />
    </div>
  </header>
);
