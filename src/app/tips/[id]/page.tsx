/* =======================================
 * リタワーク 転職のヒント 詳細
 * URL: src/app/tips/[id]/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../../../styles/PageTips.module.scss';
import type { TipsIndexJson, TipDetail } from '@/types/tips';
import { withBasePath } from '@/utils/withBasePath';

// A案：Rendererは別コンポーネントに分離
import { TipsBodyRenderer } from '@/components/tips/TipsBodyRenderer';

import path from 'path';
import { readFileSync } from 'fs';

export const generateMetadata = (): Metadata => {
  // ※ 仕様ルールにより同期のみ
  // タイトルを記事別にしたい場合は、後で index を同期参照してマップ化するのが安全
  return {
    title: '転職のヒント｜リタワーク',
    description: '転職のヒント記事の詳細ページです。',
  };
};

export const generateStaticParams = () => {
  // ※ 同期のみ（ルール準拠）
  // public/db/tips/tipsIndex.json から id 一覧を作る
  const filePath = path.join(
    process.cwd(),
    'public',
    'db',
    'tips',
    'tipsIndex.json'
  );
  const raw = readFileSync(filePath, 'utf8');
  const tipsIndex = JSON.parse(raw) as TipsIndexJson;

  return tipsIndex.items.map((item) => ({
    id: item.id,
  }));
};

type PageProps = {
  params: { id: string };
};

export default async function TipDetailPage({ params }: PageProps) {
  const detailPath = withBasePath(`/db/tips/${params.id}/detail.json`);
  const base = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3000';
  const absUrl = new URL(detailPath, base).toString();

  const res = await fetch(absUrl, { cache: 'no-store' });

  if (!res.ok) {
    notFound();
  }

  const detail = (await res.json()) as TipDetail;

  return (
    <main>
      <section className={styles.containerHead}>
        <h2>転職のヒント</h2>
      </section>
      <section className={styles.containerDetails}>
        <h3>{detail.title}</h3>
        <article>
          {detail.heroImage ? (
            <div className={styles.itemImage}>
              <Image src={detail.heroImage} alt="" width={1200} height={630} />
            </div>
          ) : null}

          {/* ここがA案の本体：Tiptap(ProseMirror) JSON を Renderer に渡す */}
          <div className={styles.itemDate}>{detail.publishedAt}</div>
          <TipsBodyRenderer doc={detail.body} />
        </article>
        <Link href="/tips/" className={styles.btnLink}>
          <span>一覧に戻る</span>
        </Link>
      </section>
    </main>
  );
}
