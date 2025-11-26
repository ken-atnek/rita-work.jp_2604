/* =======================================
 * JobDetailsClientWrapper - クライアントサイドでURLパラメータを処理
 * URL: src/components/details/JobDetailsClientWrapper.tsx
 * ======================================= */

'use client';

import { useSearchParams } from 'next/navigation';
import { JobDetailsClient } from './JobDetailsClient';

export function JobDetailsClientWrapper() {
  const searchParams = useSearchParams();

  // id を取得
  const rawId = (searchParams.get('id') || '').trim();

  // id が無いとき
  if (!rawId) {
    return (
      <>
        <h1>求人詳細</h1>
        <p>求人を特定する ID が指定されていません。</p>
      </>
    );
  }

  // job_0001 / 0001 の両対応
  const jobId = rawId.startsWith('job_') ? rawId : `job_${rawId}`;

  return <JobDetailsClient jobId={jobId} />;
}
