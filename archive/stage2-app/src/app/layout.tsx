import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

import { SiteHeader } from '@/components/site-header'

import './globals.css'

const pretendard = localFont({
  src: [
    { path: '../assets/fonts/Pretendard-Regular.subset.woff2', weight: '400' },
    { path: '../assets/fonts/Pretendard-Medium.subset.woff2', weight: '500' },
    { path: '../assets/fonts/Pretendard-SemiBold.subset.woff2', weight: '600' },
    { path: '../assets/fonts/Pretendard-Bold.subset.woff2', weight: '700' },
    { path: '../assets/fonts/Pretendard-ExtraBold.subset.woff2', weight: '800' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Kanqaroo · 내 소매에 노래 넣어줘', template: '%s · Kanqaroo' },
  description:
    '알고리즘 말고, 나를 아는 사람이 골라준 노래. 취향 보드를 열어두면 친구들이 노래를 소매에 넣어줘요.',
}

export const viewport: Viewport = {
  themeColor: '#fbf7f0',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4 pb-16">
          {children}
        </main>
        <footer className="text-text-subtle mx-auto w-full max-w-lg px-4 pb-10 text-xs leading-relaxed">
          음원은 각자 쓰는 앱에서 들어요. Kanqaroo는 30초 미리듣기와 링크만 보여줘요.
        </footer>
      </body>
    </html>
  )
}
