/* =======================================
 * リタワーク 求人詳細ページ｜福利厚生（リッチコンテンツ）
 * URL: src/components/details/ContainerBenefitsDetail.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-12-04
 * Last updated: 2025-12-04
 * ======================================= */

import styles from './ContainerBenefitsDetail.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
import type { BenefitsDetailContent } from '@/types/job';

type ContainerBenefitsDetailProps = {
  benefitsDetail: BenefitsDetailContent | null;
  contractPlanId: string;
};

export default function ContainerBenefitsDetail({
  benefitsDetail,
  contractPlanId,
}: ContainerBenefitsDetailProps) {
  if (!benefitsDetail || !benefitsDetail.sections?.length) {
    return null;
  }

  return (
    <section
      className={clsx(
        styles.containerBenefitsDetail,
        styles[`plan-${contractPlanId}`] // ★ 追加
      )}
    >
      <article>
        <h2>福利厚生</h2>
        <ul className={styles.benefitsDetailList}>
          {benefitsDetail.sections.map((section) => (
            <li key={section.id} className={styles.item}>
              <div className={styles.itemImage}>
                <Image
                  src={section.image}
                  width={480}
                  height={294}
                  alt={section.title}
                />
              </div>
              <div className={styles.boxText}>
                <h3 className={styles.title}>{section.title}</h3>
                <div className={styles.body}>
                  {section.body.map((line, index) =>
                    line === '' ? <br key={index} /> : <p key={index}>{line}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
