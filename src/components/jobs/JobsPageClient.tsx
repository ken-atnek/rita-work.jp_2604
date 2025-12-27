/* =======================================
 * リタワーク 一覧ページ
 * Component: JobsPageClient
 * URL: src/components/jobs/JobsPageClient.tsx
 * Referenced in: src/app/jobs/page.tsx
 * Created: 2025-12-27
 * Last updated: 2025-12-27
 * ======================================= */

'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import styles from './JobsPageClient.module.scss';
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { JobCardList } from '@/components/job/JobCardList';

import type { JobIndexItem } from '@/types/jobIndex';

/* ---------------------------------------
 * マスター型（最低限）
 * -------------------------------------- */

type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

type SalaryBandHourlyMaster = {
  id: string;
  label?: string;
  name?: string;
};

export default function JobsPageClient() {
  /* ---------------------------------------
   * favorites（localStorage）
   * -------------------------------------- */
  const { favoriteIdsArray, toggleFavorite } = useFavoriteJobIds();

  /* ---------------------------------------
   * 一覧データ（全件）
   * -------------------------------------- */
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);

  /* ---------------------------------------
   * 表示用マップ
   * -------------------------------------- */
  const [employmentTypeMap, setEmploymentTypeMap] = useState<
    Record<string, string>
  >({});
  const [jobCategoryMap, setJobCategoryMap] = useState<Record<string, string>>(
    {}
  );
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );
  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
    {}
  );

  /* ---------------------------------------
   * UI state
   * -------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);
  const [activeTab, setActiveTab] = useState<'recommend' | 'new'>('recommend');
  /* ---------------------------------------
   * 初期ロード
   * -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 求人一覧（1回だけ）
        const json = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath('/db/jobs/jobsIndexAll.json'),
          { items: [] }
        );
        setJobsAll(json.items);

        // 雇用形態マスター（employmentTypeId → 日本語）
        const employmentTypes = await fetchJson<
          Array<{ id: string; name: string }>
        >(withBasePath('/db/master/employmentTypes.json'), []);

        setEmploymentTypeMap(toIdLabelMap(employmentTypes, (t) => t.name));

        // 職種マスター（jobCategoryId → 日本語）
        const categories = await fetchJson<
          Array<{ id: string; name?: string; label?: string }>
        >(withBasePath('/db/master/jobCategories.json'), []);

        setJobCategoryMap(
          toIdLabelMap(categories, (c) => c.name ?? c.label ?? c.id)
        );

        // 新着表示期間
        const config = await fetchJson<{ newIconPeriodDays?: number }>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }

        // 給与単位
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        // 時給バンド
        const bands = await fetchJson<SalaryBandHourlyMaster[]>(
          withBasePath('/db/master/salaryBandsHourly.json'),
          []
        );
        setHourlyBandMap(toIdLabelMap(bands, (b) => b.label ?? b.name ?? b.id));

        // TODO: employmentTypes / jobCategories は次の段階で追加
      } catch (e) {
        console.error(e);
        setError('求人一覧の読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ---------------------------------------
   * まずは「全件」＝そのまま表示（ここから絞り込みを追加していく）
   * -------------------------------------- */
  const jobsForView = useMemo(() => {
    // 新着（updatedAt が新しい順）
    if (activeTab === 'new') {
      // ✅ ここがポイント：型ガードで updatedAt: string を確定させる
      const hasUpdatedAt = (
        job: JobIndexItem
      ): job is JobIndexItem & { updatedAt: string } =>
        typeof job.updatedAt === 'string' && job.updatedAt.length > 0;

      return [...jobsAll]
        .filter(hasUpdatedAt)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }

    return jobsAll;
  }, [activeTab, jobsAll]);

  /* ---------------------------------------
   * UI
   * -------------------------------------- */
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* ===== ページ見出し ===== */}
      <section className={styles.containerHead}>
        <div className={styles.boxHead}>
          <h2>求人を検索</h2>
        </div>
      </section>
      <section className={styles.containerJobs}>
        <nav className={styles.wrapBtn}>
          <button
            type="button"
            className={clsx(activeTab === 'recommend' && styles.isActive)}
            onClick={() => setActiveTab('recommend')}
          >
            おすすめ
          </button>

          <button
            type="button"
            className={clsx(activeTab === 'new' && styles.isActive)}
            onClick={() => setActiveTab('new')}
          >
            新着
          </button>
        </nav>
        {/* ここに「検索UI（絞り込み）」を後で足す */}
        <JobCardList
          jobs={jobsForView}
          salaryUnitMap={salaryUnitMap}
          hourlyBandMap={hourlyBandMap}
          employmentTypeMap={employmentTypeMap}
          jobCategoryMap={jobCategoryMap}
          favoriteJobIds={favoriteIdsArray}
          onToggleFavorite={toggleFavorite}
          ulClassName={styles.jobsList}
          newIconPeriodDays={newIconPeriodDays}
        />
      </section>
    </>
  );
}
