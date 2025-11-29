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

  // 掲載期間
  publishedPeriod: PublishedPeriod;

  // マスター参照用
  jobCategoryId: string;
  employmentTypeId: string;

  // 表示用
  title: string;
  heroImages: string[];

  // 初年度年収レンジ（job_0001.json にあるやつ）
  firstYearIncomeRangeId: string;

  // 給与
  salary: {
    unitId: 'monthly' | 'hourly';
    min: number;
    max: number;
    bonus: {
      hasBonus: boolean;
      note: string;
    };
  };

  // 業務環境統計
  workEnvironmentStats: WorkEnvironmentStat[];

  // インタビュー、フリースペース、プレミアム
  interview: Interview;
  freeText: FreeText;
  premium: PremiumContent;

  // 日勤・夜勤のスケジュール
  dailySchedule: DailySchedule;

  // 契約プラン (light / standard / premium など)
  contractPlanId: string;
};
