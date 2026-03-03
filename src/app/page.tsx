/* =======================================
 * リタワーク TOPページ
 * URL: src/app/page.tsx
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
import ContainerSpotlightCard from '@/components/Top/ContainerSpotlightCard';

export const generateMetadata = (): Metadata => {
  return {
    title:
      '熊本の医療・介護・福祉の求人検索ならリタワーク｜条件から探せる仕事情報',
    description: isRealProduction
      ? '熊本の医療・介護・福祉業界の求人を掲載する求人ポータルサイト。エリア・職種・雇用形態など条件から、自分に合った仕事を簡単に探せます。'
      : undefined,
  };
};
export default function PageTop() {
  return (
    <>
      <ContainerTopHero />
      <ContainerTopSearch />
      <ContainerTopPickUp />
      <ContainerSpotlightCard />
      <ContainerTopConditions />
      <ContainerTopTips />
      <ContainerTopMessage />
    </>
  );
}
