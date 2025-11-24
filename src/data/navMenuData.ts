/* =======================================
 * メニュー項目
 * URL: src/data/navMenuData.ts
 * Created: 2025-07-19
 * Last updated: 2025-07-19
 * ======================================= */

export type NavMenuItem = {
  href: string;
  label: string;
};

export const navMenu: NavMenuItem[] = [
  { href: '/service/', label: '提供サービス' },
  { href: '/news/', label: 'お知らせ' },
  { href: '/case-study/', label: '災害・感染症' },
  { href: '/company/', label: '会社概要' },
  { href: '/contact/', label: 'お問い合わせ' },
];
