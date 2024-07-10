import React from 'react';
import { PageHeader } from './components/PageHeader';
import Client from './components/Client';

export default function Home() {
  return (
    <main className="grid grid-rows-[auto_1fr] gap-4 p-4 place-items-center">
      <PageHeader />
      <Client />
    </main>
  )
}
