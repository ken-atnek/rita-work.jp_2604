/* =======================================
 * リタワーク TOPページ
 * URL: /app/page.tsx
 * Created: 2025-08-26
 * Last updated: 2025-08-26
 * ======================================= */

import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';

export const generateMetadata = (): Metadata => {
  return {
    title: 'リタワーク',
    description: isRealProduction
      ? 'リタワークのディスクリプション'
      : undefined,
  };
};
export default function Home() {
  return <></>;
}
