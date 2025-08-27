'use client';

import { SiteHeader } from '@/components/navigation/site-header';
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <div className='flex flex-col items-center justify-items-center gap-16 overflow-y-auto p-8 pb-20 font-sans sm:p-20'>
        <main className='row-start-2 flex flex-col items-center gap-[32px] sm:items-start'>
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
        </main>
      </div>
    </>
  );
}
