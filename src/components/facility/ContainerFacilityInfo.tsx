/* =======================================
 * リタワーク 求人詳細ページ｜事業者情報
 * URL: src/components/facility/ContainerFacilityInfo.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-29
 * Last updated: 2025-12-03
 * ======================================= */

// 事業所情報セクション（法人・事業所・アクセス・スタッフ構成など）を表示するコンポーネント

'use client';

import styles from './ContainerFacilityInfo.module.scss';
import type { Job } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import ExternalLink from '@/components/common/ExternalLink';
import type { JobCategory } from '@/types/jobCategory';

// === 事業所情報セクションに渡ってくるデータ群 ===
// job            : 求人本体データ（現在は未使用・将来拡張用）
// facility       : 事業所（施設）ごとの基本情報
// corporation    : 法人情報（法人名など）
// employmentTypes: 雇用形態マスタ（正社員・パートなど）
// jobCategories  : 職種マスタ（看護師・理学療法士など）
// facilityTypes  : 事業所形態マスタ（病院・診療所・訪問看護ステーションなど）
type ContainerFacilityInfoProps = {
  // 求人本体データ（現在このコンポーネント内では未使用）
  job?: Job;
  // 事業所（施設）の詳細情報
  facility: Facility;
  // 法人情報（法人名など）
  corporation: Corporation;
  // 雇用形態マスタ（id → 表示名）
  employmentTypes: { id: string; name: string }[];
  // 職種マスタ（id → 表示名）
  jobCategories: JobCategory[];
  // 事業所形態マスタ（id → 表示ラベル）
  facilityTypes: { id: string; label: string }[];
};

export function ContainerFacilityInfo({
  facility,
  corporation,
  employmentTypes,
  jobCategories,
  facilityTypes,
}: ContainerFacilityInfoProps) {
  // 「YYYY-MM」の文字列を「YYYY年M月」の表示用テキストに変換
  const formatEstablishedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}年${Number(month)}月`;
  };
  // 雇用形態マスタを id → name に変換して、後続で参照しやすくする
  const employmentTypeMap = (employmentTypes ?? []).reduce<
    Record<string, string>
  >((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {});

  // 職種マスタを id → name に変換
  const jobCategoryMap = (jobCategories ?? []).reduce<Record<string, string>>(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {}
  );

  // 事業所形態マスタを id → label に変換
  const facilityTypeMap = (facilityTypes ?? []).reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.id] = item.label;
      return acc;
    },
    {}
  );

  // 施設の facilityTypeId からラベルを取得（マスタに無ければ id をそのまま表示）
  const facilityTypeLabel =
    facilityTypeMap[facility.facilityTypeId] ?? facility.facilityTypeId;
  // ==========================
  // 画面表示（dlの順番はデザイン通りに固定）
  // ==========================
  return (
    <section className={styles.containerFacilityInfo}>
      <article>
        <h2 className={styles.title}>事業所情報</h2>
        <div className={styles.boxDl}>
          {/* === 基本情報（法人・事業所） === */}
          {corporation?.name && (
            <dl>
              <dt>法人名</dt>
              <dd>
                <p>{corporation.name}</p>
              </dd>
            </dl>
          )}
          <dl>
            <dt>事業所名</dt>
            <dd>
              <p>{facility.name}</p>
            </dd>
          </dl>

          <dl>
            <dt>アクセス</dt>
            <dd>
              〒{facility.postalCode}
              <br />
              {facility.prefecture}
              {facility.city}
              {facility.addressLine}
              {/* 地図（mapUrl がある場合のみ表示） */}
              {facility.mapUrl && (
                <div className={styles.wrapMap}>
                  <iframe
                    src={facility.mapUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  {/* GoogleMap リンク */}
                  {facility.mapLinkUrl && (
                    <ExternalLink
                      href={facility.mapLinkUrl}
                      className={styles.mapUrlLink}
                    >
                      <span>Googleマップ</span>
                    </ExternalLink>
                  )}
                </div>
              )}
            </dd>
          </dl>
          {/* === 事業所の基本データ === */}
          {facility.establishedDate && (
            <dl>
              <dt>設立年月</dt>
              <dd>
                <p>{formatEstablishedDate(facility.establishedDate)}</p>
              </dd>
            </dl>
          )}
          {/* === 募集関連（この事業所で募集している職種） === */}
          {facility.recruitJobs && facility.recruitJobs.length > 0 && (
            <dl>
              <dt>募集職種</dt>
              <dd>
                <ul className={styles.listRecruitJobs}>
                  {facility.recruitJobs.map((item, index) => {
                    const jobName =
                      jobCategoryMap[item.jobCategoryId] ?? item.jobCategoryId;
                    const typeName =
                      employmentTypeMap[item.employmentTypeId] ?? '';

                    return (
                      <li
                        key={`${item.jobCategoryId}-${item.employmentTypeId}-${index}`}
                      >
                        {typeName ? `${jobName}（${typeName}）` : jobName}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </dl>
          )}
          {/* === 事業所の属性情報 === */}
          <dl>
            <dt>事業所形態</dt>
            <dd>{facilityTypeLabel}</dd>
          </dl>

          {/* 施設規模：病床数などの規模感 */}
          {facility.facilityScale && facility.facilityScale.length > 0 && (
            <dl>
              <dt>施設規模</dt>
              <dd>
                {facility.facilityScale.map((line, i) =>
                  line.trim() === '' ? (
                    <p key={i} className={styles.emptyLine}></p>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </dd>
            </dl>
          )}
          {/* 救急指定：true の場合のみ表示 */}
          {facility.isEmergencyDesignated && (
            <dl>
              <dt>救急指定</dt>
              <dd>救急指定あり</dd>
            </dl>
          )}
          {/* === 営業・運営情報 === */}
          {facility.businessHours && facility.businessHours.length > 0 && (
            <dl>
              <dt>営業時間</dt>
              <dd>
                {facility.businessHours.map((line, i) =>
                  line.trim() === '' ? (
                    <p key={i} className={styles.emptyLine}></p>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </dd>
            </dl>
          )}
          {/* 休業日：テキストエリア入力をそのまま行単位で表示 */}
          {facility.holidays && facility.holidays.length > 0 && (
            <dl>
              <dt>休業日</dt>
              <dd>
                {facility.holidays.map((line, i) =>
                  line.trim() === '' ? (
                    <p key={i} className={styles.emptyLine}></p>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </dd>
            </dl>
          )}
          {/* 平均患者数：外来・入院などの目安を改行付きで表示 */}
          {facility.averagePatients && facility.averagePatients.length > 0 && (
            <dl>
              <dt>平均患者数</dt>
              <dd>
                {facility.averagePatients.map((line, i) =>
                  line.trim() === '' ? (
                    <p key={i} className={styles.emptyLine}></p>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </dd>
            </dl>
          )}
          {/* === スタッフ・サービス情報 === */}
          {/* スタッフ構成：職種や人数構成など */}
          {facility.staffComposition &&
            facility.staffComposition.length > 0 && (
              <dl>
                <dt>スタッフ構成</dt>
                <dd>
                  {facility.staffComposition.map((line, i) =>
                    line.trim() === '' ? (
                      <p key={i} className={styles.emptyLine}></p>
                    ) : (
                      <p key={i}>{line}</p>
                    )
                  )}
                </dd>
              </dl>
            )}
          {/* 訪問エリア：訪問看護ステーション等のときのみ表示 */}
          {facility.typeSpecific?.visitArea && (
            <dl>
              <dt>訪問エリア</dt>
              <dd>{facility.typeSpecific.visitArea}</dd>
            </dl>
          )}
        </div>
      </article>
    </section>
  );
}
