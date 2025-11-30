/* =======================================
 * リタワーク 求人詳細ページ｜事業者情報
 * URL: src/components/details/ContainerFacilityInfo.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-29
 * Last updated: 2025-11-29
 * ======================================= */

'use client';

import styles from './ContainerFacilityInfo.module.scss';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import ExternalLink from '@/components/common/ExternalLink';
import type { JobCategory } from '@/types/jobCategory';

type ContainerFacilityInfoProps = {
  job: Job;
  facility: Facility;
  corporation: Corporation;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
};

export default function ContainerFacilityInfo({
  facility,
  corporation,
  employmentTypes,
  jobCategories,
}: ContainerFacilityInfoProps) {
  const formatEstablishedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}年${Number(month)}月`;
  };
  const employmentTypeMap = (employmentTypes ?? []).reduce<
    Record<string, string>
  >((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {});

  const jobCategoryMap = (jobCategories ?? []).reduce<Record<string, string>>(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {}
  );
  return (
    <section className={styles.containerFacilityInfo}>
      <article>
        <h2 className={styles.title}>事業所情報</h2>
        <div className={styles.boxDl}>
          <dl>
            <dt>法人名</dt>
            <dd>
              <p>{corporation.name}</p>
            </dd>
          </dl>
          <dl>
            <dt>事業所名</dt>
            <dd>
              <p>{facility.name}</p>
            </dd>
          </dl>
          <dl>
            <dt>アクセス</dt>
            <dd>
              〒{facility.postalCode}
              <br />
              {facility.prefecture}
              {facility.city}
              {facility.addressLine}
              {/* 地図（mapUrl がある場合のみ表示） */}
              {facility.mapUrl && (
                <div className={styles.wrapMap}>
                  <iframe
                    src={facility.mapUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* GoogleMap リンク */}
                  {facility.mapLinkUrl && (
                    <ExternalLink
                      href={facility.mapLinkUrl}
                      className={styles.mapUrlLink}
                    >
                      <span>Googleマップ</span>
                    </ExternalLink>
                  )}
                </div>
              )}
            </dd>
          </dl>
          {facility.establishedDate && (
            <dl>
              <dt>設立年月日</dt>
              <dd>
                <p>{formatEstablishedDate(facility.establishedDate)}</p>
              </dd>
            </dl>
          )}
          {facility.recruitJobs && facility.recruitJobs.length > 0 && (
            <dl>
              <dt>募集職種</dt>
              <dd>
                <ul className={styles.listRecruitJobs}>
                  {facility.recruitJobs.map((item, index) => {
                    const jobName =
                      jobCategoryMap[item.jobCategoryId] ?? item.jobCategoryId;
                    const typeName =
                      employmentTypeMap[item.employmentTypeId] ?? '';

                    return (
                      <li
                        key={`${item.jobCategoryId}-${item.employmentTypeId}-${index}`}
                      >
                        {typeName ? `${jobName}（${typeName}）` : jobName}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </dl>
          )}
          {facility.typeSpecific?.visitArea && (
            <dl>
              <dt>訪問エリア</dt>
              <dd>{facility.typeSpecific.visitArea}</dd>
            </dl>
          )}
        </div>
      </article>
    </section>
  );
}
