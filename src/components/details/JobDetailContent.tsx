/* =======================================
 * リタワーク 詳細ページ（UI専用）
 * Component: JobDetailContent
 * URL: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * ======================================= */

import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import type { JobCategory } from '@/types/jobCategory';
import ContainerJobHero from './ContainerJobHero';
import ContainerWorkEnvironmentStats from '@/components/details/ContainerWorkEnvironmentStats';
import ContainerFreeSpace from '@/components/details/ContainerFreeSpace';
import ContainerDailySchedule from '@/components/details/ContainerDailySchedule';
import ContainerFacilityInfo from '@/components/details/ContainerFacilityInfo';

type JobDetailContentProps = {
  job: Job;
  facility: Facility;
  corporation: Corporation;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
};

export function JobDetailContent({
  job,
  facility,
  corporation,
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
      <ContainerDailySchedule job={job} />
      <ContainerFacilityInfo
        job={job}
        facility={facility}
        corporation={corporation}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
      />
    </>
  );
}
