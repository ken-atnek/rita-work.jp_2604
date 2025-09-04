/* =======================================
 *リタワーク FOOTER
 * URL: src/components/common/Footer.tsx
 * Created: 2025-07-28
 * Last updated: 2025-09-03
 * ======================================= */
import styles from '@/styles/components/common/Footer.module.scss';
import Link from 'next/link';
import ExternalLink from '@/components/common/ExternalLink';
const Footer = () => {
  return (
    <footer className={styles.containerFooter}>
      <ExternalLink href="#" className={styles.linkOrder}>
        <span>求人掲載をご検討の事業者様</span>
      </ExternalLink>
      <a href="#Header" className={styles.pageTop}>
        <svg aria-label="リタワーク ロゴ">
          <use href="#svg_pageTop" />
        </svg>
      </a>
      <article>
        <div className={styles.boxShopInfo}>
          <div className={styles.itemLogo}>
            <svg aria-label="リタワーク ロゴ">
              <use href="#svg_logoFooter" />
            </svg>
          </div>
          <nav>
            <ExternalLink href="#">
              <svg aria-label="instagram ロゴ" className={styles.insta}>
                <use href="#svg_insta" />
              </svg>
            </ExternalLink>
            <ExternalLink href="#">
              <svg aria-label="youtube ロゴ" className={styles.youtube}>
                <use href="#svg_youtube" />
              </svg>
            </ExternalLink>
          </nav>
        </div>
        <nav className={styles.listMenu}>
          <Link href="#">求人検索</Link>
          <Link href="#">お気に入り・閲覧履歴</Link>
          <Link href="#">人気の求人一覧</Link>
          <Link href="#">転職のヒント一覧</Link>
          <Link href="#">マイページ</Link>
          <Link href="#">プライバシーポリシー</Link>
          <Link href="#">利用規約</Link>
          <Link href="#">運営会社</Link>
        </nav>
        <Link href="#" className={styles.linkContact}>
          <span>お問い合わせ窓口</span>
        </Link>
      </article>
      <div className={styles.copyRight}>© 2025 RITAWORK</div>
    </footer>
  );
};

export default Footer;
