/* =======================================
 * リタワーク 型定義ファイル（法人）
 * URL: src/types/corporation.ts
 * Created: 2025-11-29
 * Last updated: 2025-11-29
 * ======================================= */

export type Corporation = {
  id: string;
  contractDate: string;
  name: string;
  nameKana: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phone: string;
  email: string;
};
