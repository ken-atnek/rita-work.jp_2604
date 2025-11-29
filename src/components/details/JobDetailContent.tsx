/* =======================================
 * リタワーク 詳細ページ（UI専用）
 * Component: JobDetailContent
 * URL: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * ======================================= */

import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { JobCategory } from '@/types/jobCategory';
import ContainerJobHero from './ContainerJobHero';
import ContainerWorkEnvironmentStats from '@/components/details/ContainerWorkEnvironmentStats';
import ContainerFreeSpace from '@/components/details/ContainerFreeSpace';

type JobDetailContentProps = {
  job: Job;
  facility: Facility;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
};

export function JobDetailContent({
  job,
  facility,
  newIconPeriodDays,
  employmentTypes,
  jobCategories,
}: JobDetailContentProps) {
  return (
    <>
      <ContainerJobHero
        job={job}
        facility={facility}
        newIconPeriodDays={newIconPeriodDays}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
      />
      <ContainerWorkEnvironmentStats job={job} />
      <ContainerFreeSpace job={job} />
    </>
  );
}
