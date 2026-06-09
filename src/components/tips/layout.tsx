import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';
import type { ReactNode } from 'react';
import { getCanonicalUrl, getDefaultOpenGraphImage } from '@/lib/seo';

export const generateMetadata = (): Metadata => {
  const title = '転職のヒント';
  const description = isRealProduction
    ? '転職活動に役立つヒントやポイントを、分かりやすくまとめました。'
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl('/tips/'),
    },
    ...(isRealProduction && {
      openGraph: {
        title: `${title}｜リタワーク`,
        description,
        url: getCanonicalUrl('/tips/'),
        type: 'website',
        images: [getDefaultOpenGraphImage()],
      },
    }),
  };
};

export default function TipsLayout({ children }: { children: ReactNode }) {
  return children;
}
