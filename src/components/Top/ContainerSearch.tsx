/* =======================================
 *リタワーク TOP 求人を検索
 * URL: src/components/Top/ContainerSearch.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';

const ContainerTopSearch = () => {
  return (
    <section className={styles.containerSearch}>
      <article>
        <div className={styles.boxTop}>
          <div className={styles.wrapTitle}>
            <h2>求人を検索</h2>
            <div className={styles.itemCount}>851</div>
          </div>
          <ul>
            <li>
              <h3>職種</h3>
            </li>
            <li>
              <h3>エリア</h3>
            </li>
            <li>
              <h3>雇用形態</h3>
            </li>
            <li>
              <h3>初年度年収</h3>
            </li>
          </ul>
          <button type="button" className={styles.btnSearch}>
            <span>検索</span>
          </button>
          <button type="button" className={styles.btnReset}>
            <span>リセット</span>
          </button>
        </div>
        <div className={styles.boxBottom}>
          <div className={styles.itemInput}>
            <input type="text" placeholder="事業所名で探す" />
          </div>
          <button type="button"></button>
        </div>
      </article>
    </section>
  );
};

export default ContainerTopSearch;
