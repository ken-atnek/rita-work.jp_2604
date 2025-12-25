/* =======================================
 * FacilityHero - 事業所詳細ページのヒーロー
 * URL:src/components/facility/ContainerFacilityHero.tsx
 * ======================================= */

import styles from './ContainerFacilityHero.module.scss';
import Image from 'next/image';

type Props = {
  name: string;
  logoSrc?: string;
  tags?: string[]; // 例: ["看護師", "介護士", "理学療法士"]
};

export function ContainerFacilityHero({ name, logoSrc, tags = [] }: Props) {
  return (
    <section className={styles.containerFacilityHero}>
      <article>
        <div className={styles.boxLogo}>
          {logoSrc ? (
            <Image
              src={logoSrc}
              width={232}
              height={140}
              alt={`${name}のロゴ`}
            />
          ) : null}
        </div>
        <h2>{name}</h2>

        {tags.length > 0 ? (
          <ul className={styles.listJobCategory}>
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </section>
  );
}
