/* =======================================
 * リタワーク 求人詳細ページ｜募集要項
 * Component: ContainerJobRequirements
 * URL: src/components/details/ContainerJobRequirements.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-30
 * Last updated: 2025-11-30
 * ======================================= */

import type { Job } from '@/types/job';
import type { JobCategory } from '@/types/jobCategory';
import styles from './ContainerFacilityInfo.module.scss';

type ContainerJobRequirementsProps = {
  // 対象となる求人データ（job_0001.json など）
  job: Job;
  // 雇用形態マスタ（employmentTypes.json）を画面側に渡したもの
  employmentTypes: { id: string; name: string }[];
  // 職種マスタ（jobCategories.json）を画面側に渡したもの
  jobCategories: JobCategory[];
  // 待遇マスタ（benefitOptions.json）を画面側に渡したもの
  benefitOptions: { id: string; name: string; sortOrder: number }[];
};

export default function ContainerJobRequirements({
  job,
  employmentTypes,
  jobCategories,
  benefitOptions,
}: ContainerJobRequirementsProps) {
  // ----------------------------------------
  // 雇用形態マスタを「id → name」の形で参照しやすくした Map
  // 例: { fulltime: "正社員", part: "パート・アルバイト", ... }
  // ----------------------------------------
  const employmentTypeMap = (employmentTypes ?? []).reduce<
    Record<string, string>
  >((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {});

  // ----------------------------------------
  // 職種マスタを「id → name」の形で参照しやすくした Map
  // 例: { pt: "理学療法士", nurse: "看護師", ... }
  // ----------------------------------------
  const jobCategoryMap = (jobCategories ?? []).reduce<Record<string, string>>(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {}
  );

  // 募集職種名（マスタにあれば日本語名、なければ id をそのまま表示）
  const jobName = jobCategoryMap[job.jobCategoryId] ?? job.jobCategoryId;

  // 雇用形態名（マスタにあれば日本語名、なければ空文字）
  const typeName = employmentTypeMap[job.employmentTypeId] ?? '';

  // ----------------------------------------
  // 給与の表示用文言を組み立て
  // - unitId: 'monthly' | 'hourly'（現状は月給のみ想定）
  // - min / max は数値 → 3桁区切りに整形
  // ----------------------------------------
  const salary = job.salary;
  const unitText = salary.unitId === 'monthly' ? '月給' : '';
  const salaryMinText = salary.min.toLocaleString();
  const salaryMaxText = salary.max.toLocaleString();
  const salaryText = `${unitText}：${salaryMinText}円〜${salaryMaxText}円`;

  // 賞与欄の文言
  // hasBonus が true のときだけ表示し、
  // note があれば「賞与あり（note）」、なければ「賞与あり」
  const bonusText = salary.bonus?.hasBonus
    ? salary.bonus.note
      ? `賞与あり（${salary.bonus.note}）`
      : '賞与あり'
    : '';

  // ----------------------------------------
  // 待遇マスタを「id → name」に変換
  // job.benefits.optionIds からラベルを引くために使う
  // ----------------------------------------
  const benefitMap = benefitOptions.reduce<Record<string, string>>(
    (acc, opt) => {
      acc[opt.id] = opt.name;
      return acc;
    },
    {}
  );

  // 求人側に設定された待遇 ID 配列をラベル配列に変換
  // 例: ["dormitory", "commuting_allowance"] → ["寮あり・社宅あり", "交通費支給"]
  const selectedBenefits =
    job.benefits?.optionIds.map((id) => benefitMap[id]).filter(Boolean) ?? [];

  return (
    <section className={styles.containerJobRequirements}>
      <article>
        <h2>募集要項</h2>
        <div className={styles.boxDl}>
          {/* 募集職種 */}
          <dl>
            <dt>募集職種</dt>
            <dd>
              <p>{jobName}</p>
            </dd>
          </dl>

          {/* 雇用形態 */}
          <dl>
            <dt>雇用形態</dt>
            <dd>
              <p>{typeName}</p>
            </dd>
          </dl>

          {/* 給与・賞与 */}
          <dl>
            <dt>給与</dt>
            <dd>
              <p>
                {salaryText} {bonusText && <span>{bonusText}</span>}
              </p>
            </dd>
          </dl>

          {/* 待遇（福利厚生） */}
          {selectedBenefits.length > 0 && (
            <dl>
              <dt>待遇</dt>
              <dd>
                <ul className={styles.benefitsList}>
                  {selectedBenefits.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>

                {/* 待遇の補足テキスト（任意） */}
                {job.benefits?.note && job.benefits.note.length > 0 && (
                  <div className={styles.note}>
                    {job.benefits.note.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </dd>
            </dl>
          )}
        </div>
      </article>
    </section>
  );
}
