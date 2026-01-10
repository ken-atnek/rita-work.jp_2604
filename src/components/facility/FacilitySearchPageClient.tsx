/* =======================================
 * リタワーク 事業所検索結果ページ
 * File: src/components/facility/FacilitySearchPageClient.tsx
 * - URLの kw を取得
 * - 施設名で絞り込み → 該当施設の求人カードを表示（/jobs と同じUI）
 * - 並び替えタブなし
 * ======================================= */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './FacilitySearchPageClient.module.scss';
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';
import { toIdLabelMap } from '@/utils/toIdLabelMap';

import type { JobIndexItem } from '@/types/jobIndex';

import FacilitySearchBox from '@/components/facility/search/FacilitySearchBox';
import { JobCardList } from '@/components/job/JobCardList';
import { useFavoriteJobIds } from '@/hooks/useFavoriteJobIds';

import {
  loadJobsFilterMasters,
  type IdLabelOption,
} from '@/utils/loadJobsFilterMasters';

/* ---------------------------------------
 * このページ固有の型
 * -------------------------------------- */
type FacilityItem = {
  facilityId: string;
  facilityName: string;
  jobsCount: number;
};

type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

type JobCommonConfig = {
  newIconPeriodDays?: number;
};

const toMapFromOptions = (options: IdLabelOption[]) =>
  options.reduce<Record<string, string>>((acc, o) => {
    acc[o.id] = o.label;
    return acc;
  }, {});

export function FacilitySearchPageClient() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get('kw') || '').trim();

  const { favoriteIdsArray, toggleFavorite } = useFavoriteJobIds();

  /* ---------------------------------------
   * 一覧データ
   * -------------------------------------- */
  const [jobsAll, setJobsAll] = useState<JobIndexItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);

  /* ---------------------------------------
   * 表示用マップ（/jobs と同じ責務）
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
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);

  /* ---------------------------------------
   * UI state
   * -------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------
   * 初期ロード
   * -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // jobs
        const timestamp = Date.now();
        const jobsJson = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath(`/db/jobs/jobsIndexAll.json?t=${timestamp}`),
          { items: [] }
        );
        setJobsAll(jobsJson.items);

        // facility集約（検索判定に使う）
        const map = new Map<string, FacilityItem>();

        for (const job of jobsJson.items) {
          // JobIndexItem では必須だけど、念のため壊れデータ防御
          const facilityId = job.facilityId;

          const existing = map.get(facilityId);
          if (existing) {
            existing.jobsCount += 1;
          } else {
            map.set(facilityId, {
              facilityId,
              facilityName: job.facilityName,
              jobsCount: 1,
            });
          }
        }

        setFacilities(Array.from(map.values()));

        // ✅ masters（options）→ map化（/jobs と同じ）
        const masters = await loadJobsFilterMasters();
        setEmploymentTypeMap(toMapFromOptions(masters.employmentTypeOptions));
        setJobCategoryMap(toMapFromOptions(masters.jobCategoryOptions));

        // salaryUnits（一覧の給与表記用）
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        setSalaryUnitMap(
          toIdLabelMap(salaryUnits, (u) => u.label ?? u.name ?? u.id)
        );

        // config（newアイコン日数）
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
   * 施設名で絞り込み（kw → 施設）
   * -------------------------------------- */
  const filteredFacilities = useMemo(() => {
    if (!keyword) return facilities;

    const kw = keyword.toLowerCase();
    return facilities.filter((f) => f.facilityName.toLowerCase().includes(kw));
  }, [facilities, keyword]);

  /* ---------------------------------------
   * 該当 facilityId セット → 求人へ落とす
   * -------------------------------------- */
  const matchedFacilityIdSet = useMemo(() => {
    return new Set(filteredFacilities.map((f) => f.facilityId));
  }, [filteredFacilities]);

  const matchedJobs = useMemo(() => {
    // kwが空なら「全施設」＝全求人（仕様として自然）
    if (!keyword) return jobsAll;

    return jobsAll.filter((job) => matchedFacilityIdSet.has(job.facilityId));
  }, [jobsAll, matchedFacilityIdSet, keyword]);

  /* ---------------------------------------
   * UI
   * -------------------------------------- */
  if (loading) {
    return (
      <section>
        <FacilitySearchBox defaultKeyword={keyword} />
        <p style={{ marginTop: '2rem' }}>読み込み中...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <FacilitySearchBox defaultKeyword={keyword} />
        <p style={{ marginTop: '2rem' }}>{error}</p>
      </section>
    );
  }

  return (
    <>
      <section className={styles.containerHead}>
        <h2>事業所検索</h2>

        {/* 検索ボックス（kw復元） */}
        <FacilitySearchBox
          defaultKeyword={keyword}
          className={styles.boxForm}
          inputClassName={styles.itemInput}
        />
      </section>
      <section className={styles.containerCardList}>
        {matchedJobs.length === 0 ? (
          <p className={styles.noSearch}>該当の事業所はありません</p>
        ) : (
          <JobCardList
            jobs={matchedJobs}
            salaryUnitMap={salaryUnitMap}
            employmentTypeMap={employmentTypeMap}
            jobCategoryMap={jobCategoryMap}
            favoriteJobIds={favoriteIdsArray}
            onToggleFavorite={toggleFavorite}
            ulClassName={styles.cardList}
            newIconPeriodDays={newIconPeriodDays}
          />
        )}
      </section>
    </>
  );
}
