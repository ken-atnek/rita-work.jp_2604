/* =======================================
 * リタワーク 求人詳細ページ｜フリースペース
 * URL: src/components/details/ContainerFreeSpace.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-12-04
 * ======================================= */

import styles from './ContainerFreeSpace.module.scss';
import type { FreeSpaceContent } from '@/types/job';
import clsx from 'clsx';

type ContainerFreeSpaceProps = {
  freeSpace: FreeSpaceContent | null;
  contractPlanId: string;
};

export default function ContainerFreeSpace({
  freeSpace,
  contractPlanId,
}: ContainerFreeSpaceProps) {
  // 無効・未取得・セクションなしなら非表示
  if (!freeSpace || !freeSpace.sections?.length) {
    return null;
  }

  const { title, sections } = freeSpace;

  return (
    <section
      className={clsx(
        styles.containerFreeSpace,
        styles[`plan-${contractPlanId}`] // ★ 追加
      )}
    >
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
