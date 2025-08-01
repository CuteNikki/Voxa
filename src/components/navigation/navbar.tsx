import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className='sticky top-0 z-50 bg-background'>
      <div className='flex items-center justify-between border-b p-4 sm:px-8'>
        <Link href='/' className='text-xl font-bold'>
          Voxa
        </Link>
        <ul className='flex gap-4'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          {userId && (
            <>
              <li>
                <Link href='/group'>Groups</Link>
              </li>
              <li>
                <Link href='/chat'>Chats</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
