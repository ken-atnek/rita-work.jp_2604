/* =======================================
 * リタワーク 型定義ファイル（施設）
 * URL: src/types/facility.ts
 * Created: 2025-11-24
 * Last updated: 2025-12-03
 * ======================================= */

export type Facility = {
  // === 識別ID・マスタ紐付け ===
  id: string;
  corporationId: string;
  facilityTypeId: string;

  // === 事業所の基本情報 ===
  name: string;
  establishedDate: string;

  // === 住所・アクセス情報 ===
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  mapUrl?: string;
  mapLinkUrl?: string;

  // === 連絡先情報 ===
  phone: string;
  email: string;
  contactPerson: string;

  // === 営業・運営に関する情報 ===
  businessHours?: string[];
  isEmergencyDesignated?: boolean;
  holidays?: string[];
  facilityScale: string[];
  averagePatients?: string[];

  // === スタッフ・サービス構成 ===
  staffComposition?: string[];
  typeSpecific?: {
    visitArea?: string;
  };

  // === 求人連携・特別バナー ===
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
