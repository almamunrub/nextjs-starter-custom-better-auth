import type { Metadata } from 'next'
import { Geist, Geist_Mono, Oxanium } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import NextTopLoader from 'nextjs-toploader'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | ARENaXL',
    default: 'ARENaXL | Competitive Gaming Ecosystem',
  },
  description:
    'ArenaXL connects tournaments, player profiles, rewards, gaming commerce and sponsor activations in one platform.',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      '/favicon.ico',
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    title: 'ARENaXL',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        oxanium.variable
      )}
    >
      <body className='flex min-h-full flex-col'>
        <NextTopLoader
          color='#000'
          height={3}
          showSpinner={false}
          zIndex={1600}
        />
        {children}
        <Toaster richColors position='top-center' />
      </body>
    </html>
  )
}
