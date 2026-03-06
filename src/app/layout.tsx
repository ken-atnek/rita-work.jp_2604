/* =======================================
 * リタワーク Layout
 * URL:src/app/layout.tsx
 * Created: 2025-08-26
 * Last updated: 2025-08-26
 * ======================================= */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.scss';
import { Noto_Sans_JP, Roboto, Archivo_Black } from 'next/font/google';
import SvgDefs from '@/components/SvgDefs';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { isRealProduction } from '@/lib/env';

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-archivo-black',
});

const siteName = 'リタワーク';
const siteDescription =
  '熊本の医療・介護・福祉業界の求人を掲載する求人ポータルサイト。エリア・職種・雇用形態など条件から、自分に合った仕事を簡単に探せます。';

// 本番のみ metadataBase を設定
const metadataBase = isRealProduction
  ? new URL(process.env.NEXT_PUBLIC_METADATA_BASE || 'https://rita-work.jp/')
  : undefined;

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s｜${siteName}`,
  },
  description: siteDescription,
  ...(isRealProduction && {
    metadataBase,
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: metadataBase?.toString(),
      type: 'website',
      images: [
        {
          url: '/ogp.jpg',
          width: 1200,
          height: 630,
          alt: 'リタワークのOGP画像',
        },
      ],
    },
  }),
  robots: isRealProduction ? 'index, follow' : 'noindex, nofollow',
  icons: {
    icon: [
      {
        url: '/favicon/favicon-light.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon/favicon-light.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
      // { url: '/favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${roboto.className} ${notoSans.className} ${archivoBlack.variable}`}
    >
      <head>
        <meta
          name="format-detection"
          content="telephone=no, address=no, email=no"
        />
      </head>
      <body>
        <SvgDefs />
        <Header />
        <main id="Main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
