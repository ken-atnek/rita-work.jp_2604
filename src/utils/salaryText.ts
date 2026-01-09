// src/utils/salaryText.ts
import type { JobSalary } from '@/types/jobIndex';

export type SalaryBonus = {
  hasBonus: boolean;
  note?: string;
};

export type SalaryBase = {
  unitId: string; // monthly / hourly / ...
  min: number;
  max: number;
  bonus?: SalaryBonus; // 求人詳細だけ持つ想定（index側は基本なし）
};

// master未読込でも最低限表示できるフォールバック
const fallbackUnitMap: Record<string, string> = {
  monthly: '月給',
  hourly: '時給',
  yearly: '年収',
  daily: '日給',
};

export const formatYen = (value: number) =>
  new Intl.NumberFormat('ja-JP').format(value);

export const getSalaryUnitLabel = (
  unitId: string,
  salaryUnitMap?: Record<string, string>
) => {
  return salaryUnitMap?.[unitId] ?? fallbackUnitMap[unitId] ?? unitId;
};

export const buildSalaryRangeText = (min?: number, max?: number) => {
  if (typeof min === 'number' && typeof max === 'number') {
    return `${formatYen(min)}円〜${formatYen(max)}円`;
  }
  if (typeof min === 'number') {
    return `${formatYen(min)}円〜`;
  }
  if (typeof max === 'number') {
    return `〜${formatYen(max)}円`;
  }
  return '';
};

/**
 * 一覧カード向け：例）"月給 200,000円〜300,000円" / "時給 14,000円〜16,000円"
 * - hourly の bandIds は検索用（表示は min/max を使用）
 */
export const buildSalaryText = (
  salary: JobSalary | undefined,
  salaryUnitMap?: Record<string, string>
): string => {
  // 給与未設定の場合（安全ガード）
  if (!salary) {
    return '—';
  }

  const unitLabel = getSalaryUnitLabel(salary.unitId, salaryUnitMap);

  // 月給：min/max 表示
  if (salary.unitId === 'monthly') {
    const range = buildSalaryRangeText(salary.min, salary.max);
    return range ? `${unitLabel} ${range}` : unitLabel;
  }

  // 時給：min/max 表示（bandIds は検索専用）
  if (salary.unitId === 'hourly') {
    const range = buildSalaryRangeText(salary.min, salary.max);
    return range ? `${unitLabel} ${range}` : unitLabel;
  }

  // 念のためフォールバック
  return unitLabel;
};

/**
 * 詳細向け：UIで組み立てやすい“部品”を返す
 */
export const buildSalaryParts = (
  salary: SalaryBase,
  salaryUnitMap?: Record<string, string>
) => {
  const unitLabel = getSalaryUnitLabel(salary.unitId, salaryUnitMap);

  const minText = typeof salary.min === 'number' ? formatYen(salary.min) : '';
  const maxText = typeof salary.max === 'number' ? formatYen(salary.max) : '';

  const hasBonus = !!salary.bonus?.hasBonus;
  const bonusText = hasBonus ? '賞与あり' : '';
  const bonusNote =
    hasBonus && salary.bonus?.note ? ` ${salary.bonus.note}` : '';

  return { unitLabel, minText, maxText, bonusText, bonusNote };
};
