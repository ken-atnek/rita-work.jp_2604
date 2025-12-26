/* =======================================
 * ContainerCardList 事業者ページ- 求人カード一覧コンポーネント
 * URL: src/components/facility/ContainerCardList.tsx
 * Referenced in: src/components/facility/FacilityDetailContent.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-26
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import styles from './ContainerCardList.module.scss';
import { JobCardList } from '@/components/job/JobCardList';
import type { JobIndexItem } from '@/types/jobIndex';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';

type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;
};

type SalaryBand = { id: string; label?: string; name?: string };

export function ContainerCardList({
  jobs,
  salaryUnitMap,
  jobCategoryMap,
  employmentTypeMap,
}: Props) {
  const { toggleFavorite, favoriteIdsArray } = useFavoriteJobIds();

  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    (async () => {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? '';
        const res = await fetch(`${basePath}/db/master/salaryBandsHourly.json`);
        const bands = res.ok ? ((await res.json()) as SalaryBand[]) : [];
        const map = bands.reduce<Record<string, string>>((acc, cur) => {
          const text = cur.label ?? cur.name;
          if (text) acc[cur.id] = text;
          return acc;
        }, {});
        setHourlyBandMap(map);
      } catch {
        setHourlyBandMap({});
      }
    })();
  }, []);

  /* ---------------------------------------
   * 求人が無ければ表示しない
   * -------------------------------------- */
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className={styles.containerCardList}>
      <JobCardList
        jobs={jobs}
        salaryUnitMap={salaryUnitMap}
        employmentTypeMap={employmentTypeMap}
        jobCategoryMap={jobCategoryMap}
        favoriteJobIds={favoriteIdsArray}
        onToggleFavorite={toggleFavorite}
        ulClassName={styles.listCard}
        hourlyBandMap={hourlyBandMap}
      />
    </section>
  );
}
