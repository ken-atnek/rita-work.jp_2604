/* =======================================
 * リタワーク プライバシーポリシー
 * URL:src/app/privacy/page.tsx
 * Created: 2026-01-26
 * Last updated: 2026-01-26
 * ======================================= */
import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';

import styles from '../../styles/PageTerms.module.scss';
export const generateMetadata = (): Metadata => {
  return {
    title: 'プライバシーポリシー｜リタワーク',
    description: isRealProduction
      ? 'リタワークのプライバシーポリシーです。個人情報の収集方法、利用目的、第三者提供について掲載しています。'
      : undefined,
  };
};

export default async function PrivacyPage() {
  return (
    <main>
      <section className={styles.containerHead}>
        <h2>プライバシーポリシー</h2>
      </section>
      <section className={styles.containerDetails}>
        <article>
          <h3>プライバシーポリシー</h3>
          <p className={styles.headAnnounce}>
            株式会社RITA（以下「当社」といいます）は、当社が運営する求人・転職支援サービス「リタワーク」（以下「本サービス」といいます）において、利用者の個人情報を適切に取り扱うことを重要な責務と認識し、以下の方針に基づき個人情報の保護に努めます。
          </p>
          <ul className={styles.blockList}>
            <li className={styles.blockItem}>
              <h4>第1条（個人情報の定義）</h4>
              <p>
                本ポリシーにおいて「個人情報」とは、個人情報保護法その他関連法令に基づき、氏名、生年月日、住所、電話番号、メールアドレス、履歴書・職務経歴書情報、顔写真、その他特定の個人を識別できる情報をいいます。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第2条（個人情報の収集方法）</h4>
              <p>
                当社は、利用者が本サービスに登録・利用する際、以下の方法で個人情報を取得することがあります。
              </p>
              <ul>
                <li>利用者が入力・送信した情報</li>
                <li>お問い合わせや相談時に提供された情報</li>
                <li>アクセスログ、Cookie等により自動的に収集される情報</li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第3条（個人情報の利用目的）</h4>
              <p>当社は、収集した個人情報を以下の目的で利用します。</p>
              <ul>
                <li>本サービスの提供・運営のため</li>
                <li>求人応募、選考、企業との連絡のため</li>
                <li>利用者からのお問い合わせ対応のため</li>
                <li>利用者の本人確認、利用資格の確認のため</li>
                <li>本サービスの改善、新サービス開発のため</li>
                <li>メールマガジン、アンケート、キャンペーン等の案内のため</li>
                <li>法令または行政機関からの要請に応じるため</li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第4条（第三者提供）</h4>
              <p>
                当社は、利用者の同意を得ずに個人情報を第三者に提供しません。ただし、以下の場合を除きます。
              </p>
              <ul>
                <li>法令に基づく場合</li>
                <li>
                  人の生命、身体または財産の保護のために必要で、本人の同意を得ることが困難な場合
                </li>
                <li>
                  利用目的の達成に必要な範囲で、業務委託先に提供する場合（例：求人企業への応募情報提供）
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第5条（個人情報の管理）</h4>
              <ul>
                <li>
                  当社は、個人情報を正確かつ最新の状態に保つよう努め、不正アクセス、紛失、漏えい等を防止するための合理的な安全管理措置を講じます。
                </li>
                <li>
                  当社は、個人情報を取り扱う従業員に対し適切な教育を行い、管理を徹底します。
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第6条（個人情報の開示・訂正・削除）</h4>
              <p>
                利用者は、当社に対して自己の個人情報の開示、訂正、追加、削除、利用停止、消去を請求できます。当社は、法令に基づき速やかに対応します。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第7条（Cookie等の利用）</h4>
              <p>
                当社は、利用者の利便性向上、アクセス解析、広告配信のためにCookie等を使用することがあります。利用者はブラウザ設定によりCookieを拒否することができますが、その場合本サービスの一部が利用できなくなることがあります。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第8条（免責事項）</h4>
              <ul>
                <li>
                  利用者が自ら第三者に個人情報を提供した場合、当社は一切の責任を負いません。
                </li>
                <li>
                  本サービスのリンク先等、当社が直接管理しない外部サイトにおける個人情報の取扱いについては責任を負いません。
                </li>
              </ul>
            </li>

            <li className={styles.blockItem}>
              <h4>第9条（ポリシーの変更）</h4>
              <p>
                当社は、本ポリシーの内容を予告なく変更する場合があります。変更後のポリシーは、本サービスに掲載された時点から効力を生じるものとします。
              </p>
            </li>

            <li className={styles.blockItem}>
              <h4>第10条（お問い合わせ窓口）</h4>
              <p>
                本ポリシーに関するお問い合わせは、下記窓口までお願いいたします。
              </p>
            </li>
          </ul>
          <div className={styles.boxCompany}>
            <span>株式会社RITA</span>
            <span>〒862-0950 熊本県熊本市中央区水前寺6丁目23-12 1F</span>
            <span>E-mail：r.igara@ritagroup.net</span>
          </div>
        </article>
      </section>
    </main>
  );
}
