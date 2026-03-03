/* =======================================
 *リタワーク TOP 人気の条件
 * URL: src/components/Top/ContainerConditions.tsx
 * Created: 2025-09-04
 * Last updated: 2026-02-18
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';
import ContainerConditionsSlide from './ContainerConditionsSlide';

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

        <ContainerConditionsSlide />
        {/* <a href="#" className={styles.btnLink}>
          <span>一覧を見る</span>
        </a> */}
      </article>
    </section>
  );
}
