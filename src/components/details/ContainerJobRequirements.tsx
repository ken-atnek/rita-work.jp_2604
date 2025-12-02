/* =======================================
 * リタワーク 求人詳細ページ｜募集要項
 * Component: ContainerJobRequirements
 * URL: src/components/details/ContainerJobRequirements.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-30
 * Last updated: 2025-11-30
 * ======================================= */

// 募集要項コンテンツ全体を司るコンポーネント

// === 画面に渡される全マスタ + 求人データ ===
import type { Job } from '@/types/job';
import type { JobCategory } from '@/types/jobCategory';
import styles from './ContainerFacilityInfo.module.scss';

type ContainerJobRequirementsProps = {
  // 求人本体データ（job_0001.json）
  job: Job;
  // 雇用形態マスタ（正社員・パートなど）
  employmentTypes: { id: string; name: string }[];
  // 職種マスタ（看護師・理学療法士など）
  jobCategories: JobCategory[];
  // 待遇（福利厚生）マスタ
  benefitOptions: { id: string; name: string; sortOrder: number }[];
  // 研修・サポートマスタ
  trainingSupportOptions: { id: string; label: string }[];
  // アクセス条件マスタ
  accessOptions: { id: string; label: string }[];
  // 応募要件マスタ
  applicationRequirementOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // 休日条件マスタ
  holidayOptions: { id: string; label: string }[];
};

export default function ContainerJobRequirements({
  job,
  employmentTypes,
  jobCategories,
  benefitOptions,
  trainingSupportOptions,
  accessOptions,
  applicationRequirementOptions,
  holidayOptions,
}: ContainerJobRequirementsProps) {
  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
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
  // --- マスタを id → label に引けるよう変換 ---
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
  // --- 給与の表示文言を整形（3桁区切り・賞与表記） ---
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
  // --- マスタを id → label に引けるよう変換 ---
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

  // 歓迎要件（そのまま配列で使う）
  const welcomeRequirements = job.welcomeRequirements ?? [];

  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // 研修・サポート用のマスタ Map
  // ----------------------------------------
  const trainingSupportMap = trainingSupportOptions.reduce<
    Record<string, string>
  >((acc, opt) => {
    acc[opt.id] = opt.label;
    return acc;
  }, {});

  const trainingSupportLabels =
    job.trainingSupport?.options
      ?.map((id) => trainingSupportMap[id])
      .filter(Boolean) ?? [];

  const trainingSupportNotes = job.trainingSupport?.note ?? [];

  const hasTrainingSupport =
    trainingSupportLabels.length > 0 || trainingSupportNotes.length > 0;

  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // アクセス条件用のマスタ Map
  // ----------------------------------------
  const accessMap = accessOptions.reduce<Record<string, string>>((acc, opt) => {
    acc[opt.id] = opt.label;
    return acc;
  }, {});

  const accessLabels =
    job.access?.options?.map((id) => accessMap[id]).filter(Boolean) ?? [];

  // 選考プロセス（そのまま配列で使う）
  const selectionProcess = job.selectionProcess ?? [];

  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // 応募要件マスタを「id → name」に変換
  // ----------------------------------------
  const applicationRequirementMap = applicationRequirementOptions.reduce<
    Record<string, string>
  >((acc, opt) => {
    acc[opt.id] = opt.name;
    return acc;
  }, {});

  // 求人側の応募要件（ID配列）→ ラベル配列に変換
  const applicationRequirementLabels =
    job.applicationRequirements?.optionIds
      ?.map((id) => applicationRequirementMap[id])
      .filter(Boolean) ?? [];

  const applicationRequirementNotes = job.applicationRequirements?.note ?? [];

  const hasApplicationRequirements =
    applicationRequirementLabels.length > 0 ||
    applicationRequirementNotes.length > 0;

  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // 休日条件用のマスタ Map
  // ----------------------------------------
  const holidayMap = holidayOptions.reduce<Record<string, string>>(
    (acc, opt) => {
      acc[opt.id] = opt.label;
      return acc;
    },
    {}
  );

  const holidayConditionLabels =
    job.holidayConditions?.optionIds
      ?.map((id) => holidayMap[id])
      .filter(Boolean) ?? [];

  const holidayConditionNotes = job.holidayConditions?.note ?? [];

  const hasHolidayConditions =
    holidayConditionLabels.length > 0 || holidayConditionNotes.length > 0;

  // ==============================
  // 表示ブロック（<dl> の並び）
  // ==============================
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
          {/* 休日・シフト */}
          {hasHolidayConditions && (
            <dl>
              <dt>休日</dt>
              <dd>
                {holidayConditionLabels.length > 0 && (
                  <ul className={styles.holidayConditionList}>
                    {holidayConditionLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}

                {holidayConditionNotes.length > 0 && (
                  <div className={styles.note}>
                    {holidayConditionNotes.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </dd>
            </dl>
          )}
          {/* 長期休暇・特別休暇 */}
          {job.longHolidays && job.longHolidays.length > 0 && (
            <dl>
              <dt>長期休暇・特別休暇</dt>
              <dd>
                {job.longHolidays.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </dd>
            </dl>
          )}
          {/* 応募要件 */}
          {hasApplicationRequirements && (
            <dl>
              <dt>応募要件</dt>
              <dd>
                {applicationRequirementLabels.length > 0 && (
                  <ul className={styles.applicationRequirementList}>
                    {applicationRequirementLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}

                {applicationRequirementNotes.length > 0 && (
                  <div className={styles.note}>
                    {applicationRequirementNotes.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </dd>
            </dl>
          )}
          {/* 歓迎要件 */}
          {welcomeRequirements.length > 0 && (
            <dl>
              <dt>歓迎要件</dt>
              <dd>
                <div className={styles.welcomeList}>
                  {welcomeRequirements.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </dd>
            </dl>
          )}

          {/* 研修・サポート */}
          {hasTrainingSupport && (
            <dl>
              <dt>研修・サポート</dt>
              <dd>
                {trainingSupportLabels.length > 0 && (
                  <ul className={styles.trainingSupportList}>
                    {trainingSupportLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}
                {trainingSupportNotes.length > 0 && (
                  <div className={styles.note}>
                    {trainingSupportNotes.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </dd>
            </dl>
          )}

          {/* アクセス */}
          {accessLabels.length > 0 && (
            <dl>
              <dt>アクセス</dt>
              <dd>
                <ul className={styles.accessList}>
                  {accessLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          )}

          {/* 選考プロセス */}
          {selectionProcess.length > 0 && (
            <dl>
              <dt>選考プロセス</dt>
              <dd>
                <div className={styles.selectionProcessList}>
                  {selectionProcess.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </dd>
            </dl>
          )}
        </div>
      </article>
    </section>
  );
}
