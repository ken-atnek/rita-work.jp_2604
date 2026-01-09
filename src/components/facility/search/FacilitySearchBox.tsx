/* =======================================
 * リタワーク 事業所検索ボックス（共通）
 * File: src/components/facility/search/FacilitySearchBox.tsx
 * - 入力 → /facility?kw=... に遷移
 * - defaultKeyword で初期値を渡せる（検索結果ページ用）
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

type Props = {
  /** 検索結果ページでURLのkwを初期値として入れたい時に使う */
  defaultKeyword?: string;
  /** 外側のクラス（ページ側のレイアウトに合わせたい場合） */
  className?: string;
  /** input のクラス */
  inputClassName?: string;
  /** button のクラス */
  buttonClassName?: string;
  /** input placeholder（任意） */
  placeholder?: string;
};

const normalizeKeyword = (v: string) => v.trim();

export default function FacilitySearchBox({
  defaultKeyword = '',
  className,
  inputClassName,
  buttonClassName,
  placeholder = '事業所名で探す',
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultKeyword);

  // 検索結果ページ側で defaultKeyword が変わった時も反映できるようにする
  useEffect(() => {
    setKeyword(defaultKeyword);
  }, [defaultKeyword]);

  const goSearch = (raw: string) => {
    const kw = normalizeKeyword(raw);

    // 空なら kw を付けず /facility へ
    if (!kw) {
      router.push('/facility');
      return;
    }

    const params = new URLSearchParams();
    params.set('kw', kw);
    router.push(`/facility?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(className)}>
      <div className={clsx(inputClassName)}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      <button type="submit" className={clsx(buttonClassName)} aria-label="検索">
        {/* ボタンの中身（アイコン等）はCSSで対応でOK */}
      </button>
    </form>
  );
}
