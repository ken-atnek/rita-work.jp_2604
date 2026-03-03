/* =======================================
 * リタワーク /jobs 一覧ページ（Client）
 * - URLパラメータ（jc / ar / et / st / sy / sh）から絞り込み条件を復元
 * - 「おすすめ」: contractPlan順 + 同一プラン内シャッフル（初回のみ固定）
 * - 「新着」: updatedAt 降順
 * URL: src/components/jobs/JobsPageClient.tsx
 * Created: 2025-12-27
 * Last updated: 2026-01-09
 * ======================================= */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './JobsPageClient.module.scss';

import { JobsFilter } from '@/components/jobs/filters/JobsFilter';
import { JobCardList } from '@/components/job/JobCardList';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';

import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

import type { JobIndexItem } from '@/types/jobIndex';
import type { AreasMaster } from '@/types/area';
import type {
  SalaryUnitMaster,
  ContractPlanMaster,
  JobCommonConfig,
} from '@/types/master';

import {
  buildJobsSearchQuery,
  getInitialJobsSearchFromSearchParams,
} from '@/utils/jobsSearchQuery';
import type { JobsSearchPayload } from '@/utils/jobsSearchQuery';

import {
  loadJobsFilterMasters,
  type IdLabelOption,
} from '@/utils/loadJobsFilterMasters';

// Fisher–Yates shuffle（元配列は壊さない）
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const toMapFromOptions = (options: IdLabelOption[]) =>
  options.reduce<Record<string, string>>((acc, o) => {
    acc[o.id] = o.label;
    return acc;
  }, {});

export default function JobsPageClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const cond = sp.get('cond'); // 例: "conditions01"
  /* ---------------------------------------
   * URL復元（jc / ar / et / st / sy / sh）
   * -------------------------------------- */
  const initialPayload = useMemo(
    () => getInitialJobsSearchFromSearchParams(sp),
    [sp]
  );

  const initialJobCategoryIds = initialPayload.jobCategoryIds;
  const initialAreaIds = initialPayload.areaIds;
  const initialEmploymentTypeIds = initialPayload.employmentTypeIds;

  const initialSalaryTab = initialPayload.salaryTab;
  const initialSalaryYearlyIds = initialPayload.salaryYearlyIds;
  const initialSalaryHourlyIds = initialPayload.salaryHourlyIds;

  /* ---------------------------------------
   * favorites（localStorage）
   * -------------------------------------- */
  const { favoriteIdsArray, toggleFavorite } = useFavoriteJobIds();

  /* ---------------------------------------
   * 一覧データ
   * -------------------------------------- */
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobIndexItem[]>([]);
  const recommendedBuiltRef = useRef(false);

  /* ---------------------------------------
   * 表示用マップ
   * -------------------------------------- */
  const [employmentTypeMap, setEmploymentTypeMap] = useState<
    Record<string, string>
  >({});
  const [jobCategoryMap, setJobCategoryMap] = useState<Record<string, string>>(
    {}
  );
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );

  /* ---------------------------------------
   * UI state
   * -------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);
  const [activeTab, setActiveTab] = useState<'recommend' | 'new'>('recommend');

  /* ---------------------------------------
   * JobsFilter用の master
   * -------------------------------------- */
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

  // contractPlan の優先度（小さいほど上）: premium=0, standard=1 ...
  const [contractPlanPriority, setContractPlanPriority] = useState<
    Record<string, number>
  >({});

  /* ---------------------------------------
   * 検索条件（applied）
   * -------------------------------------- */
  const [appliedJobCategoryIds, setAppliedJobCategoryIds] = useState<string[]>(
    initialJobCategoryIds
  );
  const [appliedAreaIds, setAppliedAreaIds] =
    useState<string[]>(initialAreaIds);

  const [appliedEmploymentTypeIds, setAppliedEmploymentTypeIds] = useState<
    string[]
  >(initialEmploymentTypeIds);

  const [appliedSalaryTab, setAppliedSalaryTab] = useState<'yearly' | 'hourly'>(
    initialSalaryTab
  );
  const [appliedSalaryYearlyIds, setAppliedSalaryYearlyIds] = useState<
    string[]
  >(initialSalaryYearlyIds);
  const [appliedSalaryHourlyIds, setAppliedSalaryHourlyIds] = useState<
    string[]
  >(initialSalaryHourlyIds);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // URL変更時に applied を同期
  useEffect(() => {
    setAppliedJobCategoryIds(initialJobCategoryIds);
    setAppliedAreaIds(initialAreaIds);
    setAppliedEmploymentTypeIds(initialEmploymentTypeIds);

    setAppliedSalaryTab(initialSalaryTab);
    setAppliedSalaryYearlyIds(initialSalaryYearlyIds);
    setAppliedSalaryHourlyIds(initialSalaryHourlyIds);
  }, [
    initialJobCategoryIds,
    initialAreaIds,
    initialEmploymentTypeIds,
    initialSalaryTab,
    initialSalaryYearlyIds,
    initialSalaryHourlyIds,
  ]);

  /* ---------------------------------------
   * 初期ロード
   * -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        recommendedBuiltRef.current = false;
        setRecommendedJobs([]);

        // jobs
        const timestamp = Date.now();
        const jobsPath = cond
          ? `/db/jobs/conditions/${cond}.json?t=${timestamp}`
          : `/db/jobs/jobsIndexAll.json?t=${timestamp}`;

        const jobsJson = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath(jobsPath),
          { items: [] }
        );

        setJobsAll(jobsJson.items);

        // ✅ JobsFilter 用 master（共通）
        const masters = await loadJobsFilterMasters();
        setEmploymentTypeOptions(masters.employmentTypeOptions);
        setJobCategoryOptions(masters.jobCategoryOptions);
        setAreasMaster(masters.areasMaster);
        setSalaryYearlyOptions(masters.salaryYearlyOptions);
        setSalaryHourlyOptions(masters.salaryHourlyOptions);

        // ✅ /jobs で必要な map は options から生成（ページ責務）
        setEmploymentTypeMap(toMapFromOptions(masters.employmentTypeOptions));
        setJobCategoryMap(toMapFromOptions(masters.jobCategoryOptions));

        // contractPlans（おすすめ順の優先度）
        const contractPlans = await fetchJson<ContractPlanMaster[]>(
          withBasePath('/db/master/contractPlans.json'),
          []
        );
        setContractPlanPriority(
          contractPlans.reduce<Record<string, number>>((acc, p, idx) => {
            acc[p.id] = idx;
            return acc;
          }, {})
        );

        // salaryUnits（一覧の給与表記用）
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        // config
        const config = await fetchJson<JobCommonConfig>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }
      } catch (e) {
        console.error(e);
        setError('求人一覧の読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cond]);

  /* ---------------------------------------
   * おすすめ順（初回のみ固定生成）
   * - contractPlans.json の並びを優先度にする
   * - 同一プラン内は shuffle
   * -------------------------------------- */
  useEffect(() => {
    if (recommendedBuiltRef.current) return;
    if (jobsAll.length === 0) return;
    if (Object.keys(contractPlanPriority).length === 0) return;

    const getPriority = (job: JobIndexItem) => {
      const id = (job as unknown as { contractPlanId?: string }).contractPlanId;
      if (!id) return Number.MAX_SAFE_INTEGER;
      return contractPlanPriority[id] ?? Number.MAX_SAFE_INTEGER;
    };

    const grouped = new Map<number, JobIndexItem[]>();
    for (const job of jobsAll) {
      const key = getPriority(job);
      const list = grouped.get(key) ?? [];
      list.push(job);
      grouped.set(key, list);
    }

    const keys = Array.from(grouped.keys()).sort((a, b) => a - b);

    const merged: JobIndexItem[] = [];
    for (const key of keys) {
      merged.push(...shuffle(grouped.get(key) ?? []));
    }

    setRecommendedJobs(merged);
    recommendedBuiltRef.current = true;
  }, [jobsAll, contractPlanPriority]);

  /* ---------------------------------------
   * 検索アクション
   * - JobsFilter（UI）から payload を受け取り
   *   1) 一覧へ適用（applied）
   *   2) URLへ反映（jc / ar / et / st / sy / sh）
   * -------------------------------------- */
  const handleSearch = (payload: JobsSearchPayload) => {
    // applied 反映（排他）
    setAppliedJobCategoryIds(payload.jobCategoryIds);
    setAppliedAreaIds(payload.areaIds);
    setAppliedEmploymentTypeIds(payload.employmentTypeIds);

    setAppliedSalaryTab(payload.salaryTab);

    // URL/検索の一貫性のため、payloadも排他で正規化して使う
    const normalized: JobsSearchPayload =
      payload.salaryTab === 'yearly'
        ? { ...payload, salaryHourlyIds: [] }
        : { ...payload, salaryYearlyIds: [] };

    if (normalized.salaryTab === 'yearly') {
      setAppliedSalaryYearlyIds(normalized.salaryYearlyIds);
      setAppliedSalaryHourlyIds([]);
    } else {
      setAppliedSalaryYearlyIds([]);
      setAppliedSalaryHourlyIds(normalized.salaryHourlyIds);
    }

    const qs = buildJobsSearchQuery(normalized);
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  };

  const handleReset = () => {
    setAppliedJobCategoryIds([]);
    setAppliedAreaIds([]);
    setAppliedEmploymentTypeIds([]);

    setAppliedSalaryTab('yearly');
    setAppliedSalaryYearlyIds([]);
    setAppliedSalaryHourlyIds([]);

    router.push('/jobs');
  };

  /* ---------------------------------------
   * 表示用一覧（タブ + 絞り込み適用）
   * -------------------------------------- */
  const jobsForView = useMemo(() => {
    // タブによる base 決定
    let base: JobIndexItem[] =
      activeTab === 'recommend'
        ? recommendedJobs.length
          ? recommendedJobs
          : jobsAll
        : jobsAll;

    // 新着タブは updatedAt 降順
    if (activeTab === 'new') {
      base = [...jobsAll].sort(
        (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      );
    }

    const hasSalaryFilter =
      (appliedSalaryTab === 'yearly' && appliedSalaryYearlyIds.length > 0) ||
      (appliedSalaryTab === 'hourly' && appliedSalaryHourlyIds.length > 0);

    if (
      appliedJobCategoryIds.length === 0 &&
      appliedAreaIds.length === 0 &&
      appliedEmploymentTypeIds.length === 0 &&
      !hasSalaryFilter
    ) {
      return base;
    }

    return base.filter((job) => {
      const okCategory =
        appliedJobCategoryIds.length === 0 ||
        appliedJobCategoryIds.includes(job.jobCategoryId);

      const okArea =
        appliedAreaIds.length === 0 ||
        job.areaIds.some((id) => appliedAreaIds.includes(id));

      const okEmployment =
        appliedEmploymentTypeIds.length === 0 ||
        appliedEmploymentTypeIds.includes(job.employmentTypeId);

      const okSalary =
        appliedSalaryTab === 'yearly'
          ? appliedSalaryYearlyIds.length === 0 ||
            (job.firstYearIncomeRangeId !== undefined &&
              appliedSalaryYearlyIds.includes(job.firstYearIncomeRangeId))
          : appliedSalaryHourlyIds.length === 0 ||
            (job.salary?.unitId === 'hourly' &&
              job.salary.bandIds.some((id) =>
                appliedSalaryHourlyIds.includes(id)
              ));

      return okCategory && okArea && okEmployment && okSalary;
    });
  }, [
    activeTab,
    jobsAll,
    recommendedJobs,
    appliedJobCategoryIds,
    appliedAreaIds,
    appliedEmploymentTypeIds,
    appliedSalaryTab,
    appliedSalaryYearlyIds,
    appliedSalaryHourlyIds,
  ]);

  const jobsCountText = jobsForView.length.toLocaleString();

  /* ---------------------------------------
   * UI
   * -------------------------------------- */
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className={styles.containerHead}>
        <h2>
          求人を検索
          <span>
            掲載：<i>{jobsCountText}</i>件
          </span>
        </h2>

        <div className={styles.blockFilters}>
          <button
            type="button"
            className={styles.itemMobileButton}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            <span>条件で探す</span>
          </button>
          <div
            className={clsx(styles.boxMobile, isMobileOpen && styles.isOpen)}
          >
            <div className={styles.innerBoxMobile}>
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
        </div>
      </section>

      <section className={styles.containerJobs}>
        <nav className={styles.wrapBtn}>
          <button
            type="button"
            className={clsx(activeTab === 'recommend' && styles.isActive)}
            onClick={() => setActiveTab('recommend')}
          >
            おすすめ
          </button>
          <button
            type="button"
            className={clsx(activeTab === 'new' && styles.isActive)}
            onClick={() => setActiveTab('new')}
          >
            新着
          </button>
        </nav>

        {jobsForView.length === 0 ? (
          <p className={styles.noFavorite}>該当の求人情報はありません</p>
        ) : (
          <JobCardList
            jobs={jobsForView}
            salaryUnitMap={salaryUnitMap}
            employmentTypeMap={employmentTypeMap}
            jobCategoryMap={jobCategoryMap}
            favoriteJobIds={favoriteIdsArray}
            onToggleFavorite={toggleFavorite}
            ulClassName={styles.jobsList}
            newIconPeriodDays={newIconPeriodDays}
          />
        )}
      </section>
    </>
  );
}
