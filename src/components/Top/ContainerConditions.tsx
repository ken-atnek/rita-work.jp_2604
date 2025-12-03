/* =======================================
 *リタワーク TOP 人気の条件
 * URL: src/components/Top/ContainerConditions.tsx
 * Created: 2025-09-04
 * Last updated: 2025-11-24
 * ======================================= */

'use client';

import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import type { Options } from '@splidejs/splide';
import '@splidejs/react-splide/css';

import styles from '@/styles/PageTop.module.scss';
import conditions from '@/data/Top/conditions.json';

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
    768: { perPage: 2 },
  },
};

export default function ContainerTopConditions() {
  return (
    <section className={styles.containerConditions}>
      <article>
        <div className={styles.boxH2}>
          <h2>人気の条件</h2>
          <p>
            応募数が多く注目度も高い、転職希望者から選ばれている条件をピックアップしています。
          </p>
        </div>

        <div className={styles.boxSlideList}>
          <Splide
            hasTrack={false}
            options={splideOptions}
            aria-label="人気の条件"
          >
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
                    <span className={styles.label}>{tag.label}</span>
                  </button>
                </SplideSlide>
              ))}
            </SplideTrack>

            {/* ▼ カスタム矢印（公式サンプル通りのクラス構成） */}
            <div className={`splide__arrows ${styles.splideArrows}`}>
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
        </div>

        <a href="#" className={styles.btnLink}>
          <span>一覧を見る</span>
        </a>
      </article>
    </section>
  );
}
