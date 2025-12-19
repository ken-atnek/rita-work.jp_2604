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
import { useState, useCallback, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import ExternalLink from '@/components/common/ExternalLink';

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

  // LINEログイン開始URL（Xサーバー側）
  const backendStartUrl = useMemo(() => {
    return `https://rita5258.xbiz.jp/backend/line-login/start/?job_id=${encodeURIComponent(job.id)}`;
  }, [job.id]);

  // 給与表示テキスト生成
  const { unitId, min, max, bonus } = job.salary;
  const unitText = unitId === 'monthly' ? '月給' : '時給';
  const minText = min.toLocaleString();
  const maxText = max.toLocaleString();
  const hasBonus = bonus.hasBonus;
  const bonusText = hasBonus ? '賞与あり' : '';
  const bonusNote = hasBonus && bonus.note ? ` ${bonus.note}` : '';

  // LINE応募用モーダル：PC判定（シンプルにUAと画面幅で判定）
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLineApplyClick = useCallback(() => {
    if (!backendStartUrl) return;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile =
      /iPhone|iPod|Android.*Mobile|Windows Phone|Opera Mini/i.test(ua);
    if (isMobile) {
      window.location.href = backendStartUrl;
    } else {
      setIsModalOpen(true);
    }
  }, [backendStartUrl]);

  return (
    <>
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
              <button
                type="button"
                className={styles.contact}
                onClick={handleLineApplyClick}
              >
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

      {isModalOpen && backendStartUrl && (
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
                <QRCodeCanvas value={backendStartUrl} size={170} />
              </div>
              <div className={styles.wrapBottom}>
                <h5>このPCから応募する</h5>
                <p>
                  LINEアプリをPCにインストール済みの場合は、
                  <br />
                  以下のリンクから直接ログインできます。
                </p>
                <ExternalLink href={backendStartUrl}>
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
