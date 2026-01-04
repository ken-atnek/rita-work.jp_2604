/* =======================================
 * リタワーク 求人カード詳細
 * URL: src/app/details/page.tsx
 * ======================================= */

// src/app/details/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobDetailsClientWrapper } from '../../components/details/JobDetailsClientWrapper';

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function DetailsPage() {
  return (
    <main style={{ backgroundColor: '#F3F3F3' }}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailsClientWrapper />
      </Suspense>
    </main>
  );
}
