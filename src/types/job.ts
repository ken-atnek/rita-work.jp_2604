/* =======================================
 * リタワーク 型定義ファイル（求人）
 * URL: src/types/job.ts
 * Created: 2025-11-24
 * ======================================= */

export type PublishedPeriod = {
  start: string;
  end: string;
};
export type WorkEnvironmentStat = {
  metricId: string;
  value: number;
};
export type Job = {
  id: string;
  title: string;
  facilityId: string;
  employmentTypeId: string;
  jobCategoryId: string;
  heroImages: string[];
  salary: {
    unitId: 'monthly' | 'hourly';
    min: number;
    max: number;
    bonus: {
      hasBonus: boolean;
      note: string;
    };
  };
  workEnvironmentStats: WorkEnvironmentStat[];
  contractPlanId: string;
  publishedPeriod: PublishedPeriod;
};
