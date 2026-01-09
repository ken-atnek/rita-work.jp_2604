/* =======================================
 * リタワーク 求人検索クエリユーティリティ
 * - /jobs への遷移（トップ）と /jobs 内の検索反映で共通利用
 * - URLパラメータ: jc / ar / et / st / sy / sh
 * Created: 2026-01-09
 * ======================================= */

export type SalaryTab = 'yearly' | 'hourly';

export type JobsSearchPayload = {
  jobCategoryIds: string[];
  areaIds: string[];
  employmentTypeIds: string[];
  salaryTab: SalaryTab;
  salaryYearlyIds: string[];
  salaryHourlyIds: string[];
};

/**
 * CSVエンコード（空なら undefined）
 * 例: ['pt','nurse'] => 'pt,nurse'
 */
export const encodeCsv = (arr: string[]): string | undefined => {
  if (arr.length === 0) return undefined;
  return arr.join(',');
};

/**
 * CSVデコード（空なら []）
 * 例: 'pt,nurse' => ['pt','nurse']
 */
export const decodeCsv = (v: string | undefined | null): string[] => {
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * payload から /jobs 用のクエリ文字列を生成する（先頭の ? は付けない）
 * - 給与は排他（yearlyなら sy のみ、hourlyなら sh のみ）
 * - st は常に付与（/jobs 側の初期タブ復元に使う）
 */
export const buildJobsSearchQuery = (payload: JobsSearchPayload): string => {
  const params = new URLSearchParams();

  const jc = encodeCsv(payload.jobCategoryIds);
  if (jc) params.set('jc', jc);

  const ar = encodeCsv(payload.areaIds);
  if (ar) params.set('ar', ar);

  const et = encodeCsv(payload.employmentTypeIds);
  if (et) params.set('et', et);

  // 給与タブ（年収/時給）
  params.set('st', payload.salaryTab);

  if (payload.salaryTab === 'yearly') {
    const sy = encodeCsv(payload.salaryYearlyIds);
    if (sy) params.set('sy', sy);
    params.delete('sh'); // 排他
  } else {
    const sh = encodeCsv(payload.salaryHourlyIds);
    if (sh) params.set('sh', sh);
    params.delete('sy'); // 排他
  }

  return params.toString();
};

/**
 * /jobs の SearchParams から initial 値を復元する
 * - next/navigation の useSearchParams() の値で使う想定
 */
export const getInitialJobsSearchFromSearchParams = (sp: {
  get: (key: string) => string | null;
}): JobsSearchPayload => {
  const jcParam = sp.get('jc') ?? '';
  const arParam = sp.get('ar') ?? '';
  const etParam = sp.get('et') ?? '';
  const stParam = sp.get('st') ?? 'yearly';
  const syParam = sp.get('sy') ?? '';
  const shParam = sp.get('sh') ?? '';

  const salaryTab: SalaryTab = stParam === 'hourly' ? 'hourly' : 'yearly';

  return {
    jobCategoryIds: decodeCsv(jcParam),
    areaIds: decodeCsv(arParam),
    employmentTypeIds: decodeCsv(etParam),
    salaryTab,
    salaryYearlyIds: decodeCsv(syParam),
    salaryHourlyIds: decodeCsv(shParam),
  };
};
