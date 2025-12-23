import NavigationBar from '@/components/custom/navigation-bar';
import {ThemeProvider} from '@/components/theme-provider';
import {JetBrains_Mono} from 'next/font/google';
import type {Metadata} from 'next';
import {ReactNode} from 'react';
import Link from 'next/link';

import './globals.css';

const jetbrainsMono = JetBrains_Mono({subsets: ['latin'], variable: '--font-sans'});

export const metadata: Metadata = {
  title: 'Pleases Star my Repos | @mcmanussliam',
  description: 'Documentation for projects by @mcmanussliam',
};

function Content({children}: Readonly<{children: ReactNode}>) {
  return (
    <div className="min-h-screen w-1/1 lg:w-4/5 flex flex-col">
      <nav className='w-full'>
        <NavigationBar/>
      </nav>

      <main className="p-7 flex-1">
        {children}
      </main>

      <footer className="p-7 text-muted-foreground text-xs text-center">
        Built by <Link href="https://github.com/mcmanussliam" className="underline">mcmanussliam</Link>. The source code is available on GitHub.
      </footer>
    </div>
  );
}

export default function Root({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex justify-center'>
            <Content>{children}</Content>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
