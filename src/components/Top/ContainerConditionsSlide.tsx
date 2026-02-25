/* =======================================
 * ContainerConditionsSlide - 人気の条件 Splide（クライアント）
 * URL: src/components/Top/ContainerConditionsSlide.tsx
 * Created: 2026-02-18
 * Last updated: 2026-02-18
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import type { Options } from '@splidejs/splide';
import '@splidejs/react-splide/css';

import styles from '@/styles/PageTop.module.scss';
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';

export type ConditionItem = {
  id: string;
  label: string;
  subLabel?: string;
  image: string;
};

const splideOptions: Options = {
  type: 'loop',
  perPage: 5,
  perMove: 1,
  gap: '20px',
  autoplay: true,
  interval: 5000,
  pauseOnHover: true,
  speed: 400,
  arrows: true,
  pagination: false,
  drag: false,
  // focus: 'center',
  breakpoints: {
    1024: { perPage: 3 },
    768: { perPage: 2.3, gap: '4vw' },
  },
};

export default function ContainerConditionsSlide() {
  const [conditions, setConditions] = useState<ConditionItem[]>([]);

  useEffect(() => {
    fetchJson<ConditionItem[]>(withBasePath('/db/conditions.json'), []).then(
      setConditions
    );
  }, []);

  if (conditions.length === 0) return null;

  return (
    <div className={styles.boxSlideList}>
      <Splide hasTrack={false} options={splideOptions} aria-label="人気の条件">
        {/* ▼ 必須の track / list 部分 */}
        <SplideTrack>
          {conditions.map((tag) => (
            <SplideSlide key={tag.id}>
              <button
                type="button"
                className={styles.tagButton}
                style={{
                  backgroundImage: `url(${tag.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className={styles.label}>
                  {tag.label}
                  {tag.subLabel && (
                    <small className={styles.subLabel}>{tag.subLabel}</small>
                  )}
                </span>
              </button>
            </SplideSlide>
          ))}
        </SplideTrack>

        {/* ▼ カスタム矢印（公式サンプル通りのクラス構成） */}
        <div className={`splide__arrows ${styles.splideArrows}`}>
          <button type="button" className="splide__arrow splide__arrow--prev">
            <svg>
              <use href="#svg_pageTop" />
            </svg>
          </button>
          <button type="button" className="splide__arrow splide__arrow--next">
            <svg>
              <use href="#svg_pageTop" />
            </svg>
          </button>
        </div>
      </Splide>
    </div>
  );
}
