/* =======================================
 * リタワーク 詳細ページ
 * URL: src/components/details/JobDetailsClient.tsx
 * Referenced in: src/app/details/page.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
'use client';

import { useEffect, useState } from 'react';
import { JobDetailContent } from './JobDetailContent';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
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
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);
  const [employmentTypes, setEmploymentTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [facility, setFacility] = useState<Facility | null>(null); // ★追加
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

        // 2b. facility.json を読む（jobData.facilityId からパスを組み立て）
        const facilityRes = await fetch(
          `/db/facilities/${jobData.facilityId}/facility.json`
        );
        if (!facilityRes.ok) {
          throw new Error('施設データの取得に失敗しました');
        }
        const facilityData = (await facilityRes.json()) as Facility;
        // 3. 共通設定（新着期間）を読む
        try {
          const configRes = await fetch('/db/config/job_common.json');
          if (configRes.ok) {
            const config = (await configRes.json()) as {
              newIconPeriodDays?: number;
            };

            if (typeof config.newIconPeriodDays === 'number') {
              setNewIconPeriodDays(config.newIconPeriodDays);
            }
          }
          // 失敗しても致命的ではないので catch しない（初期値90のまま）
        } catch {
          // ここも何もしない：デフォルト90日を使う
        }
        // 4. 雇用形態マスターの取得
        let types: { id: string; name: string }[] = [];
        try {
          const typesRes = await fetch('/db/master/employmentTypes.json');
          if (typesRes.ok) {
            types = (await typesRes.json()) as { id: string; name: string }[];
          }
        } catch {}
        setEmploymentTypes(types);
        setFacility(facilityData);
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
        setFacility(null);
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

  if (!job || !facility) {
    return <p>求人データが見つかりません。</p>;
  }

  // UI は別コンポーネントに渡す
  return (
    <JobDetailContent
      job={job}
      facility={facility}
      newIconPeriodDays={newIconPeriodDays}
      employmentTypes={employmentTypes}
    />
  );
}
