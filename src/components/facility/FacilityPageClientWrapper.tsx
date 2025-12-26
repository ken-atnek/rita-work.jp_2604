/* =======================================
 * FacilityPageClientWrapper - クライアントサイドでURLパラメータを処理
 * URL: src/components/facility/FacilityPageClientWrapper.tsx
 * ======================================= */

'use client';

import { useSearchParams } from 'next/navigation';
import { FacilityPageClient } from './FacilityPageClient';

export function FacilityPageClientWrapper() {
  const searchParams = useSearchParams();

  const rawId = (searchParams.get('id') || '').trim();

  if (!rawId) {
    return (
      <>
        <h1>事業所情報</h1>
        <p>事業所を特定する ID が指定されていません。</p>
      </>
    );
  }

  const facilityId = rawId.startsWith('fac_') ? rawId : `fac_${rawId}`;

  return <FacilityPageClient facilityId={facilityId} />;
}
