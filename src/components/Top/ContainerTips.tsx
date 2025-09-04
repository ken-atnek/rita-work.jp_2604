/* =======================================
 *リタワーク TOP 転職のヒント
 * URL: src/components/Top/ContainerTips.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';
import Image from 'next/image';
import Link from 'next/link';
const ContainerTopTips = () => {
  return (
    <section className={styles.containerTips}>
      <article>
        <div className={styles.boxH2}>
          <h2>転職のヒント</h2>
          <p>
            転職活動を成功に導くために、実践的で役立つノウハウや知識をわかりやすく紹介しています。
          </p>
        </div>
        <ul>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
          <li>
            <Image src="/images/__dummy/tips.webp" fill alt="ダミー画像" />
          </li>
        </ul>
        <Link href="#" className={styles.btnLink}>
          <span>一覧を見る</span>
        </Link>
      </article>
    </section>
  );
};

export default ContainerTopTips;
