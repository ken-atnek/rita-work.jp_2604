/* =======================================
 * リタワーク 求人カード詳細
 * URL: src/app/details/page.tsx
 * ======================================= */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobDetailsClientWrapper } from '../../components/details/JobDetailsClientWrapper';
import { PREVIEW_QUERY_KEY, PREVIEW_QUERY_VALUE } from '@/config/preview';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

// ✅ generateMetadata は同期関数で
export function generateMetadata({ searchParams }: PageProps): Metadata {
  const preview = searchParams?.[PREVIEW_QUERY_KEY];
  const previewValue = Array.isArray(preview) ? preview[0] : preview;
  const isPreview = previewValue === PREVIEW_QUERY_VALUE;

  // canonical は preview パラメータを落として正規化しておく
  const id = searchParams?.id;
  const idValue = Array.isArray(id) ? id[0] : id;
  const canonical = idValue
    ? `/details?id=${encodeURIComponent(idValue)}`
    : '/details';

  return {
    robots: isPreview
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    alternates: {
      canonical,
    },
  };
}

export default function DetailsPage() {
  return (
    <main style={{ backgroundColor: '#F3F3F3' }}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <JobDetailsClientWrapper />
      </Suspense>
    </main>
  );
}
