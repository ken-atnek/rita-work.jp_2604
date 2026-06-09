/* =======================================
 * リタワーク 事業所詳細ページ
 * URL: src/app/facility/page.tsx
 * ======================================= */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FacilityPageClientWrapper } from '@/components/facility/FacilityPageClientWrapper';
import { isRealProduction } from '@/lib/env';
import { getCanonicalUrl, getDefaultOpenGraphImage } from '@/lib/seo';

export const generateMetadata = (): Metadata => {
  const title = '事業所詳細';
  const description = isRealProduction
    ? '熊本の医療・介護・福祉に関わる事業所情報を掲載しています。施設概要や募集求人を確認できます。'
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl('/facility/'),
    },
    ...(isRealProduction && {
      openGraph: {
        title: `${title}｜リタワーク`,
        description,
        url: getCanonicalUrl('/facility/'),
        type: 'website',
        images: [getDefaultOpenGraphImage()],
      },
    }),
  };
};

export default function FacilityPage() {
  return (
    <>
      <Suspense fallback={<div>読み込み中...</div>}>
        <FacilityPageClientWrapper />
      </Suspense>
    </>
  );
}
