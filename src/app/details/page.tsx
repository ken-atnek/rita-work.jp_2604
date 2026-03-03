/* =======================================
 * リタワーク 求人カード詳細
 * URL: src/app/details/page.tsx
 * ======================================= */

// src/app/details/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobDetailsClientWrapper } from '../../components/details/JobDetailsClientWrapper';

export const metadata: Metadata = {
  title: '求人詳細｜リタワーク',
  description: '熊本の医療・介護・福祉求人の詳細情報を掲載しています。',
  robots: { index: true, follow: true },
};
export default function DetailsPage() {
  return (
    <main style={{ backgroundColor: '#FFFBF4' }}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailsClientWrapper />
      </Suspense>
    </main>
  );
}
