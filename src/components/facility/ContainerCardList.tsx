/* =======================================
 * ContainerCardList 事業者ページ- 求人カード一覧コンポーネント
 * URL: src/components/facility/ContainerCardList.tsx
 * Referenced in: src/components/facility/FacilityDetailContent.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-25
 * ======================================= */
import clsx from 'clsx';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ContainerCardList.module.scss';
import type { JobIndexItem } from '@/types/jobIndex';

type Props = {
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
  jobCategoryMap?: Record<string, string>;
  employmentTypeMap: Record<string, string>;
};

const formatYen = (value: number) =>
  new Intl.NumberFormat('ja-JP').format(value);

const buildSalaryText = (
  job: JobIndexItem,
  salaryUnitMap: Record<string, string>
) => {
  const unitLabel = salaryUnitMap[job.salary.unitId] ?? job.salary.unitId;

  // min/max が入ってないケースも将来あり得るので念のため
  const min = job.salary?.min;
  const max = job.salary?.max;

  if (typeof min === 'number' && typeof max === 'number') {
    return `${unitLabel} ${formatYen(min)}円〜${formatYen(max)}円`;
  }

  if (typeof min === 'number') {
    return `${unitLabel} ${formatYen(min)}円〜`;
  }

  if (typeof max === 'number') {
    return `${unitLabel} 〜${formatYen(max)}円`;
  }

  return unitLabel;
};

export function ContainerCardList({
  jobs,
  salaryUnitMap,
  jobCategoryMap,
  employmentTypeMap,
}: Props) {
  const [favoriteJobIds, setFavoriteJobIds] = useState<Set<string>>(new Set());

  const toggleFavorite = (jobId: string) => {
    setFavoriteJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <section className={styles.containerCardList}>
      <ul className={styles.list}>
        {jobs.map((job) => {
          const heroSrc = job.heroImages?.[0] ?? '';
          const jobCategoryLabel =
            (jobCategoryMap && jobCategoryMap[job.jobCategoryId]) ||
            job.jobCategoryId;
          const isFav = favoriteJobIds.has(job.jobId); // ★ これが必要
          return (
            <li key={job.jobId} className={styles.item}>
              <button
                type="button"
                className={clsx(
                  styles.itemFavorite,
                  isFav && styles['is-active']
                )}
                onClick={() => toggleFavorite(job.jobId)}
                aria-pressed={isFav}
                aria-label={isFav ? 'お気に入り解除' : 'お気に入りに追加'}
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
                  <div
                    className={styles.itemImagePlaceholder}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.innerHead}>
                  <div className={styles.wrapHead}>
                    {job.isNew && <span className={styles.iconNew}>新着</span>}
                    <span className={styles.employmentType}>
                      {employmentTypeMap[job.employmentTypeId] ??
                        job.employmentTypeId}
                    </span>
                  </div>
                  <h2>{job.title}</h2>
                  <h3>{job.facilityName}</h3>
                </div>
                <div className={styles.detailsList}>
                  <dl>
                    <dt className={styles.metaTerm}>給与</dt>
                    <dd className={styles.metaDesc}>
                      {buildSalaryText(job, salaryUnitMap)}
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
        })}
      </ul>
    </section>
  );
}
