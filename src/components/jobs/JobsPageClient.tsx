/* =======================================
 * リタワーク /jobs 一覧ページ（Client）
 * - URLパラメータ（jc / ar）から絞り込み条件を復元
 * - 「おすすめ」: contractPlan順 + 同一プラン内シャッフル（初回のみ固定）
 * - 「新着」: updatedAt 降順
 * URL: src/components/jobs/JobsPageClient.tsx
 * Created: 2025-12-27
 * Last updated: 2026-01-08
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
import type { AreasMaster, AreaGroup } from '@/types/area';

/* ---------------------------------------
 * URLパラメータ用ユーティリティ
 * - jc=pt,nurse のようなCSVを扱う
 * -------------------------------------- */
const decodeCsv = (v: string | undefined): string[] => {
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const encodeCsv = (arr: string[]): string | undefined => {
  if (arr.length === 0) return undefined;
  return arr.join(',');
};

// Fisher–Yates shuffle（元配列は壊さない）
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------------------------------------
 * マスター型（最低限）
 * -------------------------------------- */
type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

type JobCategoryMaster = {
  id: string;
  name?: string;
  label?: string;
};

type ContractPlanMaster = {
  id: string;
  label?: string;
  name?: string;
};

type EmploymentTypeMaster = {
  id: string;
  name: string;
};

type JobCommonConfig = {
  newIconPeriodDays?: number;
};

export default function JobsPageClient() {
  const router = useRouter();
  const sp = useSearchParams();

  /* ---------------------------------------
   * URL復元（jc / ar）
   * -------------------------------------- */
  const jcParam = sp.get('jc') ?? '';
  const arParam = sp.get('ar') ?? '';
  const etParam = sp.get('et') ?? '';
  const stParam = sp.get('st') ?? 'yearly';
  const syParam = sp.get('sy') ?? '';
  const shParam = sp.get('sh') ?? '';

  const initialJobCategoryIds = useMemo(() => decodeCsv(jcParam), [jcParam]);
  const initialAreaIds = useMemo(() => decodeCsv(arParam), [arParam]);
  const initialEmploymentTypeIds = useMemo(() => decodeCsv(etParam), [etParam]);
  const initialSalaryTab = (stParam === 'hourly' ? 'hourly' : 'yearly') as
    | 'yearly'
    | 'hourly';

  const initialSalaryYearlyIds = useMemo(() => decodeCsv(syParam), [syParam]);
  const initialSalaryHourlyIds = useMemo(() => decodeCsv(shParam), [shParam]);

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

  const [jobCategoryOptions, setJobCategoryOptions] = useState<
    Array<{ id: string; label: string }>
  >([]);

  // contractPlan の優先度（小さいほど上）: premium=0, standard=1 ...
  const [contractPlanPriority, setContractPlanPriority] = useState<
    Record<string, number>
  >({});

  // areas は groups構造で保持（AreaField で g.label を表示するため）
  const [areasMaster, setAreasMaster] = useState<AreasMaster | null>(null);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    Array<{ id: string; label: string }>
  >([]);

  const [salaryYearlyOptions, setSalaryYearlyOptions] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [salaryHourlyOptions, setSalaryHourlyOptions] = useState<
    Array<{ id: string; label: string }>
  >([]);

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

        // jobs
        const jobsJson = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath('/db/jobs/jobsIndexAll.json'),
          { items: [] }
        );
        setJobsAll(jobsJson.items);

        // masters（順番に読む：読みやすさ優先）
        const employmentTypes = await fetchJson<EmploymentTypeMaster[]>(
          withBasePath('/db/master/employmentTypes.json'),
          []
        );
        setEmploymentTypeOptions(
          employmentTypes.map((t) => ({ id: t.id, label: t.name }))
        );

        setEmploymentTypeMap(toIdLabelMap(employmentTypes, (t) => t.name));

        const categories = await fetchJson<JobCategoryMaster[]>(
          withBasePath('/db/master/jobCategories.json'),
          []
        );
        setJobCategoryMap(
          toIdLabelMap(categories, (c) => c.name ?? c.label ?? c.id)
        );
        setJobCategoryOptions(
          categories.map((c) => ({
            id: c.id,
            label: c.name ?? c.label ?? c.id,
          }))
        );

        // ✅ areas.json は groups構造前提で読む（g.label安定）
        const areasJson = await fetchJson<{ groups: AreaGroup[] }>(
          withBasePath('/db/master/areas.json'),
          { groups: [] }
        );
        setAreasMaster(areasJson);

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

        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        const firstYearIncomeRanges = await fetchJson<
          Array<{ id: string; label: string }>
        >(withBasePath('/db/master/firstYearIncomeRanges.json'), []);
        setSalaryYearlyOptions(
          firstYearIncomeRanges.map((r) => ({ id: r.id, label: r.label }))
        );

        const salaryBandsHourly = await fetchJson<
          Array<{ id: string; label: string }>
        >(withBasePath('/db/master/salaryBandsHourly.json'), []);
        setSalaryHourlyOptions(
          salaryBandsHourly.map((r) => ({ id: r.id, label: r.label }))
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
  }, []);

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
   *   2) URLへ反映（jc / ar）
   * -------------------------------------- */
  const handleSearch = (payload: {
    jobCategoryIds: string[];
    areaIds: string[];
    employmentTypeIds: string[];
    salaryTab: 'yearly' | 'hourly';
    salaryYearlyIds: string[];
    salaryHourlyIds: string[];
  }) => {
    // applied 反映（排他）
    setAppliedJobCategoryIds(payload.jobCategoryIds);
    setAppliedAreaIds(payload.areaIds);
    setAppliedEmploymentTypeIds(payload.employmentTypeIds);

    setAppliedSalaryTab(payload.salaryTab);
    if (payload.salaryTab === 'yearly') {
      setAppliedSalaryYearlyIds(payload.salaryYearlyIds);
      setAppliedSalaryHourlyIds([]); // ←排他：時給を必ず消す
    } else {
      setAppliedSalaryYearlyIds([]); // ←排他：年収を必ず消す
      setAppliedSalaryHourlyIds(payload.salaryHourlyIds);
    }

    const params = new URLSearchParams();

    const jc = encodeCsv(payload.jobCategoryIds);
    if (jc) params.set('jc', jc);

    const ar = encodeCsv(payload.areaIds);
    if (ar) params.set('ar', ar);

    const et = encodeCsv(payload.employmentTypeIds);
    if (et) params.set('et', et);

    // ✅ 給与（排他でURLも片方だけ）
    params.set('st', payload.salaryTab);

    if (payload.salaryTab === 'yearly') {
      const sy = encodeCsv(payload.salaryYearlyIds);
      if (sy) params.set('sy', sy);
      params.delete('sh'); // ←必ず消す
    } else {
      const sh = encodeCsv(payload.salaryHourlyIds);
      if (sh) params.set('sh', sh);
      params.delete('sy'); // ←必ず消す
    }

    // ※ sy/sh が空のときも st は残すかどうかは好み。
    //   「給与条件なしならstも消したい」ならここで条件分岐。

    const qs = params.toString();
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
      const hasUpdatedAt = (
        job: JobIndexItem
      ): job is JobIndexItem & { updatedAt: string } =>
        typeof job.updatedAt === 'string' && job.updatedAt.length > 0;

      base = [...jobsAll]
        .filter(hasUpdatedAt)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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

      const jobAreaIds =
        (job as unknown as { areaIds?: string[] }).areaIds ?? [];
      const okArea =
        appliedAreaIds.length === 0 ||
        jobAreaIds.some((id) => appliedAreaIds.includes(id));

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

  /* ---------------------------------------
   * UI
   * -------------------------------------- */
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className={styles.containerHead}>
        <h2>求人を検索</h2>

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
      </section>
    </>
  );
}
