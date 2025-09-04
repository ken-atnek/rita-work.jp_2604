/* =======================================
 *リタワーク TOP 人気の条件
 * URL: src/components/Top/ContainerConditions.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from '@/styles/PageTop.module.scss';
import conditions from '@/data/Top/conditions.json';

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
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={3.2}
            spaceBetween={16}
            loop={true}
            speed={400}
            centeredSlides={true}
            simulateTouch={false}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            watchSlidesProgress={true} // ← 追加
            breakpoints={{
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5 },
            }}
            style={{ padding: '0 4vw' }}
          >
            {conditions.concat(conditions).map((tag, index) => (
              <SwiperSlide key={`${tag.id}-${index}`}>
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
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev">
            <svg>
              <use href="#svg_pageTop" />
            </svg>
          </div>
          <div className="swiper-button-next">
            <svg>
              <use href="#svg_pageTop" />
            </svg>
          </div>
        </div>
        <a href="#" className={styles.btnLink}>
          <span>一覧を見る</span>
        </a>
      </article>
    </section>
  );
}
