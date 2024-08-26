import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-dark'>
        <div className='layout text-light flex min-h-screen flex-col items-center justify-center text-center'>
          <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
        </div>
      </section>
    </main>
  );
}
