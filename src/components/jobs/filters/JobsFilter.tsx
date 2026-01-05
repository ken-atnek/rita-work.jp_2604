/* =======================================
 * リタワーク フィルター親コンポーネント
 * URL: src/components/jobs/filters/JobsFilter.tsx
 * Created: 2026-01-05
 * Last updated: 2026-01-05
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';
import { JobCategoryField } from './JobCategoryField';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  // URL復元値（appliedの初期値）
  initialJobCategoryIds: string[];

  // マスター（職種）
  jobCategoryOptions: Option[];

  // 親へ：検索ボタン押下
  onSearch: (payload: { jobCategoryIds: string[] }) => void;

  // 親へ：リセット押下
  onReset: () => void;
};

export function JobsFilter({
  initialJobCategoryIds,
  jobCategoryOptions,
  onSearch,
  onReset,
}: Props) {
  /* ---------------------------------------
   * draft（チェック中）
   * - URLが変わったら初期値も変わるので同期する
   * -------------------------------------- */
  const [draftJobCategoryIds, setDraftJobCategoryIds] = useState<string[]>(
    initialJobCategoryIds
  );

  useEffect(() => {
    setDraftJobCategoryIds(initialJobCategoryIds);
  }, [initialJobCategoryIds]);

  /* ---------------------------------------
   * 検索（apply）
   * -------------------------------------- */
  const handleSearch = () => {
    onSearch({ jobCategoryIds: draftJobCategoryIds });
  };

  /* ---------------------------------------
   * リセット
   * -------------------------------------- */
  const handleReset = () => {
    setDraftJobCategoryIds([]);
    onReset();
  };
  type OpenFilterKey = 'jobCategory' | null;

  const [openFilter, setOpenFilter] = useState<OpenFilterKey>(null);

  return (
    <article className={styles.innerFilters}>
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
