/* =======================================
 *リタワーク TOP HERO
 * URL: src/components/Top/ContainerHero.tsx
 * Created: 2025-09-03
 * Last updated: 2025-09-03
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';
import Image from 'next/image';

const ContainerTopHero = () => {
  return (
    <section className={styles.containerHero}>
      <div className={styles.boxImage}>
        <Image
          src="/images/hero-pc.webp"
          alt="HERO画像"
          width={1366}
          height={500}
        />
      </div>
      <div className={styles.boxLogo}>
        <svg aria-label="リタワーク ロゴ">
          <use href="#svg_logoHero" />
        </svg>
        <p>
          Are worries holding you back?
          <br />
          You don’t have to face them alone.
        </p>
      </div>
    </section>
  );
};

export default ContainerTopHero;
