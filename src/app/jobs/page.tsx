/* =======================================
 * リタワーク 一覧ページ
 * URL: src/app/jobs/page.tsx
 * Created: 2025-12-27
 * Last updated: 2025-12-27
 * ======================================= */

import { Suspense } from 'react';
import JobsPageClient from '@/components/jobs/JobsPageClient';

export default function JobsPage() {
  return (
    <main>
      <Suspense fallback={<p>読み込み中...</p>}>
        <JobsPageClient />
      </Suspense>
    </main>
  );
}
