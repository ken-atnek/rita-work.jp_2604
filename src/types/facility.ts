/* =======================================
 * リタワーク 型定義ファイル（施設）
 * URL: src/types/facility.ts
 * Created: 2025-11-24
 * ======================================= */

export type Facility = {
  id: string;
  corporationId: string;
  facilityTypeId: string;
  name: string;
  establishedDate: string;

  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  mapUrl?: string;
  mapLinkUrl?: string;
  phone: string;
  email: string;
  contactPerson: string;
  // 営業時間（改行対応のテキストエリア想定）
  businessHours?: string[];

  // 休業日（改行対応のテキストエリア想定）
  holidays?: string[];

  // スタッフ構成（改行対応のテキストエリア想定）
  staffComposition?: string[];
  typeSpecific?: {
    visitArea?: string;
  };
  recruitJobs?: {
    jobCategoryId: string;
    employmentTypeId: string;
  }[];
  specialBanner?: {
    enabled: boolean;
    logoImagePath: string;
    introVideoUrl?: string;
  };
};
