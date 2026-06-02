/* =======================================
 * ContainerCardList 事業者ページ- 求人カードLIコンポーネント
 * URL: src/components/job/JobCardItem.tsx
 * Created: 2025-12-26
 * Last updated: 2026-06-02
 * ======================================= */

'use client';

import clsx from 'clsx';
import { JobCardBody } from './JobCardBody';
import styles from './JobCardItem.module.scss';

import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  job: JobIndexItem;
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;
  isNew: boolean;
  isFavorite: boolean;
  onToggleFavorite: (jobId: string) => void;
  isPremiumLead?: boolean;
};

export function JobCardItem({ isPremiumLead = false, ...props }: Props) {
  return (
    <li
      className={clsx(styles.itemCard, isPremiumLead && styles.itemPremiumPlan)}
    >
      <JobCardBody {...props} />
    </li>
  );
}
