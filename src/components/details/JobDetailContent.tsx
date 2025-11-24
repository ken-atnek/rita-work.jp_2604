/* =======================================
 * リタワーク 詳細ページ（UI専用）
 * Component: JobDetailContent
 * URL: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * ======================================= */

import ContainerJobHero from './ContainerJobHero';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';

type JobDetailContentProps = {
  job: Job;
  facility: Facility;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
};

export function JobDetailContent({
  job,
  facility,
  newIconPeriodDays,
  employmentTypes,
}: JobDetailContentProps) {
  return (
    <>
      <ContainerJobHero
        job={job}
        facility={facility}
        newIconPeriodDays={newIconPeriodDays}
        employmentTypes={employmentTypes}
      />
      {/* 今後ここにセクションを増やしていく */}
    </>
  );
}
