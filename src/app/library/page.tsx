/* =======================================
 * リタワーク お気に入り・閲覧履歴ページ
 * URL: src/app/library/page.tsx
 * Created: 2025-12-26
 * Last updated: 2025-12-27
 * ======================================= */
import { LibraryClientWrapper } from '@/components/library/LibraryClientWrapper';
import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';
import { getCanonicalUrl } from '@/lib/seo';

export const generateMetadata = (): Metadata => {
  return {
    title: 'お気に入り・閲覧履歴',
    description: isRealProduction
      ? '保存したお気に入り求人や、これまで閲覧した求人を一覧で確認できるページ。気になる仕事を後からじっくり比較・検討できます。'
      : undefined,
    alternates: {
      canonical: getCanonicalUrl('/library/'),
    },
    robots: { index: false, follow: false },
  };
};

export default function LibraryPage() {
  return (
    <main>
      <LibraryClientWrapper />
    </main>
  );
}
