/* =======================================
 * FacilityPageClient - 事業所詳細ページ（データ取得の司令塔）
 * URL: src/components/facility/FacilityPageClient.tsx
 * Referenced in: src/components/facility/FacilityPageClientWrapper.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-25
 * ======================================= */

'use client';

import { useEffect, useState } from 'react';

import { FacilityDetailContent } from './FacilityDetailContent';

import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import type { JobCategory } from '@/types/jobCategory';
import type { JobIndexItem } from '@/types/jobIndex';
import type {
  EmploymentTypeMaster as EmploymentType,
  FacilityTypeMaster as FacilityType,
  SalaryUnitMaster as SalaryUnit,
} from '@/types/master';
import { withBasePath } from '@/utils/withBasePath';
import { fetchJson } from '@/utils/fetchJson';
import { toIdLabelMap } from '@/utils/toIdLabelMap';
type Props = {
  facilityId: string;
};

export function FacilityPageClient({ facilityId }: Props) {
  /* ===============================
   * state
   * =============================== */
  const [facility, setFacility] = useState<Facility | null>(null);
  const [corporation, setCorporation] = useState<Corporation | null>(null);

  const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );
  const [facilityJobs, setFacilityJobs] = useState<JobIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);
  /* ===============================
   * data fetch
   * =============================== */
  useEffect(() => {
    const loadFacility = async () => {
      try {
        setLoading(true);
        setError(null);

        /* -------------------------------
         * 1. 事業所データ
         * ------------------------------- */
        const facilityData = await fetchJson<Facility | null>(
          withBasePath(`/db/facilities/${facilityId}/facility.json`),
          null
        );
        if (!facilityData) {
          throw new Error('事業所データの取得に失敗しました');
        }

        /* -------------------------------
         * 1.5 施設配下の求人一覧（jobsIndex）
         * ※無い施設もあるので、失敗しても落とさない
         * ------------------------------- */
        const jobsIndexJson = await fetchJson<{ items: JobIndexItem[] }>(
          withBasePath(`/db/facilities/${facilityId}/jobs/jobsIndex.json`),
          { items: [] }
        );

        /* -------------------------------
         * 2. 法人マスター
         * ------------------------------- */
        const corporations = await fetchJson<Corporation[]>(
          withBasePath('/db/master/corporations.json'),
          []
        );
        const corporationData = corporations.find(
          (c) => c.id === facilityData.corporationId
        );
        if (!corporationData) {
          throw new Error('法人データが corporations.json に見つかりません');
        }

        /* -------------------------------
         * 3. 雇用形態マスター
         * ------------------------------- */
        const employmentMaster = await fetchJson<EmploymentType[]>(
          withBasePath('/db/master/employmentTypes.json'),
          []
        );

        /* -------------------------------
         * 4. 事業所形態マスター
         * ------------------------------- */
        const facilityTypesMaster = await fetchJson<FacilityType[]>(
          withBasePath('/db/master/facilityTypes.json'),
          []
        );

        /* -------------------------------
         * 5. 職種マスター
         * ------------------------------- */
        const categories = await fetchJson<JobCategory[]>(
          withBasePath('/db/master/jobCategories.json'),
          []
        );

        /* -------------------------------
         * 6. 給与単位マスター（salaryUnits）
         * ------------------------------- */
        const salaryUnits = await fetchJson<SalaryUnit[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );

        const salaryMap = toIdLabelMap(salaryUnits, (u) => u.label ?? u.name);

        /* -------------------------------
         * 新着期間設定（job_common）
         * ------------------------------- */
        const config = await fetchJson<{ newIconPeriodDays?: number }>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }
        /* -------------------------------
         * state 反映
         * ------------------------------- */
        setFacility(facilityData);
        setFacilityJobs(jobsIndexJson.items);
        setCorporation(corporationData);
        setEmploymentTypes(employmentMaster);
        setFacilityTypes(facilityTypesMaster);
        setJobCategories(categories);
        setSalaryUnitMap(salaryMap);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : '事業所データの取得に失敗しました'
        );
        setFacility(null);
        setCorporation(null);
        setEmploymentTypes([]);
        setFacilityTypes([]);
        setJobCategories([]);
        setSalaryUnitMap({});
        setFacilityJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFacility();
  }, [facilityId]);

  /* ===============================
   * render guard
   * =============================== */
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;
  if (!facility || !corporation) return <p>事業所データが見つかりません。</p>;

  /* ===============================
   * render
   * =============================== */
  return (
    <FacilityDetailContent
      facility={facility}
      corporation={corporation}
      employmentTypes={employmentTypes}
      jobCategories={jobCategories}
      facilityTypes={facilityTypes}
      salaryUnitMap={salaryUnitMap}
      jobs={facilityJobs}
      newIconPeriodDays={newIconPeriodDays}
    />
  );
}
