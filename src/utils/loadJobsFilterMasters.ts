import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';

import type { AreasMaster, AreaGroup } from '@/types/area';

export type IdLabelOption = { id: string; label: string };

type EmploymentTypeMaster = { id: string; name: string };
type JobCategoryMaster = { id: string; name?: string; label?: string };

export type JobsFilterMasters = {
  jobCategoryOptions: IdLabelOption[];
  employmentTypeOptions: IdLabelOption[];
  areasMaster: AreasMaster;
  salaryYearlyOptions: IdLabelOption[];
  salaryHourlyOptions: IdLabelOption[];
};

export const loadJobsFilterMasters = async (): Promise<JobsFilterMasters> => {
  // 雇用形態
  const employmentTypes = await fetchJson<EmploymentTypeMaster[]>(
    withBasePath('/db/master/employmentTypes.json'),
    []
  );
  const employmentTypeOptions = employmentTypes.map((t) => ({
    id: t.id,
    label: t.name,
  }));

  // 職種
  const categories = await fetchJson<JobCategoryMaster[]>(
    withBasePath('/db/master/jobCategories.json'),
    []
  );
  const jobCategoryOptions = categories.map((c) => ({
    id: c.id,
    label: c.name ?? c.label ?? c.id,
  }));

  // エリア（groups構造）
  const areasJson = await fetchJson<{ groups: AreaGroup[] }>(
    withBasePath('/db/master/areas.json'),
    { groups: [] }
  );
  const areasMaster: AreasMaster = areasJson;

  // 年収レンジ（検索用）
  const firstYearIncomeRanges = await fetchJson<
    Array<{ id: string; label: string }>
  >(withBasePath('/db/master/firstYearIncomeRanges.json'), []);
  const salaryYearlyOptions = firstYearIncomeRanges.map((r) => ({
    id: r.id,
    label: r.label,
  }));

  // 時給バンド（検索用）
  const salaryBandsHourly = await fetchJson<
    Array<{ id: string; label: string }>
  >(withBasePath('/db/master/salaryBandsHourly.json'), []);
  const salaryHourlyOptions = salaryBandsHourly.map((r) => ({
    id: r.id,
    label: r.label,
  }));

  return {
    jobCategoryOptions,
    employmentTypeOptions,
    areasMaster,
    salaryYearlyOptions,
    salaryHourlyOptions,
  };
};
