import Header from '@/components/layout/Header'
import type { Metadata } from 'next'
import { Gaegu, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const gaegu = Gaegu({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-gaegu',
})

export const metadata: Metadata = {
  title: '토리스토리',
  description: '나만의 Y2K 미니홈피 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" data-theme="spring">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gaegu.variable} bg-bg antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
