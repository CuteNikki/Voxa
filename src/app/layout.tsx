import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { Geist, Geist_Mono } from 'next/font/google';
import { extractRouterConfig } from 'uploadthing/server';

import { ourFileRouter } from '@/app/api/uploadthing/core';

import { defaultMetadata } from '@/constants/metadata';

import { UserSyncer } from '@/hooks/user';

import ConvexProviderWithClerk from '@/providers/convex';
import { ThemeProvider } from '@/providers/theme';

// import { Navbar } from '@/components/navigation/navbar';
import PresenceSyncClient from '@/components/presence';

import { AppSidebar } from '@/components/navigation/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Toaster richColors position='top-center' />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ClerkProvider appearance={{ baseTheme: shadcn }}>
            <ConvexProviderWithClerk>
              <PresenceSyncClient />
              <UserSyncer />
              <div className='flex h-svh flex-col'>
                <SidebarProvider
                  style={
                    {
                      '--sidebar-width': 'calc(var(--spacing) * 72)',
                      '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                  }
                >
                  <AppSidebar variant='inset' />
                  <SidebarInset className='flex-1 overflow-hidden'>{children}</SidebarInset>
                </SidebarProvider>
              </div>
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
