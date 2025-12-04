/* =======================================
 * リタワーク 型定義ファイル（求人）
 * URL: src/types/job.ts
 * Created: 2025-11-24
 * Last updated: 2025-11-29
 * ======================================= */

export type PublishedPeriod = {
  start: string;
  end: string;
};

export type WorkEnvironmentStat = {
  metricId: string;
  value: number;
};

/**
 * フリーテキスト（フリースペース）参照
 * 例: /db/facilities/fac_0001/jobs/job_0001_freespace.json
 */
export type FreeText = {
  enabled: boolean;
  path: string;
};

export type FreeSpaceSection = {
  heading: string;
  body: string[];
};

export type FreeSpaceContent = {
  title: string;
  sections: FreeSpaceSection[];
};
/**
 * 職場関連動画 JSON 参照
 * 例: /db/facilities/fac_0001/jobs/job_0001_movie.json
 */
export type JobVideosRef = {
  enabled: boolean;
  path: string;
};
/**
 * インタビュー用 JSON 参照
 * 例: /db/facilities/fac_0001/jobs/job_0001_interview.json
 */
export type Interview = {
  enabled: boolean;
  path: string;
};

/**
 * プレミアム用 JSON 参照
 * 例: /db/facilities/fac_0001/jobs/job_0001_premium.json
 */
export type PremiumContent = {
  enabled: boolean;
  path: string;
};

/**
 * 日勤・夜勤の1日の流れ
 */
export type DailyScheduleItem = {
  time: string;
  body: string[];
};

export type DailySchedule = {
  dayShift: DailyScheduleItem[];
  nightShift: DailyScheduleItem[];
};

export type Job = {
  id: string;
  facilityId: string;

  /* ============================
   * 掲載期間
   * ============================ */
  publishedPeriod: PublishedPeriod;

  /* ============================
   * マスター参照
   * ============================ */
  jobCategoryId: string;
  employmentTypeId: string;

  /* ============================
   * 基本表示情報（タイトル・画像など）
   * ============================ */
  title: string;
  heroImages: string[];

  /* ============================
   * 初年度年収レンジ
   * ============================ */
  firstYearIncomeRangeId: string;

  /* ============================
   * 診療科目（複数選択）
   * ============================ */
  clinicalDepartments?: string[];

  /* ============================
   * 給与関連
   * ============================ */
  salary: {
    unitId: 'monthly' | 'hourly';
    min: number;
    max: number;
    bonus: {
      hasBonus: boolean;
      note: string;
    };
  };

  /* 給与備考（改行対応） */
  salaryNotes?: string[];

  /* ============================
   * 仕事内容
   * ============================ */
  jobContents?: {
    optionIds: string[];
    note?: string[];
  };

  /* ============================
   * サービス形態
   * ============================ */
  serviceTypes?: {
    optionIds: string[];
  };

  /* ============================
   * 職場環境データ（3項目）
   * ============================ */
  workEnvironmentStats: WorkEnvironmentStat[];

  /* ============================
   * 職場関連動画・インタビュー・フリースペース・プレミアム
   * ============================ */
  jobVideos?: JobVideosRef;
  interview: Interview;
  freeText: FreeText;
  premium: PremiumContent;

  /* ============================
   * 日勤・夜勤スケジュール
   * ============================ */
  dailySchedule: DailySchedule;

  /* ============================
   * 待遇（福利厚生）
   * ============================ */
  benefits?: {
    optionIds: string[];
    note?: string[];
  };

  /* ============================
   * 応募要件
   * ============================ */
  applicationRequirements?: {
    optionIds: string[];
    note?: string[];
  };

  /* ============================
   * 勤務スタイル・働き方
   * ============================ */
  workStyle?: {
    optionIds: string[];
    note?: string[];
  };

  /* ============================
   * 休日・シフト条件
   * ============================ */
  holidayConditions?: {
    optionIds: string[];
    note?: string[];
  };

  /* 長期休暇・特別休暇 */
  longHolidays?: string[];

  /* 歓迎要件 */
  welcomeRequirements?: string[];

  /* ============================
   * 研修・サポート
   * ============================ */
  trainingSupport?: {
    options: string[];
    note?: string[];
  };

  /* ============================
   * アクセス
   * ============================ */
  access?: {
    options: string[];
  };

  /* ============================
   * 選考プロセス
   * ============================ */
  selectionProcess?: string[];

  /* ============================
   * 契約プラン
   * ============================ */
  contractPlanId: string;
};
