/* =======================================
 * リタワーク｜マイページ（お気に入り求人）
 * URL: src/components/library/LibraryClientWrapper.tsx
 * Referenced in: src/app/library/page.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-26
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
  // master（日本語ラベル用）
  const [employmentTypes, setEmploymentTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );
  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
    {}
  );
  // 新着表示の期間（日数） ※configから読む
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(30);
  /* -------------------------------
   * 2) jobsIndexAll.json → jobsAll
   * - 失敗してもページは落とさない（items: [] にフォールバック）
   * ------------------------------- */
  useEffect(() => {
    const loadJobsAll = async () => {
      const json = await fetchJson<{ items: JobIndexItem[] }>(
        withBasePath('/db/jobs/jobsIndexAll.json'),
        { items: [] }
      );

      setJobsAll(json.items);
    };

    loadJobsAll();
  }, []);

  /* -------------------------------
   * 2.5) master JSON → label maps
   * - マイページでカード表示するために必要
   * - 失敗してもページは落とさない（ID表示にフォールバックできる）
   * ------------------------------- */
  useEffect(() => {
    const loadMasters = async () => {
      // 雇用形態
      const employmentMaster = await fetchJson<{ id: string; name: string }[]>(
        withBasePath('/db/master/employmentTypes.json'),
        []
      );
      setEmploymentTypes(employmentMaster);

      // 職種
      const categories = await fetchJson<JobCategory[]>(
        withBasePath('/db/master/jobCategories.json'),
        []
      );
      setJobCategories(categories);

      // 給与単位（unitId → 日本語ラベル）
      const salaryUnits = await fetchJson<
        { id: string; label?: string; name?: string }[]
      >(withBasePath('/db/master/salaryUnits.json'), []);

      const unitMap = toIdLabelMap(
        salaryUnits,
        (u) => u.label ?? u.name ?? u.id
      );
      setSalaryUnitMap(unitMap);

      // 時給バンド（bandId → 日本語ラベル）
      const bands = await fetchJson<
        { id: string; label?: string; name?: string }[]
      >(withBasePath('/db/master/salaryBandsHourly.json'), []);

      const bandMap = toIdLabelMap(bands, (b) => b.label ?? b.name ?? b.id);
      setHourlyBandMap(bandMap);
    };

    loadMasters();
  }, []);
  /* -------------------------------
   * 2.6) config（新着表示の期間）
   * ------------------------------- */
  useEffect(() => {
    const loadConfig = async () => {
      const json = await fetchJson<{ newIconPeriodDays?: number }>(
        withBasePath('/db/config/job_common.json'),
        {}
      );

      if (typeof json.newIconPeriodDays === 'number') {
        setNewIconPeriodDays(json.newIconPeriodDays);
      }
    };

    loadConfig();
  }, []);

  const { toggleFavorite, favoriteIdsArray } = useFavoriteJobIds();

  /* -------------------------------
   * 3) jobIds × jobsAll → favoriteJobs
   * - 追加順を維持（jobIdsの順）
   * ------------------------------- */
  const favoriteJobs = useMemo(() => {
    if (favoriteIdsArray.length === 0 || jobsAll.length === 0) return [];

    const set = new Set(favoriteIdsArray);
    const picked = jobsAll.filter((job) => set.has(job.jobId));

    const order = new Map(favoriteIdsArray.map((id, idx) => [id, idx]));
    picked.sort(
      (a, b) => (order.get(a.jobId) ?? 9999) - (order.get(b.jobId) ?? 9999)
    );

    return picked;
  }, [favoriteIdsArray, jobsAll]);
  const employmentTypeMap = useMemo(() => {
    return toIdLabelMap(employmentTypes, (t) => t.name);
  }, [employmentTypes]);

  const jobCategoryMap = useMemo(() => {
    return toIdLabelMap(jobCategories, (c) => c.name);
  }, [jobCategories]);

  const historyJobs = useMemo(() => {
    if (historyIds.length === 0 || jobsAll.length === 0) return [];

    // 履歴IDを Set に（filter高速化）
    const idSet = new Set(historyIds);

    // 該当する求人だけ抽出
    const picked = jobsAll.filter((job) => idSet.has(job.jobId));

    // 履歴の順番（最新順）を維持
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
              hourlyBandMap={hourlyBandMap}
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
            // onRemove={removeHistory} ←後でやるなら
            ulClassName={styles.historyList}
            newIconPeriodDays={newIconPeriodDays}
          />
        )}
      </section>
    </>
  );
}
