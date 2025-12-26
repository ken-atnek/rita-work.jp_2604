/* =======================================
 * JobCardList - 求人カードULコンポーネント（表示専用）
 * URL: src/components/job/JobCardList.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-26
 * ======================================= */

import { JobCardItem } from '@/components/job/JobCardItem';
import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;

  // お気に入り制御は親から渡す（司令塔が持つ）
  favoriteJobIds: Set<string>;
  onToggleFavorite: (jobId: string) => void;

  // ulのclassは使う側が決められるようにしておく（再利用しやすい）
  ulClassName?: string;
};

export function JobCardList({
  jobs,
  salaryUnitMap,
  employmentTypeMap,
  jobCategoryMap,
  favoriteJobIds,
  onToggleFavorite,
  ulClassName,
}: Props) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <ul className={ulClassName}>
      {jobs.map((job) => {
        const isFav = favoriteJobIds.has(job.jobId);

        return (
          <JobCardItem
            key={job.jobId}
            job={job}
            salaryUnitMap={salaryUnitMap}
            employmentTypeMap={employmentTypeMap}
            jobCategoryMap={jobCategoryMap}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </ul>
  );
}
