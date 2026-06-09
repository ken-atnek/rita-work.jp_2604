/* =======================================
 * FacilityHero - 事業所詳細ページのヒーロー
 * URL:src/components/facility/ContainerFacilityHero.tsx
 * Referenced in: src/components/facility/FacilityPageClient.tsx
 * Created: 2025-12-25
 * Last updated: 2026-3-22
 * ======================================= */

import styles from './ContainerFacilityHero.module.scss';
import Image from 'next/image';

type Props = {
  name: string;
  logoSrc?: string;
  allTags: string[];
  activeTags?: string[];
};
export function ContainerFacilityHero({
  name,
  logoSrc,
  allTags = [],
  activeTags = [],
}: Props) {
  const activeTagSet = new Set(activeTags);

  const sortedTags = [
    ...allTags.filter((tag) => activeTagSet.has(tag)),
    ...allTags.filter((tag) => !activeTagSet.has(tag)),
  ];
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
        <h1>{name}</h1>

        <ul className={styles.listJobCategory}>
          {sortedTags.map((tag) => (
            <li
              key={tag}
              className={activeTagSet.has(tag) ? styles.isActive : undefined}
            >
              {tag}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
