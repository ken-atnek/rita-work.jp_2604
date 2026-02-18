/* =======================================
 * マスターJSON共通型定義
 * URL: src/types/master.ts
 * Created: 2026-02-18
 * ======================================= */

/** 給与単位マスター (salaryUnits.json) */
export type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

/** 時給バンドマスター (salaryBandsHourly.json) */
export type SalaryBandHourlyMaster = {
  id: string;
  label?: string;
  name?: string;
};

/** 契約プランマスター (contractPlans.json) */
export type ContractPlanMaster = {
  id: string;
  label?: string;
  name?: string;
};

/** 雇用形態マスター (employmentTypes.json) */
export type EmploymentTypeMaster = {
  id: string;
  name: string;
};

/** 施設種別マスター (facilityTypes.json) */
export type FacilityTypeMaster = {
  id: string;
  label: string;
};

/** 職種マスター (jobCategories.json) */
export type JobCategoryMaster = {
  id: string;
  name?: string;
  label?: string;
};

/** 求人共通設定 (config/job_common.json) */
export type JobCommonConfig = {
  newIconPeriodDays?: number;
};
