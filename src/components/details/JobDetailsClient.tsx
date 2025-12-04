/* =======================================
 * リタワーク 詳細ページ
 * Component: JobDetailsClient
 * URL: src/components/details/JobDetailsClient.tsx
 * Created: 2025-11-24
 * Last updated: 2025-12-02
 * ======================================= */
'use client';

import { useEffect, useState } from 'react';
import { JobDetailContent } from './JobDetailContent';
import type { Job, FreeSpaceContent } from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import type { JobCategory } from '@/types/jobCategory';

type DetailsListItem = {
  jobId: string;
  facilityId: string;
  path: string;
};

type JobDetailsClientProps = {
  jobId: string;
};
type BenefitOption = {
  id: string;
  name: string;
  sortOrder: number;
};
type FacilityType = {
  id: string;
  label: string;
};

type TrainingSupportOption = {
  id: string;
  label: string;
};

type AccessOption = {
  id: string;
  label: string;
};
type ApplicationRequirementOption = {
  id: string;
  name: string;
  sortOrder: number;
};
type HolidayOption = {
  id: string;
  label: string;
};
type WorkStyleOption = {
  id: string;
  name: string;
  sortOrder: number;
};
type ClinicalDepartmentOption = {
  id: string;
  name: string;
  sortOrder: number;
};
type JobContentOption = {
  id: string;
  name: string;
  sortOrder: number;
};
type JobVideo = {
  id: string;
  url: string;
  title: string;
};
type ServiceTypeOption = {
  id: string;
  name: string;
  sortOrder: number;
};
export function JobDetailsClient({ jobId }: JobDetailsClientProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [corporation, setCorporation] = useState<Corporation | null>(null);
  const [employmentTypes, setEmploymentTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [newIconPeriodDays, setNewIconPeriodDays] = useState<number>(90);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [benefitOptions, setBenefitOptions] = useState<BenefitOption[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [trainingSupportOptions, setTrainingSupportOptions] = useState<
    TrainingSupportOption[]
  >([]);
  const [accessOptions, setAccessOptions] = useState<AccessOption[]>([]);
  const [applicationRequirementOptions, setApplicationRequirementOptions] =
    useState<ApplicationRequirementOption[]>([]);
  const [holidayOptions, setHolidayOptions] = useState<HolidayOption[]>([]);
  const [workStyleOptions, setWorkStyleOptions] = useState<WorkStyleOption[]>(
    []
  );
  const [clinicalDepartments, setClinicalDepartments] = useState<
    ClinicalDepartmentOption[]
  >([]);
  const [jobContentOptions, setJobContentOptions] = useState<
    JobContentOption[]
  >([]);
  // サービス形態マスタ
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    ServiceTypeOption[]
  >([]);
  const [jobVideos, setJobVideos] = useState<JobVideo[]>([]);
  const [freeSpace, setFreeSpace] = useState<FreeSpaceContent | null>(null);
  useEffect(() => {
    const loadDetails = async () => {
      try {
        /* -------------------------------
         * 1. details_list.json 読み込み
         * ------------------------------- */
        const listRes = await fetch('/db/details_list.json');
        if (!listRes.ok) throw new Error('details_list の取得に失敗しました');
        const allJobs: DetailsListItem[] = await listRes.json();

        const target = allJobs.find((item) => item.jobId === jobId);
        if (!target)
          throw new Error('指定された求人が details_list に見つかりません');

        /* -------------------------------
         * 2. job_xxxx.json 読み込み
         * ------------------------------- */
        const jobRes = await fetch(target.path);
        if (!jobRes.ok) throw new Error('求人データの取得に失敗しました');
        const jobData = (await jobRes.json()) as Job;

        /* -------------------------------
         * 3. facility.json 読み込み
         * ------------------------------- */
        const facilityRes = await fetch(
          `/db/facilities/${jobData.facilityId}/facility.json`
        );
        if (!facilityRes.ok) throw new Error('施設データの取得に失敗しました');
        const facilityData = (await facilityRes.json()) as Facility;

        /* -------------------------------
         * 4. corporations.json 読み込み
         * ------------------------------- */
        const corpRes = await fetch('/db/master/corporations.json');
        const corporations = corpRes.ok
          ? ((await corpRes.json()) as Corporation[])
          : [];
        const corporationData =
          corporations.find((item) => item.id === facilityData.corporationId) ??
          null;

        /* -------------------------------
         * 5. 新着期間設定 読み込み
         * ------------------------------- */
        const configRes = await fetch('/db/config/job_common.json');
        if (configRes.ok) {
          const config = await configRes.json();
          if (typeof config.newIconPeriodDays === 'number') {
            setNewIconPeriodDays(config.newIconPeriodDays);
          }
        }

        // 雇用形態マスタ取得
        /* -------------------------------
         * 6. 雇用形態マスター 読み込み
         * ------------------------------- */
        const typesRes = await fetch('/db/master/employmentTypes.json');
        const types = typesRes.ok
          ? ((await typesRes.json()) as { id: string; name: string }[])
          : [];
        setEmploymentTypes(types);

        // 職種マスタ取得
        /* -------------------------------
         * 7. 職種マスター 読み込み
         * ------------------------------- */
        const catRes = await fetch('/db/master/jobCategories.json');
        const categories = catRes.ok
          ? ((await catRes.json()) as JobCategory[])
          : [];
        setJobCategories(categories);

        const depRes = await fetch('/db/master/clinicalDepartments.json');
        const depMaster = depRes.ok ? await depRes.json() : [];
        setClinicalDepartments(depMaster);

        // 待遇マスタ取得
        /* -------------------------------
         * 8. 待遇マスター 読み込み
         * ------------------------------- */
        const benefitRes = await fetch('/db/master/benefitOptions.json');
        const benefitMaster = benefitRes.ok
          ? ((await benefitRes.json()) as BenefitOption[])
          : [];
        setBenefitOptions(benefitMaster);
        // 事業所形態マスタ取得
        /* 9. 事業所形態マスター 読み込み */
        const facilityTypesRes = await fetch('/db/master/facilityTypes.json');
        const facilityTypesMaster = facilityTypesRes.ok
          ? ((await facilityTypesRes.json()) as FacilityType[])
          : [];
        setFacilityTypes(facilityTypesMaster);

        // 研修・サポートマスタ取得
        /* 10. 研修・サポートマスター 読み込み */
        const trainingSupportRes = await fetch(
          '/db/master/trainingSupportOptions.json'
        );
        const trainingSupportMaster = trainingSupportRes.ok
          ? ((await trainingSupportRes.json()) as TrainingSupportOption[])
          : [];
        setTrainingSupportOptions(trainingSupportMaster);

        // アクセス条件マスタ取得
        /* 11. アクセス条件マスター 読み込み */
        const accessOptionsRes = await fetch('/db/master/accessOptions.json');
        const accessOptionsMaster = accessOptionsRes.ok
          ? ((await accessOptionsRes.json()) as AccessOption[])
          : [];
        setAccessOptions(accessOptionsMaster);

        // 応募要件マスタ取得
        /* 12. 応募要件マスター 読み込み */
        const applicationRequirementRes = await fetch(
          '/db/master/applicationRequirementOptions.json'
        );
        const applicationRequirementMaster = applicationRequirementRes.ok
          ? ((await applicationRequirementRes.json()) as ApplicationRequirementOption[])
          : [];
        setApplicationRequirementOptions(applicationRequirementMaster);
        // 休日条件マスタ取得
        /* 13. 休日条件マスター 読み込み */
        const holidayOptionsRes = await fetch('/db/master/holidayOptions.json');
        const holidayOptionsMaster = holidayOptionsRes.ok
          ? ((await holidayOptionsRes.json()) as HolidayOption[])
          : [];
        setHolidayOptions(holidayOptionsMaster);
        // 勤務スタイルマスタ取得
        /* 14. 勤務スタイルマスター 読み込み */
        const workStyleRes = await fetch('/db/master/workStyleOptions.json');
        const workStyleMaster = workStyleRes.ok
          ? ((await workStyleRes.json()) as WorkStyleOption[])
          : [];
        setWorkStyleOptions(workStyleMaster);

        // 仕事内容マスタ取得
        /* 15. 仕事内容マスター 読み込み */
        const jobContentRes = await fetch('/db/master/jobContentOptions.json');
        const jobContentMaster = jobContentRes.ok
          ? ((await jobContentRes.json()) as JobContentOption[])
          : [];
        setJobContentOptions(jobContentMaster);

        // サービス形態マスタ取得
        /* 16. サービス形態マスター 読み込み */
        const serviceTypeRes = await fetch(
          '/db/master/serviceTypeOptions.json'
        );
        const serviceTypeMaster = serviceTypeRes.ok
          ? ((await serviceTypeRes.json()) as ServiceTypeOption[])
          : [];
        setServiceTypeOptions(serviceTypeMaster);

        // 17. 動画マスタ取得
        let videos: JobVideo[] = [];

        // job.json に jobVideos 設定があって、かつ有効な場合のみ取得
        if (
          jobData.jobVideos &&
          jobData.jobVideos.enabled &&
          jobData.jobVideos.path
        ) {
          try {
            const jobVideosRes = await fetch(jobData.jobVideos.path);

            if (jobVideosRes.ok) {
              const movieJson = (await jobVideosRes.json()) as {
                videos?: JobVideo[];
              };

              // JSON が { "videos": [...] } 形式なので、videos プロパティだけ取り出す
              videos = Array.isArray(movieJson.videos) ? movieJson.videos : [];
            }
          } catch (e) {
            console.warn('動画データの取得に失敗しました', e);
          }
        }

        // 18. フリースペース取得
        let freeSpaceData: FreeSpaceContent | null = null;

        if (jobData.freeText?.enabled && jobData.freeText.path) {
          try {
            const freeRes = await fetch(jobData.freeText.path);

            if (freeRes.ok) {
              const data = (await freeRes.json()) as FreeSpaceContent;
              freeSpaceData = data;
            }
          } catch (e) {
            console.warn('フリースペースの取得に失敗しました', e);
          }
        }

        setFreeSpace(freeSpaceData);

        setJobVideos(videos);

        /* -------------------------------
         * 正常セット
         * ------------------------------- */
        setJob(jobData);
        setFacility(facilityData);
        setCorporation(corporationData);
        setError(null);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error
            ? e.message
            : '求人データの読み込み中にエラーが発生しました。'
        );
        setJob(null);
        setFacility(null);
        setCorporation(null);
        setJobVideos([]);
        setFreeSpace(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [jobId]);

  /* -------------------------------
   * UI: 読み込み・エラー処理
   * ------------------------------- */
  if (loading) return <p>読み込み中です…</p>;
  if (error) return <p>{error}</p>;
  if (!job || !facility || !corporation)
    return <p>求人データが見つかりません。</p>;

  /* -------------------------------
   * メイン表示
   * ------------------------------- */
  // 画面側の詳細ページコンポーネントへ全データを渡す
  return (
    <JobDetailContent
      job={job}
      facility={facility}
      corporation={corporation}
      newIconPeriodDays={newIconPeriodDays}
      employmentTypes={employmentTypes}
      jobCategories={jobCategories}
      benefitOptions={benefitOptions}
      facilityTypes={facilityTypes}
      trainingSupportOptions={trainingSupportOptions}
      accessOptions={accessOptions}
      applicationRequirementOptions={applicationRequirementOptions}
      holidayOptions={holidayOptions}
      workStyleOptions={workStyleOptions}
      clinicalDepartments={clinicalDepartments}
      jobContentOptions={jobContentOptions}
      serviceTypeOptions={serviceTypeOptions}
      jobVideos={jobVideos}
      freeSpace={freeSpace}
    />
  );
}
