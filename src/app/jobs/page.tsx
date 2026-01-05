/* =======================================
 * リタワーク 一覧ページ
 * URL: src/app/jobs/page.tsx
 * Created: 2025-12-27
 * Last updated: 2026-01-05
 * ======================================= */

import { Suspense } from 'react';
import JobsPageClient from '@/components/jobs/JobsPageClient';

function JobsPageFallback() {
  return <p>読み込み中...</p>;
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageClient />
    </Suspense>
  );
}
