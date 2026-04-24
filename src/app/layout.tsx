import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DevFolio Pro — Ship your developer portfolio in seconds',
    template: '%s — DevFolio Pro',
  },
  description:
    'Sync with GitHub, generate descriptions with AI, and track your views. Stand out to recruiters without writing a single line of CSS.',
  keywords: ['developer portfolio', 'github portfolio', 'portfolio builder', 'AI portfolio'],
  authors: [{ name: 'DevFolio Pro' }],
  creator: 'DevFolio Pro',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DevFolio Pro',
    title: 'DevFolio Pro — Ship your developer portfolio in seconds',
    description:
      'Sync with GitHub, generate descriptions with AI, and track your views.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFolio Pro',
    description: 'Ship your developer portfolio in seconds.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}