/* =======================================
 *リタワーク TOP 転職のヒント
 * URL: src/components/Top/ContainerTips.tsx
 * Created: 2025-09-04
 * Last updated: 2026-02-09
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@/styles/PageTop.module.scss';
import type { TipsIndexJson } from '@/types/tips';
import { withBasePath } from '@/utils/withBasePath';

const ContainerTopTips = () => {
  const [tipsIndex, setTipsIndex] = useState<TipsIndexJson>({ items: [] });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const path = withBasePath('/db/tips/tipsIndexTop.json');
    const ts = Date.now();

    fetch(`${path}?t=${ts}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((json) => setTipsIndex(json as TipsIndexJson))
      .catch(() => setIsError(true));
  }, []);

  return (
    <section className={styles.containerTips}>
      <article>
        <div className={styles.boxH2}>
          <h2>転職のヒント</h2>
          <p>
            転職活動を成功に導くために、実践的で役立つノウハウや知識をわかりやすく紹介しています。
          </p>
        </div>
        {isError ? <p>転職のヒントの読み込みに失敗しました。</p> : null}
        <ul>
          {tipsIndex.items.map((item) => (
            <li key={item.id}>
              <Link href={`/tips/${item.id}`}>
                <div className={styles.itemImage}>
                  <Image src={item.thumbnail} alt="" width={640} height={360} />
                </div>
                <h3>{item.title}</h3>
                <p className={styles.summary}>{item.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/tips/" className={styles.btnLink}>
          <span>一覧を見る</span>
        </Link>
      </article>
    </section>
  );
};

export default ContainerTopTips;
