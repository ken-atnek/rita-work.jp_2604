/* =======================================
 * ContainerCardList 事業者ページ- 求人カード一覧コンポーネント
 * URL: src/components/facility/ContainerCardList.tsx
 * Referenced in: src/components/facility/FacilityDetailContent.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-26
 * ======================================= */

'use client';

import styles from './ContainerCardList.module.scss';
import { JobCardList } from '@/components/job/JobCardList';
import type { JobIndexItem } from '@/types/jobIndex';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';

type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>; // あれば日本語ラベル化、なければidのまま
};

export function ContainerCardList({
  jobs,
  salaryUnitMap,
  jobCategoryMap,
  employmentTypeMap,
}: Props) {
  const { favoriteJobIds, toggleFavorite } = useFavoriteJobIds();

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
        favoriteJobIds={favoriteJobIds}
        onToggleFavorite={toggleFavorite}
        ulClassName={styles.listCard}
      />
    </section>
  );
}
