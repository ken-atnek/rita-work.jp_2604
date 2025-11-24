/* =======================================
 * リタワーク 型定義ファイル（求人）
 * URL: src/types/job.ts
 * Created: 2025-11-24
 * ======================================= */

export type PublishedPeriod = {
  start: string;
  end: string;
};

export type Job = {
  id: string;
  title: string;
  facilityId: string;
  employmentTypeId: string;

  heroImages: string[];

  contractPlanId: string;
  publishedPeriod: PublishedPeriod;
};
