/* =======================================
 * リタワーク 転職のヒント
 * URL: src/app/tips/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';

import { TipsList } from '@/components/tips/TipsList';
import type { TipsIndexJson } from '@/types/tips';

import { withBasePath } from '@/utils/withBasePath';

export const generateMetadata = (): Metadata => {
  return {
    title: '転職のヒント｜リタワーク',
    description: isRealProduction
      ? '転職活動に役立つヒントやポイントを、分かりやすくまとめました。'
      : undefined,
  };
};

export default async function TipsPage() {
  const path = withBasePath('/db/tips/tipsIndex.json');
  const base = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3000';
  const absUrl = new URL(path, base).toString();
  const res = await fetch(absUrl, { cache: 'no-store' });
  const tipsIndex = res.ok
    ? ((await res.json()) as TipsIndexJson)
    : { items: [] };

  return (
    <main>
      <TipsList items={tipsIndex.items} />
    </main>
  );
}
