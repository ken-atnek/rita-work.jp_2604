/* =======================================
 * リタワーク フィルター｜職種
 * URL: src/components/jobs/filters/JobCategoryField.tsx
 * Created: 2026-01-05
 * Last updated: 2026-01-08
 * ======================================= */

'use client';

import clsx from 'clsx';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  title?: string;
  options: Option[];
  value: string[]; // 選択中ID（draft）
  onChange: (next: string[]) => void; // 親へ返す
  isOpen: boolean;
  onToggleOpen: () => void;
};

export function JobCategoryField({
  title = '職種',
  options,
  value,
  onChange,
  isOpen,
  onToggleOpen,
}: Props) {
  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((x) => x !== id)
      : [...value, id];
    onChange(next);
  };

  if (options.length === 0) {
    return (
      <section>
        <h3>{title}</h3>
        <p>職種を読み込み中...</p>
      </section>
    );
  }

  const hasValue = value.length > 0;

  return (
    <div
      className={clsx(
        styles.itemFilter,
        styles.jobCategory,
        hasValue && styles.isSelected
      )}
    >
      <button type="button" onClick={onToggleOpen}>
        {title}
      </button>

      <div className={clsx(styles.wrapFilterList, isOpen && styles.isOpen)}>
        <div className={styles.innerFilterList}>
          <div className={styles.itemFilterList}>
            <div className={styles.wrapHead}>
              <h3>{title}</h3>
              <span
                className={styles.btnClose}
                role="button"
                tabIndex={0}
                aria-label="閉じる"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleOpen();
                }}
              />
            </div>

            <ul>
              {options.map((opt) => (
                <li key={opt.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={value.includes(opt.id)}
                      onChange={() => toggle(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
