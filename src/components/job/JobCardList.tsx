/* =======================================
 * JobCardList - 求人カードULコンポーネント（表示専用）
 * URL: src/components/job/JobCardList.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-26
 * ======================================= */

import { JobCardItem } from '@/components/job/JobCardItem';
import type { JobIndexItem } from '@/types/jobIndex';
import { isNewByPublishedStart } from '@/utils/isNewByPublishedStart';
type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;
  hourlyBandMap?: Record<string, string>;
  // お気に入り制御は親から渡す（司令塔が持つ）
  favoriteJobIds: string[];
  onToggleFavorite: (jobId: string) => void;

  ulClassName: string;
  newIconPeriodDays: number;
};

export function JobCardList({
  jobs,
  salaryUnitMap,
  employmentTypeMap,
  jobCategoryMap,
  favoriteJobIds,
  onToggleFavorite,
  ulClassName,
  hourlyBandMap,
  newIconPeriodDays,
}: Props) {
  if (!jobs || jobs.length === 0) return null;
  const favoriteSet = new Set(favoriteJobIds);

  return (
    <ul className={ulClassName}>
      {jobs.map((job) => {
        const isFav = favoriteSet.has(job.jobId);
        const isNew = isNewByPublishedStart({
          start: job.publishedPeriod?.start,
          newIconPeriodDays,
        });
        return (
          <JobCardItem
            key={job.jobId}
            job={job}
            isNew={isNew}
            salaryUnitMap={salaryUnitMap}
            employmentTypeMap={employmentTypeMap}
            jobCategoryMap={jobCategoryMap}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
            hourlyBandMap={hourlyBandMap}
          />
        );
      })}
    </ul>
  );
}
