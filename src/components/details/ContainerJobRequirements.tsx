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
import styles from '@/components/facility/ContainerFacilityInfo.module.scss';

type ContainerJobRequirementsProps = {
  // ==========================
  // 求人本体データ（job_0001.json）
  // ==========================
  job: Job;

  // ==========================
  // 基本マスタ（募集職種・雇用形態）
  // ==========================
  // 雇用形態マスタ（正社員・パートなど）
  employmentTypes: { id: string; name: string }[];
  // 職種マスタ（看護師・理学療法士など）
  jobCategories: JobCategory[];

  // ==========================
  // 仕事内容まわりのマスタ
  // ==========================
  // 診療科目マスタ
  clinicalDepartments: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // 仕事内容マスタ
  jobContentOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // サービス形態マスタ
  serviceTypeOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];

  // ==========================
  // 給与・待遇・働き方系マスタ
  // ==========================
  // 待遇（福利厚生）マスタ
  benefitOptions: { id: string; name: string; sortOrder: number }[];
  // 勤務スタイルマスタ（勤務時間）
  workStyleOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // 休日条件マスタ
  holidayOptions: { id: string; label: string }[];

  // ==========================
  // 応募要件・研修・アクセス系マスタ
  // ==========================
  // 応募要件マスタ
  applicationRequirementOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // 研修・サポートマスタ
  trainingSupportOptions: { id: string; label: string }[];
  // アクセス条件マスタ
  accessOptions: { id: string; label: string }[];

  salaryUnitMap: Record<string, string>;
  hourlyBandMap: Record<string, string>;
};

export default function ContainerJobRequirements({
  job,
  employmentTypes,
  jobCategories,
  clinicalDepartments,
  jobContentOptions,
  serviceTypeOptions,
  benefitOptions,
  workStyleOptions,
  holidayOptions,
  applicationRequirementOptions,
  trainingSupportOptions,
  accessOptions,
  salaryUnitMap,
  hourlyBandMap,
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

  // 単位（例：月給 / 時給）
  const unitLabel = salaryUnitMap[salary.unitId] ?? salary.unitId;

  // 表示テキスト
  let salaryText = '';
  let bonusText = '';

  if (salary.unitId === 'monthly') {
    // monthly 型に自動で絞られる
    const minText = salary.min.toLocaleString();
    const maxText = salary.max.toLocaleString();

    salaryText = `${unitLabel}：${minText}円〜${maxText}円`;

    bonusText = salary.bonus?.hasBonus
      ? salary.bonus.note
        ? `賞与あり（${salary.bonus.note}）`
        : '賞与あり'
      : '';
  }

  if (salary.unitId === 'hourly') {
    const bandId = 'bandId' in salary ? salary.bandId : '';
    const bandLabel = bandId ? (hourlyBandMap[bandId] ?? bandId) : '';
    const min = 'min' in salary ? salary.min : undefined;
    const max = 'max' in salary ? salary.max : undefined;
    const rangeText =
      typeof min === 'number' && typeof max === 'number'
        ? `${min.toLocaleString()}円〜${max.toLocaleString()}円`
        : '';

    salaryText = `${unitLabel}：${bandLabel || rangeText}`;
    bonusText = '';
  }
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

  // 給与の備考（複数行・空行あり）
  const salaryNotes = job.salaryNotes ?? [];

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

  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // 勤務スタイル用のマスタ Map
  // ----------------------------------------
  const workStyleMap = workStyleOptions.reduce<Record<string, string>>(
    (acc: Record<string, string>, opt) => {
      acc[opt.id] = opt.name;
      return acc;
    },
    {} as Record<string, string>
  );
  const workStyleLabels =
    job.workStyle?.optionIds?.map((id) => workStyleMap[id]).filter(Boolean) ??
    [];

  const workStyleNotes = job.workStyle?.note ?? [];
  const hasWorkStyle = workStyleLabels.length > 0 || workStyleNotes.length > 0;
  // ----------------------------------------
  // --- マスタを id → label に引けるよう変換 ---
  // 診療科目マスタを「id → name」に変換
  // ----------------------------------------
  const clinicalDepartmentMap = clinicalDepartments.reduce<
    Record<string, string>
  >((acc, dep) => {
    acc[dep.id] = dep.name;
    return acc;
  }, {});

  // 求人側に設定された診療科目 ID 配列をラベル配列に変換
  const clinicalDepartmentLabels =
    job.clinicalDepartments
      ?.map((id) => clinicalDepartmentMap[id])
      .filter(Boolean) ?? [];

  // ----------------------------------------
  // --- 仕事内容マスタを id → label に引けるよう変換 ---
  // job.jobContents.optionIds からラベルを引くための Map
  // ----------------------------------------
  const jobContentMap = jobContentOptions.reduce<Record<string, string>>(
    (acc, opt) => {
      acc[opt.id] = opt.name;
      return acc;
    },
    {}
  );

  const jobContentLabels =
    job.jobContents?.optionIds
      ?.map((id) => jobContentMap[id])
      .filter(Boolean) ?? [];

  const jobContentNotes = job.jobContents?.note ?? [];

  const hasJobContents =
    jobContentLabels.length > 0 || jobContentNotes.length > 0;

  // ----------------------------------------
  // --- サービス形態マスタを id → label に引けるよう変換 ---
  // job.serviceTypes.optionIds からラベルを引くための Map
  // ----------------------------------------
  const serviceTypeMap = serviceTypeOptions.reduce<Record<string, string>>(
    (acc, opt) => {
      acc[opt.id] = opt.name;
      return acc;
    },
    {}
  );

  const serviceTypeLabels =
    job.serviceTypes?.optionIds
      ?.map((id) => serviceTypeMap[id])
      .filter(Boolean) ?? [];

  const hasServiceTypes = serviceTypeLabels.length > 0;

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
              <p className={styles.itemLarge}>{jobName}</p>
            </dd>
          </dl>

          {/* 雇用形態 */}
          <dl>
            <dt>雇用形態</dt>
            <dd>
              <p className={styles.itemLarge}>{typeName}</p>
            </dd>
          </dl>
          {/* 仕事内容 */}
          {hasJobContents && (
            <dl>
              <dt>仕事内容</dt>
              <dd>
                {jobContentLabels.length > 0 && (
                  <ul className={styles.jobContentList}>
                    {jobContentLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}

                {jobContentNotes.length > 0 && (
                  <div className={styles.note}>
                    {jobContentNotes.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
                  </div>
                )}
              </dd>
            </dl>
          )}
          {/* 診療科目 */}
          {clinicalDepartmentLabels.length > 0 && (
            <dl>
              <dt>診療科目</dt>
              <dd>
                <ul className={styles.clinicalDepartmentList}>
                  {clinicalDepartmentLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          )}
          {/* サービス形態 */}
          {hasServiceTypes && (
            <dl>
              <dt>サービス形態</dt>
              <dd>
                {serviceTypeLabels.length > 0 && (
                  <ul className={styles.serviceTypeList}>
                    {serviceTypeLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}
              </dd>
            </dl>
          )}
          {/* 給与・賞与 */}
          <dl>
            <dt>給与</dt>
            <dd>
              <p className={styles.salaryText}>
                {salaryText} {bonusText && <span>{bonusText}</span>}
              </p>
            </dd>
          </dl>
          {/* 給与備考（独立項目・複数行対応） */}
          {salaryNotes.length > 0 && (
            <dl>
              <dt>給与の備考</dt>
              <dd>
                {salaryNotes.map((line, index) => (
                  <p className={styles.salaryNotes} key={index}>
                    {line}
                  </p>
                ))}
              </dd>
            </dl>
          )}

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
                {job.benefits?.note && (
                  <div className={styles.note}>
                    {job.benefits.note.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
                  </div>
                )}
              </dd>
            </dl>
          )}
          {/* 勤務スタイル */}
          {hasWorkStyle && (
            <dl>
              <dt>勤務時間</dt>
              <dd>
                {workStyleLabels.length > 0 && (
                  <ul className={styles.workStyleList}>
                    {workStyleLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}

                {workStyleNotes.length > 0 && (
                  <div className={styles.note}>
                    {workStyleNotes.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
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
                    {holidayConditionNotes.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
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
                {job.longHolidays.map((line, index) =>
                  line.trim() === '' ? (
                    <p key={index} className={styles.emptyLine}></p>
                  ) : (
                    <p key={index}>{line}</p>
                  )
                )}
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
                    {applicationRequirementNotes.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
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
                  {welcomeRequirements.map((line, index) =>
                    line.trim() === '' ? (
                      <p key={index} className={styles.emptyLine}></p>
                    ) : (
                      <p key={index}>{line}</p>
                    )
                  )}
                </div>
              </dd>
            </dl>
          )}

          {/* 研修・サポート */}
          {hasTrainingSupport && (
            <dl>
              <dt>教育体制・研修</dt>
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
                    {trainingSupportNotes.map((line, index) =>
                      line.trim() === '' ? (
                        <p key={index} className={styles.emptyLine}></p>
                      ) : (
                        <p key={index}>{line}</p>
                      )
                    )}
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
                  {selectionProcess.map((line, index) =>
                    line.trim() === '' ? (
                      <p key={index} className={styles.emptyLine}></p>
                    ) : (
                      <p key={index}>{line}</p>
                    )
                  )}
                </div>
              </dd>
            </dl>
          )}
        </div>
      </article>
    </section>
  );
}
