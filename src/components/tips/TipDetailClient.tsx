/* =======================================
 * リタワーク 転職のヒントクライアント
 * URL:src/components/tips/TipDetailClient.tsx
 * Created: 2026-01-26
 * Last updated: 2026-01-26
 * ======================================= */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/styles/PageTips.module.scss';
import type { TipDetail } from '@/types/tips';
import { withBasePath } from '@/utils/withBasePath';
import { TipsBodyRenderer } from '@/components/tips/TipsBodyRenderer';
import { getCanonicalUrl, upsertCanonicalLink } from '@/lib/seo';

type Props = {
  id: string;
};

export function TipDetailClient({ id }: Props) {
  const [detail, setDetail] = useState<TipDetail | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const url = withBasePath(`/db/tips/${id}/detail.json`);
    const ts = Date.now();

    fetch(`${url}?t=${ts}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((json) => setDetail(json as TipDetail))
      .catch(() => setIsError(true));
  }, [id]);

  useEffect(() => {
    if (!detail) return;

    document.title = [detail.title, '転職のヒント', 'リタワーク']
      .filter(Boolean)
      .join('｜');

    upsertCanonicalLink(getCanonicalUrl(`/tips/${id}/`));
  }, [detail, id]);

  if (isError) {
    return (
      <div className={styles.errorBox}>
        <p>記事の読み込みに失敗しました。</p>
        <p>
          <Link href="/tips/">一覧に戻る</Link>
        </p>
      </div>
    );
  }

  if (!detail) {
    return <p>読み込み中...</p>;
  }

  return (
    <>
      <h3>{detail.title}</h3>

      <article>
        {detail.heroImage ? (
          <div className={styles.itemImage}>
            <Image src={detail.heroImage} alt="" width={1200} height={630} />
          </div>
        ) : null}

        <div className={styles.itemDate}>{detail.publishedAt}</div>
        <TipsBodyRenderer doc={detail.body} />
      </article>
    </>
  );
}
