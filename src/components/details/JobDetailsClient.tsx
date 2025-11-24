/* =======================================
 * リタワーク 詳細ページ
 * URL: src/components/JobDetailsClient.tsx
 * Referenced in: src/app/details/page.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
'use client';

import { useEffect, useState } from 'react';
import { JobDetailContent } from './JobDetailContent';
import type { Job } from '@/types/job';

type DetailsListItem = {
  jobId: string;
  facilityId: string;
  path: string;
};

type JobDetailsClientProps = {
  jobId: string;
};

export function JobDetailsClient({ jobId }: JobDetailsClientProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. details_list.json を読む
        const listRes = await fetch('/db/details_list.json');
        if (!listRes.ok) {
          throw new Error('details_list の取得に失敗しました');
        }
        const allJobs: DetailsListItem[] = await listRes.json();

        const target = allJobs.find((item) => item.jobId === jobId);
        if (!target) {
          throw new Error('指定された求人が details_list に見つかりません');
        }

        // 2. job_xxxx.json 本体を読む
        const jobRes = await fetch(target.path);
        if (!jobRes.ok) {
          throw new Error('求人データの取得に失敗しました');
        }
        const jobData = (await jobRes.json()) as Job;

        setJob(jobData);
        setError(null);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error
            ? e.message
            : '求人データの読み込み中にエラーが発生しました。'
        );
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [jobId]);

  if (loading) {
    return <p>読み込み中です…</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!job) {
    return <p>求人データが見つかりません。</p>;
  }

  // UI は別コンポーネントに渡す
  return <JobDetailContent job={job} />;
}
