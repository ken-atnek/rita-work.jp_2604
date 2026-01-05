/* =======================================
 * リタワーク フィルター｜職種
 * URL: src/components/jobs/filters/JobCategoryField.tsx
 * Created: 2026-01-05
 * Last updated: 2026-01-05
 * ======================================= */

'use client';
import styles from './JobsFilter.module.scss';
import clsx from 'clsx';

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
  return (
    <div
      className={clsx(
        styles.itemFilter,
        styles.jobCategory,
        value.length > 0 && styles.isActive
      )}
    >
      <button type="button" onClick={onToggleOpen}>
        {title}
      </button>
      <div className={clsx(styles.wrapFilterList, isOpen && styles.isOpen)}>
        <div className={styles.innerFilterList}>
          <div className={styles.itemFilterList}>
            <h3>{title}</h3>
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
