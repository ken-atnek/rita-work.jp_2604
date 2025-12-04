/* =======================================
 * リタワーク 詳細ページ（UI専用）
 * Component: JobDetailContent
 * URL: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-12-04
 * ======================================= */

import type { Job, FreeSpaceContent } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import type { JobCategory } from '@/types/jobCategory';

import ContainerJobHero from './ContainerJobHero';
import ContainerWorkEnvironmentStats from '@/components/details/ContainerWorkEnvironmentStats';
import ContainerFreeSpace from '@/components/details/ContainerFreeSpace';
import ContainerJobVideos from '@/components/details/ContainerJobVideos';
import ContainerDailySchedule from '@/components/details/ContainerDailySchedule';
import ContainerJobRequirements from '@/components/details/ContainerJobRequirements';
import ContainerFacilityInfo from '@/components/details/ContainerFacilityInfo';

type JobDetailContentProps = {
  job: Job;
  facility: Facility;
  corporation: Corporation;
  newIconPeriodDays: number;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
  benefitOptions: { id: string; name: string; sortOrder: number }[];
  facilityTypes: { id: string; label: string }[];
  trainingSupportOptions: { id: string; label: string }[];
  accessOptions: { id: string; label: string }[];
  applicationRequirementOptions: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  holidayOptions: { id: string; label: string }[];
  workStyleOptions: { id: string; name: string; sortOrder: number }[];
  clinicalDepartments: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
  // 仕事内容マスタを追加
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
  jobVideos: {
    id: string;
    url: string;
    title: string;
  }[];
  freeSpace: FreeSpaceContent | null;
};

export function JobDetailContent({
  // === 求人本体（ヘッダー用） ===
  job,
  facility,
  corporation,
  newIconPeriodDays,

  // === マスタ（職種・雇用形態） ===
  employmentTypes,
  jobCategories,

  // === 募集要項（JobRequirements専用マスタ） ===
  benefitOptions,
  trainingSupportOptions,
  accessOptions,
  applicationRequirementOptions,
  holidayOptions,
  workStyleOptions,
  clinicalDepartments,
  jobContentOptions,
  serviceTypeOptions,
  jobVideos,
  freeSpace,

  // === 事業者マスタ（FacilityInfo専用） ===
  facilityTypes,
}: JobDetailContentProps) {
  return (
    <>
      {/* === 求人ヘッダー（職種・給与・勤務地など） === */}
      <ContainerJobHero
        job={job}
        facility={facility}
        newIconPeriodDays={newIconPeriodDays}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
      />

      {/* === 職場環境データ（スタッフ構成・業務比率など） === */}
      <ContainerWorkEnvironmentStats job={job} />

      {/* === 職場関連動画 === */}
      <ContainerJobVideos jobVideos={jobVideos} />

      {/* === フリースペース（テキスト・画像など任意情報） === */}
      <ContainerFreeSpace freeSpace={freeSpace} />

      {/* === 一日の流れ（勤務スケジュール） === */}
      <ContainerDailySchedule job={job} />

      {/* === 募集要項・勤務条件（全プラン共通コンテンツ） === */}
      <ContainerJobRequirements
        job={job}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
        benefitOptions={benefitOptions}
        trainingSupportOptions={trainingSupportOptions}
        accessOptions={accessOptions}
        applicationRequirementOptions={applicationRequirementOptions}
        holidayOptions={holidayOptions}
        workStyleOptions={workStyleOptions}
        clinicalDepartments={clinicalDepartments}
        jobContentOptions={jobContentOptions}
        serviceTypeOptions={serviceTypeOptions}
      />

      {/* === 事業者情報（法人・事業所の基本情報） === */}
      <ContainerFacilityInfo
        job={job}
        facility={facility}
        corporation={corporation}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
        facilityTypes={facilityTypes}
      />
    </>
  );
}
