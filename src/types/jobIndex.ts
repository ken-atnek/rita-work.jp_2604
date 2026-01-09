/* =======================================
 * リタワーク 求人インデックス用 型定義
 * File: src/types/jobIndex.ts
 * ======================================= */

/* ---------------------------------------
 * 掲載期間
 * - end が null の場合は掲載中
 * -------------------------------------- */
export type PublishedPeriod = {
  start: string;
  end: string | null;
};

/* ---------------------------------------
 * 給与型（一覧用）
 * -------------------------------------- */

// 月給：min / max を持つ
export type SalaryMonthly = {
  unitId: 'monthly';
  min: number;
  max: number;
};

export type SalaryHourly = {
  unitId: 'hourly';
  min: number;
  max: number;
  bandIds: string[];
};

// 一覧で使用する給与型
export type JobSalary = SalaryMonthly | SalaryHourly;

/* ---------------------------------------
 * 求人インデックス項目
 * - facilities 内一覧 / 全件一覧 共通
 * -------------------------------------- */
export type JobIndexItem = {
  jobId: string;
  facilityId: string;
  publishedPeriod: PublishedPeriod;
  updatedAt: string;

  title: string;
  facilityName: string;

  areaIds: string[];
  employmentTypeId: string;
  jobCategoryId: string;

  // 🔍 年収検索用
  firstYearIncomeRangeId?: string;

  // 🖥 表示・時給検索用
  salary?: JobSalary;

  heroImages: string[];
  workLocationText: string;
};

/* ---------------------------------------
 * 求人インデックス
 * -------------------------------------- */
export type JobIndex = {
  // 施設別 index の場合のみ存在
  facilityId?: string;

  items: JobIndexItem[];
};
