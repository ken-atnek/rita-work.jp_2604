/* =======================================
 * リタワーク 詳細ページ
 * URL: src/app/details/page.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */

import { JobDetailsClient } from '@/components/details/JobDetailsClient';

type DetailsPageProps = {
  searchParams?: {
    id?: string;
  };
};

export default function DetailsPage({ searchParams }: DetailsPageProps) {
  const jobId = searchParams?.id ?? '';

  if (!jobId) {
    return (
      <main>
        <h1>求人詳細</h1>
        <p>求人を特定する ID が指定されていません。</p>
      </main>
    );
  }

  return (
    <main>
      <h1>求人詳細</h1>
      {/* ここから先はクライアントコンポーネントに任せる */}
      <JobDetailsClient jobId={jobId} />
    </main>
  );
}
