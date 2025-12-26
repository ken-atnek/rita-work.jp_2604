/* =======================================
 * FacilityDetailContent - 事業所詳細表示コンテンツ
 * URL: src/components/facility/FacilityDetailContent.tsx
 * ======================================= */

// import type { Job } from '@/types/job';
import type { Corporation } from '@/types/corporation';
import type { Facility } from '@/types/facility';
import type { JobCategory } from '@/types/jobCategory';
import type { JobIndexItem } from '@/types/jobIndex';
import { ContainerFacilityHero } from './ContainerFacilityHero';
import { ContainerCardList } from './ContainerCardList';
import { ContainerFacilityVideos } from './ContainerFacilityVideos';
import { ContainerFacilityInfo } from '@/components/facility/ContainerFacilityInfo';
type Props = {
  facility: Facility;
  corporation: Corporation;
  employmentTypes: { id: string; name: string }[];
  jobCategories: JobCategory[];
  facilityTypes: { id: string; label: string }[];
  jobs: JobIndexItem[];
  salaryUnitMap: Record<string, string>;
};
type JobVideo = {
  id: string;
  url: string;
};
export function FacilityDetailContent({
  facility,
  corporation,
  employmentTypes,
  jobCategories,
  facilityTypes,
  jobs,
  salaryUnitMap,
}: Props) {
  const jobCategoryMap = jobCategories.reduce<Record<string, string>>(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {}
  );

  const tags = Array.from(
    new Set(
      (facility.recruitJobs ?? []).map(
        (item) => jobCategoryMap[item.jobCategoryId] ?? item.jobCategoryId
      )
    )
  );
  const employmentTypeMap = employmentTypes.reduce<Record<string, string>>(
    (acc, type) => {
      acc[type.id] = type.name;
      return acc;
    },
    {}
  );
  const jobVideos: JobVideo[] =
    facility.specialBanner?.enabled && facility.specialBanner.introVideoUrl
      ? [
          {
            id: 'intro',
            url: facility.specialBanner.introVideoUrl,
          },
        ]
      : [];
  return (
    <>
      <ContainerFacilityHero
        name={facility.name}
        logoSrc={
          facility.specialBanner?.enabled
            ? facility.specialBanner.logoImagePath
            : undefined
        }
        tags={tags}
      />
      <ContainerCardList
        jobs={jobs}
        salaryUnitMap={salaryUnitMap}
        employmentTypeMap={employmentTypeMap}
        jobCategoryMap={jobCategoryMap}
      />
      {/* === 職場関連動画 === */}
      <ContainerFacilityVideos jobVideos={jobVideos} />
      {/* === 事業者情報（法人・事業所の基本情報） === */}
      <ContainerFacilityInfo
        facility={facility}
        corporation={corporation}
        employmentTypes={employmentTypes}
        jobCategories={jobCategories}
        facilityTypes={facilityTypes}
      />
    </>
  );
}
