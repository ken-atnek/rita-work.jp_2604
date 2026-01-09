/* =======================================
 * FacilityPageClientWrapper - クライアントサイドでURLパラメータを処理
 * URL: src/components/facility/FacilityPageClientWrapper.tsx
 * ======================================= */

'use client';

import { useSearchParams } from 'next/navigation';
import { FacilityPageClient } from './FacilityPageClient';
import { FacilitySearchPageClient } from './FacilitySearchPageClient';
export function FacilityPageClientWrapper() {
  const searchParams = useSearchParams();

  const rawId = (searchParams.get('id') || '').trim();

  if (!rawId) {
    // id が無い場合は「事業所検索ページ」
    return <FacilitySearchPageClient />;
  }

  const facilityId = rawId.startsWith('fac_') ? rawId : `fac_${rawId}`;

  return <FacilityPageClient facilityId={facilityId} />;
}
