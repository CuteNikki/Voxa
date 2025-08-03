'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  const { user } = useUser();

  if (!user) {
    return (
      <nav className='bg-background sticky top-0 z-50'>
        <div className='flex items-center justify-between border-b p-4 sm:px-8'>
          <Link href='/' className='text-xl font-bold'>
            Voxa
          </Link>
          <ul className='flex gap-4'>
            <li>
              <Link href='/'>Home</Link>
            </li>
            <li>
              <SignInButton />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className='bg-background sticky top-0 z-50'>
      <div className='flex items-center justify-between border-b p-4 sm:px-8'>
        <Link href='/' className='text-xl font-bold'>
          Voxa
        </Link>
        <ul className='flex items-center gap-4'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/group'>Groups</Link>
          </li>
          <li>
            <Link href='/chat'>Chats</Link>
          </li>
          <li className='h-7 w-7'>
            <UserButton />
          </li>
        </ul>
      </div>
    </nav>
  );
}
