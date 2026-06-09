/* =======================================
 * リタワーク 求人カード詳細
 * URL: src/app/details/page.tsx
 * ======================================= */

// src/app/details/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobDetailsClientWrapper } from '../../components/details/JobDetailsClientWrapper';
import { isRealProduction } from '@/lib/env';
import { getCanonicalUrl, getDefaultOpenGraphImage } from '@/lib/seo';

export const metadata: Metadata = {
  title: '求人詳細',
  description: '熊本の医療・介護・福祉求人の詳細情報を掲載しています。',
  alternates: {
    canonical: getCanonicalUrl('/details/'),
  },
  ...(isRealProduction && {
    openGraph: {
      title: '求人詳細｜リタワーク',
      description: '熊本の医療・介護・福祉求人の詳細情報を掲載しています。',
      url: getCanonicalUrl('/details/'),
      type: 'website',
      images: [getDefaultOpenGraphImage()],
    },
  }),
  robots: isRealProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function DetailsPage() {
  return (
    <>
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailsClientWrapper />
      </Suspense>
    </>
  );
}
