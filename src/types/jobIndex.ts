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

// 時給：bandId のみを持つ
export type SalaryHourly = {
  unitId: 'hourly';
  bandId: string;
};

// 一覧で使用する給与型
export type JobSalary = SalaryMonthly | SalaryHourly;

/* ---------------------------------------
 * 求人インデックス項目
 * - facilities 内一覧 / 全件一覧 共通
 * -------------------------------------- */
export type JobIndexItem = {
  /* -------------------------------
   * 識別情報
   * ------------------------------ */
  jobId: string;

  // 全件 index（jobsIndexAll.json）では必須
  // 施設別 index（facilities/.../jobsIndex.json）では省略可
  facilityId?: string;

  /* -------------------------------
   * 掲載情報
   * ------------------------------ */
  publishedPeriod: PublishedPeriod;

  // 並び替え・新着判定用（ISO文字列）
  updatedAt?: string;

  /* -------------------------------
   * 表示用基本情報
   * ------------------------------ */
  title: string;
  facilityName: string;

  employmentTypeId: string;
  jobCategoryId: string;

  heroImages: string[];

  /* -------------------------------
   * 給与・勤務地
   * ------------------------------ */
  salary: JobSalary;
  workLocationText: string;

  /* -------------------------------
   * 表示用フラグ
   * - 現在は UI では非推奨（将来的に削除予定）
   * ------------------------------ */
  isNew: boolean;
};

/* ---------------------------------------
 * 求人インデックス
 * -------------------------------------- */
export type JobIndex = {
  // 施設別 index の場合のみ存在
  facilityId?: string;

  items: JobIndexItem[];
};
