/* =======================================
 * リタワーク TOPページ
 * URL: /app/page.tsx
 * Created: 2025-08-26
 * Last updated: 2025-08-26
 * ======================================= */

import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';
import ContainerTopHero from '@/components/Top/ContainerHero';
import ContainerTopSearch from '@/components/Top/ContainerSearch';
import ContainerTopMessage from '@/components/Top/ContainerMessage';
import ContainerTopPickUp from '@/components/Top/ContainerPickUp';
import ContainerTopConditions from '@/components/Top/ContainerConditions';
import ContainerTopTips from '@/components/Top/ContainerTips';

export const generateMetadata = (): Metadata => {
  return {
    title: 'リタワーク',
    description: isRealProduction
      ? 'リタワークのディスクリプション'
      : undefined,
  };
};
export default function Home() {
  return (
    <>
      <ContainerTopHero />
      <ContainerTopSearch />
      <ContainerTopPickUp />
      <ContainerTopConditions />
      <ContainerTopTips />
      <ContainerTopMessage />
    </>
  );
}
