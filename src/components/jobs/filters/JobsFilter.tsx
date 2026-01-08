/* =======================================
 * リタワーク フィルター親コンポーネント
 * URL: src/components/jobs/filters/JobsFilter.tsx
 * Created: 2026-01-05
 * Last updated: 2026-01-08
 * ======================================= */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { AreasMaster } from '@/types/area';

import { JobCategoryField } from './JobCategoryField';
import { AreaField } from './AreaField';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  // URL復元値（appliedの初期値）
  initialJobCategoryIds: string[];
  initialAreaIds: string[];

  // マスター
  jobCategoryOptions: Option[];
  areas: AreasMaster | null;

  // 親へ：検索ボタン押下
  onSearch: (payload: { jobCategoryIds: string[]; areaIds: string[] }) => void;

  // 親へ：リセット押下
  onReset: () => void;
};

type OpenFilterKey = 'jobCategory' | 'area' | null;

export function JobsFilter({
  initialJobCategoryIds,
  initialAreaIds,
  jobCategoryOptions,
  areas,
  onSearch,
  onReset,
}: Props) {
  const filterRef = useRef<HTMLDivElement | null>(null);

  // 開閉状態（外側クリックで閉じる対象）
  const [openFilter, setOpenFilter] = useState<OpenFilterKey>(null);

  /* ---------------------------------------
   * draft（チェック中）
   * - URLが変わったら初期値も変わるので同期する
   * -------------------------------------- */
  const [draftJobCategoryIds, setDraftJobCategoryIds] = useState<string[]>(
    initialJobCategoryIds
  );
  const [draftAreaIds, setDraftAreaIds] = useState<string[]>(initialAreaIds);

  useEffect(() => {
    setDraftJobCategoryIds(initialJobCategoryIds);
    setDraftAreaIds(initialAreaIds);
  }, [initialJobCategoryIds, initialAreaIds]);

  /* ---------------------------------------
   * 外側クリックで閉じる
   * -------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* ---------------------------------------
   * 検索（apply）
   * -------------------------------------- */
  const handleSearch = () => {
    onSearch({ jobCategoryIds: draftJobCategoryIds, areaIds: draftAreaIds });
    setOpenFilter(null); // ついでに閉じる（不要なら消してOK）
  };

  /* ---------------------------------------
   * リセット
   * -------------------------------------- */
  const handleReset = () => {
    setDraftJobCategoryIds([]);
    setDraftAreaIds([]);
    onReset();
    setOpenFilter(null);
  };

  return (
    <article ref={filterRef} className={styles.innerFilters}>
      <div className={styles.boxFilters}>
        <JobCategoryField
          title="職種"
          options={jobCategoryOptions}
          value={draftJobCategoryIds}
          onChange={setDraftJobCategoryIds}
          isOpen={openFilter === 'jobCategory'}
          onToggleOpen={() =>
            setOpenFilter((prev) =>
              prev === 'jobCategory' ? null : 'jobCategory'
            )
          }
        />

        <AreaField
          title="エリア"
          areas={areas}
          value={draftAreaIds}
          onChange={setDraftAreaIds}
          isOpen={openFilter === 'area'}
          onToggleOpen={() =>
            setOpenFilter((prev) => (prev === 'area' ? null : 'area'))
          }
        />
      </div>

      <div className={styles.boxBtn}>
        <button
          type="button"
          onClick={handleSearch}
          className={styles.btnSearch}
        >
          検索
        </button>
        <button type="button" onClick={handleReset} className={styles.btnReset}>
          リセット
        </button>
      </div>
    </article>
  );
}
