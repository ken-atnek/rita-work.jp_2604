/* =======================================
 * リタワーク 転職のヒント 詳細
 * URL: src/app/tips/[id]/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */

import path from 'path';
import { readFileSync } from 'fs';
import Link from 'next/link';
import styles from '@/styles/PageTips.module.scss';
import type { TipsIndexJson } from '@/types/tips';
import { TipDetailClient } from '@/components/tips/TipDetailClient';

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  const filePath = path.join(
    process.cwd(),
    'public',
    'db',
    'tips',
    'tipsIndex.json'
  );

  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as TipsIndexJson;

  return data.items.map((item) => ({ id: item.id }));
}

export default async function TipDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
      <section className={styles.containerHead}>
        <h1>転職のヒント</h1>
      </section>

      <section className={styles.containerDetails}>
        <TipDetailClient id={id} />

        <Link href="/tips/" className={styles.btnLink}>
          <span>一覧に戻る</span>
        </Link>
      </section>
    </main>
  );
}
