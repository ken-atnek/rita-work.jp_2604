/* =======================================
 * リタワーク  転職のヒント 記事検索ボックス
 * URL:src/components/tips/TipsSearchBox.tsx
 * Referenced in:  src/app/tips/page.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
'use client';

import styles from './TipsList.module.scss';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TipsSearchBox({
  value,
  onChange,
  placeholder = 'キーワードで検索',
}: Props) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={styles.innerSearch}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={styles.itemInput}
      />
      <button type="submit" aria-label="検索">
        <span aria-hidden="true" />
      </button>
    </form>
  );
}
