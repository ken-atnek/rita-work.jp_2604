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
import { EmploymentTypeField } from './EmploymentTypeField';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  // URL復元値（appliedの初期値）
  initialJobCategoryIds: string[];
  initialAreaIds: string[];
  initialEmploymentTypeIds: string[];

  // マスター
  jobCategoryOptions: Option[];
  areas: AreasMaster | null;
  employmentTypeOptions: Option[];

  // 親へ：検索ボタン押下
  onSearch: (payload: {
    jobCategoryIds: string[];
    areaIds: string[];
    employmentTypeIds: string[];
  }) => void;

  // 親へ：リセット押下
  onReset: () => void;
};

type OpenFilterKey = 'jobCategory' | 'employmentType' | 'area' | null;

export function JobsFilter({
  initialJobCategoryIds,
  initialAreaIds,
  initialEmploymentTypeIds,
  jobCategoryOptions,
  employmentTypeOptions,
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

  const [draftEmploymentTypeIds, setDraftEmploymentTypeIds] = useState<
    string[]
  >(initialEmploymentTypeIds);

  useEffect(() => {
    setDraftJobCategoryIds(initialJobCategoryIds);
    setDraftAreaIds(initialAreaIds);
    setDraftEmploymentTypeIds(initialEmploymentTypeIds);
  }, [initialJobCategoryIds, initialAreaIds, initialEmploymentTypeIds]);

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
    onSearch({
      jobCategoryIds: draftJobCategoryIds,
      areaIds: draftAreaIds,
      employmentTypeIds: draftEmploymentTypeIds,
    });
    setOpenFilter(null); // ついでに閉じる（不要なら消してOK）
  };

  /* ---------------------------------------
   * リセット
   * -------------------------------------- */
  const handleReset = () => {
    setDraftJobCategoryIds([]);
    setDraftAreaIds([]);
    setDraftEmploymentTypeIds([]);
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

        <EmploymentTypeField
          title="雇用形態"
          options={employmentTypeOptions}
          value={draftEmploymentTypeIds}
          onChange={setDraftEmploymentTypeIds}
          isOpen={openFilter === 'employmentType'}
          onToggleOpen={() =>
            setOpenFilter((prev) =>
              prev === 'employmentType' ? null : 'employmentType'
            )
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
