/* =======================================
 * リタワーク 転職のヒント
 * URL: src/app/tips/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
'use client';
import { useEffect, useMemo, useState } from 'react';
import { TipsSearchBox } from '@/components/tips/TipsSearchBox';
import { TipsList } from '@/components/tips/TipsList';
import type { TipsIndexJson } from '@/types/tips';
import { withBasePath } from '@/utils/withBasePath';

export default function TipsPage() {
  const [tipsIndex, setTipsIndex] = useState<TipsIndexJson>({ items: [] });
  const [isError, setIsError] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const path = withBasePath('/db/tips/tipsIndex.json');
    const ts = Date.now();

    fetch(`${path}?t=${ts}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((json) => setTipsIndex(json as TipsIndexJson))
      .catch(() => setIsError(true));
  }, []);

  const filteredItems = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return tipsIndex.items;

    return tipsIndex.items.filter((item) => {
      const haystack = `${item.title}\n${item.summary}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [tipsIndex.items, keyword]);

  return (
    <main>
      {isError ? <p>一覧の読み込みに失敗しました。</p> : null}

      <TipsList
        items={filteredItems}
        searchSlot={<TipsSearchBox value={keyword} onChange={setKeyword} />}
      />
    </main>
  );
}
