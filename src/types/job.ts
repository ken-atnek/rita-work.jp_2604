/* =======================================
 * リタワーク 型定義ファイル（求人）
 * URL: src/types/job.ts
 * Created: 2025-11-24
 * ======================================= */
export type Job = {
  id: string;
  title: string;
  facilityId: string;

  heroImages: string[];

  contractPlanId: string;
};
