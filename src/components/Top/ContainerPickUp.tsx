/* =======================================
 *リタワーク TOP 積極採用企業
 * URL: src/components/Top/ContainerPickUp.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';

const ContainerTopPickUp = () => {
  return (
    <section className={styles.containerPickUp}>
      <article>
        <div className={styles.boxH2}>
          <h2>積極採用企業</h2>
          <p>
            業界内でも信頼され、採用意欲も高く多くの人材を迎え入れている企業が集まっています。
          </p>
        </div>
      </article>
    </section>
  );
};

export default ContainerTopPickUp;
