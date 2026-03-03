/* =======================================
 * リタワーク 詳細ページ
 * Component: JobDetailsClient
 * URL: src/components/details/JobDetailsClient.tsx
 * Created: 2025-11-24
 * Last updated: 2025-12-27
 * ======================================= */
'use client';

import { useEffect, useState } from 'react';
import { JobDetailContent } from './JobDetailContent';
import { useSearchParams } from 'next/navigation';
import { isPreviewAccess } from '@/utils/isPreviewAccess';

import type {
  Job,
  FreeSpaceContent,
  BenefitsDetailContent,
  InterviewContent,
} from '@/types/job';
import type { Facility } from '@/types/facility';
import type { Corporation } from '@/types/corporation';
import type { JobCategory } from '@/types/jobCategory';
import type {
  SalaryUnitMaster,
  SalaryBandHourlyMaster,
  EmploymentTypeMaster,
  FacilityTypeMaster as FacilityType,
} from '@/types/master';
import { withBasePath } from '@/utils/withBasePath';
import { fetchJson } from '@/utils/fetchJson';
import { toIdLabelMap } from '@/utils/toIdLabelMap';
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
  /* ---------------------------------------
   * 画面表示用 state
   * -------------------------------------- */
  // inside component
  const searchParams = useSearchParams();
  const isPreview = isPreviewAccess(searchParams);

  const [job, setJob] = useState<Job | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [corporation, setCorporation] = useState<Corporation | null>(null);

  const [employmentTypes, setEmploymentTypes] = useState<
    EmploymentTypeMaster[]
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
   * 給与系マスタ Map
   * - salaryUnitMap: unitId -> 日本語ラベル
   * - hourlyBandMap: bandId -> 日本語ラベル
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
         * 0. 開始時ガード
         * - jobId 切り替えでも「読み込み中」に戻るようにする
         * ------------------------------- */
        setLoading(true);
        setError(null);

        /* -------------------------------
         * 1. details_list.json 読み込み
         * ------------------------------- */
        const timestamp = Date.now();
        const allJobs = await fetchJson<DetailsListItem[]>(
          withBasePath(`/db/details_list.json?t=${timestamp}`),
          []
        );
        if (allJobs.length === 0) {
          throw new Error(
            'details_list の取得に失敗しました（0件または取得不可）'
          );
        }

        const target = allJobs.find((item) => item.jobId === jobId);
        if (!target) {
          throw new Error('指定された求人が details_list に見つかりません');
        }

        /* -------------------------------
         * 2. job_xxxx.json 読み込み
         * ------------------------------- */
        const jobData = await fetchJson<Job | null>(
          withBasePath(target.path),
          null
        );
        if (!jobData) throw new Error('求人データの取得に失敗しました');

        // -------------------------------
        // 表示ステータス判定（public以外はpreview時のみ表示）
        // -------------------------------
        const isPublic = jobData.status === 'public';
        if (!isPublic && !isPreview) {
          throw new Error('この求人は現在公開されていません。');
        }

        /* -------------------------------
         * 3. facility.json 読み込み
         * ------------------------------- */
        const facilityData = await fetchJson<Facility | null>(
          withBasePath(`/db/facilities/${jobData.facilityId}/facility.json`),
          null
        );
        if (!facilityData) throw new Error('施設データの取得に失敗しました');

        /* -------------------------------
         * 4. corporations.json 読み込み
         * ------------------------------- */
        const corporations = await fetchJson<Corporation[]>(
          withBasePath('/db/master/corporations.json'),
          []
        );
        const corporationData = corporations.find(
          (item) => item.id === facilityData.corporationId
        );
        if (!corporationData) {
          throw new Error('法人データが corporations.json に見つかりません');
        }

        /* -------------------------------
         * 5. 新着期間設定 読み込み
         * ------------------------------- */
        const config = await fetchJson<{ newIconPeriodDays?: number }>(
          withBasePath('/db/config/job_common.json'),
          {}
        );
        if (typeof config.newIconPeriodDays === 'number') {
          setNewIconPeriodDays(config.newIconPeriodDays);
        }

        /* -------------------------------
         * 6. 雇用形態マスター 読み込み
         * ------------------------------- */
        const types = await fetchJson<EmploymentTypeMaster[]>(
          withBasePath('/db/master/employmentTypes.json'),
          []
        );
        setEmploymentTypes(types);

        /* -------------------------------
         * 7. 職種マスター 読み込み
         * ------------------------------- */
        const categories = await fetchJson<JobCategory[]>(
          withBasePath('/db/master/jobCategories.json'),
          []
        );
        setJobCategories(categories);

        /* -------------------------------
         * 7.5 給与単位マスター
         * ------------------------------- */
        const salaryUnits = await fetchJson<SalaryUnitMaster[]>(
          withBasePath('/db/master/salaryUnits.json'),
          []
        );
        const salaryUnitMapBuilt = toIdLabelMap(
          salaryUnits,
          (u) => u.label ?? u.name ?? u.id
        );
        setSalaryUnitMap(salaryUnitMapBuilt);

        /* -------------------------------
         * 7.6 時給バンドマスター
         * ------------------------------- */
        const bands = await fetchJson<SalaryBandHourlyMaster[]>(
          withBasePath('/db/master/salaryBandsHourly.json'),
          []
        );
        const hourlyBandMapBuilt = toIdLabelMap(
          bands,
          (b) => b.label ?? b.name ?? b.id
        );
        setHourlyBandMap(hourlyBandMapBuilt);

        /* -------------------------------
         * 以降、既存の master 読み込み群
         * ------------------------------- */
        const depMaster = await fetchJson<ClinicalDepartmentOption[]>(
          withBasePath('/db/master/clinicalDepartments.json'),
          []
        );
        setClinicalDepartments(depMaster);

        // 8. 待遇マスター
        const benefitMaster = await fetchJson<BenefitOption[]>(
          withBasePath('/db/master/benefitOptions.json'),
          []
        );
        setBenefitOptions(benefitMaster);

        // 9. 事業所形態マスター
        const facilityTypesMaster = await fetchJson<FacilityType[]>(
          withBasePath('/db/master/facilityTypes.json'),
          []
        );
        setFacilityTypes(facilityTypesMaster);

        // 10. 研修・サポートマスター
        const trainingSupportMaster = await fetchJson<TrainingSupportOption[]>(
          withBasePath('/db/master/trainingSupportOptions.json'),
          []
        );
        setTrainingSupportOptions(trainingSupportMaster);

        // 11. アクセス条件マスター
        const accessOptionsMaster = await fetchJson<AccessOption[]>(
          withBasePath('/db/master/accessOptions.json'),
          []
        );
        setAccessOptions(accessOptionsMaster);

        // 12. 応募要件マスター
        const applicationRequirementMaster = await fetchJson<
          ApplicationRequirementOption[]
        >(withBasePath('/db/master/applicationRequirementOptions.json'), []);
        setApplicationRequirementOptions(applicationRequirementMaster);

        // 13. 休日条件マスター
        const holidayOptionsMaster = await fetchJson<HolidayOption[]>(
          withBasePath('/db/master/holidayOptions.json'),
          []
        );
        setHolidayOptions(holidayOptionsMaster);

        // 14. 勤務スタイルマスター
        const workStyleMaster = await fetchJson<WorkStyleOption[]>(
          withBasePath('/db/master/workStyleOptions.json'),
          []
        );
        setWorkStyleOptions(workStyleMaster);

        // 15. 仕事内容マスター
        const jobContentMaster = await fetchJson<JobContentOption[]>(
          withBasePath('/db/master/jobContentOptions.json'),
          []
        );
        setJobContentOptions(jobContentMaster);

        // 16. サービス形態マスター
        const serviceTypeMaster = await fetchJson<ServiceTypeOption[]>(
          withBasePath('/db/master/serviceTypeOptions.json'),
          []
        );
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
          // fetchJson は落ちないが、ログは出したいので try/catch は残す
          try {
            const movieJson = await fetchJson<{ videos?: JobVideo[] }>(
              withBasePath(jobData.jobVideos.path),
              {}
            );
            videos = Array.isArray(movieJson.videos) ? movieJson.videos : [];
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
            freeSpaceData = await fetchJson<FreeSpaceContent | null>(
              withBasePath(jobData.freeText.path),
              null
            );
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
            benefitsDetailData = await fetchJson<BenefitsDetailContent | null>(
              withBasePath(jobData.benefitsDetailRef.path),
              null
            );
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
            interviewData = await fetchJson<InterviewContent | null>(
              withBasePath(jobData.interview.path),
              null
            );
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

        setError(
          e instanceof Error
            ? e.message
            : '求人データの読み込み中にエラーが発生しました。'
        );

        // 失敗時はクリア（画面で事故らないように）
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
        setSalaryUnitMap({});
        setHourlyBandMap({});
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [jobId, isPreview]);

  useEffect(() => {
    if (!isPreview) return;

    const applyNoindex = () => {
      const targetContent = 'noindex,nofollow,noarchive';

      // 既存の meta[name="robots"] を上書き（無ければ作る）
      let meta = document.querySelector(
        'meta[name="robots"]'
      ) as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'robots');
        document.head.appendChild(meta);
      }

      // setAttribute は値が同じでも MutationObserver を発火させることがあるため
      // 変更が必要な場合のみ更新する（無限ループ/高負荷対策）
      if (meta.getAttribute('content') !== targetContent) {
        meta.setAttribute('content', targetContent);
      }
      if (meta.getAttribute('data-rita-preview') !== '1') {
        meta.setAttribute('data-rita-preview', '1');
      }
    };

    // まず1回適用
    applyNoindex();

    // Nextが head を書き換えても、即戻す
    const observer = new MutationObserver(() => {
      applyNoindex();
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content'],
    });

    return () => {
      observer.disconnect();

      // preview解除時は index/follow に戻す（必要なら）
      const meta = document.querySelector(
        'meta[name="robots"][data-rita-preview="1"]'
      ) as HTMLMetaElement | null;

      if (meta) {
        meta.setAttribute('content', 'index,follow');
        meta.removeAttribute('data-rita-preview');
      }
    };
  }, [isPreview]);

  useEffect(() => {
    if (!job || !facility) return;

    const jobTitle = (job.title || '').trim();
    const facilityName = (facility.facilityName || '').trim();

    document.title = [jobTitle, facilityName, 'リタワーク']
      .filter(Boolean)
      .join('｜');
  }, [job, facility]);
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
      salaryUnitMap={salaryUnitMap}
      hourlyBandMap={hourlyBandMap}
    />
  );
}
