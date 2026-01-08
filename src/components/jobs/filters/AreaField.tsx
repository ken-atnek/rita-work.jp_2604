/* =======================================
 * リタワーク フィルター｜エリア
 * URL: src/components/jobs/filters/AreaField.tsx
 * Created: 2026-01-05
 * Last updated: 2026-01-08
 * ======================================= */

'use client';

import clsx from 'clsx';
import styles from './JobsFilter.module.scss';
import type { AreasMaster, AreaGroup, AreaItem } from '@/types/area';

type Props = {
  title: string; // "エリア"
  areas: AreasMaster | null; // fetch結果
  value: string[];
  onChange: (next: string[]) => void; // 親へ返す
  isOpen: boolean;
  onToggleOpen: () => void;
};

function isGroupsShape(v: AreasMaster): v is { groups: AreaGroup[] } {
  if (Array.isArray(v)) return false;

  const candidate: { groups?: unknown } = v;
  return Array.isArray(candidate.groups);
}

export function AreaField({
  title,
  areas,
  value,
  onChange,
  isOpen,
  onToggleOpen,
}: Props) {
  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id]
    );
  };

  const hasValue = value.length > 0;

  return (
    <div
      className={clsx(
        styles.itemFilter,
        styles.areaField,
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

            {!areas ? (
              <p>読み込み中...</p>
            ) : isGroupsShape(areas) ? (
              // ✅ グループ構造
              areas.groups.map((g) => (
                <div key={g.id} className={styles.areaGroup}>
                  <p
                    className={clsx(
                      styles.areaLabel,
                      styles[`areaLabel--${g.id}`]
                    )}
                  >
                    {g.label}
                  </p>

                  <ul>
                    {g.items.map((opt) => (
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
              ))
            ) : (
              // ✅ フラット配列
              <ul>
                {areas.map((opt: AreaItem) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
