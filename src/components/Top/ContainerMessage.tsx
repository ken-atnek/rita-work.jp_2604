/* =======================================
 *リタワーク TOP メッセージ
 * URL: src/components/Top/ContainerMessage.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */

import styles from '@/styles/PageTop.module.scss';
import ExternalLink from '@/components/common/ExternalLink';
import Image from 'next/image';

const ContainerTopMessage = () => {
  return (
    <section className={styles.containerMessage}>
      <article>
        <div className={styles.itemImage}>
          <Image
            src="/images/iphone.webp"
            width={346}
            height={728}
            alt="iPhone画像"
          />
        </div>
        <div className={styles.wrapMessage}>
          <h2>message</h2>
          <p>
            リタワークは、求人者と企業の橋渡しを超えた存在を目指しています。
            <br />
            一人ひとりの悩みや不安、業界の課題に正面から向き合い、理想の職場環境を一緒につくること。
            <br />
            「本当に納得できる職場」を見つけるために、私たちがいます。
            就職先のことに限らず、転職活動全般のお悩みやご不安も、お気軽にご相談ください。
          </p>
          <ExternalLink href="#" className={styles.btnLink}>
            <span>ラインで相談する</span>
          </ExternalLink>
        </div>
        <div className={styles.itemMascot}></div>
      </article>
    </section>
  );
};

export default ContainerTopMessage;
