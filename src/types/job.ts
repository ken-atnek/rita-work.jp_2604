/* =======================================
 * リタワーク 型定義（求人）
 * File: src/types/job.ts
 * ======================================= */

/* ---------------------------------------
 * 掲載期間
 * -------------------------------------- */
export type PublishedPeriod = {
  start: string;
  end: string | null; // 掲載中の場合は null
};

/* ---------------------------------------
 * 表示ステータス
 * -------------------------------------- */
export type JobStatus = 'public' | 'draft' | 'private';

/* ---------------------------------------
 * 職場環境データ
 * -------------------------------------- */
export type WorkEnvironmentStat = {
  metricId: string;
  value: number;
};

/* ---------------------------------------
 * フリースペース（任意テキスト）
 * -------------------------------------- */
export type FreeText = {
  enabled: boolean;
  path: string;
};

export type FreeSpaceSection = {
  heading: string;
  body: string[]; // 改行対応（空文字で空行OK）
};

export type FreeSpaceContent = {
  title: string;
  sections: FreeSpaceSection[];
};

/* ---------------------------------------
 * 福利厚生詳細（リッチコンテンツ）
 * -------------------------------------- */
export type BenefitsDetailSection = {
  id: string;
  title: string;
  body: string[];
  image: string;
};

export type BenefitsDetailContent = {
  sections: BenefitsDetailSection[];
};

/* ---------------------------------------
 * インタビュー
 * -------------------------------------- */
export type InterviewArticleSection = {
  heading: string;
  body: string[];
};

export type InterviewArticle = {
  id: number;
  title: string;
  image: string | null;
  sections: InterviewArticleSection[];
};

export type InterviewContent = {
  interviewee: {
    name: string;
    role: string;
  };
  articles: InterviewArticle[];
};

/* ---------------------------------------
 * 外部JSON参照（動画・インタビュー等）
 * -------------------------------------- */
export type JobVideosRef = {
  enabled: boolean;
  path: string;
};

export type Interview = {
  enabled: boolean;
  path: string;
};

export type BenefitsDetailRef = {
  enabled: boolean;
  path: string;
};

export type PremiumContent = {
  enabled: boolean;
  path: string;
};

/* ---------------------------------------
 * 1日の流れ（勤務スケジュール）
 * -------------------------------------- */
export type DailyScheduleItem = {
  time: string;
  body: string[];
};

export type DailySchedule = {
  dayShift: DailyScheduleItem[];
  nightShift: DailyScheduleItem[];
};

/* ---------------------------------------
 * 給与型
 * -------------------------------------- */
type SalaryMonthly = {
  unitId: 'monthly';
  min: number;
  max: number;
  bonus?: {
    hasBonus: boolean;
    note?: string;
  };
};

type SalaryHourly = {
  unitId: 'hourly';
  bandId: string;
};

export type JobSalary = SalaryMonthly | SalaryHourly;

/* =======================================
 * 求人本体
 * ======================================= */
export type Job = {
  /* -----------------------------------
   * 識別情報
   * ---------------------------------- */
  id: string;
  facilityId: string;

  /* -----------------------------------
   * 掲載情報
   * ---------------------------------- */
  publishedPeriod: PublishedPeriod;
  status: JobStatus;

  /* -----------------------------------
   * マスター参照
   * ---------------------------------- */
  jobCategoryId: string;
  employmentTypeId: string;

  /* -----------------------------------
   * 基本表示情報
   * ---------------------------------- */
  title: string;
  heroImages: string[];

  /* -----------------------------------
   * 年収・給与
   * ---------------------------------- */
  firstYearIncomeRangeId: string;
  salary: JobSalary;
  salaryNotes?: string[]; // 改行対応

  /* -----------------------------------
   * 診療科目
   * ---------------------------------- */
  clinicalDepartments?: string[];

  /* -----------------------------------
   * 仕事内容・サービス形態
   * ---------------------------------- */
  jobContents?: {
    optionIds: string[];
    note?: string[];
  };

  serviceTypes?: {
    optionIds: string[];
  };

  /* -----------------------------------
   * 職場環境データ
   * ---------------------------------- */
  workEnvironmentStats: WorkEnvironmentStat[];

  /* -----------------------------------
   * 任意コンテンツ参照
   * ---------------------------------- */
  jobVideos?: JobVideosRef;
  interview?: Interview;
  freeText: FreeText;
  benefitsDetailRef?: BenefitsDetailRef;
  premium?: PremiumContent;

  /* -----------------------------------
   * 勤務スケジュール
   * ---------------------------------- */
  dailySchedule: DailySchedule;

  /* -----------------------------------
   * 待遇・応募条件
   * ---------------------------------- */
  benefits?: {
    optionIds: string[];
    note?: string[];
  };

  applicationRequirements?: {
    optionIds: string[];
    note?: string[];
  };

  workStyle?: {
    optionIds: string[];
    note?: string[];
  };

  holidayConditions?: {
    optionIds: string[];
    note?: string[];
  };

  longHolidays?: string[];
  welcomeRequirements?: string[];

  /* -----------------------------------
   * 研修・サポート
   * ---------------------------------- */
  trainingSupport?: {
    options: string[];
    note?: string[];
  };

  /* -----------------------------------
   * アクセス
   * ---------------------------------- */
  access?: {
    options: string[];
  };

  /* -----------------------------------
   * 選考・契約
   * ---------------------------------- */
  selectionProcess?: string[];
  contractPlanId: string;
};
