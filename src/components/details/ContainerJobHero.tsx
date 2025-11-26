/* =======================================
 * リタワーク 求人詳細ページ｜Heroビジュアル表示コンポーネント
 * URL: src/components/details/ContainerJobHero.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
import styles from './ContainerJobHero.module.scss';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { JobCategory } from '@/types/jobCategory';
import { isNewByPublishedPeriod } from '@/lib/newIcon';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';

type ContainerJobHeroProps = {
  job: Job;
  facility: Facility;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
};

export default function ContainerJobHero({
  job,
  facility,
  newIconPeriodDays,
  employmentTypes,
  jobCategories,
}: ContainerJobHeroProps) {
  const isNew = isNewByPublishedPeriod(
    job.publishedPeriod?.start,
    newIconPeriodDays
  );
  const typeName =
    employmentTypes.find((t) => t.id === job.employmentTypeId)?.name ?? '';
  const jobCategoryName =
    jobCategories.find((c) => c.id === job.jobCategoryId)?.name ?? '';
  const fullAddress = `${facility.prefecture}${facility.city}${facility.addressLine}`;

  // 給与表示テキスト生成
  const { unitId, min, max, bonus } = job.salary;
  const unitText = unitId === 'monthly' ? '月給' : '時給';
  const minText = min.toLocaleString();
  const maxText = max.toLocaleString();
  const hasBonus = bonus.hasBonus;
  const bonusText = hasBonus ? '賞与あり' : '';
  const bonusNote = hasBonus && bonus.note ? ` ${bonus.note}` : '';

  return (
    <section className={styles.containerJobHero}>
      <article>
        <div className={styles.boxHeadIcons}>
          {isNew && <span className={styles.iconNew}>新着</span>}
          {typeName && (
            <span className={styles.employmentType}>{typeName}</span>
          )}
        </div>
        <h2>{job.title}</h2>
        <div className={styles.facilityName}>{facility.name}</div>
        <div className={styles.boxSlideImage}>
          <Splide
            className={styles.innerSlide}
            hasTrack={false}
            aria-label={`${facility.name} のイメージ`}
            options={{
              type: 'loop',
              perPage: 1,
              autoplay: true,
              interval: 6000,
              pauseOnHover: true,
              speed: 1000,
              arrows: true,
              pagination: true,
            }}
          >
            <SplideTrack className={styles.splideTrack}>
              {job.heroImages.map((src, index) => (
                <SplideSlide key={`${job.id}-hero-${index}`}>
                  <Image
                    src={src}
                    alt={`${job.title} イメージ ${index + 1}`}
                    className={styles.heroImage}
                    width={1158}
                    height={600}
                  />
                </SplideSlide>
              ))}
            </SplideTrack>

            <div className="splide__arrows">
              <button
                type="button"
                className="splide__arrow splide__arrow--prev"
              >
                <svg>
                  <use href="#svg_pageTop" />
                </svg>
              </button>
              <button
                type="button"
                className="splide__arrow splide__arrow--next"
              >
                <svg>
                  <use href="#svg_pageTop" />
                </svg>
              </button>
            </div>
          </Splide>

          <div className={styles.wrapButtons}>
            <button type="button" className={styles.iconFavorite}></button>
            <button type="button" className={styles.contact}>
              <span>LINEで相談する</span>
            </button>
          </div>
        </div>
        <ul className={styles.listPrimary}>
          <li className={styles.itemJobCategory}>{jobCategoryName}</li>
          <li className={styles.itemAddress}>{fullAddress}</li>
          <li className={styles.itemSalary}>
            <span className={styles.unit}>{unitText}：</span>
            <span className={styles.amount}>
              {minText}円〜{maxText}円
            </span>
            {bonusText && (
              <span className={styles.bonus}>
                {bonusText}
                {bonusNote}
              </span>
            )}
          </li>
        </ul>
      </article>
    </section>
  );
}
