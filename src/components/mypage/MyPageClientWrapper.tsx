/* =======================================
 * リタワーク｜マイページ（お気に入り求人）
 * URL: src/components/mypage/MyPageClientWrapper.tsx
 * Referenced in: src/components/mypage/MyPageClientWrapper.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-26
 * ======================================= */
'use client';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import styles from './MyPageClientWrapper.module.scss';
import { JobCardList } from '@/components/job/JobCardList';
import { JobHistoryList } from '@/components/job/JobHistoryList';
import type { JobCategory } from '@/types/jobCategory';
import type { JobIndexItem } from '@/types/jobIndex';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { useJobHistoryIds } from '@/hooks/useJobHistoryIds';

export function MyPageClientWrapper() {
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
  /* -------------------------------
   * 2) jobsIndexAll.json → jobsAll
   * ------------------------------- */
  useEffect(() => {
    const loadJobsAll = async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

      try {
        const res = await fetch(`${basePath}/db/jobs/jobsIndexAll.json`);
        const json = res.ok
          ? ((await res.json()) as { items: JobIndexItem[] })
          : { items: [] };

        setJobsAll(json.items);
      } catch {
        setJobsAll([]);
      }
    };

    loadJobsAll();
  }, []);

  /* -------------------------------
   * 2.5) master JSON → label maps
   * - マイページでカード表示するために必要
   * ------------------------------- */
  useEffect(() => {
    const loadMasters = async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

      try {
        // 雇用形態
        const employmentRes = await fetch(
          `${basePath}/db/master/employmentTypes.json`
        );
        const employmentMaster = employmentRes.ok
          ? ((await employmentRes.json()) as { id: string; name: string }[])
          : [];
        setEmploymentTypes(employmentMaster);

        // 職種
        const categoryRes = await fetch(
          `${basePath}/db/master/jobCategories.json`
        );
        const categories = categoryRes.ok
          ? ((await categoryRes.json()) as JobCategory[])
          : [];
        setJobCategories(categories);

        // 給与単位
        const salaryUnitRes = await fetch(
          `${basePath}/db/master/salaryUnits.json`
        );
        const salaryUnits = salaryUnitRes.ok
          ? ((await salaryUnitRes.json()) as {
              id: string;
              label?: string;
              name?: string;
            }[])
          : [];
        // 時給バンド（hourly）
        const bandRes = await fetch(
          `${basePath}/db/master/salaryBandsHourly.json`
        );
        const bands = bandRes.ok
          ? ((await bandRes.json()) as {
              id: string;
              label?: string;
              name?: string;
            }[])
          : [];

        const bandMap = bands.reduce<Record<string, string>>((acc, cur) => {
          const text = cur.label ?? cur.name;
          if (text) acc[cur.id] = text;
          return acc;
        }, {});

        setHourlyBandMap(bandMap);
        const map: Record<string, string> = Object.fromEntries(
          salaryUnits.map((u) => [u.id, u.label ?? u.name ?? u.id])
        );
        setSalaryUnitMap(map);
      } catch {
        // master が取れなくてもページ自体は落とさない（ID表示にフォールバックできる）
        setEmploymentTypes([]);
        setJobCategories([]);
        setSalaryUnitMap({});
        setHourlyBandMap({});
      }
    };

    loadMasters();
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
    return employmentTypes.reduce<Record<string, string>>((acc, type) => {
      acc[type.id] = type.name;
      return acc;
    }, {});
  }, [employmentTypes]);

  const jobCategoryMap = useMemo(() => {
    return jobCategories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
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

  const buildJobDetailUrl = (jobId: string) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    return `${basePath}/details?id=${encodeURIComponent(jobId)}`;
  };
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
          />
        )}
      </section>
    </>
  );
}
