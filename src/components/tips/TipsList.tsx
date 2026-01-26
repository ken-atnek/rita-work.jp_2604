/* =======================================
 * リタワーク  転職のヒント 記事一覧
 * URL:src/components/tips/TipsList.tsx
 * Referenced in:  src/app/tips/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
import Image from 'next/image';
import Link from 'next/link';

import styles from './TipsList.module.scss';
import type { TipIndexItem } from '@/types/tips';

type Props = {
  items: TipIndexItem[];
};

export function TipsList({ items }: Props) {
  return (
    <>
      <section className={styles.containerHead}>
        <h2>転職のヒント</h2>
      </section>
      <section className={styles.containerTipsDetails}>
        <p className={styles.headAnnounce}>
          転職活動を成功に導くために、実践的で役立つノウハウや知識をわかりやすく紹介しています。
        </p>
        <ul className={styles.listTips}>
          {items.map((item) => (
            <li key={item.id} className={styles.boxDetails}>
              <Link href={`/tips/${item.id}`} className={styles.wrapLink}>
                <div className={styles.itemImage}>
                  <Image src={item.thumbnail} alt="" width={640} height={360} />
                </div>
                <h3>{item.title}</h3>
                <p className={styles.summary}>{item.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
