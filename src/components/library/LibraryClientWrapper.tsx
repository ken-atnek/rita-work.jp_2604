/* =======================================
 * リタワーク｜マイページ（お気に入り求人）
 * URL: src/components/library/LibraryClientWrapper.tsx
 * Referenced in: src/app/library/page.tsx
 * Created: 2025-12-25
 * Last updated: 2026-01-08
 * ======================================= */

'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import styles from './LibraryClientWrapper.module.scss';
import { JobCardList } from '@/components/job/JobCardList';
import { JobHistoryList } from '@/components/job/JobHistoryList';

import type { JobCategory } from '@/types/jobCategory';
import type { JobIndexItem } from '@/types/jobIndex';

import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { useJobHistoryIds } from '@/hooks/useJobHistoryIds';

import { buildJobDetailUrl } from '@/utils/buildJobDetailUrl';
import { withBasePath } from '@/utils/withBasePath';
import { fetchJson } from '@/utils/fetchJson';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

export function LibraryClientWrapper() {
  // 全件求人 index（jobsIndexAll.json）
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);

  // 表示タブ（お気に入り / 閲覧履歴）
  const [activeTab, setActiveTab] = useState<'favorite' | 'history'>(
    'favorite'
  );

  const { historyIds } = useJobHistoryIds();
  const { toggleFavorite, favoriteIdsArray } = useFavoriteJobIds();

  // 表示用ラベル maps
  const [employmentTypeMap, setEmploymentTypeMap] = useState<
    Record<string, string>
  >({});
  const [jobCategoryMap, setJobCategoryMap] = useState<Record<string, string>>(
    {}
  );
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );

  // 新着表示の期間（日数） ※configから読む
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(30);

  /* -------------------------------
   * 初期ロード
   * - jobsIndexAll
   * - masters
   * - config
   * ------------------------------- */
  useEffect(() => {
    const loadAll = async () => {
      // jobs は失敗しても落ちない（items: [] でフォールバック）
      const timestamp = Date.now();
      const jobsPromise = fetchJson<{ items: JobIndexItem[] }>(
        withBasePath(`/db/jobs/jobsIndexAll.json?t=${timestamp}`),
        { items: [] }
      );

      // masters / config も基本落とさない方針
      const employmentPromise = fetchJson<{ id: string; name: string }[]>(
        withBasePath('/db/master/employmentTypes.json'),
        []
      );

      const categoriesPromise = fetchJson<JobCategory[]>(
        withBasePath('/db/master/jobCategories.json'),
        []
      );

      const salaryUnitsPromise = fetchJson<
        { id: string; label?: string; name?: string }[]
      >(withBasePath('/db/master/salaryUnits.json'), []);

      const configPromise = fetchJson<{ newIconPeriodDays?: number }>(
        withBasePath('/db/config/job_common.json'),
        {}
      );

      const [jobsJson, employmentMaster, categories, salaryUnits, config] =
        await Promise.all([
          jobsPromise,
          employmentPromise,
          categoriesPromise,
          salaryUnitsPromise,
          configPromise,
        ]);

      setJobsAll(jobsJson.items);

      setEmploymentTypeMap(toIdLabelMap(employmentMaster, (t) => t.name));
      setJobCategoryMap(toIdLabelMap(categories, (c) => c.name ?? c.id));
      setSalaryUnitMap(
        toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
      );

      if (typeof config.newIconPeriodDays === 'number') {
        setNewIconPeriodDays(config.newIconPeriodDays);
      }
    };

    loadAll();
  }, []);

  /* -------------------------------
   * jobIds × jobsAll → favoriteJobs
   * - 追加順を維持（favoriteIdsArrayの順）
   * ------------------------------- */
  const favoriteJobs = useMemo(() => {
    if (favoriteIdsArray.length === 0 || jobsAll.length === 0) return [];

    const idSet = new Set(favoriteIdsArray);
    const picked = jobsAll.filter((job) => idSet.has(job.jobId));

    const order = new Map(favoriteIdsArray.map((id, idx) => [id, idx]));
    picked.sort(
      (a, b) => (order.get(a.jobId) ?? 9999) - (order.get(b.jobId) ?? 9999)
    );

    return picked;
  }, [favoriteIdsArray, jobsAll]);

  /* -------------------------------
   * historyIds × jobsAll → historyJobs
   * - 履歴の順番（最新順）を維持（historyIdsの順）
   * ------------------------------- */
  const historyJobs = useMemo(() => {
    if (historyIds.length === 0 || jobsAll.length === 0) return [];

    const idSet = new Set(historyIds);
    const picked = jobsAll.filter((job) => idSet.has(job.jobId));

    const orderMap = new Map(historyIds.map((id, index) => [id, index]));
    picked.sort(
      (a, b) =>
        (orderMap.get(a.jobId) ?? 9999) - (orderMap.get(b.jobId) ?? 9999)
    );

    return picked;
  }, [historyIds, jobsAll]);

  /* -------------------------------
   * render
   * ------------------------------- */
  return (
    <>
      {/* ===== ページ見出し ===== */}
      <section className={styles.containerHead}>
        <h2>お気に入り・閲覧履歴</h2>
      </section>

      {/* ===== タブ ===== */}
      <section className={styles.containerMyPage}>
        <nav className={styles.wrapBtn}>
          <button
            type="button"
            className={clsx(activeTab === 'favorite' && styles.isActive)}
            onClick={() => setActiveTab('favorite')}
          >
            お気に入り
          </button>

          <button
            type="button"
            className={clsx(activeTab === 'history' && styles.isActive)}
            onClick={() => setActiveTab('history')}
          >
            閲覧履歴
          </button>
        </nav>

        {/* ===== 一覧 or 0件 ===== */}
        {activeTab === 'favorite' ? (
          favoriteJobs.length === 0 ? (
            <p className={styles.noFavorite}>
              お気に入りに登録された求人はありません。
            </p>
          ) : (
            <JobCardList
              jobs={favoriteJobs}
              salaryUnitMap={salaryUnitMap}
              employmentTypeMap={employmentTypeMap}
              jobCategoryMap={jobCategoryMap}
              favoriteJobIds={favoriteIdsArray}
              onToggleFavorite={toggleFavorite}
              ulClassName={styles.listCard}
              newIconPeriodDays={newIconPeriodDays}
            />
          )
        ) : historyJobs.length === 0 ? (
          <p className={styles.noFavorite}>閲覧履歴はありません。</p>
        ) : (
          <JobHistoryList
            jobs={historyJobs}
            employmentTypeMap={employmentTypeMap}
            buildJobUrl={buildJobDetailUrl}
            ulClassName={styles.historyList}
            newIconPeriodDays={newIconPeriodDays}
          />
        )}
      </section>
    </>
  );
}
