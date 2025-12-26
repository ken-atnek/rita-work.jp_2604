/* =======================================
 * リタワーク 詳細ページ
 * Component: JobDetailsClient
 * URL: src/components/details/JobDetailsClient.tsx
 * Created: 2025-11-24
 * Last updated: 2025-12-xx
 * ======================================= */
'use client';

import { useEffect, useState } from 'react';
import { JobDetailContent } from './JobDetailContent';
import type {
  Job,
  FreeSpaceContent,
  BenefitsDetailContent,
  InterviewContent,
} from '@/types/job';
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

/* ---------------------------------------
 * 給与系マスタ（追加）
 * - salaryUnits.json: { id, label or name }
 * - salaryBandsHourly.json: { id, label or name }
 * -------------------------------------- */
type SalaryUnitMaster = {
  id: string;
  label?: string;
  name?: string;
};

type SalaryBandHourlyMaster = {
  id: string;
  label?: string;
  name?: string;
};

export function JobDetailsClient({ jobId }: JobDetailsClientProps) {
  /* ---------------------------------------
   * 画面表示用 state
   * -------------------------------------- */
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
  const [benefitsDetail, setBenefitsDetail] =
    useState<BenefitsDetailContent | null>(null);
  const [interviewContent, setInterviewContent] =
    useState<InterviewContent | null>(null);

  /* ---------------------------------------
   * 給与系マスタ Map（追加）
   * - salaryUnitMap: unitId -> 日本語ラベル（例: monthly -> 月給, hourly -> 時給）
   * - hourlyBandMap: bandId -> 日本語ラベル（例: hourly_1500_2000 -> 1,500円〜2,000円）
   * -------------------------------------- */
  const [salaryUnitMap, setSalaryUnitMap] = useState<Record<string, string>>(
    {}
  );
  const [hourlyBandMap, setHourlyBandMap] = useState<Record<string, string>>(
    {}
  );

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

        /* -------------------------------
         * 6. 雇用形態マスター 読み込み
         * ------------------------------- */
        const typesRes = await fetch('/db/master/employmentTypes.json');
        const types = typesRes.ok
          ? ((await typesRes.json()) as { id: string; name: string }[])
          : [];
        setEmploymentTypes(types);

        /* -------------------------------
         * 7. 職種マスター 読み込み
         * ------------------------------- */
        const catRes = await fetch('/db/master/jobCategories.json');
        const categories = catRes.ok
          ? ((await catRes.json()) as JobCategory[])
          : [];
        setJobCategories(categories);

        /* -------------------------------
         * 7.5 給与単位マスター（追加）
         * - /db/master/salaryUnits.json
         * ------------------------------- */
        const salaryUnitRes = await fetch('/db/master/salaryUnits.json');
        const salaryUnits = salaryUnitRes.ok
          ? ((await salaryUnitRes.json()) as SalaryUnitMaster[])
          : [];
        const salaryUnitMapBuilt = salaryUnits.reduce<Record<string, string>>(
          (acc, cur) => {
            const text = cur.label ?? cur.name;
            if (text) acc[cur.id] = text;
            return acc;
          },
          {}
        );
        setSalaryUnitMap(salaryUnitMapBuilt);

        /* -------------------------------
         * 7.6 時給バンドマスター（追加）
         * - /db/master/salaryBandsHourly.json
         * ------------------------------- */
        const bandRes = await fetch('/db/master/salaryBandsHourly.json');
        const bands = bandRes.ok
          ? ((await bandRes.json()) as SalaryBandHourlyMaster[])
          : [];
        const hourlyBandMapBuilt = bands.reduce<Record<string, string>>(
          (acc, cur) => {
            const text = cur.label ?? cur.name;
            if (text) acc[cur.id] = text;
            return acc;
          },
          {}
        );
        setHourlyBandMap(hourlyBandMapBuilt);

        /* -------------------------------
         * 以降、既存の master 読み込み群
         * ------------------------------- */
        const depRes = await fetch('/db/master/clinicalDepartments.json');
        const depMaster = depRes.ok ? await depRes.json() : [];
        setClinicalDepartments(depMaster);

        // 8. 待遇マスター
        const benefitRes = await fetch('/db/master/benefitOptions.json');
        const benefitMaster = benefitRes.ok
          ? ((await benefitRes.json()) as BenefitOption[])
          : [];
        setBenefitOptions(benefitMaster);

        // 9. 事業所形態マスター
        const facilityTypesRes = await fetch('/db/master/facilityTypes.json');
        const facilityTypesMaster = facilityTypesRes.ok
          ? ((await facilityTypesRes.json()) as FacilityType[])
          : [];
        setFacilityTypes(facilityTypesMaster);

        // 10. 研修・サポートマスター
        const trainingSupportRes = await fetch(
          '/db/master/trainingSupportOptions.json'
        );
        const trainingSupportMaster = trainingSupportRes.ok
          ? ((await trainingSupportRes.json()) as TrainingSupportOption[])
          : [];
        setTrainingSupportOptions(trainingSupportMaster);

        // 11. アクセス条件マスター
        const accessOptionsRes = await fetch('/db/master/accessOptions.json');
        const accessOptionsMaster = accessOptionsRes.ok
          ? ((await accessOptionsRes.json()) as AccessOption[])
          : [];
        setAccessOptions(accessOptionsMaster);

        // 12. 応募要件マスター
        const applicationRequirementRes = await fetch(
          '/db/master/applicationRequirementOptions.json'
        );
        const applicationRequirementMaster = applicationRequirementRes.ok
          ? ((await applicationRequirementRes.json()) as ApplicationRequirementOption[])
          : [];
        setApplicationRequirementOptions(applicationRequirementMaster);

        // 13. 休日条件マスター
        const holidayOptionsRes = await fetch('/db/master/holidayOptions.json');
        const holidayOptionsMaster = holidayOptionsRes.ok
          ? ((await holidayOptionsRes.json()) as HolidayOption[])
          : [];
        setHolidayOptions(holidayOptionsMaster);

        // 14. 勤務スタイルマスター
        const workStyleRes = await fetch('/db/master/workStyleOptions.json');
        const workStyleMaster = workStyleRes.ok
          ? ((await workStyleRes.json()) as WorkStyleOption[])
          : [];
        setWorkStyleOptions(workStyleMaster);

        // 15. 仕事内容マスター
        const jobContentRes = await fetch('/db/master/jobContentOptions.json');
        const jobContentMaster = jobContentRes.ok
          ? ((await jobContentRes.json()) as JobContentOption[])
          : [];
        setJobContentOptions(jobContentMaster);

        // 16. サービス形態マスター
        const serviceTypeRes = await fetch(
          '/db/master/serviceTypeOptions.json'
        );
        const serviceTypeMaster = serviceTypeRes.ok
          ? ((await serviceTypeRes.json()) as ServiceTypeOption[])
          : [];
        setServiceTypeOptions(serviceTypeMaster);

        /* -------------------------------
         * 17. 動画（job.json 参照で任意取得）
         * ------------------------------- */
        let videos: JobVideo[] = [];

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
              videos = Array.isArray(movieJson.videos) ? movieJson.videos : [];
            }
          } catch (e) {
            console.warn('動画データの取得に失敗しました', e);
          }
        }
        setJobVideos(videos);

        /* -------------------------------
         * 18. フリースペース（任意取得）
         * ------------------------------- */
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

        /* -------------------------------
         * 19. 福利厚生詳細（任意取得）
         * ------------------------------- */
        let benefitsDetailData: BenefitsDetailContent | null = null;

        if (
          jobData.benefitsDetailRef?.enabled &&
          jobData.benefitsDetailRef.path
        ) {
          try {
            const benefitsRes = await fetch(jobData.benefitsDetailRef.path);

            if (benefitsRes.ok) {
              const data = (await benefitsRes.json()) as BenefitsDetailContent;
              benefitsDetailData = data;
            }
          } catch (e) {
            console.warn('福利厚生詳細の取得に失敗しました', e);
          }
        }
        setBenefitsDetail(benefitsDetailData);

        /* -------------------------------
         * 20. インタビュー（任意取得）
         * ------------------------------- */
        let interviewData: InterviewContent | null = null;

        if (jobData.interview?.enabled && jobData.interview.path) {
          try {
            const interviewRes = await fetch(jobData.interview.path);

            if (interviewRes.ok) {
              const data = (await interviewRes.json()) as InterviewContent;
              interviewData = data;
            }
          } catch (e) {
            console.warn('インタビューの取得に失敗しました', e);
          }
        }
        setInterviewContent(interviewData);

        /* -------------------------------
         * 正常セット
         * ------------------------------- */
        setJob(jobData);
        setFacility(facilityData);
        setCorporation(corporationData);
        setError(null);
      } catch (e) {
        console.error(e);

        // 画面上に出すエラー文言
        setError(
          e instanceof Error
            ? e.message
            : '求人データの読み込み中にエラーが発生しました。'
        );

        // 失敗時はクリア
        setJob(null);
        setFacility(null);
        setCorporation(null);
        setEmploymentTypes([]);
        setJobCategories([]);
        setBenefitOptions([]);
        setFacilityTypes([]);
        setTrainingSupportOptions([]);
        setAccessOptions([]);
        setApplicationRequirementOptions([]);
        setHolidayOptions([]);
        setWorkStyleOptions([]);
        setClinicalDepartments([]);
        setJobContentOptions([]);
        setServiceTypeOptions([]);
        setJobVideos([]);
        setFreeSpace(null);
        setBenefitsDetail(null);
        setInterviewContent(null);

        // 給与系マップも念のためクリア（追加）
        setSalaryUnitMap({});
        setHourlyBandMap({});
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
      benefitsDetail={benefitsDetail}
      interviewContent={interviewContent}
      /* -------------------------------
       * 給与系マップ（追加）
       * - ContainerJobRequirements へ渡すため
       * ------------------------------- */
      salaryUnitMap={salaryUnitMap}
      hourlyBandMap={hourlyBandMap}
    />
  );
}
