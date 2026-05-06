/* =======================================
 * リタワーク 転職のヒント
 * URL: src/app/tips/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-05-06
 * ======================================= */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { isRealProduction } from '@/lib/env';
import TipsPageClient from '@/components/tips/TipsPageClient';

export const generateMetadata = (): Metadata => {
  return {
    title: '転職のヒント｜リタワーク',
    description: isRealProduction
      ? '医療・介護・福祉業界への転職に役立つ情報をまとめています。求人の探し方や職場選びのポイントなど、転職活動をサポートするヒントを掲載。'
      : undefined,
  };
};

export default function TipsPage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <TipsPageClient />
    </Suspense>
  );
}
