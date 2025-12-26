/* =======================================
 * ContainerCardList 事業者ページ- 求人カードLIコンポーネント
 * URL: src/components/job/JobCardItem.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-26
 * ======================================= */

'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import styles from './JobCardItem.module.scss';

import { buildJobDetailUrl } from '@/utils/buildJobUrl';
import { buildSalaryText } from '@/utils/salaryText';

import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  job: JobIndexItem;
  salaryUnitMap: Record<string, string>;
  employmentTypeMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;

  // お気に入り状態は親から渡す（localStorageは触らない）
  isFavorite: boolean;
  onToggleFavorite: (jobId: string) => void;
};

export function JobCardItem({
  job,
  salaryUnitMap,
  employmentTypeMap,
  jobCategoryMap,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const heroSrc = job.heroImages?.[0] ?? '';

  const jobCategoryLabel =
    (jobCategoryMap && jobCategoryMap[job.jobCategoryId]) || job.jobCategoryId;

  const employmentTypeLabel =
    employmentTypeMap[job.employmentTypeId] ?? job.employmentTypeId;

  return (
    <li className={styles.itemCard}>
      <Link
        href={buildJobDetailUrl(job.jobId)}
        className={styles.itemLink}
        aria-label={`${job.title}の求人詳細へ`}
      />

      <button
        type="button"
        className={clsx(styles.itemFavorite, isFavorite && styles['is-active'])}
        onClick={() => onToggleFavorite(job.jobId)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
      />

      <div className={styles.itemImage}>
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={`${job.title}の画像`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={styles.itemImagePlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.itemDetails}>
        <div className={styles.innerHead}>
          <div className={styles.wrapHead}>
            {job.isNew && <span className={styles.iconNew}>新着</span>}

            <span className={styles.employmentType}>{employmentTypeLabel}</span>
          </div>

          {/* headerにh1がある前提でh2 */}
          <h2>{job.title}</h2>

          <h3>{job.facilityName}</h3>
        </div>

        <div className={styles.detailsList}>
          <dl>
            <dt className={styles.metaTerm}>給与</dt>
            <dd className={styles.metaDesc}>
              {buildSalaryText(job.salary, salaryUnitMap)}
            </dd>
          </dl>

          <dl>
            <dt className={styles.metaTerm}>募集職種</dt>
            <dd className={styles.metaDesc}>{jobCategoryLabel}</dd>
          </dl>

          <dl>
            <dt className={styles.metaTerm}>勤務地</dt>
            <dd className={styles.metaDesc}>{job.workLocationText}</dd>
          </dl>
        </div>
      </div>
    </li>
  );
}
