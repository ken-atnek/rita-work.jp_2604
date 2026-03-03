/* =======================================
 * リタワーク 事業所詳細ページ
 * URL: src/app/facility/page.tsx
 * ======================================= */

import { Suspense } from 'react';
import { FacilityPageClientWrapper } from '@/components/facility/FacilityPageClientWrapper';

export default function FacilityPage() {
  return (
    <main style={{ backgroundColor: '#fef4e5' }}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <FacilityPageClientWrapper />
      </Suspense>
    </main>
  );
}
