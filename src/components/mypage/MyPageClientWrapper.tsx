/* =======================================
 * リタワーク｜マイページ（お気に入り求人）
 * URL: src/components/mypage/MyPageClientWrapper.tsx
 * Referenced in: src/components/mypage/MyPageClientWrapper.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-26
 * ======================================= */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { JobCardList } from '@/components/job/JobCardList';
import type { JobCategory } from '@/types/jobCategory';
import type { JobIndexItem } from '@/types/jobIndex';
import styles from './MyPageClientWrapper.module.scss';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';

export function MyPageClientWrapper() {
  // 全件求人 index（jobsIndexAll.json）
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);

  // master（日本語ラベル用）
  const [employmentTypes, setEmploymentTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
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

        const map: Record<string, string> = Object.fromEntries(
          salaryUnits.map((u) => [u.id, u.label ?? u.name ?? u.id])
        );
        setSalaryUnitMap(map);
      } catch {
        // master が取れなくてもページ自体は落とさない（ID表示にフォールバックできる）
        setEmploymentTypes([]);
        setJobCategories([]);
        setSalaryUnitMap({});
      }
    };

    loadMasters();
  }, []);

  const { favoriteJobIds, toggleFavorite, favoriteIdsArray } =
    useFavoriteJobIds();

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

  /* -------------------------------
   * render
   * ------------------------------- */

  return (
    <>
      <section className={styles.containerHead}>
        <h2>お気に入り・閲覧履歴</h2>
      </section>
      <section className={styles.containerMyPage}>
        <nav>
          <button type="button" className={styles.isActive}>
            お気に入り
          </button>
          <button type="button">閲覧履歴</button>
        </nav>
        {favoriteJobs.length === 0 ? (
          <p className={styles.noFavorite}>
            お気に入りに登録された求人はありません。
          </p>
        ) : (
          <article>
            <JobCardList
              jobs={favoriteJobs}
              salaryUnitMap={salaryUnitMap}
              employmentTypeMap={employmentTypeMap}
              jobCategoryMap={jobCategoryMap}
              favoriteJobIds={favoriteJobIds}
              onToggleFavorite={toggleFavorite}
              ulClassName={styles.listCard}
            />
          </article>
        )}
      </section>
    </>
  );
}
