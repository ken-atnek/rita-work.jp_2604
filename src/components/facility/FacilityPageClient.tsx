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

type Props = {
  facilityId: string;
};

type EmploymentType = { id: string; name: string };
type FacilityType = { id: string; label: string };
type SalaryUnit = { id: string; label: string };

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

  /* ===============================
   * data fetch
   * =============================== */
  useEffect(() => {
    const loadFacility = async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

      try {
        setLoading(true);
        setError(null);

        /* -------------------------------
         * 1. 事業所データ
         * ------------------------------- */
        const facilityRes = await fetch(
          `${basePath}/db/facilities/${facilityId}/facility.json`
        );
        if (!facilityRes.ok) {
          throw new Error('事業所データの取得に失敗しました');
        }
        const facilityData = (await facilityRes.json()) as Facility;

        /* -------------------------------
         * 1.5 施設配下の求人一覧（jobsIndex）
         * ※無い施設もあるので、失敗しても落とさない
         * ------------------------------- */
        const jobsIndexRes = await fetch(
          `${basePath}/db/facilities/${facilityId}/jobs/jobsIndex.json`
        );
        const jobsIndexJson = jobsIndexRes.ok
          ? ((await jobsIndexRes.json()) as { items: JobIndexItem[] })
          : { items: [] };

        /* -------------------------------
         * 2. 法人マスター
         * ------------------------------- */
        const corpRes = await fetch(`${basePath}/db/master/corporations.json`);
        const corporations = corpRes.ok
          ? ((await corpRes.json()) as Corporation[])
          : [];

        const corporationData =
          corporations.find((c) => c.id === facilityData.corporationId) ?? null;

        /* -------------------------------
         * 3. 雇用形態マスター
         * ------------------------------- */
        const employmentRes = await fetch(
          `${basePath}/db/master/employmentTypes.json`
        );
        const employmentMaster = employmentRes.ok
          ? ((await employmentRes.json()) as EmploymentType[])
          : [];

        /* -------------------------------
         * 4. 事業所形態マスター
         * ------------------------------- */
        const facilityTypesRes = await fetch(
          `${basePath}/db/master/facilityTypes.json`
        );
        const facilityTypesMaster = facilityTypesRes.ok
          ? ((await facilityTypesRes.json()) as FacilityType[])
          : [];

        /* -------------------------------
         * 5. 職種マスター
         * ------------------------------- */
        const categoryRes = await fetch(
          `${basePath}/db/master/jobCategories.json`
        );
        const categories = categoryRes.ok
          ? ((await categoryRes.json()) as JobCategory[])
          : [];

        /* -------------------------------
         * 6. 給与単位マスター（salaryUnits）
         * ------------------------------- */
        const salaryUnitRes = await fetch(
          `${basePath}/db/master/salaryUnits.json`
        );
        const salaryUnits = salaryUnitRes.ok
          ? ((await salaryUnitRes.json()) as SalaryUnit[])
          : [];

        const salaryMap: Record<string, string> = Object.fromEntries(
          salaryUnits.map((u) => [
            u.id,
            (u as unknown as { label?: string; name?: string }).label ??
              (u as unknown as { label?: string; name?: string }).name ??
              u.id,
          ])
        );

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
    />
  );
}
