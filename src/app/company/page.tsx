/* =======================================
 * リタワーク 会社概要
 * URL:src/app/company/page.tsx
 * Created: 2026-01-26
 * Last updated: 2026-01-26
 * ======================================= */
import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';

import styles from '../../styles/PageTerms.module.scss';
import ExternalLink from '@/components/common/ExternalLink';
export const generateMetadata = (): Metadata => {
  return {
    title: '会社概要｜リタワーク',
    description: isRealProduction
      ? '株式会社RITAの会社概要ページです。求人・転職支援サービス「リタワーク」の運営会社情報を掲載しています。'
      : undefined,
  };
};

export default async function CompanyPage() {
  return (
    <main>
      <section className={styles.containerHead}>
        <h2>運営会社</h2>
      </section>
      <section className={styles.containerDetails}>
        <article>
          <h3>運営会社</h3>

          <div className={styles.blockCompany}>
            <h4>株式会社RITA</h4>
            <address>〒862-0950 熊本県熊本市中央区水前寺6丁目23-12 1F</address>
            <span>設立：2025年4月</span>
            <span>
              電話番号：
              <ExternalLink href="tel:080-5245-6672">
                080-5245-6672
              </ExternalLink>
            </span>
            <span>
              E-mail：
              <ExternalLink href="mailto:r.igara@ritagroup.ne">
                r.igara@ritagroup.ne
              </ExternalLink>
            </span>
            <h5>事業内容</h5>
            <span>・求人サイト「リタワーク」の運営</span>
            <span>・人事部代行事業「リタジンジ」の運営</span>
            <span>・採用サイト構築支援事業</span>
            <span>・LINE公式アカウント運用支援事業</span>
          </div>
        </article>
      </section>
    </main>
  );
}
