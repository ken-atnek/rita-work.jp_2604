/* =======================================
 *リタワーク TOP 積極採用企業
 * URL: src/components/Top/ContainerPickUp.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import pickUpList from '@/data/Top/pickUp.json';

const typeMap: Record<number, string> = {
  1: '看',
  2: '介',
  3: 'PT',
  4: 'OT',
  5: 'ST',
};

export type PickUpItem = {
  id: string;
  shopName: string;
  type: number[];
  image: string;
  url: string;
  iconNew?: boolean;
};

const ContainerTopPickUp = () => {
  const typedPickUpList: PickUpItem[] = pickUpList;

  return (
    <section className={styles.containerPickUp}>
      <article>
        <div className={styles.boxH2}>
          <h2>積極採用企業</h2>
          <p>
            業界内でも信頼され、採用意欲も高く多くの人材を迎え入れている企業が集まっています。
          </p>
        </div>
        <ul className={styles.listPickUp}>
          {typedPickUpList.map((item) => (
            <li key={item.id} className={styles.boxShop}>
              {item.iconNew && <span className={styles.iconNew}>NEW</span>}
              <Link href={item.url}>
                <Image
                  src={item.image}
                  alt={item.shopName}
                  width={218}
                  height={169}
                />
              </Link>
              <ul className={styles.typeList}>
                {item.type.map((t) => (
                  <li key={t}>{typeMap[t]}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default ContainerTopPickUp;
