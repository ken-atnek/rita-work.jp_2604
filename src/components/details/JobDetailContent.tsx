/* =======================================
 * リタワーク 詳細ページ（UI専用）
 * Component: JobDetailContent
 * URL: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * ======================================= */

import ContainerJobHero from './ContainerJobHero';
import type { Job } from '@/types/job';

type JobDetailContentProps = {
  job: Job;
};

export function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <>
      <ContainerJobHero job={job} />
      {/* 今後ここにセクションを増やしていく */}
    </>
  );
}
