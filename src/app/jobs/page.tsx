/* =======================================
 * リタワーク 一覧ページ
 * URL: src/app/jobs/page.tsx
 * Created: 2025-12-27
 * Last updated: 2026-01-10
 * ======================================= */

import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';

import { Suspense } from 'react';
import JobsPageClient from '@/components/jobs/JobsPageClient';
import { getCanonicalUrl, getDefaultOpenGraphImage } from '@/lib/seo';

function JobsPageFallback() {
  return <p>読み込み中...</p>;
}

export const generateMetadata = (): Metadata => {
  const title = '求人検索';
  const description = isRealProduction
    ? '医療・介護・福祉業界の求人を掲載。エリアや職種、雇用形態など条件から自分に合った仕事を簡単検索。あなたの新しい一歩をサポートします。'
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl('/jobs/'),
    },
    ...(isRealProduction && {
      openGraph: {
        title: `${title}｜リタワーク`,
        description,
        url: getCanonicalUrl('/jobs/'),
        type: 'website',
        images: [getDefaultOpenGraphImage()],
      },
    }),
  };
};

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageClient />
    </Suspense>
  );
}
