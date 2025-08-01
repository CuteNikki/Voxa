import { ClerkProvider } from '@clerk/nextjs';

import { Geist, Geist_Mono } from 'next/font/google';

import { defaultMetadata } from '@/constants/metadata';

import ConvexProviderWithClerk from '@/providers/convex';
import { ThemeProvider } from '@/providers/theme';

import { Navbar } from '@/components/navigation/navbar';
import PresenceSyncClient from '@/components/presence';
import { UserSyncer } from '@/hooks/user';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <ConvexProviderWithClerk>
              <PresenceSyncClient />
              <UserSyncer />

              <div className='flex h-screen w-full flex-col'>
                <div className='shrink-0'>
                  <Navbar />
                </div>
                <div className='min-h-0 flex-1'>{children}</div>
              </div>
            </ConvexProviderWithClerk>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
