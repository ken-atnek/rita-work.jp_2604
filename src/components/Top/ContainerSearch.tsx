/* =======================================
 * リタワーク TOP 求人を検索
 * URL: src/components/Top/ContainerSearch.tsx
 * Created: 2025-09-04
 * Last updated: 2026-01-09
 * ======================================= */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/styles/PageTop.module.scss';
import FacilitySearchBox from '@/components/facility/search/FacilitySearchBox';
import { JobsFilter } from '@/components/jobs/filters/JobsFilter';

import { buildJobsSearchQuery } from '@/utils/jobsSearchQuery';
import type { JobsSearchPayload } from '@/utils/jobsSearchQuery';

import { loadJobsFilterMasters } from '@/utils/loadJobsFilterMasters';
import type { IdLabelOption } from '@/utils/loadJobsFilterMasters';

import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';

import type { AreasMaster } from '@/types/area';

const ContainerTopSearch = () => {
  const router = useRouter();

  // -----------------------------
  // トップはURL復元しない（初期値は空）
  // -----------------------------
  const initialJobCategoryIds = useMemo(() => [], []);
  const initialAreaIds = useMemo(() => [], []);
  const initialEmploymentTypeIds = useMemo(() => [], []);

  const initialSalaryTab = 'yearly' as const;
  const initialSalaryYearlyIds = useMemo(() => [], []);
  const initialSalaryHourlyIds = useMemo(() => [], []);

  // -----------------------------
  // マスター（JobsFilter 用）
  // -----------------------------
  const [jobCategoryOptions, setJobCategoryOptions] = useState<IdLabelOption[]>(
    []
  );
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    IdLabelOption[]
  >([]);
  const [areasMaster, setAreasMaster] = useState<AreasMaster | null>(null);

  const [salaryYearlyOptions, setSalaryYearlyOptions] = useState<
    IdLabelOption[]
  >([]);
  const [salaryHourlyOptions, setSalaryHourlyOptions] = useState<
    IdLabelOption[]
  >([]);

  // トップは「全件件数」
  const [jobsCount, setJobsCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 初期ロード（master + 全件件数）
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // ✅ JobsFilter用のmaster一式を共通関数で取得
        const masters = await loadJobsFilterMasters();
        setJobCategoryOptions(masters.jobCategoryOptions);
        setEmploymentTypeOptions(masters.employmentTypeOptions);
        setAreasMaster(masters.areasMaster);
        setSalaryYearlyOptions(masters.salaryYearlyOptions);
        setSalaryHourlyOptions(masters.salaryHourlyOptions);

        // ✅ トップ表示用：全件件数（jobsIndexAll）
        const timestamp = Date.now();
        const jobsJson = await fetchJson<{ items: Array<unknown> }>(
          withBasePath(`/db/jobs/jobsIndexAll.json?t=${timestamp}`),
          { items: [] }
        );
        setJobsCount(jobsJson.items.length);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // -----------------------------
  // 検索 → /jobs に遷移（URL生成だけ）
  // -----------------------------
  const handleSearch = (payload: JobsSearchPayload) => {
    const qs = buildJobsSearchQuery(payload);
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  };

  const handleReset = () => {
    // トップは入力初期化は JobsFilter がやる（draftを空に）
    // リセット時に /jobs へ飛ばしたい場合はここで router.push('/jobs') を入れる
  };

  return (
    <section className={styles.containerSearch}>
      <div className={styles.searchInner}>
        <div className={styles.boxTop}>
          <div className={styles.wrapTitle}>
            <h2>求人を検索</h2>

            {/* トップは「全件件数」を表示 */}
            <div className={styles.itemCount}>
              {loading ? '—' : jobsCount.toLocaleString()}
            </div>
          </div>

          <div className={styles.blockFilters}>
            <JobsFilter
              initialJobCategoryIds={initialJobCategoryIds}
              initialAreaIds={initialAreaIds}
              initialEmploymentTypeIds={initialEmploymentTypeIds}
              initialSalaryTab={initialSalaryTab}
              initialSalaryYearlyIds={initialSalaryYearlyIds}
              initialSalaryHourlyIds={initialSalaryHourlyIds}
              jobCategoryOptions={jobCategoryOptions}
              employmentTypeOptions={employmentTypeOptions}
              areas={areasMaster}
              salaryYearlyOptions={salaryYearlyOptions}
              salaryHourlyOptions={salaryHourlyOptions}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* 事業所名検索（/facility に遷移） */}
        <FacilitySearchBox
          className={styles.boxBottom}
          inputClassName={styles.itemInput}
          placeholder="事業所名で探す"
        />
      </div>
    </section>
  );
};

export default ContainerTopSearch;
