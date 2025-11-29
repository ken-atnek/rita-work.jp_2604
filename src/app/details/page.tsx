/* =======================================
 * リタワーク 詳細ページ
 * URL: src/app/details/page.tsx
 * ======================================= */

import { Suspense } from 'react';
import { JobDetailsClientWrapper } from '../../components/details/JobDetailsClientWrapper';

export default function DetailsPage() {
  return (
    <main style={{ backgroundColor: '#F3F3F3' }}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailsClientWrapper />
      </Suspense>
    </main>
  );
}
