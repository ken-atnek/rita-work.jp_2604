// src/types/jobIndex.ts

// 月給：min/max を持つ
export type SalaryMonthly = {
  unitId: 'monthly';
  min: number;
  max: number;
};

// 時給：bandId を持つ（min/max は持たない）
export type SalaryHourly = {
  unitId: 'hourly';
  bandId: string;
};

export type JobSalary = SalaryMonthly | SalaryHourly;

export type JobIndexItem = {
  jobId: string;

  // jobsIndexAll.json にあるので入れておく（Facility内indexでも使える）
  facilityId?: string;

  title: string;
  isNew: boolean;

  facilityName: string;
  employmentTypeId: string;
  jobCategoryId: string;

  heroImages: string[];

  salary: JobSalary;

  workLocationText: string;

  // jobsIndexAll.json にあるので入れておく（並び替え用）
  updatedAt?: string;
};

export type JobIndex = {
  facilityId?: string; // 全件indexでも使えるよう optional
  items: JobIndexItem[];
};
