/**
 * 職種マスタ（jobCategories.json）の型
 *
 * 対応する JSON:
 * public/db/master/jobCategories.json
 *
 * 今は必要最小限の2項目。
 * 後から slug / sortOrder / nameShort など必要に応じて追加してOK。
 */
export type JobCategory = {
  /** 求人データの jobCategoryId と一致するID */
  id: string;

  /** 表示名（看護師・介護士・理学療法士など） */
  name: string;
};
