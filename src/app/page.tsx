import Image from 'next/image';

import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

import { FriendList } from '@/components/friends/friend-list';
import { RequestList } from '@/components/friends/request-list';
import { UserList } from '@/components/friends/user-list';
import { ThemeToggle } from '@/components/theme/toggle';
import { TypographyH1 } from '@/components/typography/h1';
import { TypographyH2 } from '@/components/typography/h2';
import { TypographyH3 } from '@/components/typography/h3';
import { TypographyH4 } from '@/components/typography/h4';
import { TypographyInlineCode } from '@/components/typography/inline-code';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyLead } from '@/components/typography/lead';
import { TypographyList } from '@/components/typography/list';
import { TypographyMuted } from '@/components/typography/muted';
import { TypographyP } from '@/components/typography/p';
import { TypographyBlockquote } from '@/components/typography/quote';
import { TypographySmall } from '@/components/typography/small';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className='flex flex-col items-center justify-items-center gap-16 overflow-y-auto p-8 pb-20 font-sans sm:p-20'>
      <main className='row-start-2 flex flex-col items-center gap-[32px] sm:items-start'>
        {userId ? (
          <div className='flex w-full max-w-md flex-col gap-8'>
            <FriendList userId={userId} />
            <RequestList userId={userId} />
            <UserList userId={userId} />
          </div>
        ) : (
          <SignInButton />
        )}
        <div className='flex flex-col gap-2'>
          <TypographyH1>Taxing Laughter: The Joke Tax Chronicles</TypographyH1>
          <TypographyH2>The People of the Kingdom</TypographyH2>
          <TypographyH3>The Joke Tax</TypographyH3>
          <TypographyH4>People stopped telling jokes</TypographyH4>
          <TypographyP>The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.</TypographyP>
          <TypographyBlockquote>
            &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&apos;s only fair that they should pay for the privilege.&quot;
          </TypographyBlockquote>
          <TypographyList>
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners : 20 gold coins</li>
          </TypographyList>
          <TypographyInlineCode>@radix-ui/react-alert-dialog</TypographyInlineCode>
          <TypographyLead>A modal dialog that interrupts the user with important content and expects a response.</TypographyLead>
          <TypographyLarge>Are you absolutely sure?</TypographyLarge>
          <TypographySmall>Email address</TypographySmall>
          <TypographyMuted>Enter your email address.</TypographyMuted>
        </div>

        <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={180} height={38} priority />
        <ol className='list-inside list-decimal text-center font-mono text-sm/6 sm:text-left'>
          <li className='mb-2 tracking-[-.01em]'>
            Get started by editing <code className='rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]'>src/app/page.tsx</code>.
          </li>
          <li className='tracking-[-.01em]'>Save and see your changes instantly.</li>
        </ol>

        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <Button asChild>
            <a
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image src='/vercel.svg' alt='Vercel logomark' width={20} height={20} />
              Deploy now
            </a>
          </Button>
          <Button variant='secondary' asChild>
            <a
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px]'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/file.svg' alt='File icon' width={16} height={16} />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/window.svg' alt='Window icon' width={16} height={16} />
          Examples
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/globe.svg' alt='Globe icon' width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
