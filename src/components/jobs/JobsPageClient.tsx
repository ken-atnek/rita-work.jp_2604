/* =======================================
 * リタワーク /jobs 一覧ページ（Client）
 * - URLパラメータ（jc）から絞り込み条件を復元
 * - 「おすすめ」: contractPlan順 + 同一プラン内シャッフル（読み込み時に1回固定）
 * - 「新着」: updatedAt 降順
 * ======================================= */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { JobsFilter } from '@/components/jobs/filters/JobsFilter';
import styles from './JobsPageClient.module.scss';

import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';
import { JobCardList } from '@/components/job/JobCardList';

import type { JobIndexItem } from '@/types/jobIndex';

/* ---------------------------------------
 * マスター型（最低限）
 * -------------------------------------- */
type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

type SalaryBandHourlyMaster = {
  id: string;
  label?: string;
  name?: string;
};

/* ---------------------------------------
 * URLパラメータ用ユーティリティ
 * - jc=pt,nurse のような CSV を扱う
 * -------------------------------------- */
// "pt,nurse" → ["pt","nurse"]
const decodeCsv = (v: string | undefined): string[] => {
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
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

// ["pt","nurse"] → "pt,nurse"
const encodeCsv = (arr: string[]): string | undefined => {
  if (arr.length === 0) return undefined;
  return arr.join(',');
};

export default function JobsPageClient() {
  const router = useRouter();
  const sp = useSearchParams();

  /* ---------------------------------------
   * URL（職種）復元
   * -------------------------------------- */
  const jcParam = sp.get('jc') ?? '';

  const initialJobCategoryIds = useMemo(() => {
    return decodeCsv(jcParam);
  }, [jcParam]);

  /* ---------------------------------------
   * favorites（localStorage）
   * -------------------------------------- */
  const { favoriteIdsArray, toggleFavorite } = useFavoriteJobIds();

  /* ---------------------------------------
   * 一覧データ
   * -------------------------------------- */
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);
  // おすすめ表示用（読み込み時に一度だけ並びを作って固定）
  const [recommendedJobs, setRecommendedJobs] = useState<JobIndexItem[]>([]);

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
  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
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

  /* ---------------------------------------
   * 検索条件（職種）：draft / applied
   * -------------------------------------- */
  const [appliedJobCategoryIds, setAppliedJobCategoryIds] = useState<string[]>(
    initialJobCategoryIds
  );

  /* ---------------------------------------
   * URL変更時の同期
   * -------------------------------------- */
  useEffect(() => {
    setAppliedJobCategoryIds(initialJobCategoryIds);
  }, [initialJobCategoryIds]);

  /* ---------------------------------------
   * 初期ロード
   * -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 求人一覧
        const json = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath('/db/jobs/jobsIndexAll.json'),
          { items: [] }
        );
        setJobsAll(json.items);

        // 雇用形態
        const employmentTypes = await fetchJson<
          Array<{ id: string; name: string }>
        >(withBasePath('/db/master/employmentTypes.json'), []);
        setEmploymentTypeMap(toIdLabelMap(employmentTypes, (t) => t.name));

        // 職種
        const categories = await fetchJson<
          Array<{ id: string; name?: string; label?: string }>
        >(withBasePath('/db/master/jobCategories.json'), []);

        setJobCategoryMap(
          toIdLabelMap(categories, (c) => c.name ?? c.label ?? c.id)
        );

        const jobCategoryOptionsBuilt = categories.map((c) => ({
          id: c.id,
          label: c.name ?? c.label ?? c.id,
        }));
        setJobCategoryOptions(jobCategoryOptionsBuilt);

        // 新着期間
        const config = await fetchJson<{ newIconPeriodDays?: number }>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }
        // 契約プラン（並び順が “おすすめ” の優先順位になる）
        const contractPlans = await fetchJson<
          Array<{ id: string; label?: string; name?: string }>
        >(withBasePath('/db/master/contractPlans.json'), []);

        const priority = contractPlans.reduce<Record<string, number>>(
          (acc, p, idx) => {
            acc[p.id] = idx;
            return acc;
          },
          {}
        );
        setContractPlanPriority(priority);
        // 給与単位
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        // 時給バンド
        const bands = await fetchJson<SalaryBandHourlyMaster[]>(
          withBasePath('/db/master/salaryBandsHourly.json'),
          []
        );
        setHourlyBandMap(toIdLabelMap(bands, (b) => b.label ?? b.name ?? b.id));
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
   * おすすめ順（読み込み時に1回だけ生成して固定）
   * - contractPlans.json の並びを優先度にする
   * - 同一プラン内は shuffle
   * -------------------------------------- */
  useEffect(() => {
    // jobs がまだ無い / priority がまだ無い / すでに作った → 何もしない
    if (jobsAll.length === 0) return;
    if (Object.keys(contractPlanPriority).length === 0) return;

    // すでにおすすめ順を作っていたら再計算しない（= 読み込みごとに1回）
    if (recommendedJobs.length > 0) return;

    // contractPlanId が無い/未知のものは末尾へ
    const getPriority = (job: JobIndexItem) => {
      const id = (job as unknown as { contractPlanId?: string }).contractPlanId;
      if (!id) return Number.MAX_SAFE_INTEGER;
      return contractPlanPriority[id] ?? Number.MAX_SAFE_INTEGER;
    };

    // まずプラン優先度でグループ化 → 同一プラン内はシャッフル
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
  }, [jobsAll, contractPlanPriority, recommendedJobs.length]);

  /* ---------------------------------------
   * 検索アクション
   * - JobsFilter（UI）から payload を受け取り
   *   1) 一覧へ適用（applied）
   *   2) URLへ反映（jc）
   * -------------------------------------- */
  const handleSearch = (payload: { jobCategoryIds: string[] }) => {
    const ids = payload.jobCategoryIds;

    setAppliedJobCategoryIds(ids);

    const params = new URLSearchParams();
    const jc = encodeCsv(ids);
    if (jc) params.set('jc', jc);

    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  };

  const handleReset = () => {
    setAppliedJobCategoryIds([]);
    router.push('/jobs');
  };

  /* ---------------------------------------
   * 表示用一覧（タブ + 絞り込み適用）
   * -------------------------------------- */
  const jobsForView = useMemo(() => {
    let base: JobIndexItem[] =
      activeTab === 'recommend'
        ? recommendedJobs.length
          ? recommendedJobs
          : jobsAll
        : jobsAll;

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

    if (appliedJobCategoryIds.length === 0) {
      return base;
    }

    return base.filter((job) =>
      appliedJobCategoryIds.includes(job.jobCategoryId)
    );
  }, [activeTab, jobsAll, appliedJobCategoryIds, recommendedJobs]);

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
          {/* ↓ ここにフィルターを読み込む */}
          <JobsFilter
            initialJobCategoryIds={initialJobCategoryIds}
            jobCategoryOptions={jobCategoryOptions}
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
          hourlyBandMap={hourlyBandMap}
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
