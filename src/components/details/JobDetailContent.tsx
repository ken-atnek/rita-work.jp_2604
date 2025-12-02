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
import ContainerJobRequirements from '@/components/details/ContainerJobRequirements';
import ContainerFacilityInfo from '@/components/details/ContainerFacilityInfo';

type JobDetailContentProps = {
  job: Job;
  facility: Facility;
  corporation: Corporation;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
  benefitOptions: { id: string; name: string; sortOrder: number }[];
  facilityTypes: { id: string; label: string }[];
};

export function JobDetailContent({
  job,
  facility,
  corporation,
  newIconPeriodDays,
  employmentTypes,
  jobCategories,
  benefitOptions,
  facilityTypes,
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
      <ContainerJobRequirements
        job={job}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
        benefitOptions={benefitOptions}
      />
      <ContainerFacilityInfo
        job={job}
        facility={facility}
        corporation={corporation}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
        facilityTypes={facilityTypes}
      />
    </>
  );
}
