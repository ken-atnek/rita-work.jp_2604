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
import { SalaryField } from './SalaryField';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  // URL復元値
  initialJobCategoryIds: string[];
  initialAreaIds: string[];
  initialEmploymentTypeIds: string[];

  initialSalaryTab: 'yearly' | 'hourly';
  initialSalaryYearlyIds: string[];
  initialSalaryHourlyIds: string[];

  // マスター
  jobCategoryOptions: Option[];
  employmentTypeOptions: Option[];
  areas: AreasMaster | null;

  // 🔽 これを追加
  salaryYearlyOptions: Option[];
  salaryHourlyOptions: Option[];

  onSearch: (payload: {
    jobCategoryIds: string[];
    areaIds: string[];
    employmentTypeIds: string[];
    salaryTab: 'yearly' | 'hourly';
    salaryYearlyIds: string[];
    salaryHourlyIds: string[];
  }) => void;

  onReset: () => void;
};

type OpenFilterKey =
  | 'jobCategory'
  | 'employmentType'
  | 'area'
  | 'salary'
  | null;

export function JobsFilter({
  initialJobCategoryIds,
  initialAreaIds,
  initialEmploymentTypeIds,

  initialSalaryTab,
  initialSalaryYearlyIds,
  initialSalaryHourlyIds,

  jobCategoryOptions,
  employmentTypeOptions,
  areas,

  salaryYearlyOptions,
  salaryHourlyOptions,

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

  const [draftSalaryTab, setDraftSalaryTab] = useState<'yearly' | 'hourly'>(
    initialSalaryTab
  );
  const [draftSalaryYearlyIds, setDraftSalaryYearlyIds] = useState<string[]>(
    initialSalaryYearlyIds
  );
  const [draftSalaryHourlyIds, setDraftSalaryHourlyIds] = useState<string[]>(
    initialSalaryHourlyIds
  );

  useEffect(() => {
    setDraftJobCategoryIds(initialJobCategoryIds);
    setDraftAreaIds(initialAreaIds);
    setDraftEmploymentTypeIds(initialEmploymentTypeIds);
    setDraftSalaryTab(initialSalaryTab);
    setDraftSalaryYearlyIds(initialSalaryYearlyIds);
    setDraftSalaryHourlyIds(initialSalaryHourlyIds);
  }, [
    initialJobCategoryIds,
    initialAreaIds,
    initialEmploymentTypeIds,
    initialSalaryTab,
    initialSalaryYearlyIds,
    initialSalaryHourlyIds,
  ]);

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
      salaryTab: draftSalaryTab,
      salaryYearlyIds: draftSalaryYearlyIds,
      salaryHourlyIds: draftSalaryHourlyIds,
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

    setDraftSalaryTab('yearly');
    setDraftSalaryYearlyIds([]);
    setDraftSalaryHourlyIds([]);

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

        <SalaryField
          title="給与"
          salaryTab={draftSalaryTab}
          onChangeSalaryTab={setDraftSalaryTab}
          yearlyOptions={salaryYearlyOptions}
          hourlyOptions={salaryHourlyOptions}
          yearlyValue={draftSalaryYearlyIds}
          hourlyValue={draftSalaryHourlyIds}
          onChangeYearly={setDraftSalaryYearlyIds}
          onChangeHourly={setDraftSalaryHourlyIds}
          isOpen={openFilter === 'salary'}
          onToggleOpen={() =>
            setOpenFilter((prev) => (prev === 'salary' ? null : 'salary'))
          }
        />
      </div>

      <div className={styles.boxBtn}>
        <button
          type="button"
          onClick={handleSearch}
          className={styles.btnSearch}
        >
          <span className={styles.statusPc}>検索</span>
          <span className={styles.statusSp}>条件で調べる</span>
        </button>
        <button type="button" onClick={handleReset} className={styles.btnReset}>
          リセット
        </button>
      </div>
    </article>
  );
}
