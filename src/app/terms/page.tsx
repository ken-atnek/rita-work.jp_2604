/* =======================================
 * リタワーク 利用規約
 * URL: src/app/terms/page.tsx
 * Created: 2026-01-26
 * Last updated: 2026-01-26
 * ======================================= */
import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';
import { getCanonicalUrl, getDefaultOpenGraphImage } from '@/lib/seo';

import styles from '../../styles/PageTerms.module.scss';
export const generateMetadata = (): Metadata => {
  const title = '利用規約';
  const description = isRealProduction
    ? '求人・転職支援サービス「リタワーク」の利用規約ページです。サービス利用条件、禁止事項、免責事項についてご確認いただけます。'
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl('/terms/'),
    },
    ...(isRealProduction && {
      openGraph: {
        title: `${title}｜リタワーク`,
        description,
        url: getCanonicalUrl('/terms/'),
        type: 'website',
        images: [getDefaultOpenGraphImage()],
      },
    }),
  };
};

export default async function TermsPage() {
  return (
    <main>
      <section className={styles.containerHead}>
        <h1>利用規約</h1>
      </section>
      <section className={styles.containerDetails}>
        <article>
          <h3>利用規約</h3>
          <p className={styles.headAnnounce}>
            この利用規約（以下「本規約」といいます）は、株式会社RITA（以下「当社」といいます）が運営する求人・転職支援サービス「リタワーク」（以下「本サービス」といいます）の利用条件を定めるものです。本サービスをご利用いただくすべての方（以下「利用者」といいます）は、本規約に同意のうえ、本サービスをご利用ください。
          </p>
          <ul className={styles.blockList}>
            <li className={styles.blockItem}>
              <h4>第1条（適用）</h4>
              <ul>
                <li>
                  本規約は、利用者と当社との間の本サービス利用に関わる一切の関係に適用されるものとします。
                </li>
                <li>
                  当社は本サービスに関し、本規約のほか、利用にあたってのルール、ガイドライン等を定めることがあります。これらは本規約の一部を構成するものとします。
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第2条（利用登録）</h4>
              <ul>
                <li>
                  本サービスを利用するにあたり、当社が定める方法で登録を行う場合があります。
                </li>
                <li>
                  登録を希望する方が虚偽の内容を申請した場合、または過去に規約違反等で利用停止処分を受けた場合、当社は登録を承認しないことがあります。
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第3条（禁止事項）</h4>
              <p>
                利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul>
                <li>虚偽または不正確な情報を登録・提供する行為</li>
                <li>他人になりすまして利用する行為</li>
                <li>法令または公序良俗に違反する行為</li>
                <li>当社、他の利用者、求人企業の権利・利益を侵害する行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>本サービスを営利目的で不正に利用する行為</li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第4条（サービス提供の停止）</h4>
              <p>
                当社は、以下の場合に利用者へ事前に通知することなく本サービスの全部または一部の提供を停止・中断することができます。
              </p>
              <ul>
                <li>システム保守点検または更新を行う場合</li>
                <li>
                  地震、火災、停電、通信障害等の不可抗力により提供が困難な場合
                </li>
                <li>運営上または技術上やむを得ない場合</li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第5条（免責事項）</h4>
              <ul>
                <li>
                  当社は、求人情報の正確性、最新性、有用性、適法性について保証するものではありません。
                </li>
                <li>
                  当社は、利用者が本サービスを通じて得た情報や求人応募により生じた損害について、一切責任を負いません。
                </li>
                <li>
                  当社は、利用者と求人企業との間で発生したトラブルについて、一切の責任を負いません。
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第6条（個人情報の取扱い）</h4>
              <p>
                当社は、本サービスに関連して取得した利用者の個人情報を、当社が別途定める「プライバシーポリシー」に従い適切に取り扱います。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第7条（知的財産権）</h4>
              <p>
                本サービスに関する著作権、商標権その他一切の知的財産権は当社または正当な権利者に帰属します。利用者は、当社の許可なく利用、複製、転用をしてはなりません。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第8条（利用制限および登録抹消）</h4>
              <p>
                当社は、利用者が本規約に違反した場合、事前の通知なしに当該利用者の本サービス利用を停止し、登録を抹消できるものとします。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第9条（規約の変更）</h4>
              <p>
                当社は必要と判断した場合、利用者に通知することなく本規約を変更することができます。変更後の規約は、本サービスに掲載された時点から効力を生じます。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第10条（準拠法・裁判管轄）</h4>
              <ul>
                <li>本規約の解釈は、日本法を準拠法とします。</li>
                <li>
                  本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
