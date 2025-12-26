/* =======================================
 * リタワーク｜マイページ（閲覧履歴）LI部分
 * URL: src/components/job/JobHistoryItem.tsx
 * Referenced in: src/components/job/JobHistoryList.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-26
 * ======================================= */
import Link from 'next/link';
import styles from './JobHistoryList.module.scss';

import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  job: JobIndexItem;
  employmentTypeLabel: string;
  href: string;
};

export function JobHistoryItem({ job, employmentTypeLabel, href }: Props) {
  return (
    <li className={styles.historyItem}>
      <Link
        href={href}
        className={styles.itemLink}
        aria-label={`${job.title} 詳細へ`}
      ></Link>
      <div className={styles.wrapHead}>
        {job.isNew && <span className={styles.iconNew}>新着</span>}
        {employmentTypeLabel && (
          <span className={styles.employmentType}>{employmentTypeLabel}</span>
        )}
      </div>

      <div className={styles.wrapText}>
        <p className={styles.title}>{job.title}</p>
        <p className={styles.facility}>{job.facilityName}</p>
      </div>
    </li>
  );
}
