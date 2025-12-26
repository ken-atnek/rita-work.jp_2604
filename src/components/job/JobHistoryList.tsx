/* =======================================
 * リタワーク｜マイページ（閲覧履歴）UL部分
 * URL:src/components/job/JobHistoryList.tsx
 * Referenced in: src/components/mypage/MyPageClientWrapper.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-26
 * ======================================= */

import { JobHistoryItem } from './JobHistoryItem';
import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  jobs: JobIndexItem[];

  // 表示用マップ（MyPageで作って渡す）
  employmentTypeMap: Record<string, string>;
  buildJobUrl: (jobId: string) => string;

  ulClassName: string;
};

export function JobHistoryList({
  jobs,
  employmentTypeMap,
  buildJobUrl,
  ulClassName,
}: Props) {
  return (
    <ul className={ulClassName}>
      {jobs.map((job) => {
        const employmentTypeLabel =
          employmentTypeMap[job.employmentTypeId] ?? job.employmentTypeId;

        return (
          <JobHistoryItem
            key={job.jobId}
            job={job}
            employmentTypeLabel={employmentTypeLabel}
            href={buildJobUrl(job.jobId)}
          />
        );
      })}
    </ul>
  );
}
