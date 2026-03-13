/* =======================================
 * リタワーク 求人詳細ページ｜Heroビジュアル表示コンポーネント
 * URL: src/components/details/ContainerJobHero.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useJobHistoryIds } from '@/hooks/useJobHistoryIds';
import clsx from 'clsx';
import styles from './ContainerJobHero.module.scss';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { JobCategory } from '@/types/jobCategory';
import { isNewByPublishedPeriod } from '@/lib/newIcon';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import ExternalLink from '@/components/common/ExternalLink';
type ContainerJobHeroProps = {
  job: Job;
  facility: Facility;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
  salaryUnitMap: Record<string, string>;
  hourlyBandMap: Record<string, string>;
  contractPlanId: string;
};

export default function ContainerJobHero({
  job,
  facility,
  newIconPeriodDays,
  employmentTypes,
  jobCategories,
  salaryUnitMap,
  hourlyBandMap,
  contractPlanId,
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

  const lineEntryUrl = useMemo(() => {
    return (job.lStepUrl ?? '').trim();
  }, [job.lStepUrl]);

  // 給与表示テキスト生成
  const salary = job.salary;

  // 単位（例：月給/時給）
  const unitLabel = salaryUnitMap[salary.unitId] ?? salary.unitId;

  // 金額表示（hourlyならband、monthlyならmin/max）
  let amountText = '';
  let bonusText = '';
  let bonusNote = '';

  if (salary.unitId === 'monthly') {
    amountText = `${salary.min.toLocaleString()}円〜${salary.max.toLocaleString()}円`;

    if (salary.bonus?.hasBonus) {
      bonusText = '賞与あり';
      bonusNote = salary.bonus.note ? `（${salary.bonus.note}）` : '';
    }
  }

  if (salary.unitId === 'hourly') {
    const bandLabel = hourlyBandMap[salary.bandId] ?? salary.bandId;
    amountText = bandLabel; // 例：1,500円〜2,000円
  }

  // LINE応募用モーダル：PC判定（シンプルにUAと画面幅で判定）
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLineApplyClick = useCallback(() => {
    if (!lineEntryUrl) return;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobileUa =
      /iPhone|iPod|Android.*Mobile|Windows Phone|Opera Mini/i.test(ua);
    const isNarrowScreen =
      typeof window !== 'undefined' ? window.innerWidth <= 767 : false;
    const isMobile = isMobileUa || isNarrowScreen;

    if (isMobile) {
      window.location.href = lineEntryUrl;
    } else {
      setIsModalOpen(true);
    }
  }, [lineEntryUrl]);
  // お気に入り（求人ID単位）
  const { favoriteJobIds, toggleFavorite } = useFavoriteJobIds();
  const isFavorite = favoriteJobIds.has(job.id);
  const { addHistory } = useJobHistoryIds();
  useEffect(() => {
    addHistory(job.id);
  }, [addHistory, job.id]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(job.id);
  }, [toggleFavorite, job.id]);

  return (
    <>
      <section
        className={clsx(
          styles.containerJobHero,
          styles[`plan-${contractPlanId}`] // ★ 追加
        )}
      >
        <article>
          <div className={styles.boxHeadIcons}>
            <div className={styles.facilityName}>{facility.facilityName}</div>
            {isNew && <span className={styles.iconNew}>新着</span>}
            {typeName && (
              <span className={styles.employmentType}>{typeName}</span>
            )}
          </div>
          <h2>{job.title}</h2>

          <div className={styles.boxSlideImage}>
            <Splide
              className={styles.innerSlide}
              hasTrack={false}
              aria-label={`${facility.facilityName} のイメージ`}
              options={{
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 6000,
                pauseOnHover: true,
                speed: 1000,
                arrows: true,
                pagination: true,
                breakpoint: {
                  768: {
                    arrows: false,
                    pagination: true,
                  },
                },
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
                ></button>
                <button
                  type="button"
                  className="splide__arrow splide__arrow--next"
                ></button>
              </div>
            </Splide>

            <div className={styles.wrapButtons}>
              <button
                type="button"
                className={clsx(
                  styles.iconFavorite,
                  isFavorite && styles['is-active']
                )}
                onClick={handleToggleFavorite}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
              ></button>

              <button
                type="button"
                className={styles.contact}
                onClick={handleLineApplyClick}
                disabled={!lineEntryUrl}
              >
                <span>LINEで相談する</span>
              </button>
            </div>
          </div>
          <ul className={styles.listPrimary}>
            <li className={styles.itemJobCategory}>{jobCategoryName}</li>
            <li className={styles.itemAddress}>{fullAddress}</li>
            <li className={styles.itemSalary}>
              <span className={styles.unit}>{unitLabel}：</span>
              <span className={styles.amount}>{amountText}</span>
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

      {isModalOpen && lineEntryUrl && (
        <div className={styles.boxLineModal}>
          <div className={styles.modalDetails}>
            <div className={styles.boxHead}>
              <h3>LINEで応募</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="閉じる"
              ></button>
            </div>
            <div className={styles.boxDetails}>
              <h4>スマートフォンでQRコードを読み取る</h4>
              <p className={styles.headAnnounce}>
                下記のQRコードをスマートフォンで読み取ると、
                <br />
                LINEアプリで応募手続きが始まります。
              </p>
              <div className={styles.itemQR}>
                <QRCodeCanvas value={lineEntryUrl} size={170} />
              </div>
              <div className={styles.wrapBottom}>
                <h5>このPCから応募する</h5>
                <p>
                  LINEアプリをPCにインストール済みの場合は、
                  <br />
                  以下のリンクから直接ログインできます。
                </p>
                <ExternalLink href={lineEntryUrl}>
                  このPCからログインして応募する
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
