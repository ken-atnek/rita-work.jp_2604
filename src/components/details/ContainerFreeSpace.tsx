/* =======================================
 * リタワーク 求人詳細ページ｜フリースペース
 * URL: src/components/details/ContainerFreeSpace.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import styles from './ContainerFreeSpace.module.scss';
import type { Job, FreeSpaceContent } from '@/types/job';

type ContainerFreeSpaceProps = {
  job: Job;
};

export default function ContainerFreeSpace({ job }: ContainerFreeSpaceProps) {
  const [freeSpace, setFreeSpace] = useState<FreeSpaceContent | null>(null);

  // freeText が無効なら何もしない
  const { freeText } = job;

  useEffect(() => {
    if (!freeText?.enabled || !freeText.path) return;

    const loadFreeSpace = async () => {
      try {
        const res = await fetch(freeText.path);
        if (!res.ok) return;

        const data = (await res.json()) as FreeSpaceContent;
        setFreeSpace(data);
      } catch {
        // 失敗したら何も表示しない方針
      }
    };

    loadFreeSpace();
  }, [freeText?.enabled, freeText?.path]);

  // 無効・未取得・セクションなしなら非表示
  if (!freeText?.enabled || !freeSpace || !freeSpace.sections?.length) {
    return null;
  }

  const { title, sections } = freeSpace;

  return (
    <section className={styles.containerFreeSpace}>
      {/* このコンテナ全体の見出し：ページ内なので h2 */}

      <article className={styles.inner}>
        <h2>{title}</h2>
        <ul>
          {sections.map((section, index) => (
            <li key={index} className={styles.sectionItem}>
              {/* 各ブロックの見出し：h3 */}
              <h3 className={styles.sectionHeading}>{section.heading}</h3>

              <div className={styles.sectionBody}>
                {section.body.map((paragraph, i) => (
                  <p key={i} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
