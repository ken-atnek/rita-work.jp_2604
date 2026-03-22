/* =======================================
 *リタワーク TOP 積極採用企業
 * URL: src/components/Top/ContainerPickUp.tsx
 * Created: 2025-09-04
 * Last updated: 2026-02-18
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { isNewByPublishedStart } from '@/utils/isNewByPublishedStart';
import styles from '@/styles/PageTop.module.scss';
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';

const typeMap: Record<number, string> = {
  1: '看護師',
  2: '介護士',
  3: '理学療法士',
  4: '作業療法士',
  5: '言語聴覚士',
};

export type PickUpItem = {
  id: string;
  shopName: string;
  type: number[];
  image: string;
  updatedAt: string;
};

const ContainerTopPickUp = () => {
  const [pickUpList, setPickUpList] = useState<PickUpItem[]>([]);

  useEffect(() => {
    fetchJson<PickUpItem[]>(withBasePath('/db/pickUp.json'), []).then(
      setPickUpList
    );
  }, []);

  if (pickUpList.length === 0) return null;

  return (
    <section className={styles.containerPickUp}>
      <article>
        <div className={styles.boxH2}>
          <h2>積極採用企業</h2>
          <p>
            業界内でも信頼され、採用意欲も高く多くの人材を迎え入れている企業が集まっています。
          </p>
        </div>
        <ul
          className={styles.listPickUp}
          // style={{
          //   gridTemplateColumns: `repeat(${Math.min(Math.max(pickUpList.length, 3), 5)}, 1fr)`,
          // }}
        >
          {pickUpList.map((item) => (
            <li key={item.id} className={styles.boxShop}>
              {isNewByPublishedStart({
                start: item.updatedAt,
                newIconPeriodDays: 30,
              }) && <span className={styles.iconNew}>NEW</span>}
              <Link
                href={withBasePath(
                  `/facility/?id=fac_${item.id.padStart(4, '0')}`
                )}
              >
                <Image
                  src={item.image}
                  alt={item.shopName}
                  width={218}
                  height={169}
                />
              </Link>
              {(() => {
                const allTypes = [1, 2, 3, 4, 5];
                const activeSet = new Set(item.type);

                return (
                  <ul className={styles.typeList}>
                    {allTypes.map((t) => (
                      <li
                        key={t}
                        className={
                          activeSet.has(t) ? styles.isActive : undefined
                        }
                      >
                        {typeMap[t]}
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default ContainerTopPickUp;
