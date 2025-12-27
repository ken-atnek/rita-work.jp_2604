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
import { withBasePath } from '@/utils/withBasePath';
import { fetchJson } from '@/utils/fetchJson';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;
  newIconPeriodDays: number;
};

type SalaryBand = { id: string; label?: string; name?: string };

export function ContainerCardList({
  jobs,
  salaryUnitMap,
  jobCategoryMap,
  employmentTypeMap,
  newIconPeriodDays,
}: Props) {
  const { toggleFavorite, favoriteIdsArray } = useFavoriteJobIds();

  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
    {}
  );

  /* ---------------------------------------
   * 時給バンドマスター（bandId → 日本語ラベル）
   * - 失敗してもページは落とさない（空Map）
   * -------------------------------------- */
  useEffect(() => {
    const loadBands = async () => {
      const bands = await fetchJson<SalaryBand[]>(
        withBasePath('/db/master/salaryBandsHourly.json'),
        []
      );

      const map = toIdLabelMap(bands, (b) => b.label ?? b.name);
      setHourlyBandMap(map);
    };

    loadBands();
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
        newIconPeriodDays={newIconPeriodDays}
      />
    </section>
  );
}
