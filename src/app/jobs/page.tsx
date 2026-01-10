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

function JobsPageFallback() {
  return <p>読み込み中...</p>;
}

export const generateMetadata = (): Metadata => {
  return {
    title: '求人検索｜リタワーク',
    description: isRealProduction
      ? '医療・介護・福祉業界の求人を掲載。エリアや職種、雇用形態など条件から自分に合った仕事を簡単検索。あなたの新しい一歩をサポートします。'
      : undefined,
  };
};

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageClient />
    </Suspense>
  );
}
