/* =======================================
 * リタワーク TOP 注目の求人（Premium）
 * URL: src/components/Top/ContainerSpotlightCard.tsx
 * Created: 2026-01-09
 * Last updated: 2026-01-09
 * ======================================= */

'use client';

import { useEffect, useRef, useState } from 'react';

import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import type { Options } from '@splidejs/splide';
import '@splidejs/react-splide/css';

import styles from '@/styles/PageTop.module.scss';
import { JobCardBody } from '@/components/job/JobCardBody';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';
import { toIdLabelMap } from '@/utils/toIdLabelMap';
import { shuffle } from '@/utils/shuffle';
import { isNewByPublishedStart } from '@/utils/isNewByPublishedStart';
import type { JobIndexItem } from '@/types/jobIndex';
import type { SalaryUnitMaster, JobCommonConfig } from '@/types/master';

import { loadJobsFilterMasters } from '@/utils/loadJobsFilterMasters';

// ▼ ここはあなたのプロジェクトの JobCard の実体に合わせて調整してOK
// 例1: import { JobCard } from '@/components/job/JobCard';
// 例2: import JobCard from '@/components/job/JobCard';

/* ---------------------------------------
 * Splide option（見た目は後で調整でOK）
 * -------------------------------------- */
const splideOptions: Options = {
  type: 'loop',
  perPage: 2,
  perMove: 1,
  gap: '18px',
  autoplay: false,
  interval: 5000,
  pauseOnHover: true,
  speed: 400,
  arrows: true,
  pagination: false,
  padding: { left: '18%', right: '18%' },
  drag: true,
  // autoHeight: true,
  breakpoints: {
    768: {
      perPage: 1,
      padding: { left: '0', right: '18%' },
      trimSpace: false,
      // focus: 'center', // 中央寄せにしたいなら
    },
  },
};


export default function ContainerSpotlightCard() {
  const { favoriteIdsArray, toggleFavorite } = useFavoriteJobIds();

  const [premiumJobs, setPremiumJobs] = useState<JobIndexItem[]>([]);
  const builtRef = useRef(false);

  // 表示用 map（JobsPageClient と同じ考え方）
  const [employmentTypeMap, setEmploymentTypeMap] = useState<
    Record<string, string>
  >({});
  const [jobCategoryMap, setJobCategoryMap] = useState<Record<string, string>>(
    {}
  );
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // jobs
        const timestamp = Date.now();
        const jobsJson = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath(`/db/jobs/jobsIndexAll.json?t=${timestamp}`),
          { items: [] }
        );

        // masters（options）
        const masters = await loadJobsFilterMasters();
        setEmploymentTypeMap(toIdLabelMap(masters.employmentTypeOptions, o => o.label));
        setJobCategoryMap(toIdLabelMap(masters.jobCategoryOptions, o => o.label));

        // salaryUnits（一覧の給与表記用）
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        // config
        const config = await fetchJson<JobCommonConfig>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }

        // premium 抽出（初回だけ shuffle 固定）
        const premium = jobsJson.items.filter(
          (j) => j.contractPlanId === 'premium'
        );

        if (!builtRef.current) {
          setPremiumJobs(shuffle(premium));
          builtRef.current = true;
        } else {
          setPremiumJobs(premium);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 読み込み中 or 0件なら非表示（必要ならメッセージ表示に変えてOK）
  if (loading) return null;
  if (premiumJobs.length === 0) return null;

  return (
    <section className={styles.containerSpotlightCard}>
      <article>
        <div className={styles.boxH2}>
          <h2>注目の求人</h2>
          <p>
            多くの求職者が注目する“いま人気”の求人をピックアップ。気になる職場は早めのチェックがおすすめです。
          </p>
        </div>

        <div className={styles.boxSlideList}>
          <Splide
            hasTrack={false}
            options={splideOptions}
            aria-label="注目の求人"
          >
            <SplideTrack>
              {premiumJobs.map((job) => (
                <SplideSlide key={job.jobId}>
                  <JobCardBody
                    job={job}
                    salaryUnitMap={salaryUnitMap}
                    employmentTypeMap={employmentTypeMap}
                    jobCategoryMap={jobCategoryMap}
                    isFavorite={favoriteIdsArray.includes(job.jobId)}
                    onToggleFavorite={toggleFavorite}
                    variant="spotlight"
                    isNew={isNewByPublishedStart({
                      start: job.publishedPeriod.start,
                      newIconPeriodDays,
                    })}
                  />
                </SplideSlide>
              ))}
            </SplideTrack>

            <div className={`splide__arrows ${styles.splideArrows}`}>
              <button
                type="button"
                className="splide__arrow splide__arrow--prev"
              ></button>
              <button
                type="button"
                className="splide__arrow splide__arrow--next"
              ></button>
            </div>
          </Splide>
        </div>
      </article>
    </section>
  );
}
